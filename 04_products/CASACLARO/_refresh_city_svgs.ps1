$ErrorActionPreference = 'Stop'

function Write-Utf8NoBom {
  param([string]$Path, [string]$Text)
  [System.IO.File]::WriteAllText($Path, $Text, [System.Text.UTF8Encoding]::new($false))
}

$svgMap = @{
  'medellin.svg' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">Medellin hero art</title>
  <desc id="desc">Mountain valley skyline for Medellin.</desc>
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffd166"/>
      <stop offset="55%" stop-color="#f4a261"/>
      <stop offset="100%" stop-color="#2a9d8f"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <circle cx="1240" cy="160" r="120" fill="#fff3d4" opacity="0.85"/>
  <path d="M0 520 L170 320 L350 470 L520 250 L740 520 L920 280 L1130 530 L1340 300 L1600 520 L1600 900 L0 900 Z" fill="#31572c" opacity="0.95"/>
  <path d="M0 610 L220 420 L380 560 L560 360 L760 620 L940 410 L1160 610 L1370 450 L1600 620 L1600 900 L0 900 Z" fill="#4f772d" opacity="0.85"/>
  <rect x="180" y="460" width="92" height="180" rx="12" fill="#243b53"/><rect x="300" y="400" width="96" height="240" rx="12" fill="#243b53"/><rect x="430" y="500" width="74" height="140" rx="12" fill="#243b53"/><rect x="550" y="360" width="118" height="280" rx="12" fill="#243b53"/><rect x="706" y="440" width="86" height="200" rx="12" fill="#243b53"/><rect x="828" y="390" width="120" height="250" rx="12" fill="#243b53"/><rect x="982" y="470" width="80" height="170" rx="12" fill="#243b53"/><rect x="1096" y="410" width="94" height="230" rx="12" fill="#243b53"/>
  <path d="M180 690 H1230" stroke="#ffd166" stroke-width="16" stroke-linecap="round"/>
  <rect x="100" y="96" width="470" height="188" rx="28" fill="rgba(255,255,255,0.78)"/>
  <text x="138" y="172" font-size="34" font-family="Segoe UI, sans-serif" font-weight="700" fill="#243b53" letter-spacing="6">CASACLARO</text>
  <text x="138" y="232" font-size="76" font-family="Georgia, serif" font-weight="700" fill="#243b53">Medellin</text>
  <text x="138" y="276" font-size="28" font-family="Segoe UI, sans-serif" font-weight="700" fill="#2a9d8f">VALLEY ENERGY AND HILLSIDE LIGHT</text>
</svg>
'@
  'bogota.svg' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">Bogota hero art</title>
  <desc id="desc">High plateau skyline with eastern hills for Bogota.</desc>
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#dce8f5"/>
      <stop offset="55%" stop-color="#9bbbd4"/>
      <stop offset="100%" stop-color="#355070"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <path d="M1060 190 L1190 70 L1310 210 L1450 110 L1600 230 L1600 900 L1060 900 Z" fill="#243b53" opacity="0.32"/>
  <rect x="120" y="360" width="96" height="300" rx="10" fill="#1d3557"/><rect x="246" y="410" width="74" height="250" rx="10" fill="#1d3557"/><rect x="348" y="320" width="112" height="340" rx="10" fill="#1d3557"/><rect x="486" y="440" width="82" height="220" rx="10" fill="#1d3557"/><rect x="596" y="280" width="138" height="380" rx="10" fill="#1d3557"/><rect x="766" y="380" width="94" height="280" rx="10" fill="#1d3557"/><rect x="892" y="250" width="156" height="410" rx="10" fill="#1d3557"/><rect x="1080" y="350" width="112" height="310" rx="10" fill="#1d3557"/><rect x="1220" y="300" width="144" height="360" rx="10" fill="#1d3557"/>
  <path d="M0 690 C260 640 480 720 760 680 C980 650 1240 730 1600 680" stroke="#f1faee" stroke-width="8" fill="none" opacity="0.8"/>
  <circle cx="240" cy="180" r="88" fill="#f1faee" opacity="0.72"/>
  <rect x="100" y="104" width="470" height="188" rx="28" fill="rgba(255,255,255,0.8)"/>
  <text x="138" y="180" font-size="34" font-family="Segoe UI, sans-serif" font-weight="700" fill="#1d3557" letter-spacing="6">CASACLARO</text>
  <text x="138" y="240" font-size="76" font-family="Georgia, serif" font-weight="700" fill="#1d3557">Bogota</text>
  <text x="138" y="284" font-size="28" font-family="Segoe UI, sans-serif" font-weight="700" fill="#355070">ALTITUDE, SCALE, AND EASTERN HILLS</text>
</svg>
'@
  'cartagena.svg' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">Cartagena hero art</title>
  <desc id="desc">Coastal wall, towers, and sea for Cartagena.</desc>
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffd6a5"/>
      <stop offset="50%" stop-color="#f4a261"/>
      <stop offset="100%" stop-color="#2a9d8f"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <rect y="610" width="1600" height="290" fill="#2a9d8f"/>
  <path d="M0 650 C180 620 340 690 520 660 C700 630 880 690 1080 650 C1260 620 1440 680 1600 645 L1600 900 L0 900 Z" fill="#1b7f7a"/>
  <path d="M140 520 H870" stroke="#e9c46a" stroke-width="42" stroke-linecap="round"/>
  <rect x="210" y="420" width="110" height="140" rx="12" fill="#e9c46a"/>
  <rect x="840" y="360" width="70" height="200" rx="12" fill="#e9c46a"/>
  <rect x="1010" y="250" width="120" height="330" rx="12" fill="#264653"/><rect x="1160" y="320" width="90" height="260" rx="12" fill="#264653"/><rect x="1280" y="280" width="140" height="300" rx="12" fill="#264653"/>
  <circle cx="1260" cy="150" r="98" fill="#fff3d4" opacity="0.8"/>
  <rect x="100" y="98" width="500" height="188" rx="28" fill="rgba(255,255,255,0.8)"/>
  <text x="138" y="174" font-size="34" font-family="Segoe UI, sans-serif" font-weight="700" fill="#264653" letter-spacing="6">CASACLARO</text>
  <text x="138" y="236" font-size="76" font-family="Georgia, serif" font-weight="700" fill="#264653">Cartagena</text>
  <text x="138" y="280" font-size="28" font-family="Segoe UI, sans-serif" font-weight="700" fill="#e76f51">WALLED COAST, HUMIDITY, AND HARBOR LIGHT</text>
</svg>
'@
  'cali.svg' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">Cali hero art</title>
  <desc id="desc">Tropical skyline with dancing river curves for Cali.</desc>
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffcad4"/>
      <stop offset="50%" stop-color="#f28482"/>
      <stop offset="100%" stop-color="#84a59d"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <path d="M0 520 L220 360 L430 500 L660 280 L860 460 L1100 250 L1360 430 L1600 320 L1600 900 L0 900 Z" fill="#386641" opacity="0.3"/>
  <path d="M0 720 C220 640 460 770 740 690 C980 625 1260 780 1600 700" stroke="#ffd166" stroke-width="26" fill="none" stroke-linecap="round"/>
  <rect x="180" y="430" width="94" height="210" rx="12" fill="#4d194d"/><rect x="308" y="360" width="132" height="280" rx="12" fill="#4d194d"/><rect x="470" y="470" width="84" height="170" rx="12" fill="#4d194d"/><rect x="586" y="330" width="120" height="310" rx="12" fill="#4d194d"/><rect x="740" y="400" width="88" height="240" rx="12" fill="#4d194d"/><rect x="864" y="350" width="126" height="290" rx="12" fill="#4d194d"/>
  <circle cx="1320" cy="170" r="92" fill="#fff1e6" opacity="0.78"/>
  <rect x="96" y="100" width="470" height="188" rx="28" fill="rgba(255,255,255,0.8)"/>
  <text x="134" y="176" font-size="34" font-family="Segoe UI, sans-serif" font-weight="700" fill="#4d194d" letter-spacing="6">CASACLARO</text>
  <text x="134" y="238" font-size="76" font-family="Georgia, serif" font-weight="700" fill="#4d194d">Cali</text>
  <text x="134" y="282" font-size="28" font-family="Segoe UI, sans-serif" font-weight="700" fill="#386641">SALSA RHYTHM, VALLEY HEAT, AND URBAN GREEN</text>
</svg>
'@
  'pereira.svg' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">Pereira hero art</title>
  <desc id="desc">Coffee hills and low-rise city profile for Pereira.</desc>
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fefae0"/>
      <stop offset="50%" stop-color="#dda15e"/>
      <stop offset="100%" stop-color="#606c38"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <path d="M0 590 C180 470 360 710 560 560 C740 430 930 690 1140 560 C1290 470 1430 560 1600 500 L1600 900 L0 900 Z" fill="#6a994e"/>
  <path d="M0 700 C160 620 300 760 470 700 C620 646 820 760 980 690 C1150 620 1340 760 1600 670 L1600 900 L0 900 Z" fill="#386641"/>
  <path d="M260 500 C320 430 420 430 480 500" stroke="#bc6c25" stroke-width="18" fill="none"/><path d="M560 460 C620 390 720 390 780 460" stroke="#bc6c25" stroke-width="18" fill="none"/><path d="M860 500 C920 430 1020 430 1080 500" stroke="#bc6c25" stroke-width="18" fill="none"/>
  <rect x="250" y="470" width="90" height="160" rx="10" fill="#283618"/><rect x="370" y="430" width="74" height="200" rx="10" fill="#283618"/><rect x="470" y="490" width="62" height="140" rx="10" fill="#283618"/><rect x="590" y="420" width="90" height="210" rx="10" fill="#283618"/><rect x="708" y="470" width="70" height="160" rx="10" fill="#283618"/>
  <rect x="96" y="102" width="470" height="188" rx="28" fill="rgba(255,255,255,0.8)"/>
  <text x="134" y="178" font-size="34" font-family="Segoe UI, sans-serif" font-weight="700" fill="#283618" letter-spacing="6">CASACLARO</text>
  <text x="134" y="240" font-size="76" font-family="Georgia, serif" font-weight="700" fill="#283618">Pereira</text>
  <text x="134" y="284" font-size="28" font-family="Segoe UI, sans-serif" font-weight="700" fill="#606c38">COFFEE HILLS, SOFT CLIMATE, AND DAILY EASE</text>
</svg>
'@
  'santa-marta.svg' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">Santa Marta hero art</title>
  <desc id="desc">Beachfront bay with mountain backdrop for Santa Marta.</desc>
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#bde0fe"/>
      <stop offset="50%" stop-color="#89c2d9"/>
      <stop offset="100%" stop-color="#ee9b00"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <path d="M0 500 L260 300 L480 430 L740 230 L1040 470 L1270 260 L1600 420 L1600 900 L0 900 Z" fill="#355070" opacity="0.55"/>
  <rect y="610" width="1600" height="290" fill="#219ebc"/>
  <path d="M0 650 C220 620 420 700 650 670 C900 640 1160 705 1600 650" stroke="#fefae0" stroke-width="22" fill="none" stroke-linecap="round"/>
  <path d="M0 760 H1600" stroke="#e9d8a6" stroke-width="70"/>
  <rect x="1120" y="420" width="150" height="180" rx="14" fill="#1d3557"/><rect x="1300" y="390" width="110" height="210" rx="14" fill="#1d3557"/>
  <rect x="96" y="100" width="540" height="188" rx="28" fill="rgba(255,255,255,0.82)"/>
  <text x="134" y="176" font-size="34" font-family="Segoe UI, sans-serif" font-weight="700" fill="#1d3557" letter-spacing="6">CASACLARO</text>
  <text x="134" y="238" font-size="76" font-family="Georgia, serif" font-weight="700" fill="#1d3557">Santa Marta</text>
  <text x="134" y="282" font-size="28" font-family="Segoe UI, sans-serif" font-weight="700" fill="#ee9b00">BAY LIGHT, BEACH STAYS, AND SIERRA BACKDROP</text>
</svg>
'@
  'barranquilla.svg' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">Barranquilla hero art</title>
  <desc id="desc">River city skyline with bridge arc for Barranquilla.</desc>
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffe5b4"/>
      <stop offset="50%" stop-color="#ffb703"/>
      <stop offset="100%" stop-color="#219ebc"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <rect y="640" width="1600" height="260" fill="#1d3557" opacity="0.8"/>
  <path d="M200 610 C420 360 760 360 980 610" stroke="#f1faee" stroke-width="14" fill="none"/>
  <path d="M200 610 H980" stroke="#f1faee" stroke-width="12"/>
  <path d="M1160 650 C1280 620 1420 690 1600 650" stroke="#8ecae6" stroke-width="20" fill="none"/>
  <rect x="210" y="450" width="90" height="170" rx="12" fill="#023047"/><rect x="330" y="380" width="126" height="240" rx="12" fill="#023047"/><rect x="490" y="430" width="84" height="190" rx="12" fill="#023047"/><rect x="610" y="340" width="132" height="280" rx="12" fill="#023047"/><rect x="776" y="410" width="90" height="210" rx="12" fill="#023047"/><rect x="1180" y="360" width="120" height="260" rx="12" fill="#023047"/>
  <rect x="96" y="102" width="560" height="188" rx="28" fill="rgba(255,255,255,0.82)"/>
  <text x="134" y="178" font-size="34" font-family="Segoe UI, sans-serif" font-weight="700" fill="#023047" letter-spacing="6">CASACLARO</text>
  <text x="134" y="240" font-size="76" font-family="Georgia, serif" font-weight="700" fill="#023047">Barranquilla</text>
  <text x="134" y="284" font-size="28" font-family="Segoe UI, sans-serif" font-weight="700" fill="#219ebc">RIVER SCALE, HEAT, AND CARNIVAL MOTION</text>
</svg>
'@
  'bucaramanga.svg' = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">Bucaramanga hero art</title>
  <desc id="desc">Terraced city with canyon edge and park canopy for Bucaramanga.</desc>
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#edf6f9"/>
      <stop offset="50%" stop-color="#83c5be"/>
      <stop offset="100%" stop-color="#ee6c4d"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <path d="M1080 140 L1600 70 L1600 900 L940 900 Z" fill="#6d597a" opacity="0.22"/>
  <path d="M0 720 C200 640 420 760 660 700 C860 650 1060 740 1320 680 C1440 650 1520 650 1600 660" stroke="#fefae0" stroke-width="16" fill="none"/>
  <circle cx="260" cy="170" r="86" fill="#fefae0" opacity="0.8"/>
  <circle cx="190" cy="420" r="70" fill="#2a9d8f" opacity="0.85"/><circle cx="300" cy="390" r="60" fill="#2a9d8f" opacity="0.85"/><circle cx="410" cy="430" r="74" fill="#2a9d8f" opacity="0.85"/>
  <rect x="200" y="470" width="84" height="170" rx="10" fill="#3d405b"/><rect x="316" y="420" width="96" height="220" rx="10" fill="#3d405b"/><rect x="446" y="350" width="120" height="290" rx="10" fill="#3d405b"/><rect x="602" y="430" width="90" height="210" rx="10" fill="#3d405b"/><rect x="724" y="390" width="116" height="250" rx="10" fill="#3d405b"/>
  <rect x="98" y="102" width="560" height="188" rx="28" fill="rgba(255,255,255,0.82)"/>
  <text x="136" y="178" font-size="34" font-family="Segoe UI, sans-serif" font-weight="700" fill="#3d405b" letter-spacing="6">CASACLARO</text>
  <text x="136" y="240" font-size="72" font-family="Georgia, serif" font-weight="700" fill="#3d405b">Bucaramanga</text>
  <text x="136" y="284" font-size="28" font-family="Segoe UI, sans-serif" font-weight="700" fill="#2a9d8f">PARK CANOPY, TERRACES, AND CANYON EDGE</text>
</svg>
'@
}

$base = 'c:\Users\nkwtr\Downloads\CASACLARO\assets\cities'
foreach ($name in $svgMap.Keys) {
  Write-Utf8NoBom -Path (Join-Path $base $name) -Text $svgMap[$name]
}
