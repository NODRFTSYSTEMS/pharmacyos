Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$workspaceRoot = Split-Path -Parent $PSScriptRoot
$appDir = Join-Path $workspaceRoot 'app'
$distDir = Join-Path $appDir 'dist'
$websiteDir = Join-Path $workspaceRoot 'website'
$distIndexPath = Join-Path $distDir 'index.html'
$websiteIndexPath = Join-Path $websiteDir 'index.html'
$rootStandalonePath = Join-Path $workspaceRoot 'Walcott Website Standalone.html'
$launcherPath = Join-Path $workspaceRoot 'OPEN THIS WEBSITE.html'

if (-not (Test-Path -LiteralPath $distIndexPath)) {
  throw "Build output not found at $distIndexPath"
}

if (-not (Test-Path -LiteralPath $websiteDir)) {
  New-Item -ItemType Directory -Path $websiteDir | Out-Null
}

Get-ChildItem -Path $distDir -Force | ForEach-Object {
  Copy-Item -Recurse -Force -Path $_.FullName -Destination $websiteDir
}

Get-ChildItem -Path $distDir -File | Where-Object { $_.Name -ne 'index.html' } | ForEach-Object {
  Copy-Item -Force -Path $_.FullName -Destination $workspaceRoot
}

$distHtml = Get-Content -Raw -Path $distIndexPath
$cssMatch = [regex]::Match($distHtml, '<link[^>]+href="(?<href>\.\/assets\/[^"]+\.css)"[^>]*>')
$jsMatch = [regex]::Match($distHtml, '<script[^>]+src="(?<src>\.\/assets\/[^"]+\.js)"[^>]*><\/script>')

if (-not $cssMatch.Success) {
  throw 'Could not find bundled CSS in dist/index.html'
}

if (-not $jsMatch.Success) {
  throw 'Could not find bundled JavaScript in dist/index.html'
}

$cssPath = Join-Path $distDir $cssMatch.Groups['href'].Value.TrimStart('./')
$jsPath = Join-Path $distDir $jsMatch.Groups['src'].Value.TrimStart('./')

$cssBase64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes((Get-Content -Raw -Path $cssPath)))
$jsBase64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes((Get-Content -Raw -Path $jsPath)))

$inlineBundle = @"
    <script>
      (() => {
        const runApp = () => {
        const decode = (base64) => {
          const binary = atob(base64);
          return Uint8Array.from(binary, (char) => char.charCodeAt(0));
        };

        const css = new TextDecoder().decode(decode('$cssBase64'));
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        const code = new TextDecoder().decode(decode('$jsBase64'));
        (new Function(code))();
        };

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', runApp, { once: true });
        } else {
          runApp();
        }
      })();
    </script>
"@

$rootHtml = $distHtml.Replace($cssMatch.Value, '').Replace($jsMatch.Value, $inlineBundle)

Set-Content -Path $websiteIndexPath -Value $distHtml -Encoding utf8
Set-Content -Path $rootStandalonePath -Value $rootHtml -Encoding utf8
Set-Content -Path $launcherPath -Value @'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=./Walcott%20Website%20Standalone.html" />
    <title>Open Walcott Website</title>
  </head>
  <body>
    <p>
      Redirecting to
      <a href="./Walcott%20Website%20Standalone.html">Walcott Website Standalone.html</a>.
    </p>
  </body>
</html>
'@ -Encoding utf8

Write-Output "WEBSITE_INDEX=$websiteIndexPath"
Write-Output "ROOT_STANDALONE=$rootStandalonePath"
