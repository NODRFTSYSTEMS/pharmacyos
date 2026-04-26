
const CasaClaroApp = (() => {
  const DATA_URL = 'data/cities.json';
  const SUBMISSION_STORAGE_KEY = 'casaclaro-submissions';
  const LEGACY_SUBMISSION_STORAGE_KEY = 'casaclaro-demo-submissions';
  const FX_CACHE_KEY = 'casaclaro-fx-cache';
  const LANGUAGE_STORAGE_KEY = 'casaclaro-language';
  const state = {
    data: null,
    currency: 'USD',
    language: 'en',
    fx: { rate: null, date: '', sourceLabel: '', sourceUrl: '', live: false }
  };
  let lastFocusedElement = null;
  let modalEventsBound = false;

  const featuredProfessionals = [
    {
      name: 'Lucia Herrera',
      city: 'Medellin',
      specialty: 'Relocation and lifestyle acquisition',
      specialtyEs: 'Reubicación y compra orientada al estilo de vida',
      rating: 4.9,
      note: 'Strong with first-time expats and furnished rentals.',
      noteEs: 'Fuerte con expatriados primerizos y arriendos amoblados.'
    },
    {
      name: 'Mateo Rios',
      city: 'Cartagena',
      specialty: 'Coastal second homes and tourism compliance',
      specialtyEs: 'Segundas viviendas costeras y cumplimiento turístico',
      rating: 4.8,
      note: 'Useful for buyers who need a realistic coastal operations lens.',
      noteEs: 'Útil para compradores que necesitan una lectura realista de la operación costera.'
    },
    {
      name: 'Daniela Pardo',
      city: 'Bogota',
      specialty: 'Executive rentals and family relocation',
      specialtyEs: 'Arriendos ejecutivos y reubicación familiar',
      rating: 4.9,
      note: 'Best fit for buyers who prioritize schools, healthcare, and service depth.',
      noteEs: 'Mejor encaje para compradores que priorizan colegios, salud y profundidad de servicios.'
    }
  ];

  const features = [
    {
      title: 'City Explorer',
      titleEs: 'Explorador de ciudades',
      copy: 'Compare Colombian cities through pricing, walkability, healthcare, retiree fit, and repair reality before you choose a market.',
      copyEs: 'Compara ciudades de Colombia por precio, caminabilidad, salud, encaje para retiro y realidad de mantenimiento antes de elegir mercado.',
      status: 'available'
    },
    {
      title: 'Relocation Landing Page',
      titleEs: 'Página de reubicación',
      copy: 'A true expat and golden-age decision page with city fit, healthcare context, and next-step guidance.',
      copyEs: 'Una página real de decisión para expatriados y retiro, con encaje por ciudad, contexto de salud y siguiente paso.',
      status: 'available'
    },
    {
      title: 'Seller Marketplace Intake',
      titleEs: 'Ingreso para propietarios',
      copy: 'Structured seller submissions with attachments, repair notes, pricing context, and CRM-ready routing hooks.',
      copyEs: 'Envíos estructurados para propietarios con adjuntos, notas de reparaciones, contexto de precio y hooks listos para CRM.',
      status: 'available'
    },
    {
      title: 'Partner Standards',
      titleEs: 'Estándares para aliados',
      copy: 'Clear SLA expectations for agents, brokers, lawyers, and operators handling serious cross-border clients.',
      copyEs: 'Expectativas SLA claras para agentes, brokers, abogados y operadores que atienden clientes serios transfronterizos.',
      status: 'available'
    },
    {
      title: 'Residency Snapshot',
      titleEs: 'Resumen migratorio',
      copy: 'Time-stamped investor, retiree, and digital nomad guidance tied to official Colombia sources.',
      copyEs: 'Guía fechada para inversionista, jubilado y nómada digital vinculada a fuentes oficiales de Colombia.',
      status: 'beta'
    },
    {
      title: 'Field Video Layer',
      titleEs: 'Capa de video de campo',
      copy: 'Instagram, TikTok, and YouTube-ready storytelling slots for city walks, repair stories, and neighborhood explainers.',
      copyEs: 'Espacios listos para Instagram, TikTok y YouTube con caminatas urbanas, historias de reparaciones y explicadores de barrios.',
      status: 'coming'
    }
  ];

  const badgeLabels = {
    available: 'Available Now',
    beta: 'Beta',
    coming: 'Coming Q3'
  };

  const badgeLabelsEs = {
    available: 'Disponible',
    beta: 'Beta',
    coming: 'Proximo'
  };

  async function loadData() {
    if (state.data) return state.data;
    try {
      const response = await fetch(DATA_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error('Unable to load city data.');
      state.data = await response.json();
      return state.data;
    } catch (error) {
      if (window.CASACLARO_EMBEDDED_DATA) {
        console.warn('JSON fetch failed, using embedded city data fallback.', error);
        state.data = window.CASACLARO_EMBEDDED_DATA;
        return state.data;
      }
      throw error;
    }
  }

  function getFxRate() {
    return state.fx.rate || state.data?.siteMeta?.exchangeRateCopPerUsd || 3950;
  }

  function getLocale(language = state.language) {
    return language === 'es' ? 'es-CO' : 'en-US';
  }

  function prefersReducedMotion() {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  }

  function formatVerifiedDate(dateString) {
    if (!dateString) return 'date unavailable';
    return new Intl.DateTimeFormat(getLocale(), { dateStyle: 'long' }).format(new Date(`${dateString}T00:00:00`));
  }

  function formatVerifiedTimestamp() {
    const iso = state.fx.fetchedAt || (state.fx.date ? `${state.fx.date}T12:00:00Z` : '');
    if (!iso) return state.language === 'es' ? 'fecha no disponible' : 'date unavailable';
    return new Intl.DateTimeFormat(getLocale(), {
      dateStyle: 'long',
      timeStyle: 'short'
    }).format(new Date(iso));
  }

  function withEsValue(value, fallback) {
    return value !== undefined && value !== null && value !== '' ? value : fallback;
  }

  function translateEsLabel(value) {
    const labels = {
      'Car-light only in pockets': 'Sin carro solo en bolsillos concretos',
      'Compact and manageable': 'Compacta y manejable',
      'Excellent in the historic core, mixed elsewhere': 'Excelente en el centro histórico, mixta fuera de él',
      'Good for daily errands': 'Buena para diligencias diarias',
      'High in selected districts': 'Alta en zonas seleccionadas',
      'Mixed by district': 'Mixta por distrito',
      'Pocket-dependent': 'Depende del bolsillo barrial',
      'Walkable in tourism zones': 'Caminable en zonas turísticas',
      'Adequate for routine needs': 'Adecuada para necesidades rutinarias',
      'Deepest specialist network': 'La red de especialistas más profunda',
      'Good routine private care': 'Buena atención privada de rutina',
      'Solid private options': 'Opciones privadas sólidas',
      'Strong clinical base': 'Base clínica fuerte',
      'Strong for a mid-sized city': 'Fuerte para una ciudad intermedia',
      'Strong private care reputation': 'Buena reputación en salud privada',
      'Top-tier private care': 'Salud privada de primer nivel',
      'Better for socially active retirees': 'Mejor para jubilados socialmente activos',
      'Better for warm-weather pragmatists': 'Mejor para quienes priorizan clima cálido con pragmatismo',
      'Excellent for calm retirement living': 'Excelente para un retiro tranquilo',
      'Lifestyle-first retirees': 'Retiro enfocado en estilo de vida',
      'One of the strongest retirement fits': 'Uno de los ajustes más fuertes para retiro',
      'Strong for active retirees': 'Fuerte para jubilados activos',
      'Strong for beach retirees': 'Fuerte para retiro de playa',
      'Strong services, heavier city friction': 'Buenos servicios, con mayor fricción urbana',
      'Coastal maintenance heavy': 'Mantenimiento costero exigente',
      'Hands-on coastal maintenance': 'Mantenimiento costero muy operativo',
      'Manageable': 'Manejable',
      'Moderate': 'Moderada',
      'Moderate coastal wear': 'Desgaste costero moderado',
      'Moderate to high': 'Moderada a alta'
    };
    return labels[value] || value;
  }

  function formatTagLabel(tag) {
    if (state.language !== 'es') return tag.replace('-', ' ');
    const labels = {
      walkable: 'caminable',
      'expat-friendly': 'amigable para expatriados',
      'retiree-friendly': 'amigable para retiro',
      healthcare: 'salud',
      'remote-work': 'trabajo remoto',
      coastal: 'costero',
      tourism: 'turismo',
      families: 'familias',
      'executive-rentals': 'arriendo ejecutivo',
      'low-maintenance': 'menor mantenimiento',
      'forever-young': 'larga estancia',
      value: 'valor'
    };
    return labels[tag] || tag.replace('-', ' ');
  }

  function getLocalizedData(data) {
    if (state.language !== 'es') return data;

    const content = getContentConfig();
    const cityOverrides = content.cityOverridesEs || {};
    const siteOverrides = content.siteOverridesEs || {};

    const localizedCities = data.cities.map((city) => ({
      ...(cityOverrides[city.slug] || {}),
      ...city,
      name: withEsValue(city.nameEs, city.name),
      tagline: withEsValue(cityOverrides[city.slug]?.tagline, withEsValue(city.taglineEs, city.tagline)),
      shortTagline: withEsValue(cityOverrides[city.slug]?.shortTagline, withEsValue(city.shortTaglineEs, city.shortTagline)),
      region: withEsValue(city.regionEs, city.region),
      appreciationTrend: city.appreciationTrend?.replace('year-over-year', 'interanual'),
      climate: withEsValue(cityOverrides[city.slug]?.climate, withEsValue(city.climateEs, city.climate)),
      pace: withEsValue(cityOverrides[city.slug]?.pace, withEsValue(city.paceEs, city.pace)),
      historicalContext: withEsValue(cityOverrides[city.slug]?.historicalContext, withEsValue(city.historicalContextEs, city.historicalContext)),
      investorAppeal: withEsValue(cityOverrides[city.slug]?.investorAppeal, withEsValue(city.investorAppealEs, city.investorAppeal)),
      lifestyleHighlights: withEsValue(cityOverrides[city.slug]?.lifestyleHighlights, withEsValue(city.lifestyleHighlightsEs, city.lifestyleHighlights)),
      introText: withEsValue(cityOverrides[city.slug]?.introText, withEsValue(city.introTextEs, city.introText)),
      destinationHighlights: withEsValue(cityOverrides[city.slug]?.destinationHighlights, withEsValue(city.destinationHighlightsEs, city.destinationHighlights)),
      watchouts: withEsValue(cityOverrides[city.slug]?.watchouts, withEsValue(city.watchoutsEs, city.watchouts)),
      first30DaysGuide: withEsValue(cityOverrides[city.slug]?.first30DaysGuide, withEsValue(city.first30DaysGuideEs, city.first30DaysGuide)),
      foreignOwnership: withEsValue(cityOverrides[city.slug]?.foreignOwnership, withEsValue(city.foreignOwnershipEs, city.foreignOwnership)),
      mortgageNote: withEsValue(cityOverrides[city.slug]?.mortgageNote, withEsValue(city.mortgageNoteEs, city.mortgageNote)),
      walkability: {
        ...city.walkability,
        label: withEsValue(city.walkability?.labelEs, translateEsLabel(city.walkability?.label)),
        summary: withEsValue(cityOverrides[city.slug]?.walkability?.summary, withEsValue(city.walkability?.summaryEs, city.walkability?.summary))
      },
      healthcare: {
        ...city.healthcare,
        label: withEsValue(city.healthcare?.labelEs, translateEsLabel(city.healthcare?.label)),
        summary: withEsValue(cityOverrides[city.slug]?.healthcare?.summary, withEsValue(city.healthcare?.summaryEs, city.healthcare?.summary))
      },
      retireeFit: {
        ...city.retireeFit,
        label: withEsValue(city.retireeFit?.labelEs, translateEsLabel(city.retireeFit?.label)),
        summary: withEsValue(cityOverrides[city.slug]?.retireeFit?.summary, withEsValue(city.retireeFit?.summaryEs, city.retireeFit?.summary))
      },
      repairReality: {
        ...city.repairReality,
        label: withEsValue(city.repairReality?.labelEs, translateEsLabel(city.repairReality?.label)),
        summary: withEsValue(cityOverrides[city.slug]?.repairReality?.summary, withEsValue(city.repairReality?.summaryEs, city.repairReality?.summary))
      },
      relocationSnapshot: {
        ...city.relocationSnapshot,
        bestFor: withEsValue(cityOverrides[city.slug]?.relocationSnapshot?.bestFor, withEsValue(city.relocationSnapshot?.bestForEs, city.relocationSnapshot?.bestFor)),
        monthlyComfort: withEsValue(cityOverrides[city.slug]?.relocationSnapshot?.monthlyComfort, withEsValue(city.relocationSnapshot?.monthlyComfortEs, city.relocationSnapshot?.monthlyComfort)),
        airport: withEsValue(cityOverrides[city.slug]?.relocationSnapshot?.airport, withEsValue(city.relocationSnapshot?.airportEs, city.relocationSnapshot?.airport)),
        englishSupport: withEsValue(cityOverrides[city.slug]?.relocationSnapshot?.englishSupport, withEsValue(city.relocationSnapshot?.englishSupportEs, city.relocationSnapshot?.englishSupport))
      },
      regulations: {
        ...city.regulations,
        airbnbSummary: withEsValue(cityOverrides[city.slug]?.regulations?.airbnbSummary, withEsValue(city.regulations?.airbnbSummaryEs, city.regulations?.airbnbSummary)),
        airbnbDetails: withEsValue(cityOverrides[city.slug]?.regulations?.airbnbDetails, withEsValue(city.regulations?.airbnbDetailsEs, city.regulations?.airbnbDetails))
      },
      rentalMarket: {
        ...city.rentalMarket,
        headline: withEsValue(cityOverrides[city.slug]?.rentalMarket?.headline, withEsValue(city.rentalMarket?.headlineEs, city.rentalMarket?.headline)),
        longStayDemand: withEsValue(cityOverrides[city.slug]?.rentalMarket?.longStayDemand, withEsValue(city.rentalMarket?.longStayDemandEs, city.rentalMarket?.longStayDemand)),
        furnishedDemand: withEsValue(cityOverrides[city.slug]?.rentalMarket?.furnishedDemand, withEsValue(city.rentalMarket?.furnishedDemandEs, city.rentalMarket?.furnishedDemand)),
        shortStayReality: withEsValue(cityOverrides[city.slug]?.rentalMarket?.shortStayReality, withEsValue(city.rentalMarket?.shortStayRealityEs, city.rentalMarket?.shortStayReality)),
        tenantMix: withEsValue(cityOverrides[city.slug]?.rentalMarket?.tenantMix, withEsValue(city.rentalMarket?.tenantMixEs, city.rentalMarket?.tenantMix)),
        landlordWatchouts: withEsValue(cityOverrides[city.slug]?.rentalMarket?.landlordWatchouts, withEsValue(city.rentalMarket?.landlordWatchoutsEs, city.rentalMarket?.landlordWatchouts))
      },
      neighborhoods: (city.neighborhoods || []).map((neighborhood) => ({
        ...neighborhood,
        character: withEsValue(cityOverrides[city.slug]?.neighborhoods?.[neighborhood.name]?.character, withEsValue(neighborhood.characterEs, neighborhood.character)),
        bestFor: withEsValue(cityOverrides[city.slug]?.neighborhoods?.[neighborhood.name]?.bestFor, withEsValue(neighborhood.bestForEs, neighborhood.bestFor)),
        rentalProfile: withEsValue(cityOverrides[city.slug]?.neighborhoods?.[neighborhood.name]?.rentalProfile, withEsValue(neighborhood.rentalProfileEs, neighborhood.rentalProfile))
      }))
    }));

    return {
      ...data,
      siteMeta: {
        ...data.siteMeta,
        dataUpdatedLabel: withEsValue(data.siteMeta.dataUpdatedLabelEs, data.siteMeta.dataUpdatedLabel),
        legalReviewedLabel: withEsValue(data.siteMeta.legalReviewedLabelEs, data.siteMeta.legalReviewedLabel),
        healthcareReviewedLabel: withEsValue(data.siteMeta.healthcareReviewedLabelEs, data.siteMeta.healthcareReviewedLabel),
        localAudienceNote: withEsValue(data.siteMeta.localAudienceNoteEs, data.siteMeta.localAudienceNote),
        socialLinks: (data.siteMeta.socialLinks || []).map((link) => ({
          ...link,
          description: withEsValue(siteOverrides.socialLinks?.[link.name]?.description, link.description)
        })),
        partnerStandards: (data.siteMeta.partnerStandards || []).map((item, index) => ({
          ...item,
          metric: withEsValue(siteOverrides.partnerStandards?.[index]?.metric, item.metric),
          target: withEsValue(siteOverrides.partnerStandards?.[index]?.target, item.target),
          detail: withEsValue(siteOverrides.partnerStandards?.[index]?.detail, item.detail)
        })),
        residency: {
          ...data.siteMeta.residency,
          lastReviewed: withEsValue(siteOverrides.residency?.lastReviewed, data.siteMeta.residency?.lastReviewed),
          officialPagesUpdated: withEsValue(siteOverrides.residency?.officialPagesUpdated, data.siteMeta.residency?.officialPagesUpdated),
          minimumWageReference: withEsValue(siteOverrides.residency?.minimumWageReference, data.siteMeta.residency?.minimumWageReference),
          feeCheckerLabel: withEsValue(siteOverrides.residency?.feeCheckerLabel, data.siteMeta.residency?.feeCheckerLabel),
          feeNote: withEsValue(siteOverrides.residency?.feeNote, data.siteMeta.residency?.feeNote),
          cards: (data.siteMeta.residency?.cards || []).map((card) => ({
            ...card,
            name: withEsValue(siteOverrides.residency?.cards?.[card.slug]?.name, card.name),
            subhead: withEsValue(siteOverrides.residency?.cards?.[card.slug]?.subhead, card.subhead),
            thresholdLabel: withEsValue(siteOverrides.residency?.cards?.[card.slug]?.thresholdLabel, card.thresholdLabel),
            thresholdCop: withEsValue(siteOverrides.residency?.cards?.[card.slug]?.thresholdCop, card.thresholdCop),
            thresholdUsd: withEsValue(siteOverrides.residency?.cards?.[card.slug]?.thresholdUsd, card.thresholdUsd),
            summary: withEsValue(siteOverrides.residency?.cards?.[card.slug]?.summary, card.summary),
            mustKnow: withEsValue(siteOverrides.residency?.cards?.[card.slug]?.mustKnow, card.mustKnow),
            sourceLabel: withEsValue(siteOverrides.residency?.cards?.[card.slug]?.sourceLabel, card.sourceLabel)
          }))
        },
        healthcare: {
          ...data.siteMeta.healthcare,
          summary: withEsValue(data.siteMeta.healthcare?.summaryEs, data.siteMeta.healthcare?.summary),
          highlights: withEsValue(data.siteMeta.healthcare?.highlightsEs, data.siteMeta.healthcare?.highlights)
        }
      },
      cities: localizedCities
    };
  }

  function loadLanguagePreference(data = state.data) {
    const stored = (() => {
      try {
        return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      } catch (error) {
        return null;
      }
    })();

    const supported = data?.siteMeta?.supportedLanguages || ['en', 'es'];
    if (supported.includes(stored)) return stored;

    const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
    const preferred = browserLanguages
      .filter(Boolean)
      .map((value) => value.toLowerCase())
      .find((value) => value.startsWith('es'));
    const browserLanguage = preferred ? 'es' : 'en';
    if (supported.includes(browserLanguage)) return browserLanguage;

    return data?.siteMeta?.defaultLanguage || 'en';
  }

  function persistLanguagePreference(language) {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.warn('Unable to persist language preference.', error);
    }
  }

  function updateDocumentLanguage() {
    document.documentElement.lang = state.language === 'es' ? 'es' : 'en';
  }

  function prepareMainContent() {
    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'main-content';
    if (main) main.tabIndex = -1;
  }

  async function loadFxRate(data, allowLive = true) {
    const cached = (() => {
      try {
        return JSON.parse(window.localStorage.getItem(FX_CACHE_KEY) || 'null');
      } catch (error) {
        return null;
      }
    })();

    const fallback = {
      rate: data.siteMeta.exchangeRateCopPerUsd,
      date: data.siteMeta.lastUpdated,
      sourceLabel: data.siteMeta.exchangeRate.sourceLabel,
      sourceUrl: data.siteMeta.exchangeRate.sourceUrl,
      fetchedAt: `${data.siteMeta.lastUpdated}T12:00:00Z`,
      live: false
    };

    if (!allowLive) {
      state.fx = cached?.rate ? cached : fallback;
      return state.fx;
    }

    try {
      const response = await fetch(data.siteMeta.exchangeRate.endpoint, { cache: 'no-store' });
      if (!response.ok) throw new Error(`FX endpoint returned ${response.status}`);
      const payload = await response.json();
      if (!payload.rate || !payload.date) throw new Error('FX payload missing expected fields.');

      state.fx = {
        rate: Number(payload.rate),
        date: payload.date,
        sourceLabel: data.siteMeta.exchangeRate.sourceLabel,
        sourceUrl: data.siteMeta.exchangeRate.sourceUrl,
        fetchedAt: new Date().toISOString(),
        live: true
      };

      try {
        window.localStorage.setItem(FX_CACHE_KEY, JSON.stringify(state.fx));
      } catch (error) {
        console.warn('Unable to cache FX rate locally.', error);
      }
      return state.fx;
    } catch (error) {
      console.warn('Live FX lookup failed, using cached or JSON fallback.', error);
      state.fx = cached?.rate ? cached : fallback;
      return state.fx;
    }
  }

  function getParams() {
    return new URLSearchParams(window.location.search);
  }

  function getCurrentPage() {
    return document.body.dataset.page || '';
  }

  function updateDocumentMeta({ title, description }) {
    if (title) document.title = title;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
  }

  function getContentConfig() {
    return window.CASACLARO_CONTENT || { meta: {}, sections: {}, siteOverridesEs: {}, cityOverridesEs: {} };
  }

  function applyContentSections() {
    const page = getCurrentPage();
    const locale = state.language === 'es' ? 'es' : 'en';
    const content = getContentConfig();

    const meta = content.meta?.[page]?.[locale];
    if (meta) updateDocumentMeta(meta);

    const sectionMap = content.sections?.[page] || {};
    Object.entries(sectionMap).forEach(([selector, translations]) => {
      const target = document.querySelector(selector);
      if (!target) return;
      const html = translations?.[locale] || translations?.en;
      if (html) target.innerHTML = html;
    });
  }

  function bindStaticActions() {
    const printGuideButton = document.getElementById('print-guide');
    if (printGuideButton && printGuideButton.dataset.bound !== 'true') {
      printGuideButton.dataset.bound = 'true';
      printGuideButton.addEventListener('click', () => window.print());
    }
  }

  function formatMoney(value, currency = state.currency) {
    const isCop = currency === 'COP';
    const amount = isCop ? value * getFxRate() : value;
    return new Intl.NumberFormat(getLocale(), {
      style: 'currency',
      currency,
      maximumFractionDigits: isCop ? 0 : 0
    }).format(amount);
  }

  function formatCount(value) {
    if (value >= 1000) return `${Math.round(value / 1000)}K+`;
    return `${value}+`;
  }

  function formatPercent(value) {
    return `${Number(value).toFixed(1)}%`;
  }

  function setStaticText(selector, text) {
    const element = document.querySelector(selector);
    if (element) element.textContent = text;
  }

  function setStaticHtml(selector, html) {
    const element = document.querySelector(selector);
    if (element) element.innerHTML = html;
  }

  function setStaticAttr(selector, attr, value) {
    const element = document.querySelector(selector);
    if (element) element.setAttribute(attr, value);
  }

  function setStaticControlLabel(selector, text) {
    const control = document.querySelector(selector);
    if (!control) return;
    const label = control.closest('label') || (control.id ? document.querySelector(`label[for="${control.id}"]`) : null);
    if (!label) return;
    const textNode = [...label.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
    if (textNode) {
      textNode.textContent = text;
    } else {
      label.prepend(document.createTextNode(text));
    }
  }

  function applyPageMetaTranslations(page) {
    const meta = {
      home: {
        en: {
          title: 'CasaClaro | Colombia Property, Relocation, and Neighborhood Intelligence',
          description: 'CasaClaro helps buyers, renters, sellers, expatriates, retirees, brokers, and families compare Colombian cities and neighborhoods with bilingual market context.'
        },
        es: {
          title: 'CasaClaro | Propiedad, reubicacion e inteligencia barrial en Colombia',
          description: 'CasaClaro ayuda a compradores, arrendatarios, propietarios, expatriados, jubilados, brokers y familias a comparar ciudades y barrios de Colombia con contexto bilingue.'
        }
      },
      cities: {
        en: {
          title: 'CasaClaro Cities | Explore Colombia City by City',
          description: 'Browse Colombian cities with pricing, healthcare, walkability, neighborhood pricing, and rental context.'
        },
        es: {
          title: 'CasaClaro Ciudades | Explora Colombia ciudad por ciudad',
          description: 'Explora ciudades de Colombia con precios, salud, caminabilidad, valores de barrio y contexto de arriendos.'
        }
      },
      rentals: {
        en: {
          title: 'CasaClaro Rentals | Colombia Rental Markets and Neighborhoods',
          description: 'Explore Colombian rental markets by city and neighborhood, from long-stay demand to furnished and short-stay realities.'
        },
        es: {
          title: 'CasaClaro Arriendos | Mercados y barrios de Colombia',
          description: 'Explora mercados de arriendo en Colombia por ciudad y barrio, desde demanda de larga estancia hasta realidades amobladas y de corta estancia.'
        }
      },
      relocation: {
        en: {
          title: 'CasaClaro Relocation | Expat and Retirement City Comparison',
          description: 'Compare Colombian cities for expatriates, retirees, and long-stay buyers using healthcare, walkability, climate, and residency context.'
        },
        es: {
          title: 'CasaClaro Reubicacion | Comparacion de ciudades para expatriados y retiro',
          description: 'Compara ciudades de Colombia para expatriados, jubilados y compradores de larga estancia usando salud, caminabilidad, clima y contexto migratorio.'
        }
      },
      simulator: {
        en: {
          title: 'CasaClaro Cost Simulator | Colombia Property Modeling',
          description: 'Model Colombian acquisition costs, financing, and rental cash flow with the same FX and city data used across CasaClaro.'
        },
        es: {
          title: 'CasaClaro Simulador | Modelado de propiedad en Colombia',
          description: 'Modela costos de compra, financiamiento y flujo de arriendo con el mismo FX y datos de ciudad usados en CasaClaro.'
        }
      },
      map: {
        en: {
          title: 'CasaClaro Map | Colombia Market Map',
          description: 'View CasaClaro city markets on an interactive Colombia map and jump directly into city guides.'
        },
        es: {
          title: 'CasaClaro Mapa | Mapa de mercados de Colombia',
          description: 'Mira los mercados de CasaClaro en un mapa interactivo de Colombia y entra directo a las guias de ciudad.'
        }
      },
      guide: {
        en: {
          title: 'CasaClaro Guide | Buying Property in Colombia',
          description: 'A step-by-step guide to researching, buying, and stabilizing property in Colombia.'
        },
        es: {
          title: 'CasaClaro Guia | Comprar propiedad en Colombia',
          description: 'Una guia paso a paso para investigar, comprar y estabilizar propiedad en Colombia.'
        }
      },
      residency: {
        en: {
          title: 'CasaClaro Residency | Time-Stamped Colombia Visa Guidance',
          description: 'Review current Colombia visa pathways with time-stamped thresholds, healthcare notes, and official references.'
        },
        es: {
          title: 'CasaClaro Residencia | Guia de visas con fecha en Colombia',
          description: 'Revisa rutas vigentes de visa en Colombia con umbrales fechados, notas de salud y referencias oficiales.'
        }
      },
      sellers: {
        en: {
          title: 'CasaClaro For Sellers | Submit a Home in Colombia',
          description: 'Seller education and structured home submission for CasaClaro\'s Colombia marketplace.'
        },
        es: {
          title: 'CasaClaro Propietarios | Publica un inmueble en Colombia',
          description: 'Educacion para propietarios y envio estructurado de inmuebles dentro del marketplace Colombia de CasaClaro.'
        }
      },
      agents: {
        en: {
          title: 'CasaClaro Partners | For Agents, Brokers, and Local Operators',
          description: 'Partner standards and applications for agents, brokers, lawyers, contractors, and operators inside CasaClaro.'
        },
        es: {
          title: 'CasaClaro Aliados | Para agentes, brokers y operadores locales',
          description: 'Estandares y postulaciones para agentes, brokers, abogados, contratistas y operadores dentro de CasaClaro.'
        }
      }
    };

    const pageMeta = meta[page];
    if (!pageMeta) return;
    updateDocumentMeta(pageMeta[state.language] || pageMeta.en);
  }

  function translateHomeStatic() {
    setStaticText('.home-copy h1', 'Lee Colombia con claridad antes de comprar, arrendar, mudarte o publicar.');
    setStaticText('.home-copy .hero-lede', 'CasaClaro es una plataforma bilingüe para compradores, arrendatarios, propietarios, expatriados, jubilados, brokers y familias que necesitan verdad de barrio en lugar de texto genérico de listado.');
    setStaticText('.home-copy .home-support', 'Compara ciudades, profundiza en barrios, revisa dinámicas de arriendo y venta, sigue la capa viva USD/COP y pasa de la investigación a la acción local con mejor contexto.');
    document.querySelectorAll('.hero-home .hero-actions a').forEach((link, index) => {
      const labels = ['Explorar ciudades', 'Comparar barrios', 'Guía de reubicación'];
      if (labels[index]) link.textContent = labels[index];
    });
    document.querySelectorAll('.hero-home .tag-row .tag').forEach((tag, index) => {
      const labels = ['Compradores', 'Familias', 'Expatriados', 'Arrendatarios', 'Jubilados', 'Propietarios', 'Brokers'];
      if (labels[index]) tag.textContent = labels[index];
    });
    const sections = document.querySelectorAll('main > section');
    if (sections[1]) {
      sections[1].querySelector('.section-kicker').textContent = 'Elige tu ruta';
      sections[1].querySelector('h2').textContent = 'Empieza por la decisión que realmente necesitas tomar';
      sections[1].querySelector('.hero-lede').textContent = 'La plataforma se organiza alrededor de metas reales: explorar una ciudad, comparar barrios, arrendar antes de comprar, publicar una propiedad o encontrar aliados disciplinados.';
      const cards = sections[1].querySelectorAll('.journey-card');
      const copy = [
        ['Inversionistas', 'Sube de ciudad antes de subir de unidad', 'Compara precio por m2, rendimiento, costos de cierre, reparaciones y regulación antes de que un solo listado encuadre toda la oportunidad.', 'Corre el simulador de costos'],
        ['Hogares en reubicación', 'Elige una ciudad que funcione después de la primera semana', 'Compara profundidad de salud, caminabilidad, clima, carga de mantenimiento y fricción migratoria antes de decidir dónde debe ocurrir la vida diaria.', 'Abrir guía de reubicación'],
        ['Compradores locales y familias', 'Lee el mercado en COP, no solo en shorthand de comprador extranjero', 'Precios de barrio, ángulos de arriendo y comparaciones para brokers aparecen en COP y USD para que los hogares locales usen el mismo sistema con menos fricción.', 'Abrir vista local'],
        ['Arrendatarios y propietarios', 'Entiende el arriendo a nivel de ciudad y barrio', 'Sigue dinámicas de larga estancia, amoblado y corta estancia con notas de barrio que dicen más que un titular de rentabilidad bruta.', 'Explorar mercados de arriendo'],
        ['Propietarios', 'Publica con mejor contexto de precio, reparaciones y documentos', 'La toma de inmuebles recoge condición, adjuntos, tiempos y señal de barrio para que la siguiente conversación con comprador o broker arranque con hechos.', 'Iniciar intake de propietario'],
        ['Brokers y operadores', 'La participación seria necesita estándares', 'Revisa objetivos SLA, expectativas de enrutamiento y el contexto local que CasaClaro busca entregar con cada lead o ficha de propietario.', 'Ver estándares de aliados']
      ];
      cards.forEach((card, index) => {
        if (!copy[index]) return;
        card.querySelector('.section-kicker').textContent = copy[index][0];
        card.querySelector('h3').textContent = copy[index][1];
        card.querySelector('p:last-of-type').textContent = copy[index][2];
        card.querySelector('.link-arrow').textContent = copy[index][3];
      });
    }
    if (sections[2]) {
      const cards = sections[2].querySelectorAll('.panel-card');
      if (cards[0]) {
        cards[0].querySelector('.section-kicker').textContent = 'Lente comprador local';
        cards[0].querySelector('h2').textContent = 'Primero COP, primero barrio, con sello de fecha';
        cards[0].querySelector('.hero-lede').textContent = 'La misma capa FX verificada que usa el simulador también alimenta las herramientas de comparación barrial, las tarjetas de ciudad y las vistas en COP.';
        const list = cards[0].querySelector('.check-list');
        if (list) {
          list.innerHTML = `
            <li>La foto USD/COP de arriba alimenta las conversiones visibles en toda la plataforma.</li>
            <li>Los barrios se comparan directo en COP/m2 en lugar de quedarse solo en promedios amplios de ciudad.</li>
            <li>Arriendos, reventa y carga de reparaciones siguen visibles para locales, brokers y compradores transfronterizos.</li>
          `;
        }
        cards[0].querySelectorAll('.hero-actions a')[0].textContent = 'Comparar barrios';
        cards[0].querySelectorAll('.hero-actions a')[1].textContent = 'Modelar números';
      }
      if (cards[1]) {
        cards[1].querySelector('.section-kicker').textContent = 'Herramienta de barrios';
        cards[1].querySelector('h2').textContent = 'Mide distritos frente al promedio de la ciudad';
        cards[1].querySelector('.hero-lede').textContent = 'Usa el módulo local del explorador para ordenar barrios por COP/m2, filtrar por ciudad y ver si un distrito transa por encima o por debajo del promedio general.';
        const list = cards[1].querySelector('.check-list');
        if (list) {
          list.innerHTML = `
            <li>Diseñada para compradores locales, brokers y familias que comparan shortlist en COP.</li>
            <li>Usa la tasa USD/COP activa con nota de verificación visible.</li>
            <li>Junta precio con encaje barrial en vez de dejar el precio aislado.</li>
          `;
        }
        cards[1].querySelectorAll('.hero-actions a')[0].textContent = 'Abrir herramienta';
        cards[1].querySelectorAll('.hero-actions a')[1].textContent = 'Explorar mercados';
      }
    }
    const cityBriefs = document.getElementById('home-city-briefs');
    if (cityBriefs) {
      cityBriefs.querySelector('.section-kicker').textContent = 'Resúmenes de ciudad';
      cityBriefs.querySelector('h2').textContent = 'Guías de mercado y estilo de vida por ciudad';
      cityBriefs.querySelector('.hero-lede').textContent = 'Estas tarjetas dan a inversionistas, compradores locales, arrendatarios y familias en reubicación un tablero inicial claro antes de bajar al barrio.';
    }
    const neighborhoodSection = document.getElementById('home-neighborhoods');
    if (neighborhoodSection) {
      const article = neighborhoodSection.querySelector('article');
      if (article) {
        const kicker = article.querySelector('.section-kicker');
        const title = article.querySelector('h2');
        const lede = article.querySelector('.hero-lede');
        const paragraphs = article.querySelectorAll('p');
        const actions = article.querySelectorAll('.hero-actions a');
        if (kicker) kicker.textContent = 'Barrios y arriendos';
        if (title) title.textContent = 'Porque la decisión cambia cuadra por cuadra';
        if (lede) lede.textContent = 'CasaClaro trata los barrios como una capa propia para locales, arrendatarios, jubilados, propietarios y compradores transfronterizos que necesitan algo más que un titular de ciudad.';
        if (paragraphs[2]) paragraphs[2].textContent = 'Usa los destacados barriales para entender carácter, perfil de inquilino y bandas de precio; luego abre la vista de arriendos para ver larga estancia, amoblado y corta estancia.';
        if (actions[0]) actions[0].textContent = 'Ver mercados de arriendo';
        if (actions[1]) actions[1].textContent = 'Abrir comparación completa';
      }
    }
    const practicalSection = document.getElementById('home-practical');
    if (practicalSection) {
      practicalSection.querySelector('.section-kicker').textContent = 'Chequeos prácticos';
      practicalSection.querySelector('h2').textContent = 'Las preguntas que la gente hace primero';
      const cards = practicalSection.querySelectorAll('.feature-card');
      const copy = [
        ['¿Es caminable?', 'Cada guía de ciudad ya trae una vista de caminabilidad para que la vida diaria no se deduzca solo por fotos de listado.'],
        ['¿Cómo es la salud?', 'La profundidad de la salud privada, la practicidad para retiro y el contexto de larga estancia aparecen en reubicación, residencia y ciudad.'],
        ['¿Cómo pega el mantenimiento?', 'Desgaste costero, sistemas de edificios antiguos, humedad y carga de mantenimiento ya forman parte de la lectura de riesgo.'],
        ['¿Qué pasa con visas y reglas?', 'Las notas de residencia y regulación tienen sello de fecha y vuelven a las fuentes oficiales colombianas vigentes.']
      ];
      cards.forEach((card, index) => {
        if (!copy[index]) return;
        card.querySelector('h3').textContent = copy[index][0];
        card.querySelector('p').textContent = copy[index][1];
      });
    }
    const relocationSection = document.getElementById('home-relocation');
    if (relocationSection) {
      relocationSection.querySelector('.section-kicker').textContent = 'Reubicación y larga estancia';
      relocationSection.querySelector('h2').textContent = 'Retiro, reubicación y vida diaria siguen visibles';
      relocationSection.querySelector('.hero-lede').textContent = 'El lente de reubicación se mantiene cerca de la salud, las rutinas tranquilas y el encaje barrial para que el retiro y la larga estancia no queden forzados dentro de una sola narrativa inversionista.';
    }
    if (sections[7]) {
      const cards = sections[7].querySelectorAll('.panel-card');
      if (cards[0]) {
        cards[0].querySelector('.section-kicker').textContent = 'Para propietarios';
        cards[0].querySelector('h2').textContent = 'Lleva precio, reparaciones y tiempo a la primera conversación';
        cards[0].querySelector('p').textContent = 'Los propietarios pueden enviar inmuebles con precio, notas de reparación, contexto de barrio, adjuntos y tiempos para que el buyer matching arranque con mejor información.';
        cards[0].querySelectorAll('.hero-actions a, .hero-actions button')[0].textContent = 'Información para propietarios';
        cards[0].querySelectorAll('.hero-actions a, .hero-actions button')[1].textContent = 'Enviar inmueble';
      }
      if (cards[1]) {
        cards[1].querySelector('.section-kicker').textContent = 'Para agentes y brokers';
        cards[1].querySelector('h2').textContent = 'La participación en el marketplace depende de estándares de servicio';
        cards[1].querySelector('p').textContent = 'Los flujos para agentes, brokers, abogados, contratistas y property managers se apoyan en expectativas de respuesta más claras y un intake con mejor contexto.';
        cards[1].querySelectorAll('.hero-actions a, .hero-actions button')[0].textContent = 'Programa de aliados';
        cards[1].querySelectorAll('.hero-actions a, .hero-actions button')[1].textContent = 'Postularme como aliado';
      }
    }
    if (sections[8]) {
      sections[8].querySelector('.section-kicker').textContent = 'Estándares de aliados';
      sections[8].querySelector('h2').textContent = 'Los leads calificados necesitan disciplina de respuesta';
    }
    if (sections[9]) {
      sections[9].querySelector('.section-kicker').textContent = 'Actualizaciones de mercado';
      sections[9].querySelector('h2').textContent = 'Sigue FX, revisión legal y cambios de mercado';
      sections[9].querySelector('p').textContent = 'Únete a la lista para recibir cambios revisados en datos de ciudad, guía migratoria y la capa cambiaria usada en toda la plataforma.';
      const labels = sections[9].querySelectorAll('label');
      if (labels[0]) labels[0].childNodes[0].textContent = 'Nombre';
      if (labels[1]) labels[1].childNodes[0].textContent = 'Correo';
      const submit = sections[9].querySelector('button[type="submit"]');
      if (submit) submit.textContent = 'Notifícame';
    }
  }

  function translateCitiesStatic() {
    setStaticText('.page-hero .section-kicker', 'Ciudades');
    setStaticText('.page-hero h1', 'Explora Colombia ciudad por ciudad');
    setStaticText('.page-hero .hero-lede', 'Filtra por caminabilidad, encaje para retiro, vida costera, valor, fuerza en salud y carga de reparaciones antes de bajar a un shortlist o a un barrio.');
    setStaticControlLabel('#explorer-search', 'Buscar ciudad o señal de estilo de vida');
    setStaticAttr('#explorer-search', 'placeholder', 'Medellín, costa, retiro, caminable, salud…');
    setStaticControlLabel('#explorer-sort', 'Ordenar ciudades');
    const filterLabels = {
      all: 'Todo',
      walkable: 'Más caminables',
      retiree: 'Aptas para retiro',
      coastal: 'Costeras',
      value: 'Entrada de valor',
      healthcare: 'Profundidad de salud',
      'low-maintenance': 'Menor mantenimiento',
      'remote-work': 'Encaje remoto',
      'forever-young': 'Larga estancia'
    };
    document.querySelectorAll('[data-explorer-filter]').forEach((button) => {
      const label = filterLabels[button.dataset.explorerFilter];
      if (label) button.textContent = label;
    });
    const options = ['Orden destacado', 'Menor precio por m2', 'Mayor rendimiento de arriendo', 'Mejor caminabilidad', 'Mejor salud', 'Mejor encaje para retiro'];
    document.querySelectorAll('#explorer-sort option').forEach((option, index) => { if (options[index]) option.textContent = options[index]; });
    const helper = document.querySelector('.explorer-toolbar .helper-text');
    if (helper) helper.textContent = 'Usa filtros si ya tienes un lente claro. Usa búsqueda si solo conoces el estilo de vida o viaje que estás buscando.';
    const cards = document.querySelectorAll('.audience-mini-grid .feature-card');
    const copy = [
      ['Primer viaje de exploración', 'Empieza por caminabilidad, salud, clima y conectividad aérea si visitas antes de reubicarte.'],
      ['Shortlist para retiro', 'Usa encaje para retiro, carga de reparaciones y fuerza en salud antes de obsesionarte con la renta.'],
      ['Shortlist comprador local', 'Usa la herramienta barrial de abajo cuando el precio en COP y la dispersión entre distritos importe más que el titular internacional.'],
      ['Disciplina inversionista', 'Compara precio por m2, rendimientos y reglas sin asumir que la ciudad más famosa siempre es la mejor compra.']
    ];
    cards.forEach((card, index) => {
      if (!copy[index]) return;
      card.querySelector('h3').textContent = copy[index][0];
      card.querySelector('p').textContent = copy[index][1];
    });
    const sections = document.querySelectorAll('main > section');
    if (sections[2]) {
      sections[2].querySelector('.section-kicker').textContent = 'Comparación rápida';
      sections[2].querySelector('h2').textContent = 'Caminabilidad, salud, retiro y mantenimiento lado a lado';
    }
    if (sections[3]) {
      sections[3].querySelector('.section-kicker').textContent = 'Herramienta local para brokers';
      sections[3].querySelector('h2').textContent = 'Comparación directa de barrios en COP/m2';
      sections[3].querySelector('.hero-lede').textContent = 'Pensada para compradores locales, brokers y familias que suben riesgo y precio al nivel de barrio en lugar de quedarse en promedios amplios de ciudad.';
    }
    setStaticControlLabel('#neighborhood-cop-city', 'Filtro de ciudad');
    setStaticControlLabel('#neighborhood-cop-sort', 'Ordenar barrios');
    const neighborhoodSort = ['Mayor COP/m2', 'Más por encima del promedio de ciudad', 'Más por debajo del promedio de ciudad', 'Menor USD/m2'];
    document.querySelectorAll('#neighborhood-cop-sort option').forEach((option, index) => { if (neighborhoodSort[index]) option.textContent = neighborhoodSort[index]; });
  }

  function translateRentalsStatic() {
    setStaticText('.page-hero .section-kicker', 'Arriendos');
    setStaticText('.page-hero h1', 'Los mercados de arriendo viven al nivel de ciudad y barrio');
    setStaticText('.page-hero .hero-lede', 'Compara larga estancia, demanda amoblada, realidades de corta estancia y alertas para propietarios en Colombia tanto a nivel ciudad como a nivel barrio.');
    const sections = document.querySelectorAll('main > section');
    if (sections[1]) {
      sections[1].querySelector('.section-kicker').textContent = 'Foto de arriendo por ciudad';
      sections[1].querySelector('h2').textContent = 'Cómo difieren los principales mercados';
    }
    if (sections[2]) {
      sections[2].querySelector('.section-kicker').textContent = 'Ángulos de arriendo por barrio';
      sections[2].querySelector('h2').textContent = 'Porque la historia de renta cambia dentro de cada ciudad';
    }
    const cards = document.querySelectorAll('.panel-card');
    if (cards[0]) {
      cards[0].querySelector('.section-kicker').textContent = 'Para propietarios';
      const list = cards[0].querySelector('.check-list');
      if (list) {
        list.innerHTML = `
          <li>Sube reglas del edificio antes de subir el upside de tarifa nocturna.</li>
          <li>Precio unidades amobladas según demanda real de inquilino, no folklore de redes.</li>
          <li>Pregunta si tu mercado es realmente larga estancia, ejecutivo, retiro o turismo.</li>
          <li>Sigue carga de reparaciones y costo de rotación, sobre todo en la costa.</li>
        `;
      }
    }
    if (cards[1]) {
      cards[1].querySelector('.section-kicker').textContent = 'Siguiente paso';
      cards[1].querySelector('h2').textContent = 'Usa los números cuando el barrio ya tenga sentido';
      cards[1].querySelectorAll('.hero-actions a')[0].textContent = 'Correr simulador';
      cards[1].querySelectorAll('.hero-actions a')[1].textContent = 'Comparar ciudades';
      cards[1].querySelectorAll('.hero-actions a')[2].textContent = 'Enviar inventario apto para renta';
    }
  }

  function translateRelocationStatic() {
    setStaticText('.page-hero .section-kicker', 'Reubicación');
    setStaticText('.page-hero h1', 'Muévete a Colombia con expectativas más claras');
    setStaticText('.page-hero .hero-lede', 'Esta página es para expatriados, jubilados, familias que regresan y perfiles de larga estancia que necesitan más que matemática de inversión. Compara salud, caminabilidad, clima, carga de reparaciones y fricción migratoria antes de elegir dónde aterrizar.');
    document.querySelectorAll('.page-hero .tag-row .tag').forEach((tag, index) => {
      const labels = ['Expatriados', 'Jubilados', 'Familias que regresan', 'Larga estancia'];
      if (labels[index]) tag.textContent = labels[index];
    });
    const sections = document.querySelectorAll('main > section');
    if (sections[1]) {
      sections[1].querySelector('.section-kicker').textContent = 'Mejores puntos de partida';
      sections[1].querySelector('h2').textContent = 'Formas rápidas de orientarte';
    }
    const topCreamCards = sections[2]?.querySelectorAll('.panel-card') || [];
    if (topCreamCards[0]) {
      topCreamCards[0].querySelector('.section-kicker').textContent = 'Para retiro';
      topCreamCards[0].querySelector('h2').textContent = 'Las decisiones de retiro suelen ir sobre confort, cuidado y fricción';
      const list = topCreamCards[0].querySelector('.check-list');
      if (list) list.innerHTML = `
        <li>Empieza por profundidad de salud y habitabilidad rutinaria, no por vida nocturna o hype.</li>
        <li>Pregunta si quieres una ciudad social más densa, un ritmo cafetero más calmado o humedad costera.</li>
        <li>Prefiere edificios con historial de mantenimiento claro frente a relatos heroicos de remodelación.</li>
        <li>Usa la guía de residencia y el verificador de tarifas temprano para que el calendario siga realista.</li>
      `;
    }
    if (topCreamCards[1]) {
      topCreamCards[1].querySelector('.section-kicker').textContent = 'Para primeras visitas';
      topCreamCards[1].querySelector('h2').textContent = 'El encanto turístico y el encaje de larga estancia no siempre son lo mismo';
      const list = topCreamCards[1].querySelector('.check-list');
      if (list) list.innerHTML = `
        <li>Visita mañana, tarde y noche antes de decidir que un barrio encaja con tu ritmo.</li>
        <li>Pregunta cuánto tiempo quieres pasar en carro, en lomas o alrededor de humedad y calor.</li>
        <li>Valida si tu circuito diario probable es caminable: café, mercado, clínica y vida social.</li>
        <li>Usa las páginas de ciudad para separar energía vacacional de realidad de vida completa.</li>
      `;
    }
    const infoCards = sections[3]?.querySelectorAll('.panel-card') || [];
    if (infoCards[0]) {
      infoCards[0].querySelector('.section-kicker').textContent = 'Salud';
      infoCards[0].querySelector('h2').textContent = 'La planeación médica debe ocurrir antes de la mudanza';
    }
    if (infoCards[1]) {
      infoCards[1].querySelector('.section-kicker').textContent = 'Residencia';
      infoCards[1].querySelector('h2').textContent = 'La guía legal tiene sello de fecha';
      infoCards[1].querySelector('p').textContent = 'CasaClaro trata residencia y tarifas como información viva. Los umbrales cambian cuando Colombia actualiza el salario mínimo y las tarifas oficiales siempre deben revisarse antes de radicar.';
    }
    if (sections[4]) {
      sections[4].querySelector('.section-kicker').textContent = 'Comparación de ciudades';
      sections[4].querySelector('h2').textContent = 'Cómo se apilan las ciudades para vida de larga estancia';
    }
    const darkCards = sections[5]?.querySelectorAll('.panel-card') || [];
    if (darkCards[0]) {
      darkCards[0].querySelector('.section-kicker').textContent = 'Primeros 90 días';
      const list = darkCards[0].querySelector('.check-list');
      if (list) list.innerHTML = `
        <li>Valida estrategia de salud y seguro antes de asumir que la cobertura local funciona igual que en tu país.</li>
        <li>Arrienda antes de comprar si clima, altitud o ritmo barrial todavía son incógnita.</li>
        <li>Camina la zona en mañana y noche. Una ciudad puede ser encantadora al mediodía y agotadora por la noche.</li>
        <li>Pregunta directo por reparaciones, energía de respaldo, presión de agua y reservas del edificio.</li>
      `;
    }
    if (darkCards[1]) {
      darkCards[1].querySelector('.section-kicker').textContent = 'Siguiente paso';
      darkCards[1].querySelector('h2').textContent = 'Usa la herramienta correcta después de esta página';
      darkCards[1].querySelectorAll('.hero-actions a, .hero-actions button')[0].textContent = 'Abrir explorador de ciudades';
      darkCards[1].querySelectorAll('.hero-actions a, .hero-actions button')[1].textContent = 'Correr simulador';
      darkCards[1].querySelectorAll('.hero-actions a, .hero-actions button')[2].textContent = 'Hablar con CasaClaro';
    }
  }

  function translateResidencyStatic() {
    setStaticText('.page-hero .section-kicker', 'Residencia');
    setStaticText('.page-hero h1', 'Guía de residencia y visas con sello de fecha claro');
    setStaticText('.page-hero .hero-lede', 'Esta página trata la información legal como información viva. Los umbrales, requisitos y tarifas pueden cambiar, así que CasaClaro te devuelve a las fuentes oficiales vigentes en Colombia.');
    const sections = document.querySelectorAll('main > section');
    const topCards = sections[1]?.querySelectorAll('.panel-card') || [];
    if (topCards[0]) {
      topCards[0].querySelector('.section-kicker').textContent = 'Panorama oficial';
      topCards[0].querySelector('h2').textContent = 'Tarjetas de visa vigentes';
    }
    if (topCards[1]) {
      topCards[1].querySelector('.section-kicker').textContent = 'Chequeo de elegibilidad';
      topCards[1].querySelector('h2').textContent = 'Autoevaluación rápida';
      const labels = topCards[1].querySelectorAll('label');
      if (labels[0]) labels[0].childNodes[0].textContent = 'Monto de inversión planeado (COP)';
      if (labels[1]) labels[1].childNodes[0].textContent = 'Ingreso pensional mensual (COP)';
      const button = topCards[1].querySelector('button');
      if (button) button.textContent = 'Revisar encaje ilustrativo';
      const helper = topCards[1].querySelector('.helper-text');
      if (helper) helper.innerHTML = 'Las tarifas pueden cambiar y variar por tipo de visa, nacionalidad y oficina. Usa el verificador oficial antes de radicar: <a href="https://www.cancilleria.gov.co/tramites_servicios/visa/costos-medios-pago-oficinas-atencion" target="_blank" rel="noreferrer">verificador de tarifas de Cancillería</a>.';
    }
    const bottomCards = sections[2]?.querySelectorAll('.panel-card') || [];
    if (bottomCards[0]) {
      bottomCards[0].querySelector('.section-kicker').textContent = 'Salud';
      bottomCards[0].querySelector('h2').textContent = 'Los hogares jubilados deben tratar la cobertura como prioridad';
      const list = bottomCards[0].querySelector('.check-list');
      if (list) list.innerHTML = `
        <li>Muchos extranjeros arrancan con cobertura privada, prepagada o internacional mientras confirman elegibilidad de largo plazo.</li>
        <li>La ruta pensionado exige cobertura de salud y no concede automáticamente acceso al sistema colombiano salvo donde apliquen acuerdos bilaterales o multilaterales.</li>
        <li>Para hogares con necesidades complejas o muy cargados a especialistas, Medellín y Bogotá suelen ofrecer el banco privado más profundo.</li>
      `;
    }
    if (bottomCards[1]) {
      bottomCards[1].querySelector('.section-kicker').textContent = 'Errores comunes';
      const list = bottomCards[1].querySelector('.check-list');
      if (list) list.innerHTML = `
        <li>Comprar primero e intentar diseñar la estrategia de visa después.</li>
        <li>Suponer que contenido viejo de internet con umbrales o etiquetas desactualizadas sigue siendo suficiente.</li>
        <li>Tratar capturas de tarifas como si fueran duraderas aunque el tarifario oficial cambie.</li>
        <li>Omitir asesoría legal en registro de inversión extranjera cuando la ruta inversionista forma parte del plan.</li>
      `;
    }
  }

  function translateSellersStatic() {
    setStaticText('.page-hero .section-kicker', 'Propietarios');
    setStaticText('.page-hero h1', 'Publica un inmueble con mejor disciplina de precio y menos sorpresas');
    setStaticText('.page-hero .hero-lede', 'Lleva contexto de barrio, reparaciones, adjuntos, tiempos y expectativas realistas de salida al mercado a la primera conversación con comprador o broker.');
    const sections = document.querySelectorAll('main > section');
    const introCards = sections[1]?.querySelectorAll('.panel-card') || [];
    if (introCards[0]) {
      introCards[0].querySelector('.section-kicker').textContent = 'Antes de publicar';
      const list = introCards[0].querySelector('.check-list');
      if (list) list.innerHTML = `
        <li>Reúne información de título, predial, administración y ocupación antes de que la pida un comprador.</li>
        <li>Escribe reparaciones conocidas en lugar de esperar a que aparezcan en due diligence.</li>
        <li>Sé claro sobre si el inmueble está turnkey, ligeramente desactualizado o rumbo a una reforma pesada.</li>
        <li>En vivienda costera, asume que preguntarán por corrosión, impermeabilización, plantas y calidad de reservas.</li>
      `;
    }
    if (introCards[1]) {
      introCards[1].querySelector('.section-kicker').textContent = 'Qué pasa después de enviar';
      const list = introCards[1].querySelector('.check-list');
      if (list) list.innerHTML = `
        <li>CasaClaro revisa encaje, mercado, marco de precio y vacíos documentales dentro de un día hábil.</li>
        <li>Si el activo encaja con la red actual, puede rutearse a un flujo local de agente, broker o comprador.</li>
        <li>Adjuntos y notas ya quedan estructurados para un flujo CRM más limpio.</li>
      `;
    }
    if (sections[2]) {
      sections[2].querySelector('.section-kicker').textContent = 'Lente vendedor';
      sections[2].querySelector('h2').textContent = 'Resúmenes representativos por ciudad para propietarios';
      sections[2].querySelector('.hero-lede').textContent = 'Estas notas ayudan a entender cómo cambian condición, disciplina de precio y expectativas del comprador según el mercado.';
    }
    const form = document.querySelector('form[data-form-type="seller-page"]');
    if (form) {
      form.querySelector('.section-kicker').textContent = 'Intake propietario';
      form.querySelector('h2').textContent = 'Enviar un inmueble para revisión';
      const labels = form.querySelectorAll('label');
      const names = ['Nombre del propietario', 'Correo', 'Ciudad', 'Barrio', 'Tipo de inmueble', 'Precio pedido (USD)', 'Habitaciones (si es residencial)', 'Estado', 'Notas principales de reparaciones', 'Tiempo estimado', 'Adjuntos', 'Notas'];
      labels.forEach((label, index) => {
        const textNode = [...label.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
        if (textNode && names[index]) textNode.textContent = names[index];
      });
      const options = ['Apartamento', 'Casa', 'Penthouse', 'Lote', 'Comercial', 'Otro'];
      form.querySelectorAll('#seller-page-property-type option').forEach((option, index) => { if (options[index]) option.textContent = options[index]; });
      setStaticAttr('input[name="condition"]', 'placeholder', 'Turnkey, actualizaciones ligeras, reforma total…');
      setStaticAttr('textarea[name="repairs"]', 'placeholder', 'Humedad, cubierta, plomería, fachada, HVAC, ventanas, ascensor, drenaje…');
      setStaticAttr('input[name="timeline"]', 'placeholder', '30 días, 90 días, activo heredado, probando precio…');
      setStaticAttr('textarea[name="notes"]', 'placeholder', 'Ocupación, historial de arriendo, mejoras, reglas HOA, restricciones de cierre…');
      form.querySelector('button[type="submit"]').textContent = 'Enviar intake de propietario';
    }
    const repairCard = sections[3]?.querySelectorAll('.panel-card')[1];
    if (repairCard) {
      repairCard.querySelector('.section-kicker').textContent = 'Las reparaciones importan';
      repairCard.querySelector('h2').textContent = 'Por qué CasaClaro pregunta por reparaciones desde el inicio';
      repairCard.querySelector('p').textContent = 'La realidad de mantenimiento forma parte de la historia comercial tanto si el propietario la menciona como si no. Una narrativa calmada y clara ayuda con precio, buyer matching y certeza de cierre.';
      const lists = repairCard.querySelectorAll('.check-list');
      if (lists[0]) lists[0].innerHTML = `
        <li>El desgaste costero debe documentarse temprano.</li>
        <li>Los edificios urbanos más viejos necesitan contexto sobre reservas HOA y sistemas.</li>
        <li>Las mejoras recientes deben listarse con claridad para que el comprador no asuma lo peor.</li>
        <li>El mantenimiento diferido casi siempre termina convertido en conversación de precio.</li>
      `;
      if (lists[1]) lists[1].innerHTML = `
        <li>Prioriza recibos prediales, estados de administración, documentos de título y fotos claras de los puntos de mayor riesgo.</li>
        <li>Incluye resúmenes de inspección o cotizaciones si ya existen.</li>
        <li>Usa la caja de notas para ocupación, historial de arriendo o restricciones de cierre que cambien la ruta al mercado.</li>
      `;
      repairCard.querySelectorAll('.section-kicker')[1].textContent = 'Cuando los adjuntos estén activos';
    }
  }

  function translateAgentsStatic() {
    setStaticText('.page-hero .section-kicker', 'Aliados');
    setStaticText('.page-hero h1', 'Un marketplace necesita estándares, no solo leads');
    setStaticText('.page-hero .hero-lede', 'CasaClaro está hecho para agentes, brokers, abogados, property managers y contratistas serios que puedan trabajar con clientes locales e internacionales y responder con disciplina.');
    const sections = document.querySelectorAll('main > section');
    if (sections[1]) {
      sections[1].querySelector('.section-kicker').textContent = 'Estándares de aliados';
      sections[1].querySelector('h2').textContent = 'Las expectativas de respuesta son explícitas';
    }
    const creamCards = sections[2]?.querySelectorAll('.panel-card') || [];
    if (creamCards[0]) {
      creamCards[0].querySelector('.section-kicker').textContent = 'Cómo funciona el enrutamiento';
      creamCards[0].querySelector('h2').textContent = 'CasaClaro envía contexto, no caos';
      const list = creamCards[0].querySelector('.check-list');
      if (list) list.innerHTML = `
        <li>Los leads inversionistas llegan con ciudad, presupuesto, tiempo y objetivo.</li>
        <li>Los leads propietarios llegan con precio, condición, reparaciones y metadatos de adjuntos.</li>
        <li>Los clientes de reubicación ya traen visibles salud, caminabilidad y objetivos de retiro.</li>
        <li>Los aliados deben responder con claridad y actualizar estado en lugar de dejar el sistema ciego.</li>
      `;
    }
    if (creamCards[1]) {
      creamCards[1].querySelector('.section-kicker').textContent = 'Disciplina de marketplace';
      creamCards[1].querySelector('h2').textContent = 'Lo que hacen distinto los aliados fuertes';
      const list = creamCards[1].querySelector('.check-list');
      if (list) list.innerHTML = `
        <li>Traducen encaje barrial a lenguaje claro para extranjeros y nuevos participantes del mercado.</li>
        <li>Explican reparaciones, legal y fricción HOA temprano en lugar de esconderla.</li>
        <li>Respetan objetivos de respuesta porque el silencio se interpreta como riesgo.</li>
        <li>Coordinan con abogados, managers y contratistas cuando la transacción exige más que una visita.</li>
      `;
    }
    const lowerCards = sections[3]?.querySelectorAll('.panel-card') || [];
    if (lowerCards[0]) {
      lowerCards[0].querySelector('.section-kicker').textContent = 'Quién encaja';
      const list = lowerCards[0].querySelector('.check-list');
      if (list) list.innerHTML = `
        <li>Agentes y brokers que puedan explicar precios, regulación y encaje barrial con claridad.</li>
        <li>Abogados que entiendan título, registro de inversión extranjera y revisión contractual.</li>
        <li>Property managers que puedan estabilizar activos de larga estancia o de hospitalidad después del cierre.</li>
        <li>Contratistas que inspeccionen, coticen y comuniquen reparaciones sin optimismo vago.</li>
      `;
    }
    const form = document.querySelector('form[data-form-type="agent-page"]');
    if (form) {
      form.querySelector('.section-kicker').textContent = 'Postulación';
      form.querySelector('h2').textContent = 'Unirse a la red';
      const labels = form.querySelectorAll('label');
      const names = ['Nombre', 'Empresa', 'Ciudad principal', 'Rol', 'Especialidad', 'Tiempo típico de respuesta', 'WhatsApp o teléfono'];
      labels.forEach((label, index) => {
        const textNode = [...label.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
        if (textNode && names[index]) textNode.textContent = names[index];
      });
      const roleOptions = ['Agente', 'Broker', 'Abogado', 'Administrador', 'Contratista'];
      form.querySelectorAll('select[name="role"] option').forEach((option, index) => { if (roleOptions[index]) option.textContent = roleOptions[index]; });
      setStaticAttr('input[name="specialization"]', 'placeholder', 'Compradores retirados, costa, due diligence legal, reparaciones…');
      setStaticAttr('input[name="responseTime"]', 'placeholder', 'Mismo día, 24 horas, 48 horas…');
      form.querySelector('button[type="submit"]').textContent = 'Enviar postulación';
    }
    const finalCards = sections[4]?.querySelectorAll('.panel-card') || [];
    if (finalCards[0]) {
      finalCards[0].querySelector('.section-kicker').textContent = 'Lo que CasaClaro envía';
      finalCards[0].querySelector('h2').textContent = 'El contexto debe viajar con la introducción';
      finalCards[0].querySelector('p').textContent = 'Los aliados reciben un intake más limpio para que la primera respuesta ya pueda hablar de precio, barrio, reparaciones, fricción legal o tiempos.';
    }
    if (finalCards[1]) {
      finalCards[1].querySelector('.section-kicker').textContent = 'Qué hacen los aliados fuertes después';
      const list = finalCards[1].querySelector('.check-list');
      if (list) list.innerHTML = `
        <li>Confirman recepción rápido y explican el siguiente paso con claridad.</li>
        <li>Traducen encaje barrial, fricción legal y realidad de reparaciones en lenguaje simple.</li>
        <li>Coordinan con abogados, managers y contratistas cuando la operación requiere más que una visita.</li>
      `;
    }
  }

  function translateGuideStatic() {
    setStaticText('.page-hero .section-kicker', 'Guía inicial');
    setStaticText('.page-hero h1', 'Comprar propiedad en Colombia, paso a paso');
    setStaticText('.page-hero .hero-lede', 'Un mapa de arranque más limpio para inversionistas, personas en reubicación, jubilados y cualquiera que llegó a CasaClaro sin conocer el sistema.');
    setStaticHtml('.step-list', `
      <li><strong>Explora ciudades primero.</strong> Usa el <a href="cities.html">explorador de ciudades</a> y el <a href="map.html">mapa</a> antes de comparar dos propiedades que quizá ni siquiera pertenecen a la misma conversación.</li>
      <li><strong>Revisa encaje de reubicación.</strong> Si esto podría convertirse en tu casa, abre <a href="relocation.html">la página de reubicación</a> y compara salud, caminabilidad, reparaciones y ajuste para retiro.</li>
      <li><strong>Mira residencia temprano.</strong> Usa <a href="residency.html">la página de residencia</a> para revisar si tu estrategia de inversionista o pensionado cuadra con la guía oficial vigente.</li>
      <li><strong>Modela costos reales.</strong> Usa el <a href="cost-simulator.html">simulador</a> para costos de cierre, reserva de remodelación y flujo mensual ajustado por deuda.</li>
      <li><strong>Arma el equipo.</strong> CasaClaro está pensado para agentes, brokers, abogados, contratistas y property managers, no solo para vendedores.</li>
      <li><strong>Haz debida diligencia de título y edificio.</strong> Tu abogado debe revisar título, gravámenes, reglamento HOA, registro de inversión extranjera y usos antes de liberar fondos.</li>
      <li><strong>Sube las reparaciones con honestidad.</strong> Propiedades costeras, torres viejas y unidades baratas muchas veces parecen económicas porque el mantenimiento aún no ha sido bien valorizado.</li>
      <li><strong>Planifica los primeros 30 días.</strong> Cada <a href="city.html?id=medellin">guía de ciudad</a> ya incluye puntos específicos de aterrizaje del primer mes.</li>
    `);
    const checklistCard = document.querySelectorAll('.panel-card')[1];
    if (checklistCard) {
      checklistCard.querySelector('.section-kicker').textContent = 'Checklist';
      checklistCard.querySelector('h2').textContent = 'Enlaces rápidos';
      const list = checklistCard.querySelector('.check-list');
      if (list) list.innerHTML = `
        <li><a href="cities.html">Comparar ciudades lado a lado</a></li>
        <li><a href="relocation.html">Ver ajustes de reubicación para expats y jubilados</a></li>
        <li><a href="residency.html">Revisar notas legales con fecha</a></li>
        <li><a href="for-sellers.html">¿Vendes en lugar de comprar? Empieza aquí</a></li>
        <li><a href="for-agents.html">Revisar estándares de aliados</a></li>
      `;
      checklistCard.querySelector('button').textContent = 'Imprimir esta guía';
    }
  }

  function translateMapStatic() {
    setStaticText('.page-hero .section-kicker', 'Mapa');
    setStaticText('.page-hero h1', 'Mira los mercados en un mapa');
    setStaticText('.page-hero .hero-lede', 'Usa el mapa para orientarte geográficamente y luego entra a la guía de ciudad para ver habitabilidad, salud, reparaciones y regulación.');
    const citySnapshots = document.querySelectorAll('main > section')[2];
    if (citySnapshots) {
      citySnapshots.querySelector('.section-kicker').textContent = 'Fotos de ciudad';
      citySnapshots.querySelector('h2').textContent = 'Salta de la geografía al resumen de ciudad';
    }
  }

  function translateSimulatorStatic() {
    setStaticText('.page-hero .section-kicker', 'Simulador');
    setStaticText('.page-hero h1', 'Modela los números antes de que manden las emociones');
    setStaticText('.page-hero .hero-lede', 'El simulador toma supuestos de precio, rentabilidad y costos de cierre del mismo dataset que usan las tarjetas de ciudad, la reubicación y el mapa.');
    const form = document.getElementById('cost-simulator-form');
    if (form) {
      const labels = form.querySelectorAll('label');
      const names = ['Moneda de entrada', 'Precio del inmueble', 'Ciudad', 'Presupuesto de remodelación', 'Vista de moneda', 'Usar financiación', 'Cuota inicial (%)', 'Tasa de interés (%)', 'Plazo del crédito (años)'];
      labels.forEach((label, index) => {
        const textNode = [...label.childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
        if (textNode && names[index]) textNode.textContent = names[index];
      });
      const button = form.querySelector('#download-report');
      if (button) button.textContent = 'Descargar reporte';
      const helper = form.querySelector('.helper-text');
      if (helper) helper.textContent = 'La exportación PDF usa el diálogo de impresión del navegador para un reporte rápido. Agrega jsPDF o una ruta PDF del servidor después si necesitas exportes con marca.';
    }
    const results = document.querySelector('.simulator-results');
    if (results) {
      results.querySelector('.section-kicker').textContent = 'Salida ilustrativa';
      const labels = ['Costos de cierre', 'Capital inicial total', 'Arriendo bruto mensual', 'Flujo operativo mensual'];
      results.querySelectorAll('.result-grid article span').forEach((span, index) => { if (labels[index]) span.textContent = labels[index]; });
      results.querySelector('.helper-text:last-of-type').textContent = 'Los estimados son ilustrativos. Los costos, impuestos, financiación y renta real varían por propiedad y por barrio.';
    }
  }

  function translateCityTemplateStatic() {
    setStaticText('.page-hero .section-kicker', 'Redirigiendo');
    setStaticText('.page-hero h1', 'Usa la página dinámica de ciudad');
    setStaticHtml('.page-hero .hero-lede', 'CasaClaro renderiza las guías de ciudad a través de <code>city.html?id=slug</code>.');
    setStaticText('.page-hero .btn', 'Abrir ciudades');
  }

  function applyStaticTranslations() {
    const isEs = state.language === 'es';
    const choose = (en, es) => (isEs ? es : en);
    const setText = (selector, en, es) => {
      const element = document.querySelector(selector);
      if (element) element.textContent = choose(en, es);
    };
    const setHtml = (selector, en, es) => {
      const element = document.querySelector(selector);
      if (element) element.innerHTML = choose(en, es);
    };
    const setLabelText = (selector, en, es) => {
      const label = document.querySelector(selector);
      if (label && label.firstChild) label.firstChild.textContent = choose(en, es);
    };
    const setPlaceholder = (selector, en, es) => {
      const field = document.querySelector(selector);
      if (field) field.setAttribute('placeholder', choose(en, es));
    };
    const translations = {
      home: [
        ['.home-copy h1', 'Read Colombia clearly before you buy, rent, move, or list.', 'Lee Colombia con claridad antes de comprar, arrendar, mudarte o vender.'],
        ['.home-copy .hero-lede', 'CasaClaro is a bilingual Colombia property platform for buyers, renters, sellers, expatriates, retirees, brokers, and families who need neighborhood truth instead of generic listing copy.', 'CasaClaro es una plataforma bilingüe de propiedad en Colombia para compradores, arrendatarios, propietarios, expatriados, jubilados, brokers y familias que necesitan verdad de barrio en lugar de copy genérico de listado.'],
        ['.home-copy .home-support', 'Compare cities, drill into neighborhoods, review rental and sale dynamics, watch the live USD/COP layer, and move from research into practical local action with cleaner context.', 'Compara ciudades, profundiza en barrios, revisa dinámicas de arriendo y venta, sigue la capa viva USD/COP y pasa de la investigación a una acción local más práctica y ordenada.']
      ],
      cities: [
        ['.page-hero h1', 'Explore Colombia city by city', 'Explora Colombia ciudad por ciudad'],
        ['.page-hero .hero-lede', 'Filter by walkability, retiree fit, coastal living, value, healthcare strength, and repair burden before you narrow to a shortlist or a neighborhood.', 'Filtra por caminabilidad, encaje para retiro, vida costera, valor, fortaleza en salud y carga de reparaciones antes de bajar a una shortlist o a un barrio.']
      ],
      rentals: [
        ['.page-hero h1', 'Rental markets live at the city and neighborhood level', 'Los mercados de arriendo viven al nivel de ciudad y barrio'],
        ['.page-hero .hero-lede', 'Compare long-stay leases, furnished demand, short-stay realities, and landlord watchouts at city and neighborhood level across Colombia.', 'CasaClaro ahora cubre arriendos de larga estancia, demanda amoblada, realidades de corta estancia y alertas para propietarios en Colombia. Esta página es para inversionistas, arrendatarios, dueños, operadores y brokers que necesitan más que un titular de rentabilidad bruta.']
      ],
      relocation: [
        ['.page-hero h1', 'Move to Colombia with clearer expectations', 'Muévete a Colombia con expectativas más claras'],
        ['.page-hero .hero-lede', 'This page is for expatriates, retirees, and long-stay residents who need more than investment math. Compare healthcare, walkability, climate, repair burden, and residency friction before choosing where to land.', 'Esta página es para expatriados, jubilados y residentes de larga estancia que necesitan más que matemáticas de inversión. Compara salud, caminabilidad, clima, carga de reparaciones y fricción migratoria antes de elegir dónde aterrizar.']
      ],
      simulator: [
        ['.page-hero h1', 'Model the numbers before the emotions take over', 'Modela los números antes de que manden las emociones'],
        ['.page-hero .hero-lede', 'The simulator pulls pricing, yield, and closing-cost assumptions from the same shared dataset used by the city cards, relocation page, and map.', 'El simulador toma supuestos de precio, rentabilidad y costos de cierre del mismo dataset compartido que usan las tarjetas de ciudades, la página de reubicación y el mapa.']
      ],
      map: [
        ['.page-hero h1', 'See the markets on a map', 'Mira los mercados en un mapa'],
        ['.page-hero .hero-lede', 'Use the map to orient yourself geographically, then drop into the city guide for livability, healthcare, repair, and regulation detail.', 'Usa el mapa para orientarte geográficamente y luego entra a la guía de ciudad para ver detalles de habitabilidad, salud, reparaciones y regulación.']
      ],
      guide: [
        ['.page-hero h1', 'Buying property in Colombia, step by step', 'Comprar propiedad en Colombia, paso a paso'],
        ['.page-hero .hero-lede', 'A cleaner starting map for investors, relocators, retirees, and anyone who arrived on CasaClaro without already knowing the system.', 'Un punto de partida más claro para inversionistas, personas en reubicación, jubilados y cualquier visitante que llegó a CasaClaro sin conocer ya el sistema.']
      ],
      residency: [
        ['.page-hero h1', 'Residency and visa guidance that is clearly time-stamped', 'Guía de residencia y visas con sello de fecha claro'],
        ['.page-hero .hero-lede', 'Visa thresholds are tied to Colombia\u2019s minimum wage and are updated when regulations change. This guide references official Colombian sources and carries a review date. Confirm current fees and requirements before filing.', 'Esta p\u00e1gina trata la informaci\u00f3n legal como informaci\u00f3n viva. Los umbrales, requisitos y tarifas pueden cambiar, as\u00ed que CasaClaro te devuelve a las fuentes oficiales actuales de Colombia en lugar de fingir que las reglas nunca cambian.']
      ],
      sellers: [
        ['.page-hero h1', 'List a home with better pricing discipline and fewer surprises', 'Publica un inmueble con mejor disciplina de precio y menos sorpresas'],
        ['.page-hero .hero-lede', 'List with neighborhood context, repair notes, attachments, timing, and realistic route-to-market expectations from the first submission.', 'CasaClaro ahora toma el lado del propietario con la misma seriedad que el comprador: contexto de barrio, notas de reparaciones, adjuntos, tiempos y expectativas realistas de salida al mercado.']
      ],
      agents: [
        ['.page-hero h1', 'A marketplace needs standards, not just leads', 'Un marketplace necesita estándares, no solo leads'],
        ['.page-hero .hero-lede', 'CasaClaro is built for serious agents, brokers, lawyers, property managers, and contractors who can work with international clients and respond with discipline.', 'CasaClaro está hecho para agentes, brokers, abogados, administradores y contratistas serios que puedan trabajar con clientes internacionales y responder con disciplina.']
      ]
    };

    const page = getCurrentPage();
    (translations[page] || []).forEach(([selector, en, es]) => {
      const element = document.querySelector(selector);
      if (element) element.textContent = choose(en, es);
    });

    if (page === 'home') {
      const heroActions = document.querySelectorAll('.hero-home .hero-actions a');
      if (heroActions[0]) heroActions[0].textContent = choose('Explore Cities', 'Explorar ciudades');
      if (heroActions[1]) heroActions[1].textContent = choose('Compare Neighborhoods', 'Comparar barrios');
      if (heroActions[2]) heroActions[2].textContent = choose('Relocation Guide', 'Guía de reubicación');

      const tags = ['Buyers', 'Families', 'Expatriates', 'Renters', 'Retirees', 'Sellers', 'Brokers'];
      const tagsEs = ['Compradores', 'Familias', 'Expatriados', 'Arrendatarios', 'Jubilados', 'Propietarios', 'Brokers'];
      document.querySelectorAll('.hero-home .tag-row .tag').forEach((tag, index) => {
        tag.textContent = choose(tags[index], tagsEs[index]);
      });

      const stats = [
        ['City markets', 'Mercados por ciudad'],
        ['Neighborhood briefs', 'Fichas de barrio'],
        ['Visa paths tracked', 'Rutas de visa monitoreadas'],
        ['Audience lanes', 'Carriles de audiencia']
      ];
      document.querySelectorAll('.stat-ribbon .mini-stat span').forEach((item, index) => {
        const pair = stats[index];
        if (pair) item.textContent = choose(pair[0], pair[1]);
      });

      setText('#home-paths h2', 'Start from the decision you actually need to make', 'Empieza por la decisión que realmente necesitas tomar');
      setText('#home-paths .hero-lede', 'The platform is organized around real user goals: scouting a city, comparing neighborhoods, renting before buying, listing a property, or finding disciplined local partners.', 'La plataforma se organiza alrededor de metas reales: explorar una ciudad, comparar barrios, arrendar antes de comprar, publicar un inmueble o encontrar aliados locales con disciplina.');
      const homeCards = [
        ['Investors', 'Inversionistas', 'Underwrite the market before you underwrite the unit', 'Subraya el mercado antes de subrayar la unidad', 'Compare price per m2, rental yield, closing costs, repairs, and regulation before any one listing frames the whole opportunity.', 'Compara precio por m2, rendimiento de arriendo, costos de cierre, reparaciones y regulación antes de que un solo listado defina toda la oportunidad.', 'Run the cost simulator', 'Abrir simulador'],
        ['Relocating Households', 'Hogares en reubicación', 'Choose a city that works after the first week', 'Elige una ciudad que funcione después de la primera semana', 'Compare healthcare depth, walkability, climate, repair burden, and residency friction before you decide where daily life should happen.', 'Compara profundidad de salud, caminabilidad, clima, carga de reparaciones y fricción migratoria antes de decidir dónde debe pasar la vida diaria.', 'Open relocation guide', 'Abrir guía de reubicación'],
        ['Local Buyers & Families', 'Compradores locales y familias', 'Read the market in COP, not just in foreign-buyer shorthand', 'Lee el mercado en COP, no solo en atajos para comprador extranjero', 'Neighborhood pricing, rental angles, and broker comparisons now surface in COP and USD so local households can use the same system with less friction.', 'Los precios barriales, ángulos de arriendo y comparativos para brokers ya aparecen en COP y USD para que los hogares locales usen el mismo sistema con menos fricción.', 'Open the local buyer view', 'Abrir la vista local'],
        ['Renters & Landlords', 'Arrendatarios y propietarios', 'Understand rentals at city and neighborhood level', 'Entiende arriendos a nivel de ciudad y barrio', 'Track long-stay, furnished, and short-stay dynamics with neighborhood notes that make more sense than a gross-yield headline by itself.', 'Sigue dinámicas de larga estancia, amoblado y corta estancia con notas barriales que dicen más que un simple titular de rentabilidad bruta.', 'Browse rental markets', 'Ver mercados de arriendo'],
        ['Sellers', 'Propietarios', 'List with cleaner pricing, repair, and documentation context', 'Publica con mejor contexto de precio, reparaciones y documentación', 'Seller intake captures condition, attachments, timing, and neighborhood signal so the next buyer or broker conversation starts with facts.', 'El intake para propietarios captura estado, adjuntos, tiempos y señal de barrio para que la siguiente conversación con comprador o broker arranque con hechos.', 'Start seller intake', 'Iniciar intake'],
        ['Brokers & Operators', 'Brokers y operadores', 'Serious marketplace participation needs standards', 'La participación seria necesita estándares', 'Review SLA targets, routing expectations, and the local-market context CasaClaro aims to hand off with each lead or seller brief.', 'Revisa metas SLA, expectativas de enrutamiento y el contexto de mercado local que CasaClaro busca entregar con cada lead o ficha de propietario.', 'See partner standards', 'Ver estándares']
      ];
      document.querySelectorAll('#home-paths .journey-card').forEach((card, index) => {
        const pair = homeCards[index];
        if (!pair) return;
        card.querySelector('.section-kicker').textContent = choose(pair[0], pair[1]);
        card.querySelector('h3').textContent = choose(pair[2], pair[3]);
        card.querySelector('p:not(.section-kicker)').textContent = choose(pair[4], pair[5]);
        card.querySelector('.link-arrow').textContent = choose(pair[6], pair[7]);
      });

      setText('#home-local-lens .panel-card:first-child .section-kicker', 'Local Buyer Lens', 'Lente comprador local');
      setText('#home-local-lens .panel-card:first-child h2', 'COP-first, neighborhood-first, time-stamped', 'COP primero, barrio primero, con sello de tiempo');
      setText('#home-local-lens .panel-card:first-child .hero-lede', 'The same verified FX layer used in the simulator also feeds the neighborhood comparison tools, city cards, and buyer-facing COP views across the platform.', 'La misma capa FX verificada del simulador también alimenta las herramientas de comparación barrial, las tarjetas de ciudad y las vistas en COP para compradores a lo largo de la plataforma.');
      setHtml('#home-local-lens .panel-card:first-child .check-list', `
        <li>The live USD/COP snapshot shown above feeds displayed conversions across the platform.</li>
        <li>Neighborhoods can be compared directly in COP/m2 instead of only at broad city-average level.</li>
        <li>Rentals, resale logic, and repair burdens stay visible for locals, brokers, and cross-border buyers alike.</li>
      `, `
        <li>La foto viva USD/COP mostrada arriba alimenta las conversiones visibles en toda la plataforma.</li>
        <li>Los barrios se pueden comparar directo en COP/m2 en lugar de quedar solo a nivel de promedio de ciudad.</li>
        <li>Arriendos, lógica de reventa y cargas de mantenimiento siguen visibles para locales, brokers y compradores transfronterizos.</li>
      `);
      const localLensActions = document.querySelectorAll('#home-local-lens .panel-card:first-child .hero-actions a');
      if (localLensActions[0]) localLensActions[0].textContent = choose('Compare Neighborhoods', 'Comparar barrios');
      if (localLensActions[1]) localLensActions[1].textContent = choose('Model the Numbers', 'Modelar números');

      setText('#home-local-lens .panel-card:last-child .section-kicker', 'Neighborhood Tool', 'Herramienta barrial');
      setText('#home-local-lens .panel-card:last-child h2', 'Benchmark districts against the city average', 'Compara distritos frente al promedio de ciudad');
      setText('#home-local-lens .panel-card:last-child .hero-lede', 'Use the city explorer’s local-buyer module to sort neighborhoods by COP/m2, filter by city, and see whether a district trades above or below the broader market average.', 'Usa el módulo para comprador local dentro del explorador para ordenar barrios por COP/m2, filtrar por ciudad y ver si un distrito cotiza por encima o por debajo del promedio amplio de mercado.');
      setHtml('#home-local-lens .panel-card:last-child .check-list', `
        <li>Designed for local buyers, brokers, and families comparing shortlists in COP.</li>
        <li>Uses the active USD/COP rate with a verified timestamp note.</li>
        <li>Pairs pricing with neighborhood fit instead of leaving price isolated.</li>
      `, `
        <li>Diseñado para compradores locales, brokers y familias que comparan shortlists en COP.</li>
        <li>Usa la tasa USD/COP activa con una nota de verificación fechada.</li>
        <li>Une precio con encaje barrial en vez de dejar el precio aislado.</li>
      `);
      const toolActions = document.querySelectorAll('#home-local-lens .panel-card:last-child .hero-actions a');
      if (toolActions[0]) toolActions[0].textContent = choose('Open the Tool', 'Abrir herramienta');
      if (toolActions[1]) toolActions[1].textContent = choose('Explore Markets', 'Explorar mercados');

      setText('#home-city-briefs h2', 'City-by-city market and lifestyle guides', 'Guías de mercado y estilo de vida ciudad por ciudad');
      setText('#home-city-briefs .hero-lede', 'These cards give investors, local buyers, renters, and relocating families one clean starting board before they drop into neighborhoods.', 'Estas tarjetas dan a inversionistas, compradores locales, arrendatarios y familias en reubicación un tablero inicial claro antes de bajar a los barrios.');

      setText('#home-neighborhoods .section-kicker', 'Neighborhoods & Rentals', 'Barrios y arriendos');
      setText('#home-neighborhoods h2', 'Because the decision changes block by block', 'Porque la decisión cambia cuadra a cuadra');
      setText('#home-neighborhoods .hero-lede', 'Neighborhoods are their own decision layer for locals, renters, retirees, landlords, and cross-border buyers who need more than a city headline.', 'Los barrios son su propia capa de decisión para locales, arrendatarios, jubilados, arrendadores y compradores transfronterizos que necesitan más que un titular de ciudad.');
      setText('#home-neighborhoods article > p:last-of-type', 'Use the neighborhood spotlights to understand character, tenant fit, and pricing bands, then open the rentals view for long-stay, furnished, and short-stay context.', 'Usa los destacados barriales para entender carácter, perfil de inquilino y bandas de precio, y luego abre la vista de arriendos para contexto de larga estancia, amoblado y corta estancia.');
      const neighborhoodActions = document.querySelectorAll('#home-neighborhoods .hero-actions a');
      if (neighborhoodActions[0]) neighborhoodActions[0].textContent = choose('See Rental Markets', 'Ver mercados de arriendo');
      if (neighborhoodActions[1]) neighborhoodActions[1].textContent = choose('Open Full Comparison', 'Abrir comparación completa');

      setText('#home-practical h2', 'The questions people actually ask first', 'Las preguntas que la gente realmente hace primero');
      const practicalCards = [
        ['Is it walkable?', '¿Es caminable?', 'Every city guide now carries a walkability view so daily life is not inferred from listing photos alone.', 'Cada guía de ciudad trae ahora una lectura de caminabilidad para que la vida diaria no se infiera solo por fotos de listado.'],
        ['How is healthcare?', '¿Cómo está la salud?', 'Private-care depth, retiree practicality, and long-stay healthcare context now sit across relocation, residency, and city pages.', 'La profundidad de salud privada, la practicidad para retiro y el contexto de larga estancia ahora viven en reubicación, residencia y páginas de ciudad.'],
        ['What are the repair realities?', '¿Cuál es la realidad de mantenimiento?', 'Coastal wear, older-building systems, humidity, and maintenance burden now appear as part of the underwriting story.', 'Desgaste costero, sistemas de edificios viejos, humedad y carga de mantenimiento ya aparecen como parte de la historia de análisis.'],
        ['What about visas and rules?', '¿Y las visas y las reglas?', 'Residency and regulatory notes reference official Colombian sources and carry a review date.', 'Las notas migratorias y regulatorias hacen referencia a fuentes oficiales de Colombia y muestran fecha de revisión.']
      ];
      document.querySelectorAll('#home-practical .feature-card').forEach((card, index) => {
        const pair = practicalCards[index];
        if (!pair) return;
        card.querySelector('h3').textContent = choose(pair[0], pair[1]);
        card.querySelector('p').textContent = choose(pair[2], pair[3]);
      });

      setText('#home-relocation h2', 'Retirement, relocation, and everyday livability stay visible', 'Retiro, reubicación y habitabilidad diaria siguen visibles');
      setText('#home-relocation .hero-lede', 'The relocation lens stays close to healthcare, calmer routines, and neighborhood fit so retirees and long-stay movers are not forced into investor-only framing.', 'El lente de reubicación se mantiene cerca de salud, rutinas más calmadas y encaje barrial para que jubilados y mudanzas de larga estancia no queden obligados a una narrativa solo inversionista.');

      const marketplacePanels = [
        ['For Sellers', 'Para propietarios', 'Bring pricing, repairs, and timing into the first conversation', 'Lleva precio, reparaciones y tiempos a la primera conversación', 'Owners can submit homes with pricing, repair notes, neighborhood context, attachments, and timing data so buyer matching starts with cleaner information.', 'Los propietarios pueden enviar inmuebles con precio, notas de reparaciones, contexto barrial, adjuntos y tiempos para que el cruce con compradores arranque con información más limpia.', 'Seller Information', 'Información para propietarios', 'Submit a Home', 'Enviar inmueble'],
        ['For Agents & Brokers', 'Para agentes y brokers', 'Marketplace participation is tied to service standards', 'La participación en el marketplace está atada a estándares de servicio', 'Agent, broker, legal, contractor, and property-management workflows sit behind clearer response expectations and cleaner intake context.', 'Los flujos de agentes, brokers, legales, contratistas y administración quedan detrás de expectativas de respuesta más claras y de un intake más limpio.', 'Partner Program', 'Programa de aliados', 'Apply as Partner', 'Postularse como aliado']
      ];
      document.querySelectorAll('#home-marketplace .panel-card').forEach((card, index) => {
        const pair = marketplacePanels[index];
        if (!pair) return;
        card.querySelector('.section-kicker').textContent = choose(pair[0], pair[1]);
        card.querySelector('h2').textContent = choose(pair[2], pair[3]);
        card.querySelector('p').textContent = choose(pair[4], pair[5]);
        const actions = card.querySelectorAll('.hero-actions > *');
        if (actions[0]) actions[0].textContent = choose(pair[6], pair[7]);
        if (actions[1]) actions[1].textContent = choose(pair[8], pair[9]);
      });

      setText('#home-standards h2', 'Qualified leads need response standards, not vague promises', 'Los leads calificados necesitan estándares de respuesta, no promesas vagas');
      setText('#home-updates .section-kicker', 'Market Updates', 'Actualizaciones de mercado');
      setText('#home-updates h2', 'Stay current on FX, legal reviews, and market shifts', 'Mantente al día en FX, revisiones legales y cambios de mercado');
      setText('#home-updates p', 'Join the update list for reviewed changes in city data, residency guidance, and the exchange-rate layer used across the platform.', 'Únete a la lista para recibir cambios revisados en datos de ciudad, guía migratoria y la capa de tasa de cambio usada en toda la plataforma.');
      setLabelText('#home-updates form label:nth-of-type(1)', 'Name', 'Nombre');
      setLabelText('#home-updates form label:nth-of-type(2)', 'Email', 'Correo');
      const updateButton = document.querySelector('#home-updates form button');
      if (updateButton) updateButton.textContent = choose('Notify Me', 'Notifíquenme');
    }

    if (page === 'cities') {
      const filterLabels = {
        all: ['All', 'Todo'],
        walkable: ['Most walkable', 'Más caminables'],
        retiree: ['Retiree-friendly', 'Aptas para retiro'],
        coastal: ['Coastal', 'Costeras'],
        value: ['Value entry', 'Entrada de valor'],
        healthcare: ['Healthcare depth', 'Profundidad de salud'],
        'low-maintenance': ['Lower maintenance', 'Menor mantenimiento'],
        'remote-work': ['Remote-work fit', 'Encaje remoto'],
        'forever-young': ['Long-stay fit', 'Larga estancia']
      };

      document.querySelectorAll('[data-explorer-filter]').forEach((button) => {
        const key = button.dataset.explorerFilter;
        const pair = filterLabels[key];
        if (pair) button.textContent = isEs ? pair[1] : pair[0];
      });

      const helper = document.querySelector('.explorer-toolbar .helper-text');
      if (helper) {
        helper.textContent = isEs
          ? 'Usa filtros si ya tienes un lente claro. Usa búsqueda si solo sabes el tipo de vida o viaje que buscas.'
          : 'Use filters if you know your lens. Use search if you only know the kind of life or trip you want.';
      }

      const labelSearch = document.querySelector('label[for="explorer-search"]')
        || [...document.querySelectorAll('label')].find((label) => label.querySelector('#explorer-search'));
      if (labelSearch && labelSearch.firstChild) {
        labelSearch.firstChild.textContent = isEs ? 'Buscar ciudad o señal de estilo de vida' : 'Search city or lifestyle cue';
      }

      const labelSort = document.querySelector('label[for="explorer-sort"]')
        || [...document.querySelectorAll('label')].find((label) => label.querySelector('#explorer-sort'));
      if (labelSort && labelSort.firstChild) {
        labelSort.firstChild.textContent = isEs ? 'Ordenar ciudades' : 'Sort cities';
      }

      const options = document.querySelectorAll('#explorer-sort option');
      const optionPairs = [
        ['Featured order', 'Orden destacado'],
        ['Lowest price per m2', 'Menor precio por m2'],
        ['Highest rental yield', 'Mayor rendimiento de arriendo'],
        ['Best walkability', 'Mejor caminabilidad'],
        ['Best healthcare', 'Mejor salud'],
        ['Best retiree fit', 'Mejor encaje para retiro']
      ];
      options.forEach((option, index) => {
        if (optionPairs[index]) option.textContent = isEs ? optionPairs[index][1] : optionPairs[index][0];
      });

      setText('.audience-mini-grid .feature-card:nth-child(1) h3', 'First scouting trip', 'Primer viaje de exploración');
      setText('.audience-mini-grid .feature-card:nth-child(1) p', 'Start with walkability, healthcare, climate, and airport connectivity if you are visiting before relocating.', 'Empieza por caminabilidad, salud, clima y conexión aérea si estás visitando antes de reubicarte.');
      setText('.audience-mini-grid .feature-card:nth-child(2) h3', 'Retirement shortlist', 'Shortlist para retiro');
      setText('.audience-mini-grid .feature-card:nth-child(2) p', 'Use retiree fit, repair burden, and healthcare strength before you obsess over rental math.', 'Usa encaje para retiro, carga de mantenimiento y fortaleza de salud antes de obsesionarte con la matemática de arriendo.');
      setText('.audience-mini-grid .feature-card:nth-child(3) h3', 'Local buyer shortlist', 'Shortlist comprador local');
      setText('.audience-mini-grid .feature-card:nth-child(3) p', 'Use the neighborhood comparison tool below when COP pricing and district spread matter more than foreign-buyer headlines.', 'Usa la herramienta de comparación barrial de abajo cuando el precio en COP y la dispersión entre distritos importan más que los titulares para comprador extranjero.');
      setText('.audience-mini-grid .feature-card:nth-child(4) h3', 'Investor discipline', 'Disciplina inversionista');
      setText('.audience-mini-grid .feature-card:nth-child(4) p', 'Compare price per m2, yields, and rules without assuming the most famous city is always the best buy.', 'Compara precio por m2, rendimientos y reglas sin asumir que la ciudad más famosa siempre es la mejor compra.');
      setText('.section-cream h2', 'Walkability, healthcare, retirement comfort, and repair load side by side', 'Caminabilidad, salud, comodidad para retiro y carga de mantenimiento lado a lado');
      setText('#neighborhood-cop-tool .hero-lede, .section-shell:last-of-type .hero-lede', 'Designed for local buyers, brokers, and families underwriting at neighborhood level instead of broad city averages.', 'Diseñado para compradores locales, brokers y familias que analizan a nivel de barrio en lugar de quedarse con promedios amplios de ciudad.');
      setLabelText('label[for="neighborhood-cop-city"]', 'City filter', 'Filtro por ciudad');
      setLabelText('label[for="neighborhood-cop-sort"]', 'Sort neighborhoods', 'Ordenar barrios');
      const sortNeighborhoodOptions = document.querySelectorAll('#neighborhood-cop-sort option');
      const neighborhoodPairs = [
        ['Highest COP/m2', 'Mayor COP/m2'],
        ['Most above city average', 'Más arriba del promedio de ciudad'],
        ['Most below city average', 'Más abajo del promedio de ciudad'],
        ['Lowest USD/m2', 'Menor USD/m2']
      ];
      sortNeighborhoodOptions.forEach((option, index) => {
        if (neighborhoodPairs[index]) option.textContent = choose(neighborhoodPairs[index][0], neighborhoodPairs[index][1]);
      });
    }

    if (page === 'rentals') {
      setText('main section:nth-of-type(2) h2', 'How the major markets differ', 'Cómo cambian los principales mercados');
      setText('main section:nth-of-type(3) h2', 'Because the rent story changes inside each city', 'Porque la historia del arriendo cambia dentro de cada ciudad');
      setText('main section:nth-of-type(4) .panel-card:first-child .section-kicker', 'For Landlords', 'Para arrendadores');
      setHtml('main section:nth-of-type(4) .panel-card:first-child .check-list', `
        <li>Underwrite building rules before underwriting nightly-rate upside.</li>
        <li>Price furnished units off actual tenant demand, not social-media folklore.</li>
        <li>Ask whether your market is really long-stay, executive, retiree, or tourism-led.</li>
        <li>Track repair burden and turnover cost, especially on the coast.</li>
      `, `
        <li>Analiza reglamentos del edificio antes de modelar upside por tarifa nocturna.</li>
        <li>Precio unidades amobladas sobre demanda real, no sobre folklore de redes sociales.</li>
        <li>Pregunta si tu mercado es realmente de larga estancia, ejecutivo, retiro o turismo.</li>
        <li>Sigue carga de mantenimiento y costo de rotación, especialmente en la costa.</li>
      `);
      setText('main section:nth-of-type(4) .panel-card:last-child .section-kicker', 'Next Step', 'Siguiente paso');
      setText('main section:nth-of-type(4) .panel-card:last-child h2', 'Use the numbers after the neighborhood starts to make sense', 'Usa los números después de que el barrio empiece a tener sentido');
      const rentalActions = document.querySelectorAll('main section:nth-of-type(4) .panel-card:last-child .hero-actions a');
      if (rentalActions[0]) rentalActions[0].textContent = choose('Run the simulator', 'Abrir simulador');
      if (rentalActions[1]) rentalActions[1].textContent = choose('Compare cities', 'Comparar ciudades');
      if (rentalActions[2]) rentalActions[2].textContent = choose('Submit rental-friendly inventory', 'Enviar inventario apto para arriendo');
    }

    if (page === 'relocation') {
      const relocationTags = ['Expatriates', 'Retirees', 'Golden age', 'Forever young'];
      const relocationTagsEs = ['Expatriados', 'Jubilados', 'Edad dorada', 'Forever young'];
      document.querySelectorAll('.tag-row .tag').forEach((tag, index) => {
        const pair = [relocationTags[index], relocationTagsEs[index]];
        if (pair[0]) tag.textContent = choose(pair[0], pair[1]);
      });
      setText('main section:nth-of-type(2) h2', 'Fast ways to orient yourself', 'Formas rápidas de orientarte');
      setText('main section:nth-of-type(3) .panel-card:first-child .section-kicker', 'For Retirees', 'Para jubilados');
      setText('main section:nth-of-type(3) .panel-card:first-child h2', 'Golden-age decisions are usually about comfort, care, and friction', 'Las decisiones de edad dorada suelen ser sobre confort, cuidado y fricción');
      setHtml('main section:nth-of-type(3) .panel-card:first-child .check-list', `
        <li>Start with healthcare depth and routine livability, not nightlife or internet hype.</li>
        <li>Ask whether you want a denser social city, a calmer coffee-region pace, or coastal humidity.</li>
        <li>Prefer buildings with straightforward maintenance histories over heroic renovation stories.</li>
        <li>Use residency guidance and fee checks early so timing stays realistic.</li>
      `, `
        <li>Empieza por profundidad de salud y habitabilidad rutinaria, no por vida nocturna o hype de internet.</li>
        <li>Pregunta si quieres una ciudad social más densa, un ritmo cafetero más calmado o humedad costera.</li>
        <li>Prefiere edificios con historias de mantenimiento claras sobre relatos heroicos de renovación.</li>
        <li>Usa guía migratoria y revisión de tarifas temprano para que los tiempos sigan siendo realistas.</li>
      `);
      setText('main section:nth-of-type(3) .panel-card:last-child .section-kicker', 'For First-Time Visitors', 'Para visitantes primerizos');
      setText('main section:nth-of-type(3) .panel-card:last-child h2', 'Tourist charm and long-stay fit are not always the same thing', 'El encanto turístico y el encaje de larga estancia no siempre son lo mismo');
      setHtml('main section:nth-of-type(3) .panel-card:last-child .check-list', `
        <li>Visit morning, afternoon, and evening before deciding a neighborhood matches your rhythm.</li>
        <li>Ask how much time you want to spend in cars, on hills, or around humidity and heat.</li>
        <li>Check whether your likely daily loop is walkable: coffee, groceries, clinic, and social life.</li>
        <li>Use CasaClaro's city pages to separate vacation energy from full-time living reality.</li>
      `, `
        <li>Visita mañana, tarde y noche antes de decidir que un barrio encaja con tu ritmo.</li>
        <li>Pregunta cuánto tiempo quieres pasar en carros, cuestas o alrededor de humedad y calor.</li>
        <li>Revisa si tu circuito diario probable es caminable: café, mercado, clínica y vida social.</li>
        <li>Usa las páginas de ciudad de CasaClaro para separar energía vacacional de realidad de vida completa.</li>
      `);
      setText('main section:nth-of-type(4) .panel-card:first-child h2', 'Health planning should happen before the move', 'La planificación de salud debe pasar antes de la mudanza');
      setText('main section:nth-of-type(4) .panel-card:last-child h2', 'Residency thresholds are reviewed annually', 'Los umbrales de residencia se revisan anualmente');
      setText('main section:nth-of-type(4) .panel-card:last-child p', 'Visa thresholds are linked to Colombia\u2019s minimum wage and updated each year. Confirm current fee schedules on the official Cancilleria site before filing any application.', 'Los umbrales de visa se vinculan al salario m\u00ednimo de Colombia y se actualizan cada a\u00f1o. Confirma las tarifas vigentes en la web oficial de Cancilleria antes de radicar cualquier solicitud.');
      setText('main section:nth-of-type(6) .panel-card:first-child .section-kicker', 'First 90 Days', 'Primeros 90 días');
      setHtml('main section:nth-of-type(6) .panel-card:first-child .check-list', `
        <li>Validate healthcare and insurance strategy before you assume local coverage works the same way it does at home.</li>
        <li>Rent before you buy if climate, altitude, or neighborhood rhythm are still unknowns.</li>
        <li>Walk the area morning and evening. A city can be charming at noon and exhausting by night.</li>
        <li>Ask directly about repairs, backup power, water pressure, and building reserves.</li>
      `, `
        <li>Valida estrategia de salud y seguro antes de asumir que la cobertura local funciona igual que en casa.</li>
        <li>Arrienda antes de comprar si clima, altitud o ritmo barrial todavía son incógnitas.</li>
        <li>Camina la zona mañana y noche. Una ciudad puede ser encantadora al mediodía y agotadora de noche.</li>
        <li>Pregunta de frente por reparaciones, respaldo eléctrico, presión de agua y reservas del edificio.</li>
      `);
      setText('main section:nth-of-type(6) .panel-card:last-child .section-kicker', 'Next Step', 'Siguiente paso');
      setText('main section:nth-of-type(6) .panel-card:last-child h2', 'Use the right tool after this page', 'Usa la herramienta correcta después de esta página');
      const relocationActions = document.querySelectorAll('main section:nth-of-type(6) .panel-card:last-child .hero-actions > *');
      if (relocationActions[0]) relocationActions[0].textContent = choose('Open City Explorer', 'Abrir explorador de ciudades');
      if (relocationActions[1]) relocationActions[1].textContent = choose('Run the Simulator', 'Abrir simulador');
      if (relocationActions[2]) relocationActions[2].textContent = choose('Talk to CasaClaro', 'Hablar con CasaClaro');
    }

    if (page === 'simulator') {
      setLabelText('#cost-simulator-form label:nth-of-type(1)', 'Input currency', 'Moneda de entrada');
      setLabelText('#cost-simulator-form label:nth-of-type(2)', 'Property price', 'Precio del inmueble');
      setLabelText('#cost-simulator-form label:nth-of-type(3)', 'City', 'Ciudad');
      setLabelText('#cost-simulator-form label:nth-of-type(4)', 'Renovation budget', 'Presupuesto de remodelación');
      setLabelText('#cost-simulator-form label:nth-of-type(5)', 'Currency view', 'Moneda de salida');
      const financingLabel = document.querySelector('#cost-simulator-form input[name="financing"]')?.parentElement;
      if (financingLabel) financingLabel.childNodes[1].textContent = choose(' Use financing', ' Usar financiación');
      setLabelText('#financing-fields label:nth-of-type(1)', 'Down payment (%)', 'Cuota inicial (%)');
      setLabelText('#financing-fields label:nth-of-type(2)', 'Interest rate (%)', 'Tasa de interés (%)');
      setLabelText('#financing-fields label:nth-of-type(3)', 'Loan term (years)', 'Plazo del crédito (años)');
      const reportButton = document.getElementById('download-report');
      if (reportButton) reportButton.textContent = choose('Download Report', 'Descargar reporte');
      setText('#cost-simulator-form .helper-text:first-of-type', 'PDF export uses your browser print dialog for a quick report. Add jsPDF or a server-side PDF route later if you need branded exports.', 'La exportación PDF usa el diálogo de impresión del navegador para un reporte rápido. Agrega jsPDF o una ruta PDF del servidor después si necesitas exportes con marca.');
      const resultSpans = document.querySelectorAll('.result-grid article span');
      const resultPairs = [
        ['Closing costs', 'Costos de cierre'],
        ['Total upfront cash', 'Caja inicial total'],
        ['Gross monthly rent', 'Arriendo bruto mensual'],
        ['Monthly operating cash flow', 'Flujo operativo mensual']
      ];
      resultSpans.forEach((span, index) => {
        const pair = resultPairs[index];
        if (pair) span.textContent = choose(pair[0], pair[1]);
      });
      setText('.simulator-results .helper-text:last-of-type', 'Estimates are illustrative. Actual costs, taxes, financing, and rent performance vary by property and by neighborhood.', 'Las estimaciones son ilustrativas. Los costos reales, impuestos, financiación y desempeño de arriendo cambian según inmueble y barrio.');
    }

    if (page === 'guide') {
      setHtml('.step-list', `
        <li><strong>Explore cities first.</strong> Use the <a href="cities.html">city explorer</a> and <a href="map.html">map</a> before you compare two properties that may not belong in the same conversation.</li>
        <li><strong>Check relocation fit.</strong> If this may become your home, open <a href="relocation.html">the relocation page</a> and compare healthcare, walkability, repairs, and retiree fit.</li>
        <li><strong>Review residency early.</strong> Use <a href="residency.html">the residency page</a> to see whether your investor or pension strategy lines up with current official guidance.</li>
        <li><strong>Model real costs.</strong> Use the <a href="cost-simulator.html">simulator</a> for closing costs, renovation reserve, and debt-adjusted monthly cash flow.</li>
        <li><strong>Line up professionals.</strong> CasaClaro is structured for agents, brokers, lawyers, contractors, and property managers, not just sales agents.</li>
        <li><strong>Do title and building diligence.</strong> Your lawyer should verify title, liens, HOA rules, foreign investment registration, and use restrictions before funds are released.</li>
        <li><strong>Underwrite repairs honestly.</strong> Coastal properties, older towers, and low-priced units often look cheap because maintenance reality has not been priced correctly.</li>
        <li><strong>Plan the first 30 days.</strong> Each <a href="city.html?id=medellin">city guide</a> now includes city-specific first-month setup points.</li>
      `, `
        <li><strong>Explora ciudades primero.</strong> Usa el <a href="cities.html">explorador</a> y el <a href="map.html">mapa</a> antes de comparar dos inmuebles que quizá ni siquiera pertenecen a la misma conversación.</li>
        <li><strong>Revisa encaje de reubicación.</strong> Si esto puede volverse tu hogar, abre <a href="relocation.html">la página de reubicación</a> y compara salud, caminabilidad, reparaciones y encaje para retiro.</li>
        <li><strong>Revisa residencia temprano.</strong> Usa <a href="residency.html">la página de residencia</a> para ver si tu estrategia de inversionista o pensionado calza con la guía oficial vigente.</li>
        <li><strong>Modela costos reales.</strong> Usa el <a href="cost-simulator.html">simulador</a> para costos de cierre, reserva de remodelación y flujo mensual ajustado por deuda.</li>
        <li><strong>Arma el equipo correcto.</strong> CasaClaro se estructura para agentes, brokers, abogados, contratistas y property managers, no solo para agentes de venta.</li>
        <li><strong>Haz debida diligencia de título y edificio.</strong> Tu abogado debe verificar título, gravámenes, reglamento de administración, registro de inversión extranjera y restricciones de uso antes de liberar fondos.</li>
        <li><strong>Analiza reparaciones con honestidad.</strong> Propiedades costeras, torres viejas y unidades muy baratas a menudo se ven económicas porque la realidad de mantenimiento no fue preciada bien.</li>
        <li><strong>Planea los primeros 30 días.</strong> Cada <a href="city.html?id=medellin">guía de ciudad</a> ya incluye puntos específicos para el primer mes.</li>
      `);
      setText('.panel-card:last-child .section-kicker', 'Checklist', 'Checklist');
      setText('.panel-card:last-child h2', 'Quick links', 'Enlaces rápidos');
      setHtml('.panel-card:last-child .check-list', `
        <li><a href="cities.html">Compare cities side by side</a></li>
        <li><a href="relocation.html">See relocation fits for expats and retirees</a></li>
        <li><a href="residency.html">Review time-stamped legal notes</a></li>
        <li><a href="for-sellers.html">Selling instead of buying? Start here</a></li>
        <li><a href="for-agents.html">Review partner standards and SLA</a></li>
      `, `
        <li><a href="cities.html">Compara ciudades lado a lado</a></li>
        <li><a href="relocation.html">Mira encajes de reubicación para expatriados y jubilados</a></li>
        <li><a href="residency.html">Revisa notas legales con fecha</a></li>
        <li><a href="for-sellers.html">¿Vendes en lugar de comprar? Empieza aquí</a></li>
        <li><a href="for-agents.html">Revisa estándares para aliados y SLA</a></li>
      `);
      const printButton = document.querySelector('.panel-card:last-child .btn');
      if (printButton) printButton.textContent = choose('Print This Guide', 'Imprimir esta guía');
    }

    if (page === 'map') {
      setText('main section:nth-of-type(3) .section-kicker', 'City Snapshots', 'Snapshots de ciudad');
      setText('main section:nth-of-type(3) h2', 'Jump from geography to city brief', 'Salta de la geografía a la ficha de ciudad');
    }

    if (page === 'residency') {
      setText('main section:nth-of-type(2) .panel-card:first-child .section-kicker', 'Official-path overview', 'Resumen de rutas oficiales');
      setText('main section:nth-of-type(2) .panel-card:first-child h2', 'Current visa cards', 'Tarjetas vigentes de visa');
      setText('main section:nth-of-type(2) .panel-card:last-child .section-kicker', 'Eligibility Snapshot', 'Snapshot de elegibilidad');
      setText('main section:nth-of-type(2) .panel-card:last-child h2', 'Quick self-check', 'Autoevaluación rápida');
      setLabelText('#visa-calculator-form label:nth-of-type(1)', 'Planned investment amount (COP)', 'Monto de inversión planeado (COP)');
      setLabelText('#visa-calculator-form label:nth-of-type(2)', 'Monthly pension income (COP)', 'Ingreso mensual de pensión (COP)');
      const visaButton = document.querySelector('#visa-calculator-form button');
      if (visaButton) visaButton.textContent = choose('Check Illustrative Fit', 'Revisar encaje ilustrativo');
      setHtml('main section:nth-of-type(2) .panel-card:last-child .helper-text', 'Fees can change and may vary by visa type, nationality, and office. Use the official fee checker before filing: <a href="https://www.cancilleria.gov.co/tramites_servicios/visa/costos-medios-pago-oficinas-atencion" target="_blank" rel="noreferrer">Cancilleria visa fee checker</a>.', 'Las tarifas pueden cambiar y variar por tipo de visa, nacionalidad y oficina. Usa el verificador oficial antes de radicar: <a href="https://www.cancilleria.gov.co/tramites_servicios/visa/costos-medios-pago-oficinas-atencion" target="_blank" rel="noreferrer">Verificador de tarifas de Cancillería</a>.');
      setText('main section:nth-of-type(3) .panel-card:first-child .section-kicker', 'Healthcare', 'Salud');
      setText('main section:nth-of-type(3) .panel-card:first-child h2', 'Retirees should treat coverage as a first-order issue', 'Las familias en retiro deben tratar la cobertura como un tema de primer orden');
      setHtml('main section:nth-of-type(3) .panel-card:first-child .check-list', `
        <li>Many foreigners begin with private, prepaid, or international coverage while confirming longer-term eligibility.</li>
        <li>The official pensionado path requires health coverage and does not automatically grant access to the Colombian social security health system except where bilateral or multilateral agreements apply.</li>
        <li>For health-complex or specialist-heavy households, Medellin and Bogota usually offer the deepest private-care bench.</li>
      `, `
        <li>Muchas personas extranjeras empiezan con cobertura privada, prepagada o internacional mientras confirman elegibilidad de largo plazo.</li>
        <li>La ruta oficial pensionado exige cobertura de salud y no concede automáticamente acceso al sistema colombiano de seguridad social en salud salvo donde apliquen acuerdos bilaterales o multilaterales.</li>
        <li>Para hogares con necesidades complejas o alta carga de especialistas, Medellín y Bogotá suelen ofrecer la banca privada más profunda.</li>
      `);
      setText('main section:nth-of-type(3) .panel-card:last-child .section-kicker', 'Common mistakes', 'Errores comunes');
      setHtml('main section:nth-of-type(3) .panel-card:last-child .check-list', `
        <li>Buying first and trying to reverse-engineer the visa strategy later.</li>
        <li>Assuming old internet content that still references outdated labels or thresholds is good enough.</li>
        <li>Treating fee screenshots as durable even though official schedules change.</li>
        <li>Skipping legal counsel on foreign investment registration when the investor path is part of the plan.</li>
      `, `
        <li>Comprar primero e intentar reconstruir la estrategia de visa después.</li>
        <li>Asumir que contenido viejo de internet con etiquetas o umbrales desactualizados sigue siendo suficiente.</li>
        <li>Tratar capturas de tarifas como si fueran duraderas aunque los cuadros oficiales cambian.</li>
        <li>Saltarse la asesoría legal sobre registro de inversión extranjera cuando la ruta inversionista hace parte del plan.</li>
      `);
    }

    if (page === 'sellers') {
      setText('main section:nth-of-type(2) .panel-card:first-child .section-kicker', 'Before you list', 'Antes de publicar');
      setHtml('main section:nth-of-type(2) .panel-card:first-child .check-list', `
        <li>Collect title, tax, HOA, and occupancy information before a buyer asks for it.</li>
        <li>Write down known repairs instead of waiting for them to emerge during due diligence.</li>
        <li>Be honest about whether the property is turnkey, lightly dated, or heading for a heavier renovation.</li>
        <li>For coastal homes, assume buyers will ask about corrosion, waterproofing, generators, and reserve quality.</li>
      `, `
        <li>Reúne información de título, impuestos, administración y ocupación antes de que la pida un comprador.</li>
        <li>Deja por escrito las reparaciones conocidas en lugar de esperar a que aparezcan en la debida diligencia.</li>
        <li>Sé honesto sobre si el inmueble está listo, ligeramente desactualizado o camino a una renovación pesada.</li>
        <li>Para viviendas costeras, asume que preguntarán por corrosión, impermeabilización, generadores y calidad de reservas.</li>
      `);
      setText('main section:nth-of-type(2) .panel-card:last-child .section-kicker', 'What happens after you submit', 'Qué pasa después de enviar');
      setHtml('main section:nth-of-type(2) .panel-card:last-child .check-list', `
        <li>CasaClaro reviews fit, market, price framing, and documentation gaps within one business day.</li>
        <li>If the home fits the current network, it can be routed to a local agent, broker, or buyer flow.</li>
        <li>Attachments and notes are already structured for future CRM and upload endpoints.</li>
      `, `
        <li>CasaClaro revisa encaje, mercado, marco de precio y vacíos documentales dentro de un día hábil.</li>
        <li>Si el inmueble encaja en la red actual, puede enrutarse a un agente, broker o flujo comprador local.</li>
        <li>Adjuntos y notas ya vienen estructurados para futuros endpoints de CRM y carga.</li>
      `);
      setText('main section:nth-of-type(3) h2', 'Representative city briefs for owners', 'Fichas representativas por ciudad para propietarios');
      setText('main section:nth-of-type(3) .hero-lede', 'These city notes help owners understand how condition, pricing discipline, and buyer expectations shift from market to market.', 'Estas notas de ciudad ayudan a los propietarios a entender cómo cambian estado, disciplina de precio y expectativas del comprador de mercado a mercado.');
      setLabelText('form[data-form-type="seller-page"] label:nth-of-type(1)', 'Owner name', 'Nombre del propietario');
      setLabelText('form[data-form-type="seller-page"] label:nth-of-type(2)', 'Email', 'Correo');
      setLabelText('form[data-form-type="seller-page"] label:nth-of-type(3)', 'City', 'Ciudad');
      setLabelText('form[data-form-type="seller-page"] label:nth-of-type(4)', 'Neighborhood', 'Barrio');
      setLabelText('form[data-form-type="seller-page"] label:nth-of-type(5)', 'Property type', 'Tipo de inmueble');
      setLabelText('form[data-form-type="seller-page"] label:nth-of-type(6)', 'Asking price (USD)', 'Precio pedido (USD)');
      setLabelText('form[data-form-type="seller-page"] label:nth-of-type(7)', 'Bedrooms (if residential)', 'Habitaciones (si es residencial)');
      setLabelText('form[data-form-type="seller-page"] label:nth-of-type(8)', 'Condition', 'Estado');
      setLabelText('form[data-form-type="seller-page"] label:nth-of-type(9)', 'Main repair notes', 'Notas principales de reparaciones');
      setLabelText('form[data-form-type="seller-page"] label:nth-of-type(10)', 'Timeline', 'Tiempo estimado');
      setLabelText('form[data-form-type="seller-page"] label:nth-of-type(11)', 'Attachments', 'Adjuntos');
      setLabelText('form[data-form-type="seller-page"] label:nth-of-type(12)', 'Notes', 'Notas');
      document.querySelectorAll('form[data-form-type="seller-page"] select[name="propertyType"] option').forEach((option, index) => {
        const pairs = [
          ['Apartment', 'Apartamento'],
          ['House', 'Casa'],
          ['Penthouse', 'Penthouse'],
          ['Lot', 'Lote'],
          ['Commercial', 'Comercial'],
          ['Other', 'Otro']
        ];
        if (pairs[index]) option.textContent = choose(pairs[index][0], pairs[index][1]);
      });
      setPlaceholder('form[data-form-type="seller-page"] input[name="condition"]', 'Turnkey, light updates, full renovation…', 'Listo, retoques leves, renovación total…');
      setPlaceholder('form[data-form-type="seller-page"] textarea[name="repairs"]', 'Humidity, roof, plumbing, facade, HVAC, windows, elevator, drainage…', 'Humedad, techo, plomería, fachada, HVAC, ventanas, ascensor, drenajes…');
      setPlaceholder('form[data-form-type="seller-page"] input[name="timeline"]', '30 days, 90 days, inherited asset, testing price…', '30 días, 90 días, activo heredado, probando precio…');
      setPlaceholder('form[data-form-type="seller-page"] textarea[name="notes"]', 'Occupancy, rental history, upgrades, HOA rules, closing constraints…', 'Ocupación, historial de arriendo, mejoras, reglas HOA, restricciones de cierre…');
      const sellerButton = document.querySelector('form[data-form-type="seller-page"] button[type="submit"]');
      if (sellerButton) sellerButton.textContent = choose('Submit Seller Intake', 'Enviar intake del propietario');
      setText('main section:nth-of-type(4) .panel-card:last-child .section-kicker', 'Repairs Matter', 'Las reparaciones importan');
      setText('main section:nth-of-type(4) .panel-card:last-child h2', 'Why CasaClaro now asks about repairs directly', 'Por qué CasaClaro ahora pregunta por reparaciones de forma directa');
    }

    if (page === 'agents') {
      setText('main section:nth-of-type(2) h2', 'Response expectations are explicit', 'Las expectativas de respuesta son explícitas');
      setText('main section:nth-of-type(3) .panel-card:first-child .section-kicker', 'How Routing Works', 'Cómo funciona el enrutamiento');
      setText('main section:nth-of-type(3) .panel-card:first-child h2', 'CasaClaro is trying to send context, not chaos', 'CasaClaro busca enviar contexto, no caos');
      setText('main section:nth-of-type(3) .panel-card:last-child .section-kicker', 'Marketplace Discipline', 'Disciplina de marketplace');
      setText('main section:nth-of-type(3) .panel-card:last-child h2', 'What strong partners do differently', 'Qué hacen distinto los aliados fuertes');
      setText('main section:nth-of-type(4) .panel-card:first-child .section-kicker', 'Who fits', 'Quién encaja');
      setText('main section:nth-of-type(4) form .section-kicker', 'Apply', 'Postularse');
      setText('main section:nth-of-type(4) form h2', 'Join the network', 'Unirse a la red');
      setLabelText('form[data-form-type="agent-page"] label:nth-of-type(1)', 'Name', 'Nombre');
      setLabelText('form[data-form-type="agent-page"] label:nth-of-type(2)', 'Company', 'Empresa');
      setLabelText('form[data-form-type="agent-page"] label:nth-of-type(3)', 'Primary city', 'Ciudad principal');
      setLabelText('form[data-form-type="agent-page"] label:nth-of-type(4)', 'Role', 'Rol');
      setLabelText('form[data-form-type="agent-page"] label:nth-of-type(5)', 'Specialization', 'Especialización');
      setLabelText('form[data-form-type="agent-page"] label:nth-of-type(6)', 'Typical response time', 'Tiempo típico de respuesta');
      setLabelText('form[data-form-type="agent-page"] label:nth-of-type(7)', 'WhatsApp or phone', 'WhatsApp o teléfono');
      document.querySelectorAll('form[data-form-type="agent-page"] select[name="role"] option').forEach((option, index) => {
        const pairs = [
          ['Agent', 'Agente'],
          ['Broker', 'Broker'],
          ['Lawyer', 'Abogado'],
          ['Property manager', 'Administrador'],
          ['Contractor', 'Contratista']
        ];
        if (pairs[index]) option.textContent = choose(pairs[index][0], pairs[index][1]);
      });
      setPlaceholder('form[data-form-type="agent-page"] input[name="specialization"]', 'Retiree buyers, coastal homes, legal diligence, repairs…', 'Compradores retiro, costa, diligencia legal, reparaciones…');
      setPlaceholder('form[data-form-type="agent-page"] input[name="responseTime"]', 'Same day, 24 hours, 48 hours…', 'Mismo día, 24 horas, 48 horas…');
      const agentButton = document.querySelector('form[data-form-type="agent-page"] button[type="submit"]');
      if (agentButton) agentButton.textContent = choose('Submit Partner Application', 'Enviar postulación');
      setText('main section:nth-of-type(5) .panel-card:first-child .section-kicker', 'Backend Hooks', 'Hooks backend');
      setText('main section:nth-of-type(5) .panel-card:first-child h2', 'Ready for CRM routing and persistence', 'Listo para enrutamiento CRM y persistencia');
      setText('main section:nth-of-type(5) .panel-card:last-child .section-kicker', 'What CasaClaro sends you', 'Qué te envía CasaClaro');
    }

    if (state.language === 'es') {
      const pageTranslators = {
        home: translateHomeStatic,
        cities: translateCitiesStatic,
        rentals: translateRentalsStatic,
        relocation: translateRelocationStatic,
        residency: translateResidencyStatic,
        sellers: translateSellersStatic,
        agents: translateAgentsStatic,
        guide: translateGuideStatic,
        map: translateMapStatic,
        simulator: translateSimulatorStatic,
        'city-template': translateCityTemplateStatic
      };
      pageTranslators[page]?.();
    }
  }

  function buildCityOptions(cities, selected = '') {
    return cities.map((city) => `<option value="${city.slug}" ${selected === city.slug ? 'selected' : ''}>${city.name}</option>`).join('');
  }

  function renderHeader(currentPage) {
    const target = document.getElementById('site-header');
    if (!target) return;

    const navCurrentPage = currentPage === 'city' || currentPage === 'city-template' ? 'cities' : currentPage;
    const mainTarget = document.querySelector('main')?.id || 'main-content';

    const copy = state.language === 'es'
      ? {
          brand: 'Inteligencia cálida para propiedad, reubicación, arriendos y alianzas en Colombia.',
          investor: 'Alertas',
          submit: 'Publicar inmueble',
          menu: 'Abrir navegación',
          skip: 'Ir al contenido principal',
          closeMenu: 'Cerrar navegación',
          links: ['Inicio', 'Ciudades', 'Arriendos', 'Reubicación', 'Simulador', 'Mapa', 'Guía de Compra', 'Residencia', 'Propietarios', 'Aliados']
        }
      : {
          brand: 'Warm market intelligence for Colombia property, relocation, rentals, and partnerships.',
          investor: 'Investor Alerts',
          submit: 'Submit Home',
          menu: 'Open navigation',
          skip: 'Skip to main content',
          closeMenu: 'Close navigation',
          links: ['Home', 'Cities', 'Rentals', 'Relocation', 'Simulator', 'Map', 'Buy Guide', 'Residency', 'For Sellers', 'Partners']
        };

    const navLinks = [
      ['cities.html',         copy.links[1], 'cities'],
      ['guide.html',          copy.links[6], 'guide'],
      ['relocation.html',     copy.links[3], 'relocation'],
      ['rentals.html',        copy.links[2], 'rentals'],
      ['map.html',            copy.links[5], 'map'],
      ['cost-simulator.html', copy.links[4], 'simulator'],
      ['for-sellers.html',    copy.links[8], 'sellers'],
      ['for-agents.html',     copy.links[9], 'agents'],
    ];

    target.innerHTML = `
      <a class="skip-link" href="#${mainTarget}">${copy.skip}</a>
      <header class="site-header">
        <div class="container nav-shell">
          <a class="brand-lockup" href="index.html">
            <img src="assets/logo.png" alt="" class="brand-logo" aria-hidden="true">
            <span class="brand-wordmark">CasaClaro</span>
          </a>
          <nav class="nav-links" aria-label="Primary navigation">
            ${navLinks.map(([href, label, page]) => `<a href="${href}" ${navCurrentPage === page ? 'aria-current="page"' : ''}>${label}</a>`).join('')}
          </nav>
          <div class="header-actions">
            <div class="language-toggle" role="group" aria-label="Language toggle">
              <button class="lang-pill ${state.language === 'en' ? 'is-active' : ''}" type="button" data-language-toggle="en" aria-pressed="${state.language === 'en'}">EN</button>
              <button class="lang-pill ${state.language === 'es' ? 'is-active' : ''}" type="button" data-language-toggle="es" aria-pressed="${state.language === 'es'}">ES</button>
            </div>
            <button class="btn btn-primary btn-sm" type="button" data-open-modal="investor-modal">${copy.investor}</button>
            <a class="btn btn-secondary btn-sm" href="for-sellers.html">${copy.submit}</a>
            <button class="mobile-toggle" type="button" aria-label="${copy.menu}" aria-expanded="false" aria-controls="mobile-nav">
              <span class="menu-glyph">${state.language === 'es' ? 'Menú' : 'Menu'}</span>
            </button>
          </div>
        </div>
        <div class="container mobile-nav" id="mobile-nav">
          ${navLinks.map(([href, label, page]) => `<a href="${href}" ${navCurrentPage === page ? 'aria-current="page"' : ''}>${label}</a>`).join('')}
        </div>
      </header>
    `;

    const toggle = target.querySelector('.mobile-toggle');
    const mobileNav = target.querySelector('#mobile-nav');
    if (toggle && mobileNav) {
      toggle.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? copy.closeMenu : copy.menu);
      });
      mobileNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          mobileNav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-label', copy.menu);
        });
      });
    }

    target.querySelectorAll('[data-language-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        const language = button.dataset.languageToggle;
        if (!language || language === state.language) return;
        state.language = language;
        persistLanguagePreference(language);
        window.location.reload();
      });
    });
  }

  function renderFooter(data) {
    const target = document.getElementById('site-footer');
    if (!target) return;

    const copy = state.language === 'es'
      ? {
          note: 'CasaClaro ayuda a compradores, arrendatarios, expatriados, propietarios y brokers a leer mercado, barrio y operacion con el mismo marco bilingue.',
          dataTitle: 'Confianza y actualizaciones',
          channelsTitle: 'Siguiente paso',
          audienceTitle: 'Para usuarios locales',
          audienceLabel: 'Lectura local',
          contactNote: 'Comparte tu objetivo y el equipo puede orientar mercado, barrio o ruta de salida.',
          contactAction: 'Solicitar una revision',
          copyright: 'Los datos y la guia enfocados en Colombia se revisan trimestralmente.'
        }
      : {
          note: 'CasaClaro helps buyers, renters, expatriates, sellers, and brokers read market, neighborhood, and operating reality through one bilingual framework.',
          dataTitle: 'Trust & Updates',
          channelsTitle: 'Next Step',
          audienceTitle: 'For Local Users',
          audienceLabel: 'Local lens',
          contactNote: 'Need a sharper read? Share your goal and the team can point you toward the right market, neighborhood, or exit route.',
          contactAction: 'Request a review',
          copyright: 'Colombia-focused data and guidance are reviewed quarterly.'
        };

    const links = state.language === 'es'
      ? ['Inicio', 'Ciudades', 'Arriendos', 'Reubicacion', 'Simulador', 'Mapa', 'Guia', 'Residencia', 'Para vender', 'Aliados']
      : ['Home', 'Cities', 'Rentals', 'Relocation', 'Cost Simulator', 'Map', 'Guide', 'Residency', 'For Sellers', 'Partners'];

    const socialMarkup = data.siteMeta.socialLinks.map((item) => `
      <a class="social-chip" href="${item.url}" target="_blank" rel="noreferrer">
        <span>${item.name}</span>
        <small>${item.handle}</small>
      </a>
    `).join('');

    target.innerHTML = `
      <footer class="footer-shell">
        <div class="container footer-grid">
          <div class="footer-column footer-column--brand">
            <a href="index.html" class="footer-brand">
              <img src="assets/logo.png" alt="" class="brand-logo brand-logo--footer" aria-hidden="true">
              <span class="brand-wordmark brand-wordmark--footer">CasaClaro</span>
            </a>
            <p class="footer-note">${copy.note}</p>
          </div>
          <div class="footer-column">
            <p class="footer-col-label">${copy.dataTitle}</p>
            <p class="footer-note">${data.siteMeta.dataUpdatedLabel}</p>
            <p class="footer-note">${data.siteMeta.legalReviewedLabel}</p>
            <p class="footer-note">${data.siteMeta.healthcareReviewedLabel}</p>
            <p class="footer-note" id="footer-fx-note">FX loading...</p>
            <p class="footer-note footer-contact-note">${copy.contactNote}</p>
            <a class="footer-link-arrow" href="relocation.html">${copy.contactAction} &rarr;</a>
          </div>
          <div class="footer-column">
            <p class="footer-col-label">${copy.channelsTitle}</p>
            <nav class="footer-quick-links" aria-label="Quick links">
              <a href="cities.html">${links[1]}</a>
              <a href="relocation.html">${links[3]}</a>
              <a href="for-sellers.html">${links[8]}</a>
              <a href="for-agents.html">${links[9]}</a>
            </nav>
            <div class="socials">${socialMarkup}</div>
          </div>
        </div>
        <div class="container footer-divider"></div>
        <div class="container footer-bottom">
          <p class="footer-note">&copy; ${new Date().getFullYear()} CasaClaro. ${copy.copyright}</p>
        </div>
      </footer>
    `;
  }

  function getFocusableElements(container) {
    return [...container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter((element) => !element.hasAttribute('disabled'));
  }

  function trapFocusInModal(event) {
    if (event.key !== 'Tab') return;
    const openBackdrop = document.querySelector('.modal-backdrop.open');
    if (!openBackdrop) return;

    const focusable = getFocusableElements(openBackdrop);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function openModal(modalId, trigger) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    lastFocusedElement = trigger || document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const card = modal.querySelector('.modal-card');
    const focusable = card ? getFocusableElements(card) : [];
    (focusable[0] || card)?.focus();
  }

  function renderModals(data) {
    const target = document.getElementById('modal-root');
    if (!target) return;

    const cityOptions = buildCityOptions(data.cities);
    const copy = state.language === 'es'
      ? {
          investorKicker: 'Alertas',
          investorTitle: 'Cuéntanos qué problema quieres resolver',
          investorLead: 'Enrutamos consultas de inversión con contexto de ciudad, presupuesto, financiación y tiempos en lugar de spam genérico.',
          name: 'Nombre',
          email: 'Correo',
          targetCity: 'Ciudad objetivo',
          budget: 'Rango de presupuesto',
          primaryGoal: 'Objetivo principal',
          investment: 'Inversión',
          relocation: 'Reubicación',
          retirement: 'Retiro',
          secondHome: 'Segunda vivienda',
          timeline: 'Tiempo estimado',
          notes: 'Notas',
          investorPlaceholder: 'Caminabilidad, salud, colegios, Airbnb, reparaciones o cualquier otra prioridad',
          investorSubmit: 'Enviar formulario de inversionista',
          partnerKicker: 'Aliados',
          partnerTitle: 'Postúlate al marketplace de aliados',
          partnerLead: 'CasaClaro está construido para agentes, brokers, abogados, administradores y contratistas que responden con claridad y a tiempo.',
          company: 'Empresa',
          city: 'Ciudad principal',
          role: 'Rol',
          specialization: 'Especialidad',
          responseTime: 'Tiempo típico de respuesta',
          phone: 'WhatsApp o teléfono',
          partnerNotes: 'Mercados cubiertos, idiomas y fortalezas transaccionales',
          partnerSubmit: 'Enviar postulación',
          sellerKicker: 'Propietarios',
          sellerTitle: 'Envía un inmueble para revisión',
          sellerLead: 'Cuéntanos la ciudad, precio, reparaciones y tiempos desde el inicio para que la siguiente conversación parta de hechos.',
          owner: 'Nombre del propietario',
          neighborhood: 'Barrio',
          propertyType: 'Tipo de inmueble',
          askingPrice: 'Precio pedido (USD)',
          bedrooms: 'Habitaciones (si es residencial)',
          condition: 'Estado',
          repairs: 'Notas principales de reparaciones',
          attachments: 'Adjuntos',
          sellerSubmit: 'Enviar inmueble',
          feedbackKicker: 'Retroalimentación de datos',
          feedbackTitle: 'Reportar información de mercado desactualizada',
          feedbackLead: 'Usa este formulario para señalar datos de ciudad desactualizados, reglas faltantes o cifras que deban revisarse.',
          checkLabel: '¿Qué se debe revisar?',
          feedbackSubmit: 'Enviar solicitud de revisión',
          close: 'Cerrar modal'
        }
      : {
          investorKicker: 'Investor Alerts',
          investorTitle: 'Tell us what you are trying to solve',
          investorLead: 'Share the city, budget, timing, and decision lens so the next conversation starts with real context.',
          name: 'Name',
          email: 'Email',
          targetCity: 'Target city',
          budget: 'Budget range',
          primaryGoal: 'Primary goal',
          investment: 'Investment',
          relocation: 'Relocation',
          retirement: 'Retirement',
          secondHome: 'Second home',
          timeline: 'Timeline',
          notes: 'Notes',
          investorPlaceholder: 'Walkability, healthcare, schools, Airbnb, repairs, or anything else on your mind',
          investorSubmit: 'Send Investor Intake',
          partnerKicker: 'Partners',
          partnerTitle: 'Apply to the partner marketplace',
          partnerLead: 'CasaClaro is built for agents, brokers, lawyers, property managers, and contractors who can respond clearly and on time.',
          company: 'Company',
          city: 'Primary city',
          role: 'Role',
          specialization: 'Specialization',
          responseTime: 'Typical response time',
          phone: 'WhatsApp or phone',
          partnerNotes: 'Markets covered, languages spoken, transaction strengths',
          partnerSubmit: 'Submit Partner Application',
          sellerKicker: 'For Sellers',
          sellerTitle: 'Submit a home for review',
          sellerLead: 'Tell us the city, pricing, repairs, and timeline up front so the next conversation starts from facts.',
          owner: 'Owner name',
          neighborhood: 'Neighborhood',
          propertyType: 'Property type',
          askingPrice: 'Asking price (USD)',
          bedrooms: 'Bedrooms (if residential)',
          condition: 'Condition',
          repairs: 'Main repair notes',
          attachments: 'Attachments',
          sellerSubmit: 'Submit Seller Intake',
          feedbackKicker: 'Data Feedback',
          feedbackTitle: 'Report outdated market information',
          feedbackLead: 'Use this form to flag outdated city data, missing rules, or figures that need review.',
          checkLabel: 'What should be checked?',
          feedbackSubmit: 'Submit Review Request',
          close: 'Close modal'
        };

    target.innerHTML = `
      <div class="modal-backdrop" id="investor-modal" aria-hidden="true">
        <div class="modal-card" role="dialog" aria-modal="true" tabindex="-1">
          <div class="modal-header">
            <div>
              <p class="section-kicker">${copy.investorKicker}</p>
              <h2>${copy.investorTitle}</h2>
              <p>${copy.investorLead}</p>
            </div>
            <button class="modal-close" type="button" aria-label="${copy.close}" data-close-modal="investor-modal">&times;</button>
          </div>
          <form data-form-type="investor-modal">
            <label>${copy.name}<input type="text" name="name" autocomplete="name" required></label>
            <label>${copy.email}<input type="email" name="email" autocomplete="email" spellcheck="false" inputmode="email" required></label>
            <label>${copy.targetCity}<select name="city">${cityOptions}</select></label>
            <label>${copy.budget}<input type="text" name="budget" autocomplete="off" placeholder="${state.language === 'es' ? 'USD 150k - 350k…' : '$150k - $350k…'}" required></label>
            <label>${copy.primaryGoal}
              <select name="goal" required>
                <option value="Investment">${copy.investment}</option>
                <option value="Relocation">${copy.relocation}</option>
                <option value="Retirement">${copy.retirement}</option>
                <option value="Second home">${copy.secondHome}</option>
              </select>
            </label>
            <label>${copy.timeline}<input type="text" name="timeline" autocomplete="off" placeholder="${state.language === 'es' ? '0-3 meses, 6 meses, investigando…' : '0-3 months, 6 months, researching…'}" required></label>
            <label>${copy.notes}<textarea name="notes" rows="4" placeholder="${copy.investorPlaceholder}"></textarea></label>
            <button class="btn btn-primary" type="submit">${copy.investorSubmit}</button>
            <p class="form-feedback" aria-live="polite"></p>
          </form>
        </div>
      </div>
      <div class="modal-backdrop" id="agent-modal" aria-hidden="true">
        <div class="modal-card" role="dialog" aria-modal="true" tabindex="-1">
          <div class="modal-header">
            <div>
              <p class="section-kicker">${copy.partnerKicker}</p>
              <h2>${copy.partnerTitle}</h2>
              <p>${copy.partnerLead}</p>
            </div>
            <button class="modal-close" type="button" aria-label="${copy.close}" data-close-modal="agent-modal">&times;</button>
          </div>
          <form data-form-type="agent-modal">
            <label>${copy.name}<input type="text" name="name" autocomplete="name" required></label>
            <label>${copy.company}<input type="text" name="agency" autocomplete="organization" required></label>
            <label>${copy.city}<select name="city">${cityOptions}</select></label>
            <label>${copy.role}
              <select name="role" required>
                <option value="Agent">${state.language === 'es' ? 'Agente' : 'Agent'}</option>
                <option value="Broker">${state.language === 'es' ? 'Broker' : 'Broker'}</option>
                <option value="Lawyer">${state.language === 'es' ? 'Abogado' : 'Lawyer'}</option>
                <option value="Property manager">${state.language === 'es' ? 'Administrador' : 'Property manager'}</option>
                <option value="Contractor">${state.language === 'es' ? 'Contratista' : 'Contractor'}</option>
              </select>
            </label>
            <label>${copy.specialization}<input type="text" name="specialization" autocomplete="off" placeholder="${state.language === 'es' ? 'Lujo, reubicación, compradores retiro, costa…' : 'Luxury, relocation, retiree buyers, coastal homes…'}" required></label>
            <label>${copy.responseTime}<input type="text" name="responseTime" autocomplete="off" placeholder="${state.language === 'es' ? 'Mismo día, 24 horas, 48 horas…' : 'Same day, 24 hours, 48 hours…'}" required></label>
            <label>${copy.phone}<input type="tel" name="phone" autocomplete="tel" inputmode="tel" required></label>
            <label>${copy.notes}<textarea name="notes" rows="4" placeholder="${copy.partnerNotes}"></textarea></label>
            <button class="btn btn-primary" type="submit">${copy.partnerSubmit}</button>
            <p class="form-feedback" aria-live="polite"></p>
          </form>
        </div>
      </div>
      <div class="modal-backdrop" id="seller-modal" aria-hidden="true">
        <div class="modal-card" role="dialog" aria-modal="true" tabindex="-1">
          <div class="modal-header">
            <div>
              <p class="section-kicker">${copy.sellerKicker}</p>
              <h2>${copy.sellerTitle}</h2>
              <p>${copy.sellerLead}</p>
            </div>
            <button class="modal-close" type="button" aria-label="${copy.close}" data-close-modal="seller-modal">&times;</button>
          </div>
          <form data-form-type="seller-modal">
            <label>${copy.owner}<input type="text" name="name" autocomplete="name" required></label>
            <label>${copy.email}<input type="email" name="email" autocomplete="email" spellcheck="false" inputmode="email" required></label>
            <label>${copy.city}<select name="city">${cityOptions}</select></label>
            <label>${copy.neighborhood}<input type="text" name="neighborhood" autocomplete="address-level2" required></label>
            <label>${copy.propertyType}
              <select name="propertyType" class="seller-property-type" required>
                <option value="Apartment">${state.language === 'es' ? 'Apartamento' : 'Apartment'}</option>
                <option value="House">${state.language === 'es' ? 'Casa' : 'House'}</option>
                <option value="Penthouse">${state.language === 'es' ? 'Penthouse' : 'Penthouse'}</option>
                <option value="Lot">${state.language === 'es' ? 'Lote' : 'Lot'}</option>
                <option value="Commercial">${state.language === 'es' ? 'Comercial' : 'Commercial'}</option>
                <option value="Other">${state.language === 'es' ? 'Otro' : 'Other'}</option>
              </select>
            </label>
            <label>${copy.askingPrice}<input type="number" name="askingPrice" min="0" step="1000" inputmode="decimal" required></label>
            <label>${copy.bedrooms}<input type="number" name="bedrooms" class="seller-bedrooms" min="0" step="1"></label>
            <label>${copy.condition}<input type="text" name="condition" autocomplete="off" placeholder="${state.language === 'es' ? 'Listo, retoques leves, renovación total…' : 'Turnkey, light updates, full renovation…'}" required></label>
            <label>${copy.repairs}<textarea name="repairs" rows="3" placeholder="${state.language === 'es' ? 'Humedad, techo, plomería, fachada, ascensores, AC…' : 'Humidity, roof, plumbing, facade, elevators, AC, windows…'}"></textarea></label>
            <label>${copy.timeline}<input type="text" name="timeline" autocomplete="off" placeholder="${state.language === 'es' ? '30 días, 90 días, probando precio…' : '30 days, 90 days, testing price…'}" required></label>
            <label>${copy.attachments}
              <input type="file" name="attachments" accept=".jpg,.jpeg,.png,.pdf" multiple>
            </label>
            <label>${copy.notes}<textarea name="notes" rows="4" placeholder="${state.language === 'es' ? 'Ocupación, administración, mejoras recientes, contratos, restricciones de cierre…' : 'Occupancy, HOA, recent upgrades, leases, closing constraints…'}"></textarea></label>
            <button class="btn btn-primary" type="submit">${copy.sellerSubmit}</button>
            <p class="form-feedback" aria-live="polite"></p>
          </form>
        </div>
      </div>
      <div class="modal-backdrop" id="feedback-modal" aria-hidden="true">
        <div class="modal-card" role="dialog" aria-modal="true" tabindex="-1">
          <div class="modal-header">
            <div>
              <p class="section-kicker">${copy.feedbackKicker}</p>
              <h2>${copy.feedbackTitle}</h2>
              <p>${copy.feedbackLead}</p>
            </div>
            <button class="modal-close" type="button" aria-label="${copy.close}" data-close-modal="feedback-modal">&times;</button>
          </div>
          <form data-form-type="outdated-data">
            <label>${copy.name}<input type="text" name="name" autocomplete="name" required></label>
            <label>${copy.email}<input type="email" name="email" autocomplete="email" spellcheck="false" inputmode="email" required></label>
            <label>${copy.city}<select name="city" id="feedback-city-select">${cityOptions}</select></label>
            <label>${copy.checkLabel}
              <textarea name="notes" rows="5" placeholder="${state.language === 'es' ? 'Explica qué parece desactualizado: precios, reglas, caminabilidad, salud…' : 'Explain what looks outdated: pricing, regulations, walkability, healthcare, visa note, or partner info…'}" required></textarea>
            </label>
            <button class="btn btn-primary" type="submit">${copy.feedbackSubmit}</button>
            <p class="form-feedback" aria-live="polite"></p>
          </form>
        </div>
      </div>
    `;

    if (!modalEventsBound) {
      document.addEventListener('click', (event) => {
        const openTrigger = event.target.closest('[data-open-modal]');
        if (openTrigger) {
          const modalId = openTrigger.dataset.openModal;
          const citySlug = openTrigger.dataset.citySlug || '';
          openModal(modalId, openTrigger);
          if (citySlug) setFeedbackCity(citySlug);
        }

        const closeTrigger = event.target.closest('[data-close-modal]');
        if (closeTrigger) {
          closeModal(closeTrigger.dataset.closeModal);
        }

        const backdrop = event.target.closest('.modal-backdrop');
        if (backdrop && event.target === backdrop) {
          closeModal(backdrop.id);
        }
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          const openBackdrop = document.querySelector('.modal-backdrop.open');
          if (openBackdrop) closeModal(openBackdrop.id);
        }
        trapFocusInModal(event);
      });

      modalEventsBound = true;
    }
  }

  function setFeedbackCity(citySlug) {
    const cityField = document.getElementById('feedback-city-select');
    if (cityField && citySlug) cityField.value = citySlug;
  }

  function renderFeatures() {
    const target = document.getElementById('feature-grid');
    if (!target) return;
    target.innerHTML = features.map((feature) => `
      <article class="warm-card feature-card">
        <span class="badge ${feature.status}">${state.language === 'es' ? badgeLabelsEs[feature.status] || badgeLabels[feature.status] : badgeLabels[feature.status]}</span>
        <h3>${state.language === 'es' ? feature.titleEs || feature.title : feature.title}</h3>
        <p>${state.language === 'es' ? feature.copyEs || feature.copy : feature.copy}</p>
      </article>
    `).join('');
  }

  function renderFeaturedProfessionals() {
    const target = document.getElementById('featured-professionals');
    if (!target) return;
    target.innerHTML = featuredProfessionals.map((person) => `
      <article class="warm-card professional-card">
        <p class="section-kicker">${person.city}</p>
        <h3>${person.name}</h3>
        <p>${state.language === 'es' ? person.specialtyEs || person.specialty : person.specialty}</p>
        <p class="muted-copy">${state.language === 'es' ? person.noteEs || person.note : person.note}</p>
        <div class="inline-metrics">
          <span>${person.rating.toFixed(1)} / 5 ${state.language === 'es' ? 'calificación' : 'rating'}</span>
        </div>
      </article>
    `).join('');
  }

  function renderHeroShowcase(data) {
    const target = document.getElementById('hero-showcase-grid');
    if (!target) return;
    const copy = state.language === 'es'
      ? { open: 'Abrir guía de ciudad', roi: 'ROI' }
      : { open: 'See city guide', roi: 'ROI' };
    const featured = ['medellin', 'cartagena', 'pereira']
      .map((slug) => data.cities.find((city) => city.slug === slug))
      .filter(Boolean);

    target.innerHTML = featured.map((city, index) => `
      <article class="postcard">
        <img src="${city.heroImage}" alt="${city.name} destination illustration" width="800" height="520" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
        <div class="postcard-body">
          <p class="section-kicker">${city.name}</p>
          <h3>${city.tagline}</h3>
          <p>${city.shortTagline}</p>
          <div class="mini-facts">
            <span>${formatMoney(city.pricePerSqm, 'USD')}/m2</span>
            <span>${copy.roi} ${city.roiRange}</span>
          </div>
          <div class="card-actions">
            <a class="link-arrow" href="city.html?id=${city.slug}">${copy.open}</a>
          </div>
        </div>
      </article>
    `).join('');
  }

  function renderCityCardMarkup(city) {
    const isEs = state.language === 'es';
    const shortTagline = isEs && city.shortTaglineEs ? city.shortTaglineEs : city.shortTagline;
    const region = isEs && city.regionEs ? city.regionEs : city.region;
    const CITY_PHOTOS = {
      'medellin':     'photo-1600596542815-ffad4c1539a9',
      'bogota':       'photo-1555041469-a586c61ea9bc',
      'cartagena':    'photo-1583995080768-42657321314e',
      'santa-marta':  'photo-1571896349842-33c89424de2d',
      'barranquilla': 'photo-1522708323590-d24dbb6b0267',
      'cali':         'photo-1556909114-f6e7ad7d3136',
      'pereira':      'photo-1560185007-c5ca9d2c014d',
      'manizales':    'photo-1552321554-5fefe8c9ef14',
    };
    const photoId = CITY_PHOTOS[city.slug] || 'photo-1600596542815-ffad4c1539a9';
    const photoUrl = `https://images.unsplash.com/${photoId}?w=800&q=80&auto=format&fit=crop`;
    const copy = isEs
      ? { price: 'Precio/m²', roi: 'Rendimiento', walk: 'Caminabilidad', health: 'Salud', retiree: 'Retiro', repair: 'Mantenimiento', open: 'Explorar ciudad' }
      : { price: 'Price/m²', roi: 'Rental Yield', walk: 'Walkability', health: 'Healthcare', retiree: 'Retiree Fit', repair: 'Repair Load', open: 'Explore city' };
    const highlights = isEs && city.destinationHighlightsEs
      ? city.destinationHighlightsEs
      : (city.destinationHighlights || []);
    return `
      <article class="warm-card city-card">
        <div class="city-card-hero" style="background-image: url('${photoUrl}')" role="img" aria-label="${city.name} real estate"></div>
        <div class="city-card-body">
          <p class="section-kicker">${region || ''}</p>
          <h3>${city.name}</h3>
          <p class="city-card-tagline">${shortTagline}</p>
          <div class="fact-grid compact-grid">
            <div><span>${copy.price}</span><strong>${formatMoney(city.pricePerSqm, 'USD')}/m²</strong></div>
            <div><span>${copy.roi}</span><strong>${city.rentalYield ? city.rentalYield + '%' : city.roiRange}</strong></div>
            <div><span>${copy.walk}</span><strong>${city.walkability.label}</strong></div>
            <div><span>${copy.health}</span><strong>${city.healthcare.label}</strong></div>
            <div><span>${copy.retiree}</span><strong>${city.retireeFit.label}</strong></div>
            <div><span>${copy.repair}</span><strong>${city.repairReality.label}</strong></div>
          </div>
          ${highlights.length ? `<ul class="city-card-highlights">${highlights.slice(0, 3).map(h => `<li>${h}</li>`).join('')}</ul>` : ''}
          <a class="btn btn-primary btn-sm" href="city.html?id=${city.slug}" style="margin-top: 0.75rem; display: inline-flex;">${copy.open}</a>
        </div>
      </article>
    `;
  }

  function renderHomeCityCards(data) {
    const target = document.getElementById('city-card-grid');
    if (!target) return;
    target.innerHTML = data.cities.map(renderCityCardMarkup).join('');
  }

  function renderRetireeSpotlights(data) {
    const target = document.getElementById('retiree-city-grid');
    if (!target) return;
    const picks = [...data.cities].sort((a, b) => b.retireeFit.score - a.retireeFit.score).slice(0, 4);
    const copy = state.language === 'es'
      ? { kicker: 'Ajuste para retiro', healthcare: 'Salud', walkability: 'Caminabilidad', open: 'Leer el resumen completo' }
      : { kicker: 'Retirement fit', healthcare: 'Healthcare', walkability: 'Walkability', open: 'Read the full city brief' };
    target.innerHTML = picks.map((city) => `
      <article class="warm-card spotlight-card">
        <p class="section-kicker">${copy.kicker}</p>
        <h3>${city.name}</h3>
        <p>${city.retireeFit.summary}</p>
        <div class="fact-grid compact-grid">
          <div><span>${copy.healthcare}</span><strong>${city.healthcare.label}</strong></div>
          <div><span>${copy.walkability}</span><strong>${city.walkability.label}</strong></div>
        </div>
        <a class="link-arrow" href="city.html?id=${city.slug}">${copy.open}</a>
      </article>
    `).join('');
  }

  function renderPartnerStandards(data) {
    const translated = state.language === 'es'
      ? [
          {
            metric: 'Revisión de consulta inversionista',
            target: 'Dentro de 1 día hábil',
            detail: 'CasaClaro revisa ciudad, presupuesto, supuestos de financiación y tiempos antes de enrutar.'
          },
          {
            metric: 'Confirmación de recepción para propietarios',
            target: 'Dentro de 1 día hábil',
            detail: 'Los propietarios reciben una primera lectura sobre encaje, próximos pasos y vacíos documentales con rapidez.'
          },
          {
            metric: 'Primera respuesta del aliado',
            target: 'Dentro de 24 horas hábiles del handoff',
            detail: 'Agentes y brokers deben confirmar recepción y dejar claro el siguiente paso.'
          },
          {
            metric: 'Actualización de estado tras la introducción',
            target: 'Dentro de 48 horas hábiles',
            detail: 'Los aliados reportan si el lead avanzó, pausó o necesita otra ruta.'
          }
        ]
      : data.siteMeta.partnerStandards;
    document.querySelectorAll('[data-partner-standards]').forEach((target) => {
      target.innerHTML = translated.map((item) => `
        <article class="warm-card standard-card">
          <p class="section-kicker">${item.target}</p>
          <h3>${item.metric}</h3>
          <p>${item.detail}</p>
        </article>
      `).join('');
    });
  }

  function renderSocialChannelCards(data) {
    const target = document.getElementById('social-channel-grid');
    if (!target) return;
    const channelDescriptionEs = {
      Instagram: 'Caminatas de barrio, reels de inmuebles, cafés y sensación de calle.',
      TikTok: 'Comparativos rápidos de ciudad, clips de caminabilidad, mitos y relatos de reparaciones.',
      YouTube: 'Guías largas de reubicación, análisis para retiro, recorridos de arriendo y entrevistas con aliados.'
    };
    target.innerHTML = data.siteMeta.socialLinks.map((item) => `
      <article class="warm-card social-card">
        <p class="section-kicker">${item.name}</p>
        <h3>${item.handle}</h3>
        <p>${state.language === 'es' ? channelDescriptionEs[item.name] || item.description : item.description}</p>
        <a class="link-arrow" href="${item.url}" target="_blank" rel="noreferrer">${state.language === 'es' ? `Abrir ${item.name}` : `Open ${item.name}`}</a>
      </article>
    `).join('');
  }

  function renderResidencyCards(data, targetId = 'residency-card-grid', limit = null) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const reviewedLabel = state.language === 'es' ? 'Revisado' : 'Reviewed';
    const approxLabel = state.language === 'es' ? 'Aprox.' : 'About';
    const usingLabel = state.language === 'es' ? 'usando FX verificado el' : 'using verified FX on';
    const translationBySlug = state.language === 'es'
      ? {
          investor: {
            subhead: 'Ruta oficial actual para inversión extranjera calificada.',
            thresholdLabel: '350 salarios mínimos mensuales legales vigentes',
            summary: 'Se usa para inversión extranjera directa mantenida en real estate colombiano u otros canales aprobados, con fondos registrados correctamente por el sistema cambiario.'
          },
          pensionado: {
            subhead: 'Ruta oficial actual para solicitantes con pensión demostrable.',
            thresholdLabel: 'Pensión mensual de al menos 3 salarios mínimos',
            summary: 'Pensada para jubilados que pueden documentar ingreso pensional de una fuente reconocida y buscan una opción de larga estancia en Colombia.'
          },
          'digital-nomad': {
            subhead: 'Útil para ingresos remotos que aún no compran a escala de visa inversionista.',
            thresholdLabel: 'Ruta basada en ingresos, no en inversión inmobiliaria',
            summary: 'Relevante para trabajadores remotos que están probando Colombia antes de comprar, especialmente si comparan Medellín, Pereira, Bucaramanga o la costa.'
          }
        }
      : {};
    const cards = (limit ? data.siteMeta.residency.cards.slice(0, limit) : data.siteMeta.residency.cards).map((card) => ({
      ...card,
      subhead: translationBySlug[card.slug]?.subhead || card.subhead,
      thresholdLabel: translationBySlug[card.slug]?.thresholdLabel || card.thresholdLabel,
      summary: translationBySlug[card.slug]?.summary || card.summary
    }));
    target.innerHTML = cards.map((card) => `
      <article class="warm-card residency-card">
        <p class="section-kicker">${card.thresholdLabel}</p>
        <h3>${card.name}</h3>
        <p>${card.subhead}</p>
        <p class="muted-copy">${card.summary}</p>
        <p class="helper-text">${reviewedLabel} ${data.siteMeta.residency.lastReviewed}</p>
        <div class="residency-meta">
          <span>${card.thresholdCop}</span>
          <span>${card.thresholdCopValue ? `${approxLabel} ${formatMoney(card.thresholdCopValue / getFxRate(), 'USD')} ${usingLabel} ${formatVerifiedDate(state.fx.date)}` : card.thresholdUsd}</span>
        </div>
        <a class="link-arrow" href="${card.sourceUrl}" target="_blank" rel="noreferrer">${card.sourceLabel}</a>
      </article>
    `).join('');
  }

  function renderFxSnapshot(data) {
    const rateLabel = document.getElementById('fx-rate-label');
    const sourceLabel = document.getElementById('fx-rate-source');
    const footerNote = document.getElementById('footer-fx-note');
    const simulatorRateNote = document.getElementById('simulator-rate-note');
    const neighborhoodNote = document.getElementById('neighborhood-cop-note');

    const summary = `1 USD = ${new Intl.NumberFormat(getLocale(), { maximumFractionDigits: 2 }).format(getFxRate())} COP`;
    const stamp = state.language === 'es'
      ? `Verificado ${formatVerifiedTimestamp()} vía ${data.siteMeta.exchangeRate.sourceLabel}${state.fx.live ? '' : ' (caché/respaldo)'}.`
      : `Verified ${formatVerifiedTimestamp()} via ${data.siteMeta.exchangeRate.sourceLabel}${state.fx.live ? '' : ' (cached/fallback)'}.`;

    if (rateLabel) rateLabel.textContent = summary;
    if (sourceLabel) sourceLabel.textContent = stamp;
    if (footerNote) footerNote.textContent = state.language === 'es' ? `FX actual: ${summary}. ${stamp}` : `FX snapshot: ${summary}. ${stamp}`;
    if (simulatorRateNote) simulatorRateNote.textContent = state.language === 'es' ? `Los cálculos actuales usan ${summary}. ${stamp}` : `Current calculations use ${summary}. ${stamp}`;
    if (neighborhoodNote) {
      neighborhoodNote.textContent = state.language === 'es'
        ? `La comparación barrial usa ${summary}. ${stamp}`
        : `Neighborhood comparison uses ${summary}. ${stamp}`;
    }
  }

  function startFxAutoRefresh(data) {
    const refreshMs = 15 * 60 * 1000;
    window.setInterval(async () => {
      await loadFxRate(data);
      const localizedData = getLocalizedData(state.data || data);
      renderFxSnapshot(localizedData);
      if (document.getElementById('hero-showcase-grid')) renderHeroShowcase(localizedData);
      if (document.getElementById('city-card-grid')) renderHomeCityCards(localizedData);
      if (document.getElementById('neighborhood-spotlight-grid')) renderNeighborhoodSpotlights(localizedData);
      if (document.getElementById('retiree-city-grid')) renderRetireeSpotlights(localizedData);
      if (document.getElementById('rental-city-grid') || document.getElementById('rental-neighborhood-grid')) renderRentalsPage(localizedData);
      if (document.getElementById('neighborhood-cop-compare-grid')) renderNeighborhoodCopComparison(localizedData);
      if (document.getElementById('city-page-root')) renderCityPage(localizedData);
      const simulator = document.getElementById('cost-simulator-form');
      if (simulator) simulator.dispatchEvent(new Event('change', { bubbles: true }));
    }, refreshMs);
  }

  function initCounters(data) {
    document.querySelectorAll('.counter').forEach((counter) => {
      const dynamicType = counter.dataset.counterDynamic;
      const endValue = dynamicType === 'cities'
        ? data.cities.length
        : dynamicType === 'neighborhoods'
          ? data.cities.reduce((total, city) => total + (city.neighborhoods?.length || 0), 0)
          : Number(counter.dataset.counter || 0);
      const isDynamicExact = dynamicType === 'cities' || dynamicType === 'neighborhoods';
      if (prefersReducedMotion()) {
        counter.textContent = isDynamicExact ? String(endValue) : formatCount(endValue);
        return;
      }
      const duration = 900;
      const start = performance.now();

      const tick = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        const value = Math.round(endValue * progress);
        counter.textContent = isDynamicExact ? String(value) : formatCount(value);
        if (progress < 1) {
          window.requestAnimationFrame(tick);
        } else {
          counter.textContent = isDynamicExact ? String(endValue) : formatCount(endValue);
        }
      };

      window.requestAnimationFrame(tick);
    });
  }

  function getSellerSignal(city) {
    const isEs = state.language === 'es';
    if (city.explorerTags.includes('coastal')) {
      return isEs
        ? `En ${city.name}, la confianza del comprador sube cuando el propietario revela desgaste por salitre, historial de impermeabilización, sistemas de respaldo y realidad de la administración antes de que se lo pidan.`
        : `In ${city.name}, seller confidence rises when owners disclose salt-air wear, waterproofing history, backup systems, and HOA realities before buyers need to ask.`;
    }
    if (city.repairReality.label === 'Manageable' || city.explorerTags.includes('low-maintenance')) {
      return isEs
        ? `${city.name} suele premiar documentación limpia, precios realistas y una explicación tranquila de reservas, mejoras y costos operativos más que una venta exagerada.`
        : `${city.name} usually rewards clean documentation, realistic pricing, and a calm explanation of reserves, upgrades, and operating costs more than flashy overselling.`;
    }
    return isEs
      ? `A los vendedores de ${city.name} les va mejor cuando explican claramente estado, mejoras y reglas del edificio para que el comprador pueda medir riesgo sin adivinar.`
      : `${city.name} sellers do best when they frame condition, upgrades, and building rules clearly so international buyers can underwrite risk without guesswork.`;
  }

  function renderSellerMarketGrid(data) {
    const target = document.getElementById('seller-market-grid');
    if (!target) return;
    const copy = state.language === 'es'
      ? { price: 'Precio / m2', repair: 'Realidad de mantenimiento', brief: 'Leer el resumen del mercado' }
      : { price: 'Price / m2', repair: 'Repair reality', brief: 'Read the market brief' };

    const featured = ['medellin', 'bogota', 'cartagena', 'pereira']
      .map((slug) => data.cities.find((city) => city.slug === slug))
      .filter(Boolean);

    target.innerHTML = featured.map((city) => `
      <article class="warm-card compare-card">
        <p class="section-kicker">${city.name}</p>
        <h3>${city.shortTagline}</h3>
        <p>${getSellerSignal(city)}</p>
        <div class="compare-grid">
          <div><span>${copy.price}</span><strong>${formatMoney(city.pricePerSqm)}</strong></div>
          <div><span>${copy.repair}</span><strong>${city.repairReality.label}</strong></div>
        </div>
        <a class="link-arrow" href="city.html?id=${city.slug}">${copy.brief}</a>
      </article>
    `).join('');
  }

  function estimateSampleGrossMonthlyRent(city, samplePrice = 200000) {
    return (samplePrice * (city.rentalYield / 100)) / 12;
  }

  function deriveRentalNarrative(city) {
    const isEs = state.language === 'es';
    if (city.explorerTags.includes('coastal') || city.explorerTags.includes('tourism')) {
      return isEs
        ? 'La demanda turística y amoblada puede ser atractiva, pero las reglas del edificio, la estacionalidad y la disciplina de mantenimiento pesan más que una tarifa diaria llamativa.'
        : 'Tourism and furnished demand can be attractive, but building rules, seasonality, and maintenance discipline matter more than headline nightly rates.';
    }
    if (city.explorerTags.includes('remote-work') || city.explorerTags.includes('expat-friendly')) {
      return isEs
        ? 'La demanda amoblada de larga estancia de remotos, expatriados y colombianos que regresan suele sostener una historia de arriendos más estable que la pura especulación de corta estancia.'
        : 'Furnished long-stay demand from remote workers, expats, and returning Colombians often supports a steadier rental story than pure short-stay speculation.';
    }
    if (city.explorerTags.includes('families') || city.explorerTags.includes('executive-rentals')) {
      return isEs
        ? 'Los contratos de larga estancia ejecutivos, familiares y profesionales suelen dar aquí el caso de ocupación más limpio, especialmente en sectores con buenos servicios.'
        : 'Executive, family, and professional long-term leases usually drive the cleanest occupancy case here, especially in service-rich districts.';
    }
    return isEs
      ? 'Trata este mercado primero como una jugada de arriendo de larga estancia. Si existe corta estancia, debe verse como un upside solo después de verificar reglas y operación.'
      : 'Treat this market as a long-stay rental play first. If short stays exist, they should be an upside case only after rules and operations are verified.';
  }

  function deriveNeighborhoodRentalAngle(city, neighborhood) {
    const character = neighborhood.character.toLowerCase();
    const isEs = state.language === 'es';

    if (character.includes('nightlife') || character.includes('short-stay') || character.includes('luxury')) {
      return isEs
        ? 'Puede haber demanda turística y de arriendo amoblado de mayor presupuesto, pero los permisos del edificio deben revisarse antes de modelar corta estancia.'
        : 'Higher-budget furnished renters and tourism demand may be present, but building permissions need to be checked before underwriting short stays.';
    }
    if (character.includes('family') || character.includes('suburban')) {
      return isEs
        ? 'Se alinea mejor con arriendos familiares o profesionales de larga estancia que con inventario nocturno de alta rotación.'
        : 'Better aligned with stable long-stay family or professional leases than high-turnover nightly inventory.';
    }
    if (character.includes('walkable') || character.includes('leafy') || character.includes('local-professional')) {
      return isEs
        ? 'Buen ajuste para arrendatarios de larga estancia que quieren caminabilidad diaria, servicios cercanos y una rutina más tranquila.'
        : 'Strong long-stay fit for renters who want daily walkability, neighborhood services, and a calmer routine.';
    }
    if (character.includes('value') || character.includes('value-oriented')) {
      return isEs
        ? 'Funciona mejor como conversación de arriendo de larga estancia sensible al precio que como propuesta premium de hospitalidad.'
        : 'Works best as a price-sensitive long-stay rental conversation rather than a premium hospitality pitch.';
    }
    if (city.explorerTags.includes('coastal')) {
      return isEs
        ? 'La vida costera puede sostener demanda, pero arrendatarios y compradores igual preguntarán por humedad, mantenimiento y operación del edificio.'
        : 'Coastal lifestyle can support demand, but renters and buyers will still ask about humidity, maintenance, and building operations.';
    }

    return isEs
      ? 'Empieza aquí por el perfil del arrendatario de larga estancia y luego prueba cualquier upside amoblado o de corta estancia contra reglas reales del edificio y demanda efectiva.'
      : 'Start with the long-stay tenant profile here, then stress-test any furnished or short-stay upside against building rules and actual demand.';
  }

  function renderNeighborhoodSpotlights(data) {
    const target = document.getElementById('neighborhood-spotlight-grid');
    if (!target) return;
    const copy = state.language === 'es'
      ? {
          bestFor: 'Mejor para',
          defaultBestFor: 'Demanda mixta local y de relocalización.',
          priceBand: 'Rango de precio',
          rentalAngle: 'Ángulo de arriendo',
          open: 'Abrir resumen de barrio'
        }
      : {
          bestFor: 'Best for',
          defaultBestFor: 'Mixed local and relocation demand.',
          priceBand: 'Price band',
          rentalAngle: 'Rental angle',
          open: 'Open neighborhood brief'
        };

    const picks = data.cities
      .filter((city) => city.neighborhoods?.length)
      .slice(0, 6)
      .map((city) => ({ city, neighborhood: city.neighborhoods[0] }));

    target.innerHTML = picks.map(({ city, neighborhood }) => `
      <article class="warm-card compare-card">
        <p class="section-kicker">${city.name}</p>
        <h3>${neighborhood.name}</h3>
        <p>${neighborhood.character}</p>
        <p class="muted-copy"><strong>${copy.bestFor}:</strong> ${neighborhood.bestFor || copy.defaultBestFor}</p>
        <div class="compare-grid">
          <div><span>${copy.priceBand}</span><strong>${neighborhood.priceRange}</strong></div>
          <div><span>${copy.rentalAngle}</span><strong>${neighborhood.rentalProfile || deriveNeighborhoodRentalAngle(city, neighborhood)}</strong></div>
        </div>
        <a class="link-arrow" href="city.html?id=${city.slug}">${copy.open}: ${city.name}</a>
      </article>
    `).join('');
  }

  function renderRentalsPage(data) {
    const cityGrid = document.getElementById('rental-city-grid');
    const neighborhoodGrid = document.getElementById('rental-neighborhood-grid');
    const copy = state.language === 'es'
      ? {
          tenantMix: 'Perfil de inquilino',
          tenantFallback: 'Demanda mixta local y extranjera.',
          sampleRent: 'Arriendo bruto estimado',
          repairReality: 'Realidad de mantenimiento',
          yield: 'rend. bruto',
          longStay: 'Larga estancia',
          longStayFallback: 'Revisa la profundidad de la demanda local.',
          furnished: 'Amoblado',
          furnishedFallback: 'Selectivo según el barrio.',
          shortStay: 'Corta estancia',
          shortStayFallback: 'Primero confirma reglas del edificio.',
          fullGuide: 'Abrir guía completa de ciudad y barrios',
          bestFor: 'Mejor para',
          defaultBestFor: 'Demanda mixta de hogares.'
        }
      : {
          tenantMix: 'Tenant mix',
          tenantFallback: 'Mixed local and foreign demand.',
          sampleRent: 'Sample gross monthly rent',
          repairReality: 'Repair reality',
          yield: 'gross yield',
          longStay: 'Long stay',
          longStayFallback: 'Review local tenant depth.',
          furnished: 'Furnished',
          furnishedFallback: 'Selective by neighborhood.',
          shortStay: 'Short stay',
          shortStayFallback: 'Check building rules first.',
          fullGuide: 'Read full city and neighborhood guide',
          bestFor: 'Best for',
          defaultBestFor: 'Mixed household demand.'
        };
    if (cityGrid) {
      cityGrid.innerHTML = data.cities.map((city) => `
        <article class="warm-card compare-card">
          <p class="section-kicker">${city.name}</p>
          <h3>${city.roiRange} ROI | ${formatPercent(city.rentalYield)} ${copy.yield}</h3>
          <p>${city.rentalMarket?.headline || deriveRentalNarrative(city)}</p>
          <p class="muted-copy"><strong>${copy.tenantMix}:</strong> ${city.rentalMarket?.tenantMix || copy.tenantFallback}</p>
          <div class="compare-grid">
            <div><span>${copy.sampleRent}</span><strong>${formatMoney(estimateSampleGrossMonthlyRent(city))}</strong></div>
            <div><span>${copy.repairReality}</span><strong>${city.repairReality.label}</strong></div>
          </div>
          <div class="check-list compact-list">
            <div><strong>${copy.longStay}:</strong> ${city.rentalMarket?.longStayDemand || copy.longStayFallback}</div>
            <div><strong>${copy.furnished}:</strong> ${city.rentalMarket?.furnishedDemand || copy.furnishedFallback}</div>
            <div><strong>${copy.shortStay}:</strong> ${city.rentalMarket?.shortStayReality || copy.shortStayFallback}</div>
          </div>
          <a class="link-arrow" href="city.html?id=${city.slug}">${copy.fullGuide}</a>
        </article>
      `).join('');
    }

    if (neighborhoodGrid) {
      const neighborhoods = data.cities.flatMap((city) => city.neighborhoods.map((neighborhood) => ({ city, neighborhood })));
      neighborhoodGrid.innerHTML = neighborhoods.map(({ city, neighborhood }) => `
        <article class="warm-card compare-card">
          <p class="section-kicker">${city.name}</p>
          <h3>${neighborhood.name}</h3>
          <p>${neighborhood.character}</p>
          <p class="muted-copy"><strong>${copy.bestFor}:</strong> ${neighborhood.bestFor || copy.defaultBestFor}</p>
          <div class="compare-grid">
            <div><span>${state.language === 'es' ? 'Rango de precio' : 'Price band'}</span><strong>${neighborhood.priceRange}</strong></div>
            <div><span>${state.language === 'es' ? 'Ángulo de arriendo' : 'Rental angle'}</span><strong>${neighborhood.rentalProfile || deriveNeighborhoodRentalAngle(city, neighborhood)}</strong></div>
          </div>
        </article>
      `).join('');
    }
  }

  function getNeighborhoodComparisonRows(data) {
    return data.cities.flatMap((city) => (city.neighborhoods || []).map((neighborhood) => {
      const usd = Number(neighborhood.pricePerSqmUsd || 0);
      const cop = usd ? usd * getFxRate() : Number(neighborhood.pricePerSqmCop || 0);
      const diff = city.pricePerSqm ? ((usd - city.pricePerSqm) / city.pricePerSqm) * 100 : 0;
      return { city, neighborhood, usd, cop, diff };
    })).filter((row) => row.usd > 0 && row.cop > 0);
  }

  function renderNeighborhoodCopComparison(data) {
    const target = document.getElementById('neighborhood-cop-compare-grid');
    if (!target) return;
    const citySelect = document.getElementById('neighborhood-cop-city');
    const sortSelect = document.getElementById('neighborhood-cop-sort');
    const note = document.getElementById('neighborhood-cop-note');
    const selectedCity = citySelect?.value || 'all';
    const selectedSort = sortSelect?.value || 'cop-high';

    const copy = state.language === 'es'
      ? {
          city: 'Ciudad',
          neighborhood: 'Barrio',
          copPerSqm: 'COP/m2',
          usdPerSqm: 'USD/m2',
          diff: 'Vs ciudad',
          fit: 'Mejor para',
          fxNote: `Comparación calculada con 1 USD = ${new Intl.NumberFormat(getLocale(), { maximumFractionDigits: 2 }).format(getFxRate())} COP. Verificada ${formatVerifiedTimestamp()}.`,
          empty: 'No hay barrios con precio numérico por m2 todavía.'
        }
      : {
          city: 'City',
          neighborhood: 'Neighborhood',
          copPerSqm: 'COP/m2',
          usdPerSqm: 'USD/m2',
          diff: 'Vs city avg',
          fit: 'Best for',
          fxNote: `Comparison uses 1 USD = ${new Intl.NumberFormat(getLocale(), { maximumFractionDigits: 2 }).format(getFxRate())} COP. Verified ${formatVerifiedTimestamp()}.`,
          empty: 'No neighborhoods have numeric price-per-m2 values yet.'
        };

    const rows = getNeighborhoodComparisonRows(data);
    if (note) note.textContent = copy.fxNote;

    if (!rows.length) {
      target.innerHTML = `<article class="warm-card compare-card"><p>${copy.empty}</p></article>`;
      return;
    }

    if (citySelect) {
      citySelect.innerHTML = [
        `<option value="all">${state.language === 'es' ? 'Todas las ciudades' : 'All cities'}</option>`,
        ...data.cities.map((city) => `<option value="${city.slug}">${city.name}</option>`)
      ].join('');
      citySelect.value = selectedCity;
    }
    if (sortSelect) sortSelect.value = selectedSort;

    const render = () => {
      const activeCity = citySelect?.value || 'all';
      const sortValue = sortSelect?.value || 'cop-high';
      const filtered = rows.filter((row) => activeCity === 'all' || row.city.slug === activeCity);
      const sorted = [...filtered].sort((a, b) => {
        if (sortValue === 'diff-high') return b.diff - a.diff;
        if (sortValue === 'diff-low') return a.diff - b.diff;
        if (sortValue === 'usd-low') return a.usd - b.usd;
        return b.cop - a.cop;
      }).slice(0, Number(target.dataset.limit || 18));

      if (!sorted.length) {
        target.innerHTML = `<article class="warm-card compare-card"><p>${copy.empty}</p></article>`;
        return;
      }

      target.innerHTML = sorted.map(({ city, neighborhood, usd, cop, diff }) => {
        const diffPrefix = diff >= 0 ? '+' : '';
        return `
          <article class="warm-card compare-card neighborhood-cop-card">
            <p class="section-kicker">${copy.city}: ${city.name}</p>
            <h3>${copy.neighborhood}: ${neighborhood.name}</h3>
            <p class="muted-copy"><strong>${copy.fit}:</strong> ${neighborhood.bestFor || (state.language === 'es' ? 'Compra local, reubicación y demanda mixta.' : 'Local buying, relocation, and mixed demand.')}</p>
            <div class="compare-grid">
              <div><span>${copy.copPerSqm}</span><strong>${new Intl.NumberFormat(getLocale()).format(Math.round(cop))}</strong></div>
              <div><span>${copy.usdPerSqm}</span><strong>${formatMoney(usd, 'USD')}</strong></div>
              <div><span>${copy.diff}</span><strong>${diffPrefix}${diff.toFixed(1)}%</strong></div>
            </div>
          </article>
        `;
      }).join('');
    };

    if (citySelect && citySelect.dataset.bound !== 'true') {
      citySelect.addEventListener('change', render);
      citySelect.dataset.bound = 'true';
    }
    if (sortSelect && sortSelect.dataset.bound !== 'true') {
      sortSelect.addEventListener('change', render);
      sortSelect.dataset.bound = 'true';
    }
    render();
  }

  function renderReviewLabels(data) {
    const legalPill = document.getElementById('legal-review-pill');
    const healthPill = document.getElementById('health-review-pill');
    if (legalPill) legalPill.textContent = data.siteMeta.legalReviewedLabel;
    if (healthPill) healthPill.textContent = data.siteMeta.healthcareReviewedLabel;
  }

  function populatePageCitySelects(data) {
    const cityOptions = buildCityOptions(data.cities);
    const ids = ['seller-page-city', 'agent-page-city', 'feedback-city-select'];
    ids.forEach((id) => {
      const select = document.getElementById(id);
      if (select) select.innerHTML = cityOptions;
    });
  }

  function syncSellerBedrooms(propertyTypeField, bedroomsField) {
    if (!propertyTypeField || !bedroomsField) return;
    const residentialTypes = ['Apartment', 'House', 'Penthouse'];
    const isResidential = residentialTypes.includes(propertyTypeField.value);
    bedroomsField.disabled = !isResidential;
    bedroomsField.required = false;
    if (!isResidential) bedroomsField.value = '';
  }

  function initSellerFields() {
    const fieldPairs = [
      [document.getElementById('seller-page-property-type'), document.getElementById('seller-page-bedrooms')]
    ];
    document.querySelectorAll('.modal-card').forEach((card) => {
      fieldPairs.push([card.querySelector('.seller-property-type'), card.querySelector('.seller-bedrooms')]);
    });
    fieldPairs.forEach(([propertyTypeField, bedroomsField]) => {
      if (!propertyTypeField || !bedroomsField) return;
      if (!propertyTypeField.dataset.bound) {
        propertyTypeField.addEventListener('change', () => syncSellerBedrooms(propertyTypeField, bedroomsField));
        propertyTypeField.dataset.bound = 'true';
      }
      syncSellerBedrooms(propertyTypeField, bedroomsField);
    });
  }

  function getRouteConfig(formType) {
    return state.data.siteMeta.integrations.routes[formType] || { endpoint: '', method: 'POST', crmStage: formType };
  }

  function collectSubmission(form) {
    const formData = new FormData(form);
    const payload = {};
    const files = [];
    const fileUploads = [];

    formData.forEach((value, key) => {
      if (value instanceof File) {
        if (value.size > 0) {
          files.push({ key, name: value.name, size: value.size, type: value.type || 'application/octet-stream' });
          fileUploads.push({ key, file: value });
        }
        return;
      }
      payload[key] = value;
    });

    return { payload, files, fileUploads };
  }

  function storeSubmissionLocally(entry) {
    try {
      const existing = JSON.parse(
        window.localStorage.getItem(SUBMISSION_STORAGE_KEY)
        || window.localStorage.getItem(LEGACY_SUBMISSION_STORAGE_KEY)
        || '[]'
      );
      existing.unshift(entry);
      window.localStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify(existing.slice(0, 100)));
      return true;
    } catch (error) {
      console.warn('Local submission storage unavailable.', error);
      return false;
    }
  }

  async function routeSubmission(route, payload, files, fileUploads = []) {
    const entry = {
      submittedAt: new Date().toISOString(),
      page: window.location.pathname,
      crmStage: route.crmStage,
      payload,
      files
    };

    storeSubmissionLocally(entry);
    console.log('CasaClaro form submission', entry);

    if (!route.endpoint) return { mode: 'local' };

    try {
      let response;
      if (fileUploads.length) {
        const body = new FormData();
        Object.entries(payload).forEach(([key, value]) => body.append(key, value));
        body.append('crmStage', route.crmStage);
        body.append('submittedAt', entry.submittedAt);
        fileUploads.forEach(({ key, file }) => body.append(key, file, file.name));
        response = await fetch(route.endpoint, { method: route.method || 'POST', body });
      } else {
        response = await fetch(route.endpoint, {
          method: route.method || 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry)
        });
      }
      if (!response.ok) throw new Error(`Endpoint responded with ${response.status}`);
      return { mode: 'endpoint' };
    } catch (error) {
      console.warn('Configured endpoint failed, preserved locally instead.', error);
      return { mode: 'fallback' };
    }
  }

  function handleForms() {
    document.querySelectorAll('form[data-form-type]').forEach((form) => {
      if (form.dataset.bound === 'true') return;
      form.dataset.bound = 'true';
      const submitButton = form.querySelector('button[type="submit"]');

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) {
          form.querySelector(':invalid')?.focus();
          return;
        }
        const formType = form.dataset.formType;
        const feedback = form.querySelector('.form-feedback');
        const { payload, files, fileUploads } = collectSubmission(form);
        const route = getRouteConfig(formType);
        const originalLabel = submitButton?.textContent || '';
        form.setAttribute('aria-busy', 'true');

        if (feedback) {
          feedback.className = 'form-feedback';
          feedback.textContent = state.language === 'es' ? 'Enviando…' : 'Submitting…';
        }
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = state.language === 'es' ? 'Enviando…' : 'Submitting…';
        }

        const result = await routeSubmission(route, payload, files, fileUploads);

        if (feedback) {
          feedback.className = 'form-feedback success';
          if (result.mode === 'endpoint') {
            feedback.textContent = state.language === 'es'
              ? 'Enviado y encaminado al endpoint configurado.'
              : 'Submitted and routed to the configured endpoint.';
          } else if (result.mode === 'fallback') {
            feedback.textContent = state.language === 'es'
              ? 'Enviado. El endpoint falló, así que el registro quedó guardado localmente como respaldo.'
              : 'Submitted. The endpoint failed, so the intake was preserved locally as a fallback.';
          } else {
            feedback.textContent = state.language === 'es'
              ? 'Enviado. El registro quedó guardado localmente y listo para integrarse cuando exista un endpoint.'
              : 'Submitted. Stored locally and ready for routing once an endpoint is configured.';
          }
        }

        form.reset();
        initSellerFields();
        form.removeAttribute('aria-busy');
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalLabel;
        }
      });
    });
  }

  function validateSimulatorInputs(price, renovation, downPayment, interestRate, termYears, financing) {
    if (price <= 0) return state.language === 'es' ? 'El precio del inmueble debe ser mayor que cero.' : 'Property price must be greater than zero.';
    if (renovation < 0) return state.language === 'es' ? 'El presupuesto de remodelación no puede ser negativo.' : 'Renovation budget cannot be negative.';
    if (downPayment < 0 || downPayment > 100) return state.language === 'es' ? 'La cuota inicial debe estar entre 0% y 100%.' : 'Down payment must stay between 0% and 100%.';
    if (financing && interestRate < 0) return state.language === 'es' ? 'La tasa de interés no puede ser negativa.' : 'Interest rate cannot be negative.';
    if (financing && termYears <= 0) return state.language === 'es' ? 'El plazo del crédito debe ser mayor que cero.' : 'Loan term must be greater than zero years.';
    return '';
  }

  function calculateMortgagePayment(principal, annualRate, years) {
    if (principal <= 0) return 0;
    const months = Math.max(years * 12, 1);
    if (annualRate <= 0) return principal / months;
    const monthlyRate = annualRate / 100 / 12;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }

  function initSimulator(data) {
    const form = document.getElementById('cost-simulator-form');
    if (!form) return;
    const copy = state.language === 'es'
      ? {
          debtFlow: 'Flujo mensual después de deuda',
          operatingFlow: 'Flujo operativo mensual',
          negative: 'Negativo',
          notary: 'Notaría',
          registration: 'Registro',
          propertyTax: 'Reserva de impuesto predial',
          legal: 'Legal',
          cityTotal: 'Total ciudad',
          downPayment: 'Cuota inicial',
          grossRent: 'Arriendo bruto mensual',
          management: 'Reserva de administración',
          vacancy: 'Reserva por vacancia',
          taxes: 'Reserva tributaria',
          debtService: 'Servicio estimado de deuda'
        }
      : {
          debtFlow: 'Monthly cash flow after debt',
          operatingFlow: 'Monthly operating cash flow',
          negative: 'Negative',
          notary: 'Notary',
          registration: 'Registration',
          propertyTax: 'Property tax reserve',
          legal: 'Legal',
          cityTotal: 'City total',
          downPayment: 'Down payment',
          grossRent: 'Gross monthly rent',
          management: 'Management reserve',
          vacancy: 'Vacancy reserve',
          taxes: 'Tax reserve',
          debtService: 'Estimated debt service'
        };

    const citySelect = document.getElementById('sim-city-select');
    const financingFields = document.getElementById('financing-fields');
    const feedback = document.getElementById('simulator-feedback');
    const cashFlowLabel = document.getElementById('result-cash-flow-label');

    if (citySelect && !citySelect.innerHTML.trim()) {
      citySelect.innerHTML = buildCityOptions(data.cities);
    }

    const params = getParams();
    if (params.get('city') && citySelect) citySelect.value = params.get('city');

    const update = () => {
      state.currency = form.currency.value;
      const city = data.cities.find((item) => item.slug === citySelect.value) || data.cities[0];
      const inputCurrency = form.inputCurrency?.value || 'USD';
      const rawPrice = Number(form.price.value || 0);
      const rawRenovation = Number(form.renovation.value || 0);
      const price = inputCurrency === 'COP' ? rawPrice / getFxRate() : rawPrice;
      const renovation = inputCurrency === 'COP' ? rawRenovation / getFxRate() : rawRenovation;
      const financing = form.financing.checked;
      const downPayment = Number(form.downPayment.value || 0);
      const interestRate = Number(form.interestRate.value || 0);
      const termYears = Number(form.termYears.value || 0);
      const error = validateSimulatorInputs(price, renovation, downPayment, interestRate, termYears, financing);

      feedback.textContent = error || '';
      feedback.className = `form-feedback ${error ? 'error' : ''}`;
      financingFields.hidden = !financing;
      if (cashFlowLabel) {
        cashFlowLabel.textContent = financing ? copy.debtFlow : copy.operatingFlow;
      }

      if (error) {
        ['result-closing-costs', 'result-upfront', 'result-rent', 'result-cash-flow'].forEach((id) => {
          const node = document.getElementById(id);
          if (node) node.textContent = '-';
        });
        document.getElementById('closing-breakdown').innerHTML = '';
        document.getElementById('cash-flow-breakdown').innerHTML = '';
        return;
      }

      const breakdown = city.closingCostBreakdown || {
        notary: 1.0,
        registration: 1.5,
        propertyTax: 1.0,
        legal: city.closingCostPercent - 3.5
      };

      const closingCosts = price * (city.closingCostPercent / 100);
      const notary = price * (breakdown.notary / 100);
      const registration = price * (breakdown.registration / 100);
      const propertyTax = price * (breakdown.propertyTax / 100);
      const legal = price * (breakdown.legal / 100);
      const downPaymentAmount = financing ? price * (downPayment / 100) : 0;
      const loanAmount = financing ? Math.max(price - downPaymentAmount, 0) : 0;
      const monthlyDebt = financing ? calculateMortgagePayment(loanAmount, interestRate, termYears) : 0;
      const totalUpfront = financing ? downPaymentAmount + closingCosts + renovation : price + closingCosts + renovation;
      const grossMonthlyRent = (price * (city.rentalYield / 100)) / 12;
      const management = (price * 0.01) / 12;
      const vacancy = grossMonthlyRent * 0.05;
      const taxes = (price * 0.005) / 12;
      const operatingCashFlow = grossMonthlyRent - management - vacancy - taxes;
      const netCashFlow = financing ? operatingCashFlow - monthlyDebt : operatingCashFlow;

      document.getElementById('result-closing-costs').textContent = formatMoney(closingCosts);
      document.getElementById('result-upfront').textContent = formatMoney(Math.max(totalUpfront, 0));
      document.getElementById('result-rent').textContent = formatMoney(grossMonthlyRent);
      document.getElementById('result-cash-flow').textContent = netCashFlow > 0 ? formatMoney(netCashFlow) : copy.negative;

      document.getElementById('closing-breakdown').innerHTML = `
        <div class="breakdown-item"><span>${copy.notary} (${breakdown.notary.toFixed(1)}%)</span><strong>${formatMoney(notary)}</strong></div>
        <div class="breakdown-item"><span>${copy.registration} (${breakdown.registration.toFixed(1)}%)</span><strong>${formatMoney(registration)}</strong></div>
        <div class="breakdown-item"><span>${copy.propertyTax} (${breakdown.propertyTax.toFixed(1)}%)</span><strong>${formatMoney(propertyTax)}</strong></div>
        <div class="breakdown-item"><span>${copy.legal} (${breakdown.legal.toFixed(1)}%)</span><strong>${formatMoney(legal)}</strong></div>
        <div class="breakdown-item"><span>${copy.cityTotal} (${city.closingCostPercent.toFixed(1)}%)</span><strong>${formatMoney(closingCosts)}</strong></div>
        <div class="breakdown-item"><span>${state.language === 'es' ? 'Moneda de entrada' : 'Input currency'}</span><strong>${inputCurrency}</strong></div>
        ${financing ? `<div class="breakdown-item"><span>${copy.downPayment} (${downPayment.toFixed(0)}%)</span><strong>${formatMoney(downPaymentAmount)}</strong></div>` : ''}
      `;

      document.getElementById('cash-flow-breakdown').innerHTML = `
        <div class="breakdown-item"><span>${copy.grossRent}</span><strong>${formatMoney(grossMonthlyRent)}</strong></div>
        <div class="breakdown-item"><span>${copy.management}</span><strong>${formatMoney(management)}</strong></div>
        <div class="breakdown-item"><span>${copy.vacancy}</span><strong>${formatMoney(vacancy)}</strong></div>
        <div class="breakdown-item"><span>${copy.taxes}</span><strong>${formatMoney(taxes)}</strong></div>
        ${financing ? `<div class="breakdown-item"><span>${copy.debtService}</span><strong>${formatMoney(monthlyDebt)}</strong></div>` : ''}
      `;
    };

    form.addEventListener('input', update);
    form.addEventListener('change', update);
    document.getElementById('download-report')?.addEventListener('click', () => window.print());
    update();
  }

  function renderMapCityList(data) {
    const target = document.getElementById('map-city-list');
    if (!target) return;
    const copy = state.language === 'es'
      ? { price: 'Precio', roi: 'ROI', open: 'Abrir guía de ciudad' }
      : { price: 'Price', roi: 'ROI', open: 'Open city guide' };
    target.innerHTML = data.cities.map((city) => `
      <article class="warm-card map-city-card">
        <p class="section-kicker">${city.region}</p>
        <h3>${city.name}</h3>
        <p>${city.shortTagline}</p>
        <div class="fact-grid compact-grid">
          <div><span>${copy.price}</span><strong>${formatMoney(city.pricePerSqm)} / m2</strong></div>
          <div><span>${copy.roi}</span><strong>${city.roiRange}</strong></div>
        </div>
        <a class="link-arrow" href="city.html?id=${city.slug}">${copy.open}</a>
      </article>
    `).join('');
  }

  function initMap(data) {
    const mapElement = document.getElementById('city-map');
    renderMapCityList(data);
    if (!mapElement) return;
    if (typeof L === 'undefined') {
      const copy = state.language === 'es'
        ? {
            kicker: 'Mapa no disponible',
            title: 'Leaflet no cargó en este entorno',
            body: 'Usa las tarjetas de ciudades más abajo mientras la capa interactiva no esté disponible.'
          }
        : {
            kicker: 'Map unavailable',
            title: 'Leaflet did not load in this environment',
            body: 'Use the city snapshot cards below while the interactive layer is unavailable.'
          };
      mapElement.innerHTML = `
        <div class="map-fallback">
          <p class="section-kicker">${copy.kicker}</p>
          <h2>${copy.title}</h2>
          <p>${copy.body}</p>
        </div>
      `;
      return;
    }
    const map = L.map(mapElement, { zoomControl: true }).setView([4.5709, -74.2973], 6);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);
    const markerPoints = [];
    L.control.scale({ imperial: false }).addTo(map);

    const viewDetails = state.language === 'es' ? 'Ver detalles' : 'View details';
    data.cities.forEach((city) => {
      if (typeof city.lat !== 'number' || typeof city.lon !== 'number') return;
      markerPoints.push([city.lat, city.lon]);
      L.circleMarker([city.lat, city.lon], {
        radius: 9,
        color: '#8c3c0f',
        fillColor: '#f1c40f',
        fillOpacity: 0.95,
        weight: 2
      }).addTo(map).bindPopup(`
        <strong>${city.name}</strong><br>
        ${formatMoney(city.pricePerSqm)} / m2<br>
        ROI: ${city.roiRange}<br>
        <a href="city.html?id=${city.slug}">${viewDetails}</a>
      `);
    });
    if (markerPoints.length) {
      map.fitBounds(markerPoints, { padding: [28, 28] });
    }
  }

  function renderCityPage(data) {
    const root = document.getElementById('city-page-root');
    if (!root) return;

    const cityId = getParams().get('id');
    const city = data.cities.find((item) => item.slug === cityId);

    if (!city) {
      updateDocumentMeta({
        title: 'CasaClaro City Guide | City Not Found',
        description: 'The requested CasaClaro city guide could not be found. Return to the city explorer to browse Colombia market briefs.'
      });
      root.innerHTML = `
        <section class="page-hero compact-hero">
          <div class="container">
            <p class="section-kicker">404</p>
            <h1>City not found</h1>
            <p>The requested city ID does not exist in the current dataset.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="cities.html">Back to Cities</a>
              <a class="btn btn-secondary" href="relocation.html">Compare Relocation Fits</a>
            </div>
          </div>
        </section>
      `;
      return;
    }

    updateDocumentMeta({
      title: state.language === 'es'
        ? `CasaClaro ${city.name} | Propiedad, reubicación y guía de ciudad`
        : `CasaClaro ${city.name} | Property, Relocation, and City Guide`,
      description: state.language === 'es'
        ? `Guía de ${city.name} con precios, caminabilidad, salud, encaje para retiro, reparaciones y reglas inmobiliarias en Colombia.`
        : `${city.name} city guide covering pricing, walkability, healthcare, retiree fit, repair reality, and Colombia property rules.`
    });

    const copy = state.language === 'es'
      ? {
          intro: 'Por qué esta ciudad atrae gente',
          marketHuman: 'Mercado en términos humanos',
          history: 'Contexto histórico',
          investors: 'Por qué interesa a inversionistas',
          expats: 'Por qué se quedan los expatriados',
          practical: 'Preguntas prácticas primero',
          walkability: 'Caminabilidad',
          healthcare: 'Salud',
          retiree: 'Ajuste para retiro',
          repair: 'Realidad de mantenimiento',
          neighborhoods: 'Barrios',
          neighborhoodsTitle: 'Dónde suelen empezar a buscar',
          bestFor: 'Mejor para',
          bestForFallback: 'Demanda mixta de compradores y arrendatarios.',
          rentalAngle: 'Ángulo de arriendo',
          copPerSqm: 'COP/m2',
          usdPerSqm: 'USD/m2',
          delta: 'Vs ciudad',
          airbnb: 'Realidad de Airbnb y corta estancia',
          regulations: 'Regulación y propiedad',
          regulationsTitle: 'Qué debes verificar antes de comprar',
          foreignOwnership: 'Propiedad extranjera',
          mortgage: 'Nota hipotecaria',
          source: 'Fuente',
          metrics: 'Métricas clave',
          price: 'Precio / m2',
          roi: 'Rango ROI',
          yield: 'Rendimiento bruto',
          appreciation: 'Valorización',
          relocation: 'Foto de reubicación',
          relocationTitle: 'Cómo se siente la vida diaria',
          climate: 'Clima',
          pace: 'Ritmo',
          comfort: 'Presupuesto mensual',
          airport: 'Aeropuerto',
          english: 'Soporte en inglés',
          rentals: 'Realidad de arriendos',
          rentalsTitle: 'Cómo se comporta este mercado después de comprar',
          longStay: 'Larga estancia',
          furnished: 'Amoblado',
          shortStay: 'Corta estancia',
          tenantMix: 'Perfil de inquilino',
          landlord: 'Alertas para propietarios',
          sampleRent: `Arriendo bruto estimado sobre un activo de ${formatMoney(200000, 'USD')}`,
          regulationReminder: 'Recordatorio regulatorio',
          seller: 'Si eres propietario aquí',
          sellerTitle: 'Ángulo operativo y de venta',
          submitHome: 'Publicar inmueble',
          findOperators: 'Encontrar operadores locales',
          destination: 'Energía del destino',
          destinationTitle: 'Lo que la gente viene a sentir aquí',
          fieldJournal: 'Bitácora de campo',
          fieldJournalTitle: `Sigue cómo se siente ${city.name} sobre el terreno`,
          watchouts: 'Alertas',
          first30: 'Primeros 30 días',
          modelCity: 'Modelar esta ciudad',
          compareRelocation: 'Comparar reubicación',
          reportData: 'Reportar dato desactualizado'
        }
      : {
          intro: 'Why this city draws people in',
          marketHuman: 'Market in human terms',
          history: 'Historical context',
          investors: 'Why investors care',
          expats: 'Why expats stay',
          practical: 'Practical questions first',
          walkability: 'Walkability',
          healthcare: 'Healthcare',
          retiree: 'Retiree fit',
          repair: 'Repair reality',
          neighborhoods: 'Neighborhoods',
          neighborhoodsTitle: 'Where buyers usually start looking',
          bestFor: 'Best for',
          bestForFallback: 'Mixed buyer and renter demand.',
          rentalAngle: 'Rental angle',
          copPerSqm: 'COP/m2',
          usdPerSqm: 'USD/m2',
          delta: 'Vs city avg',
          airbnb: 'Airbnb & short-stay reality',
          regulations: 'Regulations & ownership',
          regulationsTitle: 'What to verify before you buy',
          foreignOwnership: 'Foreign ownership',
          mortgage: 'Mortgage note',
          source: 'Source',
          metrics: 'Key metrics',
          price: 'Price / m2',
          roi: 'ROI range',
          yield: 'Rental yield',
          appreciation: 'Appreciation',
          relocation: 'Relocation snapshot',
          relocationTitle: 'How daily life tends to feel',
          climate: 'Climate',
          pace: 'Pace',
          comfort: 'Monthly comfort',
          airport: 'Airport',
          english: 'English support',
          rentals: 'Rental reality',
          rentalsTitle: 'How this market behaves after purchase',
          longStay: 'Long stay',
          furnished: 'Furnished',
          shortStay: 'Short stay',
          tenantMix: 'Tenant mix',
          landlord: 'Landlord watchouts',
          sampleRent: `Sample gross monthly rent on a ${formatMoney(200000, 'USD')} asset`,
          regulationReminder: 'Regulation reminder',
          seller: 'If you own here',
          sellerTitle: 'Seller and operations angle',
          submitHome: 'Submit a home',
          findOperators: 'Find local operators',
          destination: 'Destination energy',
          destinationTitle: 'What people come here to feel',
          fieldJournal: 'Field journal',
          fieldJournalTitle: `Follow how ${city.name} feels on the ground`,
          watchouts: 'Watchouts',
          first30: 'First 30 days',
          modelCity: 'Model this city',
          compareRelocation: 'Compare relocation fits',
          reportData: 'Report outdated data'
        };

    root.innerHTML = `
      <section class="city-hero" style="background-image: linear-gradient(180deg, rgba(44, 28, 18, 0.18), rgba(24, 34, 44, 0.84)), url('${city.heroImage}')">
        <div class="container city-hero-inner">
          <p class="section-kicker">${city.region}</p>
          <h1>${city.name}</h1>
          <p class="hero-lede">${city.shortTagline}</p>
          <div class="tag-row">
            ${city.explorerTags.map((tag) => `<span class="tag light-tag">${formatTagLabel(tag)}</span>`).join('')}
          </div>
        </div>
      </section>
      <section class="section-shell">
        <div class="container city-detail-grid">
          <div class="content-stack">
            <article class="warm-card prose-card">
              <p class="section-kicker">${copy.intro}</p>
              <h2>${city.tagline}</h2>
              ${city.introText.map((paragraph) => `<p>${paragraph}</p>`).join('')}
            </article>
            <article class="warm-card prose-card">
              <p class="section-kicker">${copy.marketHuman}</p>
              <div class="insight-grid">
                <article class="insight-card">
                  <h3>${copy.history}</h3>
                  <p>${city.historicalContext}</p>
                </article>
                <article class="insight-card">
                  <h3>${copy.investors}</h3>
                  <p>${city.investorAppeal}</p>
                </article>
                <article class="insight-card">
                  <h3>${copy.expats}</h3>
                  <p>${city.lifestyleHighlights}</p>
                </article>
              </div>
            </article>
            <article class="warm-card practical-card">
              <p class="section-kicker">${copy.practical}</p>
              <div class="fact-grid practical-grid">
                <div><span>${copy.walkability}</span><strong>${city.walkability.label}</strong><p>${city.walkability.summary}</p></div>
                <div><span>${copy.healthcare}</span><strong>${city.healthcare.label}</strong><p>${city.healthcare.summary}</p></div>
                <div><span>${copy.retiree}</span><strong>${city.retireeFit.label}</strong><p>${city.retireeFit.summary}</p></div>
                <div><span>${copy.repair}</span><strong>${city.repairReality.label}</strong><p>${city.repairReality.summary}</p></div>
              </div>
            </article>
            <article class="warm-card prose-card">
              <p class="section-kicker">${copy.neighborhoods}</p>
              <h2>${copy.neighborhoodsTitle}</h2>
              <div class="neighborhood-list">
                ${city.neighborhoods.map((neighborhood) => `
                  <article class="neighborhood-item">
                    <h3>${neighborhood.name}</h3>
                    <p>${neighborhood.character}</p>
                    <strong>${neighborhood.priceRange}</strong>
                    <p class="muted-copy"><strong>${copy.bestFor}:</strong> ${neighborhood.bestFor || copy.bestForFallback}</p>
                    <p class="muted-copy"><strong>${copy.rentalAngle}:</strong> ${neighborhood.rentalProfile || deriveNeighborhoodRentalAngle(city, neighborhood)}</p>
                    ${(Number(neighborhood.pricePerSqmUsd || 0) > 0) ? `
                      <div class="compare-grid compact-grid neighborhood-metric-grid">
                        <div><span>${copy.copPerSqm}</span><strong>${new Intl.NumberFormat(getLocale()).format(Math.round(Number(neighborhood.pricePerSqmUsd) * getFxRate()))}</strong></div>
                        <div><span>${copy.usdPerSqm}</span><strong>${formatMoney(Number(neighborhood.pricePerSqmUsd), 'USD')}</strong></div>
                        <div><span>${copy.delta}</span><strong>${(((Number(neighborhood.pricePerSqmUsd) - city.pricePerSqm) / city.pricePerSqm) * 100 >= 0 ? '+' : '')}${(((Number(neighborhood.pricePerSqmUsd) - city.pricePerSqm) / city.pricePerSqm) * 100).toFixed(1)}%</strong></div>
                      </div>
                    ` : ''}
                  </article>
                `).join('')}
              </div>
            </article>
            <article class="warm-card prose-card">
              <p class="section-kicker">${copy.regulations}</p>
              <h2>${copy.regulationsTitle}</h2>
              <p><strong>${copy.airbnb}:</strong> ${city.regulations.airbnbSummary}</p>
              <p>${city.regulations.airbnbDetails}</p>
              <p><strong>${copy.foreignOwnership}:</strong> ${city.foreignOwnership}</p>
              <p><strong>${copy.mortgage}:</strong> ${city.mortgageNote}</p>
              <p class="muted-copy">${data.siteMeta.legalReviewedLabel}</p>
              <a class="link-arrow" href="${city.regulations.sourceUrl}" target="_blank" rel="noreferrer">${copy.source}: ${city.regulations.sourceLabel}</a>
            </article>
          </div>
          <aside class="sidebar-stack">
            <article class="warm-card metric-card">
              <p class="section-kicker">${copy.metrics}</p>
              <div class="fact-grid">
                <div><span>${copy.price}</span><strong>${formatMoney(city.pricePerSqm)}</strong></div>
                <div><span>${copy.roi}</span><strong>${city.roiRange}</strong></div>
                <div><span>${copy.yield}</span><strong>${formatPercent(city.rentalYield)}</strong></div>
                <div><span>${copy.appreciation}</span><strong>${city.appreciationTrend}</strong></div>
              </div>
            </article>
            <article class="warm-card prose-card">
              <p class="section-kicker">${copy.relocation}</p>
              <h3>${copy.relocationTitle}</h3>
              <p><strong>${copy.bestFor}:</strong> ${city.relocationSnapshot.bestFor}</p>
              <p><strong>${copy.climate}:</strong> ${city.climate}</p>
              <p><strong>${copy.pace}:</strong> ${city.pace}</p>
              <p><strong>${copy.comfort}:</strong> ${city.relocationSnapshot.monthlyComfort}</p>
              <p><strong>${copy.airport}:</strong> ${city.relocationSnapshot.airport}</p>
              <p><strong>${copy.english}:</strong> ${city.relocationSnapshot.englishSupport}</p>
            </article>
            <article class="warm-card prose-card">
              <p class="section-kicker">${copy.rentals}</p>
              <h3>${copy.rentalsTitle}</h3>
              <p>${city.rentalMarket?.headline || deriveRentalNarrative(city)}</p>
              <p><strong>${copy.longStay}:</strong> ${city.rentalMarket?.longStayDemand || (state.language === 'es' ? 'Revisa la profundidad del mercado local.' : 'Review tenant depth locally.')}</p>
              <p><strong>${copy.furnished}:</strong> ${city.rentalMarket?.furnishedDemand || (state.language === 'es' ? 'Selectivo por submercado.' : 'Selective by submarket.')}</p>
              <p><strong>${copy.shortStay}:</strong> ${city.rentalMarket?.shortStayReality || (state.language === 'es' ? 'Primero verifica reglas del edificio.' : 'Check building rules first.')}</p>
              <p><strong>${copy.tenantMix}:</strong> ${city.rentalMarket?.tenantMix || (state.language === 'es' ? 'Demanda mixta local y extranjera.' : 'Mixed local and foreign demand.')}</p>
              <p><strong>${copy.landlord}:</strong> ${city.rentalMarket?.landlordWatchouts || (state.language === 'es' ? 'Prueba la operación, la rotación y el mantenimiento.' : 'Stress-test operations, turnover, and maintenance.')}</p>
              <p><strong>${copy.sampleRent}:</strong> ${formatMoney(estimateSampleGrossMonthlyRent(city))}</p>
              <p><strong>${copy.regulationReminder}:</strong> ${city.regulations.airbnbSummary}</p>
            </article>
            <article class="warm-card prose-card">
              <p class="section-kicker">${copy.seller}</p>
              <h3>${copy.sellerTitle}</h3>
              <p>${getSellerSignal(city)}</p>
              <div class="card-actions vertical-actions">
                <a class="btn btn-primary btn-block" href="for-sellers.html">${copy.submitHome}</a>
                <a class="btn btn-secondary btn-block" href="for-agents.html">${copy.findOperators}</a>
              </div>
            </article>
            <article class="warm-card prose-card">
              <p class="section-kicker">${copy.destination}</p>
              <h3>${copy.destinationTitle}</h3>
              <ul class="check-list">
                ${city.destinationHighlights.map((item) => `<li>${item}</li>`).join('')}
              </ul>
            </article>
            <article class="warm-card prose-card">
              <p class="section-kicker">${copy.fieldJournal}</p>
              <h3>${copy.fieldJournalTitle}</h3>
              <div class="social-link-list">
                ${data.siteMeta.socialLinks.map((item) => `
                  <a class="social-row" href="${item.url}" target="_blank" rel="noreferrer">
                    <strong>${item.name}</strong>
                    <span>${item.description}</span>
                  </a>
                `).join('')}
              </div>
            </article>
            <article class="warm-card prose-card">
              <p class="section-kicker">${copy.watchouts}</p>
              <ul class="check-list">
                ${city.watchouts.map((item) => `<li>${item}</li>`).join('')}
              </ul>
            </article>
            <article class="warm-card prose-card">
              <p class="section-kicker">${copy.first30}</p>
              <ul class="check-list">
                ${city.first30DaysGuide.map((item) => `<li>${item}</li>`).join('')}
              </ul>
              <div class="card-actions vertical-actions">
                <a class="btn btn-primary btn-block" href="cost-simulator.html?city=${city.slug}">${copy.modelCity}</a>
                <a class="btn btn-secondary btn-block" href="relocation.html">${copy.compareRelocation}</a>
                <button class="btn btn-secondary btn-block" type="button" data-open-modal="feedback-modal" data-city-slug="${city.slug}">${copy.reportData}</button>
              </div>
            </article>
          </aside>
        </div>
      </section>
    `;
  }

  function matchesExplorerFilter(city, filter) {
    switch (filter) {
      case 'walkable':
        return city.walkability.score >= 7;
      case 'retiree':
        return city.retireeFit.score >= 8;
      case 'coastal':
        return city.explorerTags.includes('coastal');
      case 'value':
        return city.pricePerSqm <= 1700;
      case 'healthcare':
        return city.healthcare.score >= 8;
      case 'low-maintenance':
        return city.explorerTags.includes('low-maintenance') || city.repairReality.label === 'Manageable';
      case 'remote-work':
        return city.explorerTags.includes('remote-work');
      case 'forever-young':
        return city.explorerTags.includes('forever-young');
      default:
        return true;
    }
  }

  function matchesExplorerSearch(city, query) {
    if (!query) return true;
    const haystack = [
      city.name,
      city.region,
      city.shortTagline,
      city.relocationSnapshot.bestFor,
      city.repairReality.label,
      city.walkability.label,
      city.healthcare.label,
      city.retireeFit.label,
      ...(city.explorerTags || []),
      ...(city.explorerTags || []).map((tag) => formatTagLabel(tag))
    ].join(' ').toLowerCase();

    return haystack.includes(query);
  }

  function sortExplorerCities(cities, sortBy) {
    const sorted = [...cities];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.pricePerSqm - b.pricePerSqm);
        break;
      case 'yield-high':
        sorted.sort((a, b) => b.rentalYield - a.rentalYield);
        break;
      case 'walkability':
        sorted.sort((a, b) => b.walkability.score - a.walkability.score);
        break;
      case 'healthcare':
        sorted.sort((a, b) => b.healthcare.score - a.healthcare.score);
        break;
      case 'retirement':
        sorted.sort((a, b) => b.retireeFit.score - a.retireeFit.score);
        break;
      default:
        break;
    }
    return sorted;
  }

  function renderExplorerCompareMarkup(cities) {
    const isEs = state.language === 'es';
    const copy = isEs
      ? {
          noMatches: 'Sin coincidencias',
          tryDifferent: 'Prueba otro filtro u orden',
          noCity: 'Todavía no hay ciudades que cumplan exactamente esta combinación. Cambia filtros o vuelve a todas las ciudades para reabrir la vista completa.',
          walkability: 'Caminabilidad',
          healthcare: 'Salud',
          retireeFit: 'Encaje retiro',
          repairLoad: 'Carga de mantenimiento'
        }
      : {
          noMatches: 'No matches',
          tryDifferent: 'Try a different filter or sort',
          noCity: 'No cities match this exact combination yet. Switch filters or return to all cities to re-open the marketplace view.',
          walkability: 'Walkability',
          healthcare: 'Healthcare',
          retireeFit: 'Retiree fit',
          repairLoad: 'Repair load'
        };

    if (!cities.length) {
      return `
        <article class="warm-card compare-card empty-state-card">
          <p class="section-kicker">${copy.noMatches}</p>
          <h3>${copy.tryDifferent}</h3>
          <p>${copy.noCity}</p>
        </article>
      `;
    }

    return cities.map((city) => `
      <article class="warm-card compare-card">
        <h3>${city.name}</h3>
        <div class="compare-grid">
          <div><span>${copy.walkability}</span><strong>${city.walkability.label}</strong></div>
          <div><span>${copy.healthcare}</span><strong>${city.healthcare.label}</strong></div>
          <div><span>${copy.retireeFit}</span><strong>${city.retireeFit.label}</strong></div>
          <div><span>${copy.repairLoad}</span><strong>${city.repairReality.label}</strong></div>
        </div>
      </article>
    `).join('');
  }

  function initCityExplorer(data) {
    const grid = document.getElementById('explorer-city-grid');
    const compare = document.getElementById('explorer-compare-grid');
    const count = document.getElementById('explorer-count');
    const sortSelect = document.getElementById('explorer-sort');
    const searchInput = document.getElementById('explorer-search');
    const buttons = [...document.querySelectorAll('[data-explorer-filter]')];

    if (!grid || !compare || !sortSelect || !buttons.length) return;

    const isEs = state.language === 'es';
    const copy = isEs
      ? {
          noMatches: 'Sin coincidencias',
          noFit: 'Ninguna ciudad encaja todavía en ese lente',
          adjust: 'Vuelve a todas las ciudades o ajusta filtros para recuperar la comparación completa de Colombia.',
          shown: 'ciudades visibles',
          matches: 'ciudades coinciden con'
        }
      : {
          noMatches: 'No matches',
          noFit: 'No city fits that lens yet',
          adjust: 'Reset to all cities or change your filter to reopen the full Colombia comparison set.',
          shown: 'cities shown',
          matches: 'cities match'
        };

    const params = getParams();
    let activeFilter = params.get('lens') || 'all';
    if (!buttons.some((button) => button.dataset.explorerFilter === activeFilter)) activeFilter = 'all';
    const initialSort = params.get('sort');
    const initialQuery = params.get('q') || '';
    if (initialSort && [...sortSelect.options].some((option) => option.value === initialSort)) {
      sortSelect.value = initialSort;
    }
    if (searchInput) searchInput.value = initialQuery;

    const syncExplorerUrl = (query) => {
      const nextParams = new URLSearchParams(window.location.search);
      if (activeFilter !== 'all') nextParams.set('lens', activeFilter); else nextParams.delete('lens');
      if (sortSelect.value !== 'featured') nextParams.set('sort', sortSelect.value); else nextParams.delete('sort');
      if (query) nextParams.set('q', query); else nextParams.delete('q');
      const queryString = nextParams.toString();
      window.history.replaceState({}, '', `${window.location.pathname}${queryString ? `?${queryString}` : ''}`);
    };

    const render = () => {
      buttons.forEach((button) => button.classList.toggle('is-active', button.dataset.explorerFilter === activeFilter));
      const query = (searchInput?.value || '').trim().toLowerCase();
      const filtered = sortExplorerCities(
        data.cities.filter((city) => matchesExplorerFilter(city, activeFilter) && matchesExplorerSearch(city, query)),
        sortSelect.value
      );
      grid.innerHTML = filtered.length
        ? filtered.map(renderCityCardMarkup).join('')
        : `
          <article class="warm-card compare-card empty-state-card">
            <p class="section-kicker">${copy.noMatches}</p>
            <h3>${copy.noFit}</h3>
            <p>${copy.adjust}</p>
          </article>
        `;
      compare.innerHTML = renderExplorerCompareMarkup(filtered);
      if (count) count.textContent = query ? `${filtered.length} ${copy.matches} "${searchInput.value.trim()}"` : `${filtered.length} ${copy.shown}`;
      syncExplorerUrl(searchInput?.value.trim() || '');
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        activeFilter = button.dataset.explorerFilter || 'all';
        render();
      });
    });

    sortSelect.addEventListener('change', render);
    searchInput?.addEventListener('input', render);
    render();
  }

  function initRelocationPage(data) {
    const topGrid = document.getElementById('relocation-top-grid');
    const compareGrid = document.getElementById('relocation-compare-grid');
    const healthcareList = document.getElementById('healthcare-note-list');
    const legalLabel = document.getElementById('relocation-legal-label');
    const healthcareLabel = document.getElementById('relocation-healthcare-label');

    if (topGrid) {
      const titleCopy = state.language === 'es'
        ? ['Mejor primer aterrizaje', 'Mejor por profundidad de salud', 'Mejor para retiro tranquilo', 'Mejor ajuste costero de larga estancia']
        : ['Best first landing', 'Best for healthcare depth', 'Best for calm retirement', 'Best long-stay coastal fit'];
      const cards = [
        { title: titleCopy[0], city: data.cities.find((item) => item.slug === 'medellin') },
        { title: titleCopy[1], city: data.cities.find((item) => item.slug === 'bogota') },
        { title: titleCopy[2], city: data.cities.find((item) => item.slug === 'pereira') },
        { title: titleCopy[3], city: data.cities.find((item) => item.slug === 'cartagena') }
      ].filter((item) => item.city);

      const walkability = state.language === 'es' ? 'Caminabilidad' : 'Walkability';
      const healthcare = state.language === 'es' ? 'Salud' : 'Healthcare';
      const readPrefix = state.language === 'es' ? 'Leer' : 'Read';

      topGrid.innerHTML = cards.map(({ title, city }) => `
        <article class="warm-card relocation-card">
          <p class="section-kicker">${title}</p>
          <h3>${city.name}</h3>
          <p>${city.relocationSnapshot.bestFor}</p>
          <div class="fact-grid compact-grid">
            <div><span>${walkability}</span><strong>${city.walkability.label}</strong></div>
            <div><span>${healthcare}</span><strong>${city.healthcare.label}</strong></div>
          </div>
          <a class="link-arrow" href="city.html?id=${city.slug}">${readPrefix} ${city.name}</a>
        </article>
      `).join('');
    }

    if (compareGrid) {
      const walkability = state.language === 'es' ? 'Caminabilidad' : 'Walkability';
      const healthcare = state.language === 'es' ? 'Salud' : 'Healthcare';
      const retireeFit = state.language === 'es' ? 'Encaje retiro' : 'Retiree fit';
      const repairReality = state.language === 'es' ? 'Realidad de mantenimiento' : 'Repair reality';
      const openGuide = state.language === 'es' ? 'Abrir guía de ciudad' : 'Open city guide';
      compareGrid.innerHTML = data.cities.map((city) => `
        <article class="warm-card relocation-compare-card">
          <p class="section-kicker">${city.region}</p>
          <h3>${city.name}</h3>
          <p>${city.relocationSnapshot.monthlyComfort}</p>
          <div class="compare-grid">
            <div><span>${walkability}</span><strong>${city.walkability.label}</strong></div>
            <div><span>${healthcare}</span><strong>${city.healthcare.label}</strong></div>
            <div><span>${retireeFit}</span><strong>${city.retireeFit.label}</strong></div>
            <div><span>${repairReality}</span><strong>${city.repairReality.label}</strong></div>
          </div>
          <a class="link-arrow" href="city.html?id=${city.slug}">${openGuide}</a>
        </article>
      `).join('');
    }

    if (healthcareList) {
      healthcareList.innerHTML = data.siteMeta.healthcare.highlights.map((item) => `<li>${item}</li>`).join('');
    }
    if (legalLabel) legalLabel.textContent = data.siteMeta.legalReviewedLabel;
    if (healthcareLabel) healthcareLabel.textContent = data.siteMeta.healthcareReviewedLabel;

    renderResidencyCards(data, 'residency-teaser-grid', 2);
  }

  function initVisaCalculator() {
    const form = document.getElementById('visa-calculator-form');
    const result = document.getElementById('visa-result');
    if (!form || !result) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const wage = state.data.siteMeta.residency.minimumWageCop;
      const feeNote = state.language === 'es'
        ? 'Las tarifas pueden cambiar y variar según el tipo de visa, la nacionalidad y la oficina de trámite. Verifica siempre el tarifario oficial antes de radicar.'
        : state.data.siteMeta.residency.feeNote;
      const investmentAmount = Number(form.investmentAmount.value || 0);
      const monthlyPension = Number(form.monthlyPension.value || 0);
      const eligible = [];
      const isEs = state.language === 'es';

      if (investmentAmount >= wage * 350) eligible.push(isEs ? 'Visa M - Inversionista' : 'Visa M - Investor');
      if (monthlyPension >= wage * 3) eligible.push(isEs ? 'Visa M - Pensionado' : 'Visa M - Pensionado');

      if (eligible.length) {
        result.innerHTML = `
          <strong>${isEs ? 'Encaje ilustrativo:' : 'Illustrative fit:'}</strong> ${eligible.join(isEs ? ' y ' : ' and ')}.<br>
          <span>${feeNote}</span>
        `;
      } else if (investmentAmount > 0 || monthlyPension > 0) {
        result.innerHTML = `
          <strong>${isEs ? 'Encaje ilustrativo:' : 'Illustrative fit:'}</strong> ${isEs ? 'por debajo de los umbrales principales de inversionista o pensionado mostrados aquí.' : 'below the main investor or pensionado thresholds shown here.'}<br>
          <span>${isEs ? 'Eso no cierra la conversación. Revisa la vía de nómada digital y otras categorías con asesoría antes de decidir.' : 'That does not end the conversation. Review the digital nomad and other categories with counsel before making a move.'}</span>
        `;
      } else {
        result.textContent = isEs ? 'Ingresa un monto de inversión positivo, una pensión mensual positiva o ambos.' : 'Enter a positive investment amount, monthly pension amount, or both.';
      }
    });
  }

  function bindGuidePrint() {
    const button = document.getElementById('print-guide');
    if (!button || button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';
    button.addEventListener('click', () => window.print());
  }

  function validateData(data) {
    const requiredFields = [
      'slug', 'name', 'pricePerSqm', 'roiRange', 'rentalYield', 'closingCostPercent',
      'closingCostBreakdown', 'lat', 'lon', 'heroImage', 'introText', 'neighborhoods',
      'regulations', 'foreignOwnership', 'region', 'walkability', 'healthcare', 'retireeFit',
      'repairReality', 'relocationSnapshot', 'destinationHighlights', 'watchouts', 'explorerTags',
      'rentalMarket'
    ];

    return data.cities.every((city) => requiredFields.every((field) => city[field] !== undefined));
  }

  async function init() {
    const page = getCurrentPage();
    const data = await loadData();
    state.data = data;
    state.language = loadLanguagePreference(data);
    updateDocumentLanguage();
    prepareMainContent();
    applyPageMetaTranslations(page);
    const liveFxPages = new Set(['home', 'cities', 'city', 'simulator', 'residency']);
    await loadFxRate(data, liveFxPages.has(page));
    state.currency = data.siteMeta.defaultCurrency || 'USD';

    const localizedData = getLocalizedData(data);

    if (!validateData(localizedData)) console.error('CasaClaro data validation failed.');

    renderHeader(page);
    renderFooter(localizedData);
    renderModals(localizedData);
    applyContentSections();
    bindStaticActions();
    renderFeatures();
    renderFeaturedProfessionals();
    renderHeroShowcase(localizedData);
    renderHomeCityCards(localizedData);
    renderNeighborhoodSpotlights(localizedData);
    renderRetireeSpotlights(localizedData);
    renderPartnerStandards(localizedData);
    renderSocialChannelCards(localizedData);
    renderResidencyCards(localizedData);
    renderFxSnapshot(localizedData);
    renderSellerMarketGrid(localizedData);
    renderRentalsPage(localizedData);
    renderNeighborhoodCopComparison(localizedData);
    renderReviewLabels(localizedData);
    populatePageCitySelects(localizedData);
    initSellerFields();
    initCounters(localizedData);
    handleForms();
    initSimulator(localizedData);
    initMap(localizedData);
    renderCityPage(localizedData);
    initCityExplorer(localizedData);
    initRelocationPage(localizedData);
    initVisaCalculator();
    bindGuidePrint();
    startFxAutoRefresh(localizedData);
    applyStaticTranslations();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  CasaClaroApp.init().catch((error) => {
    console.error(error);
    const root = document.querySelector('main');
    if (root) {
      root.innerHTML = `
        <section class="page-hero compact-hero">
          <div class="container">
            <p class="section-kicker">Error</p>
            <h1>Unable to load CasaClaro</h1>
            <p>Please confirm the local files are being served together and try again.</p>
          </div>
        </section>
      `;
    }
  });
});
