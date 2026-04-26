const WeatherEngine = (() => {
  const CACHE_KEY = 'casaclaro-weather';
  const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  const WMO = {
    0:  { label: 'Clear',          icon: 'fa-sun' },
    1:  { label: 'Mainly Clear',   icon: 'fa-cloud-sun' },
    2:  { label: 'Partly Cloudy',  icon: 'fa-cloud-sun' },
    3:  { label: 'Overcast',       icon: 'fa-cloud' },
    45: { label: 'Foggy',          icon: 'fa-smog' },
    48: { label: 'Foggy',          icon: 'fa-smog' },
    51: { label: 'Light Drizzle',  icon: 'fa-cloud-rain' },
    53: { label: 'Drizzle',        icon: 'fa-cloud-rain' },
    55: { label: 'Drizzle',        icon: 'fa-cloud-rain' },
    61: { label: 'Light Rain',     icon: 'fa-cloud-rain' },
    63: { label: 'Rain',           icon: 'fa-cloud-showers-heavy' },
    65: { label: 'Heavy Rain',     icon: 'fa-cloud-showers-heavy' },
    71: { label: 'Light Snow',     icon: 'fa-snowflake' },
    73: { label: 'Snow',           icon: 'fa-snowflake' },
    75: { label: 'Heavy Snow',     icon: 'fa-snowflake' },
    80: { label: 'Showers',        icon: 'fa-cloud-rain' },
    81: { label: 'Showers',        icon: 'fa-cloud-showers-heavy' },
    82: { label: 'Heavy Showers',  icon: 'fa-cloud-showers-heavy' },
    85: { label: 'Snow Showers',   icon: 'fa-snowflake' },
    86: { label: 'Snow Showers',   icon: 'fa-snowflake' },
    95: { label: 'Thunderstorm',   icon: 'fa-bolt' },
    96: { label: 'Thunderstorm',   icon: 'fa-bolt' },
    99: { label: 'Thunderstorm',   icon: 'fa-bolt' }
  };

  function decode(code) {
    return WMO[code] || { label: 'Variable', icon: 'fa-cloud' };
  }

  function cToF(c) { return Math.round(c * 9 / 5 + 32); }

  function readCache(slug) {
    try {
      const store = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      const entry = store[slug];
      if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
    } catch (_) {}
    return null;
  }

  function writeCache(slug, data) {
    try {
      const store = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      store[slug] = { ts: Date.now(), data };
      localStorage.setItem(CACHE_KEY, JSON.stringify(store));
    } catch (_) {}
  }

  async function getWeather(slug, lat, lon) {
    const cached = readCache(slug);
    if (cached) return cached;

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,weather_code` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
      `&temperature_unit=celsius&timezone=auto&forecast_days=4`;

    const resp = await window.fetch(url);
    if (!resp.ok) throw new Error(`Weather API ${resp.status}`);
    const raw = await resp.json();

    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const cur = raw.current;
    const day = raw.daily;

    const result = {
      tempC: Math.round(cur.temperature_2m),
      tempF: cToF(cur.temperature_2m),
      ...decode(cur.weather_code),
      forecast: day.time.slice(1, 4).map((dateStr, i) => {
        const dt = new Date(dateStr + 'T12:00:00');
        return {
          day: DAYS[dt.getDay()],
          hiC: Math.round(day.temperature_2m_max[i + 1]),
          loC: Math.round(day.temperature_2m_min[i + 1]),
          hiF: cToF(day.temperature_2m_max[i + 1]),
          loF: cToF(day.temperature_2m_min[i + 1]),
          ...decode(day.weather_code[i + 1])
        };
      })
    };

    writeCache(slug, result);
    return result;
  }

  return { getWeather };
})();
