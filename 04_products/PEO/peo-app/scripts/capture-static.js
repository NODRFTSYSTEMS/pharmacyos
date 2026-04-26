const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const STAGING_DIR = path.resolve(__dirname, '../staging');

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

function fetchBinary(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function main() {
  // Clean and create staging dir
  if (fs.existsSync(STAGING_DIR)) {
    fs.rmSync(STAGING_DIR, { recursive: true });
  }
  fs.mkdirSync(STAGING_DIR, { recursive: true });

  const assetUrls = new Set();

  function collectAssets(html) {
    let m;
    // script src
    const scriptRe = /src="(\/_next\/static\/[^"]+)"/g;
    while ((m = scriptRe.exec(html)) !== null) assetUrls.add(m[1]);

    // link href
    const linkRe = /href="(\/_next\/static\/[^"]+)"/g;
    while ((m = linkRe.exec(html)) !== null) assetUrls.add(m[1]);

    // url() in inline styles
    const urlRe = /url\("?(\/_next\/static\/[^")\s]+)"?\)/g;
    while ((m = urlRe.exec(html)) !== null) assetUrls.add(m[1]);

    // data references in __next_f script
    const dataRe = /"(\/_next\/static\/chunks\/[^"]+)"/g;
    while ((m = dataRe.exec(html)) !== null) assetUrls.add(m[1]);
  }

  // Fetch the main page
  console.log('Fetching /en ...');
  const enRes = await fetch(`${BASE_URL}/en`);
  let enHtml = enRes.body;
  console.log(`Status: ${enRes.status}, Length: ${enHtml.length}`);

  collectAssets(enHtml);

  // Also fetch root redirect page
  console.log('Fetching / ...');
  const rootRes = await fetch(`${BASE_URL}/`);
  let rootHtml = rootRes.body;
  console.log(`Status: ${rootRes.status}, Length: ${rootHtml.length}`);
  collectAssets(rootHtml);

  console.log(`Found ${assetUrls.size} unique assets`);

  // Download all assets
  for (const assetUrl of assetUrls) {
    const fullUrl = assetUrl.startsWith('http') ? assetUrl : `${BASE_URL}${assetUrl}`;
    const localPath = path.join(STAGING_DIR, assetUrl.replace(/^\//, ''));
    const localDir = path.dirname(localPath);

    // Skip if already downloaded
    if (fs.existsSync(localPath)) continue;

    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }

    try {
      const data = await fetchBinary(fullUrl);
      fs.writeFileSync(localPath, data);
      console.log(`Downloaded: ${assetUrl} (${data.length} bytes)`);
    } catch (e) {
      console.error(`Failed to download: ${fullUrl} - ${e.message}`);
    }
  }

  // Rewrite HTML - replace absolute paths with relative
  function rewriteHtml(html, pageDepth) {
    const prefix = pageDepth > 0 ? '../'.repeat(pageDepth) : '';

    // Rewrite _next/static paths
    html = html.replace(/(src|href)="\/_next\/static\/([^"]+)"/g, (match, attr, p) => {
      return `${attr}="${prefix}_next/static/${p}"`;
    });

    // Rewrite favicon and other root paths
    html = html.replace(/href="\/favicon\.ico([^"]*)"/g, (match, p) => {
      return `href="${prefix}favicon.ico${p}"`;
    });

    // Also rewrite data references in scripts
    html = html.replace(/"\/_next\/static\/chunks\/([^"]+)"/g, (match, p) => {
      return `"${prefix}_next/static/chunks/${p}"`;
    });

    return html;
  }

  // Save root page (redirect page)
  fs.writeFileSync(path.join(STAGING_DIR, 'index.html'), rewriteHtml(rootHtml, 0));
  console.log('Saved: index.html');

  // Save en page
  const enDir = path.join(STAGING_DIR, 'en');
  fs.mkdirSync(enDir, { recursive: true });
  fs.writeFileSync(path.join(enDir, 'index.html'), rewriteHtml(enHtml, 1));
  console.log('Saved: en/index.html');

  console.log('\nDone! Staged to:', STAGING_DIR);
}

main().catch(console.error);
