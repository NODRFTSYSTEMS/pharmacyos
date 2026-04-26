window.CASACLARO_CONTENT = {
  meta: {
    home: {
      en: {
        title: 'CasaClaro | Colombia Property, Rentals, Relocation, and Neighborhood Intelligence',
        description: 'Bilingual Colombia property and relocation intelligence for buyers, renters, sellers, brokers, expatriates, retirees, and local families.'
      },
      es: {
        title: 'CasaClaro | Inteligencia inmobiliaria, de arriendos y reubicacion en Colombia',
        description: 'Plataforma bilingue para comparar ciudades, barrios, arriendos, compra, reubicacion y operacion inmobiliaria en Colombia.'
      }
    },
    cities: {
      en: {
        title: 'CasaClaro Cities | Compare Colombia Cities and Neighborhoods',
        description: 'Explore Colombian cities with neighborhood-level pricing, healthcare, rental, repair, and relocation context.'
      },
      es: {
        title: 'CasaClaro Ciudades | Compara ciudades y barrios de Colombia',
        description: 'Explora ciudades colombianas con contexto de barrios, salud, arriendos, reparaciones, reubicacion y precios en COP/m2.'
      }
    },
    rentals: {
      en: {
        title: 'CasaClaro Rentals | Colombia Rental Markets by City and Neighborhood',
        description: 'Review Colombia rental markets across long-stay, furnished, and short-stay demand with neighborhood-specific context.'
      },
      es: {
        title: 'CasaClaro Arriendos | Mercados de arriendo por ciudad y barrio',
        description: 'Revisa arriendos en Colombia por ciudad y barrio, con foco en larga estancia, amoblados, corta estancia y operacion.'
      }
    },
    relocation: {
      en: {
        title: 'CasaClaro Relocation | Compare Colombia Cities for Long-Stay Living',
        description: 'Compare Colombian cities for healthcare, walkability, climate, repair burden, and residency fit before relocating.'
      },
      es: {
        title: 'CasaClaro Reubicacion | Compara ciudades de Colombia para vida de larga estancia',
        description: 'Compara ciudades colombianas por salud, caminabilidad, clima, mantenimiento y residencia antes de reubicarte.'
      }
    },
    simulator: {
      en: {
        title: 'CasaClaro Cost Simulator | Colombia Property and Rental Modeling',
        description: 'Model property acquisition, financing, rent, and FX-sensitive cash flow using CasaClaro city data.'
      },
      es: {
        title: 'CasaClaro Simulador | Modela compra, arriendo y flujo de caja en Colombia',
        description: 'Modela compra, financiacion, arriendo y flujo de caja con el tipo de cambio verificado y la data de ciudades de CasaClaro.'
      }
    },
    map: {
      en: {
        title: 'CasaClaro Map | Colombia City and Market Map',
        description: 'Navigate Colombian markets on a map, then jump into city guides with neighborhood and livability context.'
      },
      es: {
        title: 'CasaClaro Mapa | Mapa de ciudades y mercados en Colombia',
        description: 'Ubica mercados colombianos en el mapa y abre guias de ciudad con contexto de barrios, salud y habitabilidad.'
      }
    },
    guide: {
      en: {
        title: 'CasaClaro Guide | Buying, Renting, and Stabilizing Property in Colombia',
        description: 'Step-by-step guide for researching, buying, renting, closing, and operating property in Colombia.'
      },
      es: {
        title: 'CasaClaro Guia | Comprar, arrendar y estabilizar propiedad en Colombia',
        description: 'Guia paso a paso para investigar, comprar, arrendar, cerrar y operar propiedad en Colombia.'
      }
    },
    residency: {
      en: {
        title: 'CasaClaro Residency | Time-Stamped Colombia Visa Guidance',
        description: 'Current Colombia residency guidance with reviewed visa thresholds, fee notes, and healthcare planning context.'
      },
      es: {
        title: 'CasaClaro Residencia | Guia migratoria de Colombia con fecha de revision',
        description: 'Guia actualizada de residencia en Colombia con umbrales revisados, notas de tarifas y contexto de salud.'
      }
    },
    sellers: {
      en: {
        title: 'CasaClaro For Sellers | Submit Property with Better Market Context',
        description: 'Seller guidance and structured property intake with repair, documentation, and neighborhood context for Colombia.'
      },
      es: {
        title: 'CasaClaro Propietarios | Publica tu inmueble con mejor contexto de mercado',
        description: 'Guia para propietarios y formulario estructurado con contexto de reparaciones, documentos y barrio en Colombia.'
      }
    },
    agents: {
      en: {
        title: 'CasaClaro Partners | Standards for Agents, Brokers, and Local Operators',
        description: 'Partner standards, intake expectations, and application flow for brokers, lawyers, managers, and operators in Colombia.'
      },
      es: {
        title: 'CasaClaro Aliados | Estandares para agentes, brokers y operadores locales',
        description: 'Estandares de aliados, expectativas de atencion y aplicacion para brokers, abogados, administradores y operadores en Colombia.'
      }
    }
  },
  sections: {
    home: {
      '#home-hero .container': {
        en: `
          <div class="home-copy">
            <p class="section-kicker">CasaClaro</p>
            <h1>Read Colombia clearly before you buy, rent, move, or list.</h1>
            <p class="hero-lede">CasaClaro is a bilingual Colombia property platform for buyers, renters, sellers, expatriates, retirees, brokers, and families who need neighborhood truth instead of generic listing copy.</p>
            <p class="home-support">Compare cities, drill into neighborhoods, review rental and sale dynamics, watch the live USD/COP layer, and move from research into practical local action with cleaner context.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="cities.html">Explore Cities</a>
              <a class="btn btn-secondary" href="cities.html#neighborhood-cop-tool">Compare Neighborhoods</a>
              <a class="btn btn-secondary" href="relocation.html">Relocation Guide</a>
            </div>
            <div class="tag-row">
              <span class="tag">Buyers</span>
              <span class="tag">Families</span>
              <span class="tag">Expatriates</span>
              <span class="tag">Renters</span>
              <span class="tag">Retirees</span>
              <span class="tag">Sellers</span>
              <span class="tag">Brokers</span>
            </div>
            <div class="stat-ribbon">
              <article class="mini-stat"><strong class="counter" data-counter-dynamic="cities">0</strong><span>City markets</span></article>
              <article class="mini-stat"><strong class="counter" data-counter-dynamic="neighborhoods">0</strong><span>Neighborhood briefs</span></article>
              <article class="mini-stat"><strong class="counter" data-counter="3">0</strong><span>Visa paths tracked</span></article>
              <article class="mini-stat"><strong class="counter" data-counter="6">0</strong><span>Audience lanes</span></article>
            </div>
            <div class="fx-banner" aria-live="polite">
              <strong id="fx-rate-label">USD/COP loading...</strong>
              <span id="fx-rate-source">Verified FX date loading...</span>
            </div>
          </div>
          <div id="hero-showcase-grid" class="postcard-grid"></div>
        `,
        es: `
          <div class="home-copy">
            <p class="section-kicker">CasaClaro</p>
            <h1>Lee Colombia con claridad antes de comprar, arrendar, mudarte o publicar.</h1>
            <p class="hero-lede">CasaClaro es una plataforma bilingue de propiedad y reubicacion en Colombia para compradores, arrendatarios, propietarios, expatriados, jubilados, brokers y familias que necesitan verdad de barrio, no relleno generico de listado.</p>
            <p class="home-support">Compara ciudades, entra a barrios, revisa dinamicas de compra y arriendo, sigue la capa viva de USD/COP y pasa de la investigacion a una accion local mejor informada.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="cities.html">Explorar ciudades</a>
              <a class="btn btn-secondary" href="cities.html#neighborhood-cop-tool">Comparar barrios</a>
              <a class="btn btn-secondary" href="relocation.html">Guia de reubicacion</a>
            </div>
            <div class="tag-row">
              <span class="tag">Compradores</span>
              <span class="tag">Familias</span>
              <span class="tag">Expatriados</span>
              <span class="tag">Arrendatarios</span>
              <span class="tag">Jubilados</span>
              <span class="tag">Propietarios</span>
              <span class="tag">Brokers</span>
            </div>
            <div class="stat-ribbon">
              <article class="mini-stat"><strong class="counter" data-counter-dynamic="cities">0</strong><span>Mercados de ciudad</span></article>
              <article class="mini-stat"><strong class="counter" data-counter-dynamic="neighborhoods">0</strong><span>Fichas de barrios</span></article>
              <article class="mini-stat"><strong class="counter" data-counter="3">0</strong><span>Rutas migratorias</span></article>
              <article class="mini-stat"><strong class="counter" data-counter="6">0</strong><span>Perfiles de uso</span></article>
            </div>
            <div class="fx-banner" aria-live="polite">
              <strong id="fx-rate-label">Cargando USD/COP...</strong>
              <span id="fx-rate-source">Cargando fecha verificada del tipo de cambio...</span>
            </div>
          </div>
          <div id="hero-showcase-grid" class="postcard-grid"></div>
        `
      },
      '#home-paths .container': {
        en: `
          <p class="section-kicker">Choose Your Path</p>
          <h2>Start from the decision you actually need to make</h2>
          <p class="hero-lede">The platform is organized around real user goals: scouting a city, comparing neighborhoods, renting before buying, listing a property, or finding disciplined local partners.</p>
          <div class="card-grid audience-grid">
            <article class="warm-card journey-card">
              <p class="section-kicker">Investors</p>
              <h3>Underwrite the market before you underwrite the unit</h3>
              <p>Compare price per m2, rental yield, closing costs, repairs, and regulation before any one listing frames the whole opportunity.</p>
              <a class="link-arrow" href="cost-simulator.html">Run the cost simulator</a>
            </article>
            <article class="warm-card journey-card">
              <p class="section-kicker">Relocating Households</p>
              <h3>Choose a city that works after the first week</h3>
              <p>Compare healthcare depth, walkability, climate, repair burden, and residency friction before you decide where daily life should happen.</p>
              <a class="link-arrow" href="relocation.html">Open relocation guide</a>
            </article>
            <article class="warm-card journey-card">
              <p class="section-kicker">Local Buyers & Families</p>
              <h3>Read the market in COP, not just in foreign-buyer shorthand</h3>
              <p>Neighborhood pricing, rental angles, and broker comparisons surface in COP and USD so local households can use the same system with less friction.</p>
              <a class="link-arrow" href="cities.html#neighborhood-cop-tool">Open the local buyer view</a>
            </article>
            <article class="warm-card journey-card">
              <p class="section-kicker">Renters & Landlords</p>
              <h3>Understand rentals at city and neighborhood level</h3>
              <p>Track long-stay, furnished, and short-stay dynamics with neighborhood notes that make more sense than a gross-yield headline by itself.</p>
              <a class="link-arrow" href="rentals.html">Browse rental markets</a>
            </article>
            <article class="warm-card journey-card">
              <p class="section-kicker">Sellers</p>
              <h3>List with cleaner pricing, repair, and documentation context</h3>
              <p>Seller intake captures condition, attachments, timing, and neighborhood signal so the next buyer or broker conversation starts with facts.</p>
              <a class="link-arrow" href="for-sellers.html">Start seller intake</a>
            </article>
            <article class="warm-card journey-card">
              <p class="section-kicker">Brokers & Operators</p>
              <h3>Serious marketplace participation needs standards</h3>
              <p>Review SLA targets, routing expectations, and the local-market context CasaClaro aims to hand off with each lead or seller brief.</p>
              <a class="link-arrow" href="for-agents.html">See partner standards</a>
            </article>
          </div>
        `,
        es: `
          <p class="section-kicker">Elige tu ruta</p>
          <h2>Empieza por la decision que realmente necesitas tomar</h2>
          <p class="hero-lede">La plataforma esta organizada alrededor de objetivos reales: explorar una ciudad, comparar barrios, arrendar antes de comprar, publicar un inmueble o encontrar aliados locales disciplinados.</p>
          <div class="card-grid audience-grid">
            <article class="warm-card journey-card">
              <p class="section-kicker">Inversionistas</p>
              <h3>Lee el mercado antes de leer una unidad aislada</h3>
              <p>Compara precio por m2, renta bruta, costos de cierre, reparaciones y regulacion antes de que un solo aviso te marque toda la historia.</p>
              <a class="link-arrow" href="cost-simulator.html">Abrir simulador</a>
            </article>
            <article class="warm-card journey-card">
              <p class="section-kicker">Hogares en reubicacion</p>
              <h3>Elige una ciudad que funcione despues de la primera semana</h3>
              <p>Compara salud, caminabilidad, clima, carga de mantenimiento y friccion migratoria antes de decidir donde debe pasar la vida diaria.</p>
              <a class="link-arrow" href="relocation.html">Abrir guia de reubicacion</a>
            </article>
            <article class="warm-card journey-card">
              <p class="section-kicker">Compradores locales y familias</p>
              <h3>Lee el mercado en COP, no solo en lenguaje para comprador extranjero</h3>
              <p>Los precios por barrio, los angulos de arriendo y las comparaciones para brokers aparecen en COP y USD para que los hogares locales usen el mismo sistema con menos friccion.</p>
              <a class="link-arrow" href="cities.html#neighborhood-cop-tool">Abrir vista local</a>
            </article>
            <article class="warm-card journey-card">
              <p class="section-kicker">Arrendatarios y propietarios</p>
              <h3>Entiende el arriendo a nivel de ciudad y barrio</h3>
              <p>Sigue la logica de larga estancia, amoblados y corta estancia con notas de barrio que explican mas que un titular de rentabilidad bruta.</p>
              <a class="link-arrow" href="rentals.html">Ver mercados de arriendo</a>
            </article>
            <article class="warm-card journey-card">
              <p class="section-kicker">Propietarios</p>
              <h3>Publica con mejor contexto de precio, reparaciones y documentacion</h3>
              <p>La toma de inventario recoge estado, adjuntos, tiempos y senal de barrio para que la siguiente conversacion con comprador o broker empiece con hechos.</p>
              <a class="link-arrow" href="for-sellers.html">Iniciar toma de inmueble</a>
            </article>
            <article class="warm-card journey-card">
              <p class="section-kicker">Brokers y operadores</p>
              <h3>La participacion seria en marketplace necesita estandares</h3>
              <p>Revisa metas de SLA, expectativas de respuesta y el contexto local que CasaClaro busca entregar con cada lead o ficha de propietario.</p>
              <a class="link-arrow" href="for-agents.html">Ver estandares de aliados</a>
            </article>
          </div>
        `
      },
      '#home-local-lens .container': {
        en: `
          <article class="panel-card">
            <p class="section-kicker">Local Buyer Lens</p>
            <h2>COP-first, neighborhood-first, time-stamped</h2>
            <p class="hero-lede">The same verified FX layer used in the simulator also feeds the neighborhood comparison tools, city cards, and buyer-facing COP views across the platform.</p>
            <ul class="check-list">
              <li>The live USD/COP snapshot shown above feeds displayed conversions across the platform.</li>
              <li>Neighborhoods can be compared directly in COP/m2 instead of only at broad city-average level.</li>
              <li>Rentals, resale logic, and repair burdens stay visible for locals, brokers, and cross-border buyers alike.</li>
            </ul>
            <div class="hero-actions">
              <a class="btn btn-primary" href="cities.html#neighborhood-cop-tool">Compare Neighborhoods</a>
              <a class="btn btn-secondary" href="cost-simulator.html">Model the Numbers</a>
            </div>
          </article>
          <article class="panel-card">
            <p class="section-kicker">Neighborhood Tool</p>
            <h2>Benchmark districts against the city average</h2>
            <p class="hero-lede">Use the city explorer's local-buyer module to sort neighborhoods by COP/m2, filter by city, and see whether a district trades above or below the broader market average.</p>
            <ul class="check-list">
              <li>Designed for local buyers, brokers, and families comparing shortlists in COP.</li>
              <li>Uses the active USD/COP rate with a verified timestamp note.</li>
              <li>Pairs pricing with neighborhood fit instead of leaving price isolated.</li>
            </ul>
            <div class="hero-actions">
              <a class="btn btn-primary" href="cities.html#neighborhood-cop-tool">Open the Tool</a>
              <a class="btn btn-secondary" href="cities.html">Explore Markets</a>
            </div>
          </article>
        `,
        es: `
          <article class="panel-card">
            <p class="section-kicker">Lente comprador local</p>
            <h2>COP primero, barrio primero, con fecha de verificacion</h2>
            <p class="hero-lede">La misma capa de FX verificado que usa el simulador alimenta tambien la comparacion de barrios, las tarjetas de ciudades y las vistas en COP para compradores locales.</p>
            <ul class="check-list">
              <li>El snapshot vivo de USD/COP que ves arriba alimenta las conversiones visibles del sitio.</li>
              <li>Los barrios se pueden comparar directo en COP/m2, no solo con promedios amplios de ciudad.</li>
              <li>Arriendos, reventa y carga de mantenimiento siguen visibles para locales, brokers y compradores internacionales.</li>
            </ul>
            <div class="hero-actions">
              <a class="btn btn-primary" href="cities.html#neighborhood-cop-tool">Comparar barrios</a>
              <a class="btn btn-secondary" href="cost-simulator.html">Modelar numeros</a>
            </div>
          </article>
          <article class="panel-card">
            <p class="section-kicker">Herramienta de barrios</p>
            <h2>Compara sectores contra el promedio de su ciudad</h2>
            <p class="hero-lede">Usa el modulo local del explorador para ordenar barrios por COP/m2, filtrar por ciudad y ver si un sector cotiza por encima o por debajo del promedio general del mercado.</p>
            <ul class="check-list">
              <li>Disenado para compradores locales, brokers y familias que trabajan sus listas cortas en COP.</li>
              <li>Usa el USD/COP activo con nota de hora y fecha verificadas.</li>
              <li>Une precio con encaje de barrio para que el valor no quede aislado.</li>
            </ul>
            <div class="hero-actions">
              <a class="btn btn-primary" href="cities.html#neighborhood-cop-tool">Abrir herramienta</a>
              <a class="btn btn-secondary" href="cities.html">Explorar mercados</a>
            </div>
          </article>
        `
      },
      '#home-city-briefs .container': {
        en: `
          <p class="section-kicker">City Briefs</p>
          <h2>City-by-city market and lifestyle guides</h2>
          <p class="hero-lede">These cards give investors, local buyers, renters, and relocating families one clean starting board before they drop into neighborhoods.</p>
          <div id="city-card-grid"></div>
        `,
        es: `
          <p class="section-kicker">Fichas de ciudad</p>
          <h2>Guias de mercado y estilo de vida ciudad por ciudad</h2>
          <p class="hero-lede">Estas tarjetas le dan a inversionistas, compradores locales, arrendatarios y familias en reubicacion una base clara antes de bajar al nivel de barrio.</p>
          <div id="city-card-grid"></div>
        `
      },
      '#home-neighborhoods .container': {
        en: `
          <div>
            <p class="section-kicker">Neighborhoods & Rentals</p>
            <h2>Because the decision changes block by block</h2>
            <p class="hero-lede">Neighborhoods are their own decision layer for locals, renters, retirees, landlords, and cross-border buyers who need more than a city headline.</p>
            <p>Use the neighborhood spotlights to understand character, tenant fit, and pricing bands, then open the rentals view for long-stay, furnished, and short-stay context.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="rentals.html">See Rental Markets</a>
              <a class="btn btn-secondary" href="cities.html">Open Full Comparison</a>
            </div>
          </div>
          <div id="neighborhood-spotlight-grid"></div>
        `,
        es: `
          <div>
            <p class="section-kicker">Barrios y arriendos</p>
            <h2>Porque la decision cambia cuadra por cuadra</h2>
            <p class="hero-lede">Los barrios son su propia capa de decision para locales, arrendatarios, jubilados, propietarios y compradores internacionales que necesitan mas que un titular de ciudad.</p>
            <p>Usa los destacados de barrios para entender caracter, perfil de inquilino y bandas de precio, y luego abre la vista de arriendos para contexto de larga estancia, amoblados y corta estancia.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="rentals.html">Ver arriendos</a>
              <a class="btn btn-secondary" href="cities.html">Abrir comparacion completa</a>
            </div>
          </div>
          <div id="neighborhood-spotlight-grid"></div>
        `
      },
      '#home-practical .container': {
        en: `
          <p class="section-kicker">Practical Checks</p>
          <h2>The questions people actually ask first</h2>
          <div class="card-grid audience-mini-grid">
            <article class="warm-card feature-card"><h3>Is it walkable?</h3><p>Every city guide carries a walkability view so daily life is not inferred from listing photos alone.</p></article>
            <article class="warm-card feature-card"><h3>How is healthcare?</h3><p>Private-care depth, retiree practicality, and long-stay healthcare context sit across relocation, residency, and city pages.</p></article>
            <article class="warm-card feature-card"><h3>What are the repair realities?</h3><p>Coastal wear, older-building systems, humidity, and maintenance burden show up as part of the underwriting story.</p></article>
            <article class="warm-card feature-card"><h3>What about visas and rules?</h3><p>Residency and regulatory notes reference official Colombian sources and carry a review date.</p></article>
          </div>
        `,
        es: `
          <p class="section-kicker">Chequeos practicos</p>
          <h2>Las preguntas que la gente hace primero</h2>
          <div class="card-grid audience-mini-grid">
            <article class="warm-card feature-card"><h3>¿Se puede caminar?</h3><p>Cada guia de ciudad trae una lectura de caminabilidad para que la vida diaria no se deduzca solo por fotos de listado.</p></article>
            <article class="warm-card feature-card"><h3>¿Como esta la salud?</h3><p>La profundidad de salud privada, la logica para retiro y el contexto medico de larga estancia aparecen en reubicacion, residencia y ciudad.</p></article>
            <article class="warm-card feature-card"><h3>¿Que pasa con las reparaciones?</h3><p>Desgaste costero, sistemas de edificios antiguos, humedad y carga de mantenimiento aparecen como parte del caso de compra.</p></article>
            <article class="warm-card feature-card"><h3>¿Y las visas o reglas?</h3><p>Las notas migratorias y regulatorias llevan fecha de revision y apuntan a fuentes oficiales colombianas vigentes.</p></article>
          </div>
        `
      },
      '#home-relocation .container': {
        en: `
          <p class="section-kicker">Relocation & Long Stay</p>
          <h2>Retirement, relocation, and everyday livability stay visible</h2>
          <p class="hero-lede">The relocation lens stays close to healthcare, calmer routines, and neighborhood fit so retirees and long-stay movers are not forced into investor-only framing.</p>
          <div id="retiree-city-grid"></div>
        `,
        es: `
          <p class="section-kicker">Reubicacion y larga estancia</p>
          <h2>Retiro, reubicacion y vida diaria permanecen visibles</h2>
          <p class="hero-lede">La lente de reubicacion se mantiene cerca de la salud, las rutinas mas tranquilas y el encaje de barrio para que jubilados y personas de larga estancia no queden atrapados en un discurso solo para inversionistas.</p>
          <div id="retiree-city-grid"></div>
        `
      },
      '#home-marketplace .container': {
        en: `
          <article class="panel-card">
            <p class="section-kicker">For Sellers</p>
            <h2>Bring pricing, repairs, and timing into the first conversation</h2>
            <p>Owners can submit homes with pricing, repair notes, neighborhood context, attachments, and timing data so buyer matching starts with cleaner information.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="for-sellers.html">Seller Information</a>
              <button class="btn btn-secondary" type="button" data-open-modal="seller-modal">Submit a Home</button>
            </div>
          </article>
          <article class="panel-card">
            <p class="section-kicker">For Agents & Brokers</p>
            <h2>Marketplace participation is tied to service standards</h2>
            <p>Agent, broker, legal, contractor, and property-management workflows sit behind clearer response expectations and cleaner intake context.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="for-agents.html">Partner Program</a>
              <button class="btn btn-secondary" type="button" data-open-modal="agent-modal">Apply as Partner</button>
            </div>
          </article>
        `,
        es: `
          <article class="panel-card">
            <p class="section-kicker">Para propietarios</p>
            <h2>Lleva precio, reparaciones y tiempos a la primera conversacion</h2>
            <p>Los propietarios pueden publicar inmuebles con precio, notas de reparacion, contexto de barrio, adjuntos y tiempos para que el cruce con compradores empiece con mejor informacion.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="for-sellers.html">Informacion para propietarios</a>
              <button class="btn btn-secondary" type="button" data-open-modal="seller-modal">Publicar inmueble</button>
            </div>
          </article>
          <article class="panel-card">
            <p class="section-kicker">Para agentes y brokers</p>
            <h2>La participacion en el marketplace se mide con estandares de servicio</h2>
            <p>Los flujos de agentes, brokers, abogados, contratistas y administracion de propiedad quedan detras de expectativas de respuesta mas claras y tomas de contexto mas limpias.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="for-agents.html">Programa de aliados</a>
              <button class="btn btn-secondary" type="button" data-open-modal="agent-modal">Aplicar como aliado</button>
            </div>
          </article>
        `
      },
      '#home-listings .container': {
        en: `
          <div class="listings-track-label">
            <div>
              <p class="section-kicker">Current Inventory</p>
              <h2>Structured listings, not generic lead bait</h2>
              <p class="hero-lede">CasaClaro shows active sale listings, recently sold comps, and vetted rental inventory in one consistent card system with cleaner context on condition, neighborhood fit, and pricing.</p>
            </div>
            <div class="listings-tab-row" aria-label="Listing categories">
              <span class="listings-tab is-active">Available</span>
              <span class="listings-tab">Recently Sold</span>
              <span class="listings-tab">Vetted Rentals</span>
            </div>
          </div>
          <div class="listing-grid">
            <article class="listing-card">
              <img class="listing-thumb" src="assets/cities/medellin.svg" alt="Illustration of Medellin listing" loading="lazy">
              <div class="listing-body">
                <div class="listing-meta"><span class="listing-badge available">Available</span><span class="listing-badge new">New</span></div>
                <div class="listing-price">USD 242,000</div>
                <p class="listing-addr">Laureles, Medellin</p>
                <div class="listing-specs"><span class="listing-spec-item">2 bed</span><span class="listing-spec-item">2 bath</span><span class="listing-spec-item">84 m2</span></div>
                <p>Mid-rise apartment with walkable daily loop, updated kitchen, and building reserve notes already gathered.</p>
                <a class="listing-action" href="for-sellers.html">View intake standard</a>
              </div>
            </article>
            <article class="listing-card">
              <img class="listing-thumb" src="assets/cities/bogota.svg" alt="Illustration of Bogota listing" loading="lazy">
              <div class="listing-body">
                <div class="listing-meta"><span class="listing-badge available">Available</span></div>
                <div class="listing-price">COP 1.480B</div>
                <p class="listing-addr">Chico Reservado, Bogota</p>
                <div class="listing-specs"><span class="listing-spec-item">3 bed</span><span class="listing-spec-item">3 bath</span><span class="listing-spec-item">146 m2</span></div>
                <p>Family-oriented unit with school access, porter building, and documented HOA reserve position.</p>
                <a class="listing-action" href="cities.html">Compare the neighborhood</a>
              </div>
            </article>
            <article class="listing-card">
              <img class="listing-thumb" src="assets/cities/cartagena.svg" alt="Illustration of Cartagena sold listing" loading="lazy">
              <div class="listing-body">
                <div class="listing-meta"><span class="listing-badge sold">Sold</span></div>
                <div class="listing-price">USD 318,000 closed</div>
                <p class="listing-addr">Cabrero, Cartagena</p>
                <div class="listing-specs"><span class="listing-spec-item">2 bed</span><span class="listing-spec-item">2 bath</span><span class="listing-spec-item">91 m2</span></div>
                <p>Recently closed coastal apartment used as a pricing anchor with repair, humidity, and HOA context.</p>
                <a class="listing-action" href="cost-simulator.html">Model a similar deal</a>
              </div>
            </article>
            <article class="listing-card">
              <img class="listing-thumb" src="assets/cities/pereira.svg" alt="Illustration of Pereira sold listing" loading="lazy">
              <div class="listing-body">
                <div class="listing-meta"><span class="listing-badge sold">Sold</span></div>
                <div class="listing-price">COP 690M closed</div>
                <p class="listing-addr">Pinares, Pereira</p>
                <div class="listing-specs"><span class="listing-spec-item">3 bed</span><span class="listing-spec-item">2 bath</span><span class="listing-spec-item">118 m2</span></div>
                <p>End-user comp with parking, lower maintenance burden, and strong local-buyer fit for comparison.</p>
                <a class="listing-action" href="cities.html">See city-level pricing</a>
              </div>
            </article>
            <article class="listing-card">
              <img class="listing-thumb" src="assets/cities/santa-marta.svg" alt="Illustration of Santa Marta rental listing" loading="lazy">
              <div class="listing-body">
                <div class="listing-meta"><span class="listing-badge rental">Rental</span><span class="listing-badge new">Vetted</span></div>
                <div class="listing-price">USD 1,150 / month</div>
                <p class="listing-addr">Bello Horizonte, Santa Marta</p>
                <div class="listing-specs"><span class="listing-spec-item">1 bed</span><span class="listing-spec-item">Furnished</span><span class="listing-spec-item">Beach access</span></div>
                <p>Screened long-stay rental with building rules, internet reliability, and climate notes summarized up front.</p>
                <a class="listing-action" href="rentals.html">Browse rental markets</a>
              </div>
            </article>
            <article class="listing-card">
              <img class="listing-thumb" src="assets/cities/cali.svg" alt="Illustration of Cali rental listing" loading="lazy">
              <div class="listing-body">
                <div class="listing-meta"><span class="listing-badge rental">Rental</span></div>
                <div class="listing-price">COP 3.9M / month</div>
                <p class="listing-addr">Granada, Cali</p>
                <div class="listing-specs"><span class="listing-spec-item">2 bed</span><span class="listing-spec-item">Pet-friendly</span><span class="listing-spec-item">94 m2</span></div>
                <p>Vetted urban rental with calmer street profile, grocery access, and practical fit for longer stays.</p>
                <a class="listing-action" href="rentals.html">See rental context</a>
              </div>
            </article>
          </div>
          <div class="submit-listing-cta">
            <h3>Seller and rental intake will use the same structure</h3>
            <p>Condition, documentation, pricing logic, and neighborhood signal should appear before a buyer or tenant inquiry starts.</p>
            <a class="btn btn-primary" href="for-sellers.html">Submit inventory details</a>
          </div>
        `,
        es: `
          <div class="listings-track-label">
            <div>
              <p class="section-kicker">Inventario actual</p>
              <h2>Listados estructurados, no anuncios genericos</h2>
              <p class="hero-lede">CasaClaro muestra inmuebles en venta activos, comparables vendidos recientemente y arriendos verificados dentro de un mismo sistema de fichas con mejor contexto de estado, encaje barrial y precio.</p>
            </div>
            <div class="listings-tab-row" aria-label="Categorias de listados">
              <span class="listings-tab is-active">Disponibles</span>
              <span class="listings-tab">Vendidos</span>
              <span class="listings-tab">Arriendos verificados</span>
            </div>
          </div>
          <div class="listing-grid">
            <article class="listing-card">
              <img class="listing-thumb" src="assets/cities/medellin.svg" alt="Ilustracion de inmueble en Medellin" loading="lazy">
              <div class="listing-body">
                <div class="listing-meta"><span class="listing-badge available">Disponible</span><span class="listing-badge new">Nuevo</span></div>
                <div class="listing-price">USD 242,000</div>
                <p class="listing-addr">Laureles, Medellin</p>
                <div class="listing-specs"><span class="listing-spec-item">2 hab</span><span class="listing-spec-item">2 banos</span><span class="listing-spec-item">84 m2</span></div>
                <p>Apartamento en edificio medio con circuito caminable diario, cocina renovada y reservas del edificio ya resumidas.</p>
                <a class="listing-action" href="for-sellers.html">Ver estandar de carga</a>
              </div>
            </article>
            <article class="listing-card">
              <img class="listing-thumb" src="assets/cities/bogota.svg" alt="Ilustracion de inmueble en Bogota" loading="lazy">
              <div class="listing-body">
                <div class="listing-meta"><span class="listing-badge available">Disponible</span></div>
                <div class="listing-price">COP 1.480B</div>
                <p class="listing-addr">Chico Reservado, Bogota</p>
                <div class="listing-specs"><span class="listing-spec-item">3 hab</span><span class="listing-spec-item">3 banos</span><span class="listing-spec-item">146 m2</span></div>
                <p>Unidad familiar con acceso a colegios, porteria y posicion de reservas de la copropiedad ya documentada.</p>
                <a class="listing-action" href="cities.html">Comparar el barrio</a>
              </div>
            </article>
            <article class="listing-card">
              <img class="listing-thumb" src="assets/cities/cartagena.svg" alt="Ilustracion de inmueble vendido en Cartagena" loading="lazy">
              <div class="listing-body">
                <div class="listing-meta"><span class="listing-badge sold">Vendido</span></div>
                <div class="listing-price">USD 318,000 cierre</div>
                <p class="listing-addr">Cabrero, Cartagena</p>
                <div class="listing-specs"><span class="listing-spec-item">2 hab</span><span class="listing-spec-item">2 banos</span><span class="listing-spec-item">91 m2</span></div>
                <p>Apartamento costero ya cerrado usado como ancla de precio con contexto de humedad, reparaciones y administracion.</p>
                <a class="listing-action" href="cost-simulator.html">Modelar una operacion similar</a>
              </div>
            </article>
            <article class="listing-card">
              <img class="listing-thumb" src="assets/cities/pereira.svg" alt="Ilustracion de inmueble vendido en Pereira" loading="lazy">
              <div class="listing-body">
                <div class="listing-meta"><span class="listing-badge sold">Vendido</span></div>
                <div class="listing-price">COP 690M cierre</div>
                <p class="listing-addr">Pinares, Pereira</p>
                <div class="listing-specs"><span class="listing-spec-item">3 hab</span><span class="listing-spec-item">2 banos</span><span class="listing-spec-item">118 m2</span></div>
                <p>Comparable de usuario final con parqueadero, menor carga de mantenimiento y buen encaje para comprador local.</p>
                <a class="listing-action" href="cities.html">Ver precios por ciudad</a>
              </div>
            </article>
            <article class="listing-card">
              <img class="listing-thumb" src="assets/cities/santa-marta.svg" alt="Ilustracion de arriendo en Santa Marta" loading="lazy">
              <div class="listing-body">
                <div class="listing-meta"><span class="listing-badge rental">Arriendo</span><span class="listing-badge new">Verificado</span></div>
                <div class="listing-price">USD 1,150 / mes</div>
                <p class="listing-addr">Bello Horizonte, Santa Marta</p>
                <div class="listing-specs"><span class="listing-spec-item">1 hab</span><span class="listing-spec-item">Amoblado</span><span class="listing-spec-item">Acceso playa</span></div>
                <p>Arriendo de larga estancia filtrado con reglas del edificio, estabilidad de internet y notas de clima resumidas desde el inicio.</p>
                <a class="listing-action" href="rentals.html">Ver mercados de arriendo</a>
              </div>
            </article>
            <article class="listing-card">
              <img class="listing-thumb" src="assets/cities/cali.svg" alt="Ilustracion de arriendo en Cali" loading="lazy">
              <div class="listing-body">
                <div class="listing-meta"><span class="listing-badge rental">Arriendo</span></div>
                <div class="listing-price">COP 3.9M / mes</div>
                <p class="listing-addr">Granada, Cali</p>
                <div class="listing-specs"><span class="listing-spec-item">2 hab</span><span class="listing-spec-item">Pet-friendly</span><span class="listing-spec-item">94 m2</span></div>
                <p>Arriendo urbano verificado con calle mas calmada, acceso a mercado y encaje practico para estancias mas largas.</p>
                <a class="listing-action" href="rentals.html">Ver contexto de arriendo</a>
              </div>
            </article>
          </div>
          <div class="submit-listing-cta">
            <h3>La carga de venta y arriendo seguira la misma estructura</h3>
            <p>Estado, documentos, logica de precio y contexto de barrio deben aparecer antes de cualquier consulta.</p>
            <a class="btn btn-primary" href="for-sellers.html">Enviar detalles del inmueble</a>
          </div>
        `
      },
      '#home-standards .container': {
        en: `
          <p class="section-kicker">Partner Standards / SLA</p>
          <h2>Qualified leads need response standards, not vague promises</h2>
          <div data-partner-standards></div>
        `,
        es: `
          <p class="section-kicker">Estandares de aliados / SLA</p>
          <h2>Los leads calificados necesitan tiempos de respuesta, no promesas vagas</h2>
          <div data-partner-standards></div>
        `
      },
      '#home-updates .container': {
        en: `
          <div>
            <p class="section-kicker">Market Updates</p>
            <h2>Stay current on FX, legal reviews, and market shifts</h2>
            <p>Join the update list for reviewed changes in city data, residency guidance, and the exchange-rate layer used across the platform.</p>
          </div>
          <form data-form-type="updates">
            <label>Name<input type="text" name="name" autocomplete="name" required></label>
            <label>Email<input type="email" name="email" autocomplete="email" spellcheck="false" inputmode="email" required></label>
            <button class="btn btn-primary" type="submit">Notify Me</button>
            <p class="form-feedback" aria-live="polite"></p>
          </form>
        `,
        es: `
          <div>
            <p class="section-kicker">Actualizaciones de mercado</p>
            <h2>Sigue FX, revisiones legales y cambios de mercado</h2>
            <p>Unete a la lista de actualizacion para cambios revisados en data de ciudades, residencia y la capa de tipo de cambio usada en toda la plataforma.</p>
          </div>
          <form data-form-type="updates">
            <label>Nombre<input type="text" name="name" autocomplete="name" required></label>
            <label>Correo<input type="email" name="email" autocomplete="email" spellcheck="false" inputmode="email" required></label>
            <button class="btn btn-primary" type="submit">Quiero actualizaciones</button>
            <p class="form-feedback" aria-live="polite"></p>
          </form>
        `
      }
    }
  },
  siteOverridesEs: {
    socialLinks: {
      Instagram: {
        description: 'Caminatas de barrio, recorridos de ciudad y senales reales del dia a dia.'
      },
      TikTok: {
        description: 'Comparativos rapidos, mitos del mercado y lecturas practicas de barrios.'
      },
      YouTube: {
        description: 'Guias largas de reubicacion, ciudad, reparaciones y operacion inmobiliaria.'
      }
    },
    partnerStandards: [
      {
        metric: 'Revision de consulta inversionista',
        target: 'En 1 dia habil',
        detail: 'CasaClaro revisa ciudad, presupuesto, supuestos de credito y tiempos antes de enrutar.'
      },
      {
        metric: 'Acuse de recibo al propietario',
        target: 'En 1 dia habil',
        detail: 'El propietario recibe una primera lectura de encaje, pasos siguientes y vacios documentales.'
      },
      {
        metric: 'Primera respuesta del aliado',
        target: 'En 24 horas habiles del handoff',
        detail: 'Agentes y brokers deben confirmar recepcion y explicar la accion inmediata con claridad.'
      },
      {
        metric: 'Actualizacion de estado',
        target: 'En 48 horas habiles',
        detail: 'El aliado reporta si el lead avanza, pausa o necesita otro tipo de ruta.'
      }
    ],
    residency: {
      lastReviewed: '29 de marzo de 2026',
      officialPagesUpdated: '18 de marzo de 2026',
      minimumWageReference: 'Referencia de salario minimo 2026 usada: COP 1,750,905 segun el Decreto 159 del 19 de febrero de 2026.',
      feeCheckerLabel: 'Verificador oficial de tarifas de visa',
      feeNote: 'Las tarifas pueden cambiar y variar por tipo de visa, nacionalidad y oficina. Revisa siempre el verificador oficial antes de radicar.',
      cards: {
        investor: {
          subhead: 'Ruta oficial vigente para inversion extranjera calificada.',
          thresholdLabel: '350 salarios minimos mensuales legales vigentes',
          thresholdCop: 'COP 612,816,750 de referencia con el salario minimo 2026',
          thresholdUsd: 'Aprox. USD 155,100 usando el FX verificado por CasaClaro',
          summary: 'Se usa para inversion extranjera directa mantenida en propiedad raiz u otros canales aprobados, con fondos debidamente registrados por el sistema financiero.',
          mustKnow: [
            'La pagina oficial de Cancilleria fue revisada el 29 de marzo de 2026 y su ultima actualizacion reportada fue el 18 de marzo de 2026.',
            'Exige prueba de que la inversion calificada ya fue realizada y se mantiene vigente.',
            'Exige una poliza de salud que cubra riesgos en Colombia.',
            'No omitas el registro de inversion extranjera si la estrategia migratoria depende de esta ruta.'
          ],
          sourceLabel: 'Cancilleria - Visa M Inversionista'
        },
        pensionado: {
          subhead: 'Ruta oficial vigente para solicitantes con pension demostrable.',
          thresholdLabel: 'Pension mensual de al menos 3 salarios minimos',
          thresholdCop: 'COP 5,252,715 al mes con el salario minimo 2026',
          thresholdUsd: 'Aprox. USD 1,330 al mes usando el FX verificado por CasaClaro',
          summary: 'Pensada para jubilados que pueden demostrar ingresos pensionales de una fuente publica o privada reconocida y buscan una estancia larga en Colombia.',
          mustKnow: [
            'La pagina oficial de Cancilleria fue revisada el 29 de marzo de 2026 y su ultima actualizacion reportada fue el 18 de marzo de 2026.',
            'Exige certificado de pension que demuestre el pago recurrente.',
            'Exige una poliza de salud que cubra riesgos en Colombia.',
            'La pagina oficial indica que esta categoria no concede por si sola afiliacion al sistema colombiano de salud salvo donde existan acuerdos bilaterales o multilaterales.'
          ],
          sourceLabel: 'Cancilleria - Visa M Pensionado'
        },
        'digital-nomad': {
          subhead: 'Util para remotos que aun no compran a escala de visa inversionista.',
          thresholdLabel: 'Enfoque por ingresos, no por inversion inmobiliaria',
          thresholdCop: 'Revisa requisitos oficiales: esta ruta depende de tipo de documentos e ingresos, no de un umbral inmobiliario.',
          thresholdUsd: 'N/A',
          summary: 'Sirve para trabajadores remotos que quieren probar Colombia antes de comprar, especialmente si comparan Medellin, Pereira, Bucaramanga o la costa.',
          mustKnow: [
            'La pagina oficial fue revisada el 29 de marzo de 2026.',
            'Conviene verla como ruta de transicion, no como sustituto de una debida diligencia de compra.',
            'La decision final sigue requiriendo documentos limpios y cobertura privada de salud.'
          ],
          sourceLabel: 'Cancilleria - Visa V Nomada Digital'
        }
      }
    }
  },
  cityOverridesEs: {
    medellin: {
      tagline: 'Primavera urbana con lectura fina por barrios',
      shortTagline: 'Clima templado, demanda internacional y submercados que cambian mucho entre una loma y otra.',
      historicalContext: 'Medellin paso de capital industrial a referencia regional de transformacion urbana. Hoy combina metro, servicios de salud, corredores de oficinas y barrios con comportamientos inmobiliarios muy distintos entre si.',
      investorAppeal: 'Atrae por profundidad en arriendos de larga estancia, demanda amoblada selectiva y un mercado donde el precio por m2 por barrio importa mas que el promedio de ciudad.',
      lifestyleHighlights: 'La gente se queda por clima, conectividad, vida social, acceso a salud y una rutina urbana que puede ser muy eficiente si el barrio encaja.',
      introText: [
        'Medellin no se compra bien con un promedio de ciudad. Se compra bien leyendo microzonas, reglamentos de edificio y calidad real de operacion.',
        'La diferencia entre un activo liquido y uno sobreprometido suele estar en el edificio, la pendiente, la caminabilidad efectiva y la disciplina de administracion.',
        'Para locales, extranjeros y brokers, el punto fuerte es combinar precio por m2, vida diaria y demanda de arriendo sin romantizar un solo barrio.'
      ],
      destinationHighlights: [
        'Clima estable y vida urbana con buena mezcla de servicios.',
        'Red de metro y nodos caminables que mejoran la rutina diaria.',
        'Oferta amplia de barrios para vida ejecutiva, familiar y de retiro activo.'
      ],
      watchouts: [
        'No extrapoles El Poblado a toda la ciudad.',
        'Verifica reglamento de propiedad horizontal antes de modelar corta estancia.',
        'La topografia cambia mucho la experiencia real de movilidad y caminabilidad.'
      ],
      first30DaysGuide: [
        'Camina el barrio objetivo en horas pico, tarde y noche.',
        'Revisa reservas, administracion y estado de zonas comunes del edificio.',
        'Alinea compra, cuenta bancaria, registro de inversion y estrategia tributaria antes del cierre.'
      ],
      relocationSnapshot: {
        bestFor: 'Personas que quieren ciudad viva, buena salud privada y barrios con servicios a mano.',
        monthlyComfort: 'Fuerte para presupuestos medios y altos, con bastante diferencia entre Laureles, El Poblado, Envigado y Sabaneta.',
        airport: 'Aeropuerto internacional bien conectado, con tiempos variables segun trafico y peajes.',
        englishSupport: 'Mejor que en la mayoria de ciudades colombianas, sobre todo en salud privada, brokers y corredores de expats.'
      },
      rentalMarket: {
        headline: 'El arriendo en Medellin se entiende mejor por barrio, reglamento de edificio y perfil de inquilino que por un titular de rentabilidad.',
        longStayDemand: 'Muy solido en Laureles, Envigado y zonas selectas de El Poblado para profesionales, retornados y hogares de larga estancia.',
        furnishedDemand: 'Existe una capa amoblada profunda, pero el desempeno cambia mucho entre edificios premium y producto estandar.',
        shortStayReality: 'Solo tiene sentido cuando el edificio lo permite y la operacion esta bien resuelta.',
        tenantMix: 'Mezcla de inquilino local, ejecutivo, remoto y extranjero de larga estancia.',
        landlordWatchouts: 'Mide administracion, rotacion, licencias internas del edificio y costos de mantenimiento antes de pagar prima.'
      },
      neighborhoods: {
        'El Poblado': {
          character: 'Torres premium, vida nocturna y demanda amoblada de ticket alto.',
          bestFor: 'Ejecutivos, segunda vivienda y reventas con marketing internacional.',
          rentalProfile: 'Funciona por demanda amoblada premium, pero la corta estancia se revisa edificio por edificio.'
        },
        Laureles: {
          character: 'Calles caminables, arboles, vida local y buen balance entre servicios y rutina.',
          bestFor: 'Larga estancia, trabajo remoto y hogares que valoran caminar.',
          rentalProfile: 'Uno de los submercados amoblados y de larga estancia mas limpios de Medellin.'
        },
        Envigado: {
          character: 'Perfil familiar, ordenado y mas tranquilo, con buen acceso a servicios.',
          bestFor: 'Familias, retiro activo y compradores que priorizan vida diaria calmada.',
          rentalProfile: 'La logica principal es larga estancia familiar o profesional, no turismo.'
        },
        Sabaneta: {
          character: 'Entrada de valor al sur con metro cercano y demanda local constante.',
          bestFor: 'Compradores sensibles a precio y arrendatarios de larga estancia.',
          rentalProfile: 'Mejor como corredor de arriendo estable y precio mas contenido que como apuesta de lujo.'
        }
      }
    },
    bogota: {
      tagline: 'Escala capital con demanda institucional y barrios muy segmentados',
      shortTagline: 'Profundidad corporativa, salud privada fuerte y barrios que exigen lectura fina de movilidad y producto.',
      historicalContext: 'Bogota concentra oficinas, universidades, salud privada, diplomacia y demanda corporativa. Eso crea submercados con liquidez alta, pero tambien una dispersion fuerte por barrio y producto.',
      investorAppeal: 'Importa por estabilidad de demanda ejecutiva, profundidad de mercado y corredores donde la disciplina de precio y el arriendo largo pesan mas que la moda.',
      lifestyleHighlights: 'Funciona para hogares que priorizan colegios, servicios, salud, oferta cultural y una ciudad con capas muy distintas segun sector.',
      introText: [
        'Bogota recompensa la lectura de barrio, el tiempo real de trayecto y la calidad del edificio mas que cualquier narrativa amplia de capital.',
        'En esta ciudad, la ubicacion buena no solo se mide por prestigio sino por conectividad practica, seguridad percibida y acceso diario a servicios.',
        'Para compradores y brokers, la clave es separar el discurso corporativo del producto verdaderamente liquido.'
      ],
      destinationHighlights: [
        'Mayor profundidad institucional y corporativa del pais.',
        'Salud privada, educacion y servicios de alto nivel.',
        'Barrios con perfiles muy distintos para familia, ejecutivo y estilo de vida urbano.'
      ],
      watchouts: [
        'El tiempo de trayecto puede afectar mas que el precio de compra.',
        'No todo lo premium tiene la misma liquidez de salida.',
        'La altura y el clima deben sentirse en visita real antes de decidir una compra de larga estancia.'
      ],
      first30DaysGuide: [
        'Prueba trayectos reales entre vivienda, salud, colegio y trabajo.',
        'Verifica reglamento, cupos, reservas y estado tecnico del edificio.',
        'Usa comparables por microsector, no solo por codigo postal amplio.'
      ],
      relocationSnapshot: {
        bestFor: 'Familias, ejecutivos y compradores que priorizan salud, colegios y profundidad de servicios.',
        monthlyComfort: 'Muy amplia segun barrio; el diferencial entre Chico, Zona G, Cedritos y Chapinero Alto es relevante.',
        airport: 'Aeropuerto principal del pais, con excelente conectividad pero tiempos internos que dependen mucho del trafico.',
        englishSupport: 'Alto en corredores corporativos, salud privada y servicios orientados a cliente internacional.'
      },
      rentalMarket: {
        headline: 'Bogota funciona mejor como mercado de arriendo ejecutivo, profesional y familiar que como historia de corta estancia.',
        longStayDemand: 'Profunda y estable en corredores corporativos, familiares y universitarios de buena calidad.',
        furnishedDemand: 'Existe donde el producto acompana el perfil ejecutivo o de relocacion.',
        shortStayReality: 'Suele ser secundaria frente al arriendo formal y la estabilidad operativa.',
        tenantMix: 'Ejecutivos, familias, estudiantes de ticket medio alto y clientes de relocacion.',
        landlordWatchouts: 'Revisa administracion, parqueaderos, ruido, acceso vial y sensibilidad del inquilino al tiempo de traslado.'
      },
      neighborhoods: {
        Chico: {
          character: 'Zona corporativa premium con inventario solido y perfil ejecutivo.',
          bestFor: 'Ejecutivos, diplomacia y compradores que priorizan servicios de alto nivel.',
          rentalProfile: 'Arriendo ejecutivo fuerte y relativamente estable para ticket alto.'
        },
        'Zona G': {
          character: 'Distrito gastronomico con perfil boutique y muy buena caminabilidad selectiva.',
          bestFor: 'Profesionales que quieren centralidad, restaurantes y vida urbana corta.',
          rentalProfile: 'Funciona bien en amoblado y ejecutivo cuando el edificio acompana.'
        },
        Cedritos: {
          character: 'Barrio familiar del norte con demanda estable y vida practica.',
          bestFor: 'Familias y usuarios finales que buscan norte funcional sin pagar prima maxima.',
          rentalProfile: 'Mas limpio para arriendo largo familiar que para experimentos de corta estancia.'
        },
        'Chapinero Alto': {
          character: 'Demanda joven profesional con mezcla de stock nuevo y edificios mas antiguos.',
          bestFor: 'Vida urbana, profesionales y compradores que aceptan algo de pendiente por centralidad.',
          rentalProfile: 'Demanda flexible de larga estancia con algo de upside amoblado en el producto correcto.'
        }
      }
    },
    cartagena: {
      tagline: 'Patrimonio historico, turismo y costo real de operar en la costa',
      shortTagline: 'Ciudad costera de ticket alto donde mantenimiento, reglamentos y estacionalidad importan tanto como la vista.',
      historicalContext: 'Cartagena mezcla patrimonio historico, turismo internacional, segunda vivienda y operacion hotelera ligera. Eso crea un mercado con tickets altos y castigos severos para quien subestima mantenimiento y reglamentos.',
      investorAppeal: 'Atrae por turismo, escasez en ciertos corredores y valor patrimonial, pero exige mucha mas disciplina operativa que una narrativa romantica de ciudad amurallada.',
      lifestyleHighlights: 'Se busca por mar, clima caribeno, uso personal parcial y activos con fuerte componente emocional y de estatus.',
      introText: [
        'Cartagena puede funcionar muy bien, pero rara vez perdona una mala lectura de mantenimiento, reglamento y costos de operacion.',
        'El activo correcto depende de si la historia es uso personal, turismo, renta parcial o preservacion patrimonial.',
        'Para locales, brokers y compradores externos, la debida diligencia en edificio y humedad pesa tanto como la ubicacion.'
      ],
      destinationHighlights: [
        'Marca internacional fuerte y demanda de ocio reconocible.',
        'Corredores historicos y de playa con perfiles muy distintos.',
        'Potencial de segunda vivienda con uso personal y renta parcial.'
      ],
      watchouts: [
        'La vista no compensa una mala administracion ni una operacion costosa.',
        'El salitre y la humedad castigan fuerte el capex diferido.',
        'No modeles corta estancia sin validar reglamento, registro y administracion.'
      ],
      first30DaysGuide: [
        'Revisa fachadas, ascensores, bombas, plantas y reservas del edificio.',
        'Confirma reglas de corta estancia y operacion real del inmueble.',
        'Camina el corredor en temporada alta y baja para medir ruido y flujo.'
      ],
      relocationSnapshot: {
        bestFor: 'Segunda vivienda, vida costera y perfiles que aceptan mas mantenimiento a cambio de mar y clima.',
        monthlyComfort: 'Ticket alto en corredores premium y una brecha clara entre producto turistico y residencial.',
        airport: 'Aeropuerto comodo y cercano para uso frecuente, con ventaja para propietarios de segunda vivienda.',
        englishSupport: 'Bueno en turismo, hospitalidad y servicios premium, pero menos consistente fuera de esos corredores.'
      },
      rentalMarket: {
        headline: 'Cartagena no es una sola historia de arriendo: turismo, segunda vivienda y larga estancia residencial conviven con reglas muy distintas.',
        longStayDemand: 'Existe en barrios mas residenciales y en ciertos segmentos ejecutivos o familiares.',
        furnishedDemand: 'Alta en corredores premium y de ocio, pero muy sensible al edificio y a la operacion.',
        shortStayReality: 'Puede ser potente, pero solo cuando reglamento, registro, administracion y mantenimiento estan bien resueltos.',
        tenantMix: 'Turismo, segunda vivienda, extranjeros de temporada y residentes de larga estancia por barrio.',
        landlordWatchouts: 'Sube mucho la importancia de capex, administracion, vacancia estacional y desgaste costero.'
      },
      neighborhoods: {
        Bocagrande: {
          character: 'Torres frente al mar, perfil alto y mezcla de turismo con uso residencial.',
          bestFor: 'Segunda vivienda, renta amoblada de ticket alto y compradores que quieren playa a mano.',
          rentalProfile: 'La demanda amoblada existe, pero el costo operativo y la calidad del edificio mandan.'
        },
        'Centro Historico': {
          character: 'Activos patrimoniales y producto ultra premium con narrativa unica.',
          bestFor: 'Compradores de prestigio y operadores con tolerancia a complejidad patrimonial.',
          rentalProfile: 'Puede funcionar muy bien en lujo y hospitalidad, pero permisos y operacion lo son todo.'
        },
        Cabrero: {
          character: 'Transicion entre residencial y turismo, con acceso facil al centro historico.',
          bestFor: 'Compradores que quieren cercania al centro sin vivir en su intensidad maxima.',
          rentalProfile: 'Balancea mejor larga estancia y demanda temporal selectiva.'
        },
        Manga: {
          character: 'Barrio mas residencial con marina, familias y ritmo menos turistico.',
          bestFor: 'Familias, profesionales y compradores que priorizan uso estable.',
          rentalProfile: 'Mas limpio para arriendo largo y perfil local que para alta rotacion.'
        }
      }
    },
    cali: {
      tagline: 'Entrada de valor con demanda local fuerte y barrios muy dispares',
      shortTagline: 'Base de compra mas baja, salud competitiva y barrios donde la seleccion correcta cambia todo.',
      historicalContext: 'Cali combina industria, universidades, salud privada y vida cultural fuerte. El mercado premia conocer bien el sur, el oeste y los corredores donde la demanda local es verdaderamente estable.',
      investorAppeal: 'Importa por precio de entrada mas accesible, demanda local profunda y sectores donde el arriendo largo puede ser mas limpio que en mercados mas famosos.',
      lifestyleHighlights: 'Se busca por clima mas calido, ritmo cultural, costo diario mas llevadero y barrios que aun permiten entrar con disciplina de precio.',
      introText: [
        'Cali puede ser una entrada inteligente cuando el comprador entiende barrio, seguridad percibida y calidad del edificio.',
        'La ciudad tiene sectores muy distintos entre si; el analisis correcto no sale de una sola visita ni de un promedio general.',
        'Para brokers y compradores, la oportunidad esta en separar valor real de descuento aparente.'
      ],
      destinationHighlights: [
        'Base de compra mas baja que Medellin, Bogota y Cartagena.',
        'Buena salud privada y demanda local sostenida en sectores clave.',
        'Vida cultural intensa y barrios con perfiles bien diferenciados.'
      ],
      watchouts: [
        'La dispersion barrial es muy alta y afecta seguridad percibida y liquidez.',
        'No toda ganga es oportunidad; a veces solo es capex diferido.',
        'Trabaja con comparables hiperlocales y no con promedios amplios.'
      ],
      first30DaysGuide: [
        'Recorre barrio, accesos y servicios cercanos en distintos horarios.',
        'Confirma estado real de edificio, administracion y entorno inmediato.',
        'Valida que la demanda objetivo del activo exista en ese microsector y no solo en la ciudad.'
      ],
      relocationSnapshot: {
        bestFor: 'Compradores que buscan valor relativo, buena salud y una ciudad con fuerte vida local.',
        monthlyComfort: 'Suele permitir mas metraje o mejor producto por el mismo presupuesto frente a mercados mas caros.',
        airport: 'Aeropuerto funcional para conexiones nacionales e internacionales selectivas.',
        englishSupport: 'Mas limitado que Medellin o Bogota, aunque mejora en salud privada y servicios especializados.'
      },
      rentalMarket: {
        headline: 'Cali funciona mejor como mercado de arriendo largo apoyado en demanda local, universitaria y profesional que como relato de moda internacional.',
        longStayDemand: 'Solida en corredores familiares y en zonas cercanas a salud, universidad y servicios.',
        furnishedDemand: 'Existe, pero suele ser mas selectiva y menos profunda que en Medellin o Cartagena.',
        shortStayReality: 'No es el nucleo de la historia; primero manda la larga estancia bien ubicada.',
        tenantMix: 'Hogares locales, profesionales, estudiantes y usuarios de salud segun microsector.',
        landlordWatchouts: 'Mide seguridad percibida, vacancia por barrio y profundidad real de demanda antes de pagar una prima.'
      },
      neighborhoods: {
        'Ciudad Jardin': {
          character: 'Distrito residencial de ticket alto en el sur, cerca de universidades y retail.',
          bestFor: 'Familias, estudiantes de buen perfil y compradores que quieren servicios del sur.',
          rentalProfile: 'Demanda larga y local consistente con apoyo de universidad y servicios.'
        },
        Granada: {
          character: 'Zona de restaurantes y vida urbana con apetito por apartamentos boutique.',
          bestFor: 'Profesionales que quieren centralidad, comida y caminabilidad selectiva.',
          rentalProfile: 'Uno de los microsectores donde el amoblado puede funcionar mejor, sin dejar de ser mercado de larga estancia.'
        },
        'Santa Teresita': {
          character: 'Sector del oeste mas consolidado, con bolsillos premium y ambiente residencial.',
          bestFor: 'Vida mas calmada con buen acceso al rio y a corredores tradicionales.',
          rentalProfile: 'Se comporta mejor con demanda estable de hogar que con alta rotacion.'
        },
        'Valle del Lili': {
          character: 'Stock mas nuevo, enfoque familiar y mejor punto de entrada de precio en el sur.',
          bestFor: 'Familias y usuarios que quieren cercania a salud y producto mas nuevo.',
          rentalProfile: 'Mercado practico de larga estancia con demanda familiar sostenida.'
        }
      }
    },
    barranquilla: {
      tagline: 'Caribe de negocios con clima fuerte y barrios residenciales solidos',
      shortTagline: 'Entrada costera mas pragmatica que Cartagena, con demanda familiar y ejecutiva bien definida.',
      historicalContext: 'Barranquilla se mueve por negocios, industria, servicios y vida caribena menos teatral que Cartagena. El mercado premia barrios con buena infraestructura, edificios sanos y demanda familiar sostenida.',
      investorAppeal: 'Interesa por base de compra mas ordenada que Cartagena, perfil ejecutivo y familiar, y un mercado donde la operacion residencial pesa mas que la fantasia turistica.',
      lifestyleHighlights: 'Funciona para quienes quieren Caribe, servicios urbanos y una rutina mas local, con menor ruido turistico que otros mercados costeros.',
      introText: [
        'Barranquilla suele ser una jugada de vida diaria y arriendo residencial mas que una apuesta de corta estancia.',
        'La lectura correcta pasa por calidad de edificio, resiliencia a humedad y seleccion de barrio con servicios de verdad.',
        'Para compradores y brokers, la pregunta central es si el activo resuelve vida familiar o ejecutiva de manera eficiente.'
      ],
      destinationHighlights: [
        'Vida caribena mas pragmatica y menos dependiente del turismo.',
        'Buenos corredores familiares y ejecutivos en el norte.',
        'Mercado mas estable para uso residencial y arriendo largo.'
      ],
      watchouts: [
        'La humedad y el calor castigan producto mal mantenido.',
        'No confundas cercania a comercio con calidad real de entorno residencial.',
        'El capex oculto aparece rapido cuando el edificio no ha sido bien cuidado.'
      ],
      first30DaysGuide: [
        'Revisa fachadas, impermeabilizacion y sistemas de respaldo del edificio.',
        'Prueba los trayectos diarios en horas de calor y trafico.',
        'Confirma profundidad de demanda local antes de pagar prima por novedad.'
      ],
      relocationSnapshot: {
        bestFor: 'Familias y ejecutivos que quieren Caribe con menos dependencia del turismo.',
        monthlyComfort: 'Competitivo frente a Cartagena, con buenas opciones familiares en el norte.',
        airport: 'Aeropuerto util para conexiones nacionales y algunas internacionales, con acceso relativamente simple.',
        englishSupport: 'Moderado; mejor en brokers corporativos y salud privada que en servicios mas cotidianos.'
      },
      rentalMarket: {
        headline: 'Barranquilla se entiende mejor como mercado de arriendo familiar y ejecutivo que como apuesta de hospitalidad.',
        longStayDemand: 'Consistente en Alto Prado, Riomar, Villa Santos y corredores bien servidos del norte.',
        furnishedDemand: 'Existe en nichos ejecutivos, pero no es la historia principal del mercado.',
        shortStayReality: 'Secundaria frente al uso residencial y la estabilidad operativa.',
        tenantMix: 'Hogares locales, ejecutivos, retornados y demanda corporativa selectiva.',
        landlordWatchouts: 'Vigila mantenimiento, ventilacion, humedad y calidad de administracion mas que cualquier promesa de tarifa alta.'
      },
      neighborhoods: {
        'Alto Prado': {
          character: 'Sector tradicional de prestigio con apartamentos amplios y perfil ejecutivo.',
          bestFor: 'Hogares consolidados y compradores que valoran direccion conocida.',
          rentalProfile: 'Arriendo largo ejecutivo y familiar con buen nivel de estabilidad.'
        },
        Riomar: {
          character: 'Zona norte moderna con torres y vida de servicios bastante resuelta.',
          bestFor: 'Familias de ingreso medio alto y compradores que priorizan conveniencia.',
          rentalProfile: 'Demanda familiar consistente, con necesidad de cuidar bien mantenimiento.'
        },
        'Villa Santos': {
          character: 'Barrio familiar con inventario mas nuevo y acceso facil a comercio.',
          bestFor: 'Familias que quieren norte practico y edificios relativamente recientes.',
          rentalProfile: 'Funciona muy bien para larga estancia local y de relocacion.'
        },
        Buenavista: {
          character: 'Corredor mixto de crecimiento con torres nuevas y consumo a mano.',
          bestFor: 'Compradores que valoran centro comercial, servicios y stock reciente.',
          rentalProfile: 'Mas fuerte en demanda ejecutiva y familiar que en turismo.'
        }
      }
    },
    'santa-marta': {
      tagline: 'Playa, segunda vivienda y decisiones muy dependientes del proyecto',
      shortTagline: 'Mercado costero con mejor entrada que Cartagena, donde barrio, agua y edificio mandan mas que la vista.',
      historicalContext: 'Santa Marta combina turismo, segunda vivienda, vida costera relajada y proyectos que pueden variar mucho en calidad. La lectura correcta se hace por corredor y por edificio.',
      investorAppeal: 'Atrae por precio de entrada costero relativamente menor, uso personal posible y demanda amoblada en corredores de playa, siempre con mucha sensibilidad a operacion y mantenimiento.',
      lifestyleHighlights: 'Se busca por mar, cercania a naturaleza y ritmo mas lento, con grandes diferencias entre producto turistico, vacacional y residencial.',
      introText: [
        'Santa Marta puede ser una entrada atractiva a la costa, pero exige revisar calidad de proyecto, agua, administracion y entorno real.',
        'No todos los corredores de playa tienen la misma profundidad de demanda ni el mismo costo operativo.',
        'Para compradores y brokers, la pregunta clave es si el activo resuelve uso personal, renta estacional o larga estancia de forma creible.'
      ],
      destinationHighlights: [
        'Entrada costera mas baja que Cartagena en varios segmentos.',
        'Acceso rapido a playa, Sierra y uso de segunda vivienda.',
        'Corredores muy distintos entre turismo intenso y vida mas tranquila.'
      ],
      watchouts: [
        'La calidad del proyecto pesa mas de lo normal en este mercado.',
        'Agua, humedad y mantenimiento deben revisarse con detalle.',
        'No confundas cercania a playa con fortaleza de demanda todo el ano.'
      ],
      first30DaysGuide: [
        'Verifica operacion del edificio, bombas, reservas y respaldo electrico.',
        'Camina el corredor en semana normal y en fines de semana de alta demanda.',
        'Confirma si tu caso es renta vacacional, uso personal o larga estancia antes de fijar precio de compra.'
      ],
      relocationSnapshot: {
        bestFor: 'Perfiles que quieren costa y ritmo lento, y aceptan mas trabajo de selecccion de proyecto.',
        monthlyComfort: 'Competitivo en varios corredores, aunque los proyectos premium de playa pueden subir fuerte.',
        airport: 'Muy conveniente para uso recurrente y escapadas de segunda vivienda.',
        englishSupport: 'Selectivo y concentrado en turismo, hospitalidad y brokers de playa.'
      },
      rentalMarket: {
        headline: 'Santa Marta mezcla turismo, segunda vivienda y demanda amoblada; por eso el barrio y el edificio pesan mas que el promedio de ciudad.',
        longStayDemand: 'Existe en corredores mas residenciales, pero no domina toda la historia de mercado.',
        furnishedDemand: 'Fuerte en sectores de playa bien operados y con proyecto consistente.',
        shortStayReality: 'Puede funcionar, pero depende por completo de edificio, administracion y estacionalidad.',
        tenantMix: 'Turismo, segunda vivienda, estancias medias y hogares locales segun sector.',
        landlordWatchouts: 'Mide vacancia estacional, capex costero y reputacion real del proyecto antes de modelar.'
      },
      neighborhoods: {
        'El Rodadero': {
          character: 'Torres de playa con fuerte componente turistico y arriendo amoblado.',
          bestFor: 'Propietarios que buscan rotacion vacacional y ubicacion de playa reconocible.',
          rentalProfile: 'Demanda amoblada alta, pero muy expuesta a temporada, edificio y operacion.'
        },
        'Bello Horizonte': {
          character: 'Corredor de playa mas calmado, con resort inventory y cercania al aeropuerto.',
          bestFor: 'Segunda vivienda y compradores que quieren costa menos congestionada.',
          rentalProfile: 'Sirve para vacacional y estancias medias cuando el edificio esta bien operado.'
        },
        'Centro Historico': {
          character: 'Nucleo caminable con edificios de caracter y perfil boutique.',
          bestFor: 'Compradores que priorizan atmosfera, turismo y vida urbana corta.',
          rentalProfile: 'Tiene upside en hospitalidad, pero el producto y la operacion mandan.'
        },
        'Pozos Colorados': {
          character: 'Corredor de crecimiento de ticket mas alto con producto playero nuevo.',
          bestFor: 'Segunda vivienda y compradores que quieren playa con sensacion de resort.',
          rentalProfile: 'Demanda estacional y amoblada que solo luce bien si el proyecto es fuerte.'
        }
      }
    },
    pereira: {
      tagline: 'Puerta del Eje Cafetero con vida diaria amable y buen encaje de retiro',
      shortTagline: 'Ciudad manejable, clima estable y barrios donde salud, calma y valor practico pesan mucho.',
      historicalContext: 'Pereira se apoya en comercio, salud, servicios y conectividad regional dentro del Eje Cafetero. El mercado suele atraer a quienes quieren una vida diaria mas ligera y un punto de aterrizaje menos complejo.',
      investorAppeal: 'Importa por encaje de retiro, demanda local y de relocacion, y una mezcla de precio, salud y calma que puede sostener bien la larga estancia.',
      lifestyleHighlights: 'Gana por clima amable, ritmo mas sereno, cercania a naturaleza y barrios donde la rutina diaria es menos pesada que en grandes capitales.',
      introText: [
        'Pereira suele funcionar bien para quienes priorizan una vida diaria simple, buena salud privada y barrios donde moverse no exige tanta friccion.',
        'No es una ciudad para dramatizar rentabilidades; es una ciudad para leer calidad de vida, encaje barrial y operacion limpia.',
        'Para locales, jubilados y compradores de larga estancia, la clave esta en distinguir entre comodidad real y relato aspiracional.'
      ],
      destinationHighlights: [
        'Buen equilibrio entre salud, clima y costo de vida.',
        'Encaje fuerte para retiro activo y hogares que quieren menos ruido.',
        'Conexion regional util con el resto del Eje Cafetero.'
      ],
      watchouts: [
        'No todos los corredores tienen el mismo nivel de servicios ni la misma liquidez.',
        'Algunos formatos suburbanos sacrifican caminabilidad por metraje.',
        'Revisa administracion y entorno real, no solo la narrativa de ciudad amable.'
      ],
      first30DaysGuide: [
        'Prueba rutas hacia salud, comercio y salidas regionales.',
        'Compara barrios entre centralidad practica y formatos mas campestres.',
        'Verifica mantenimiento y seguridad percibida del edificio en horarios distintos.'
      ],
      relocationSnapshot: {
        bestFor: 'Retiro activo, hogares que quieren calma y compradores que priorizan salud privada sin ritmo de gran capital.',
        monthlyComfort: 'Suele ser muy competitivo para vivir bien con presupuesto medio o medio alto.',
        airport: 'Conectividad util para moverse por Colombia, con escala regional favorable.',
        englishSupport: 'Selectivo, pero cada vez mas util en corredores de salud y servicios para expats.'
      },
      rentalMarket: {
        headline: 'Pereira se comporta mejor como mercado de larga estancia comoda que como promesa de alta rotacion.',
        longStayDemand: 'Firme en corredores de salud, hogares locales y perfiles de relocacion o retiro.',
        furnishedDemand: 'Existe de forma selectiva en barrios muy bien servidos o en producto premium.',
        shortStayReality: 'Secundaria para la mayoria de activos; primero manda la larga estancia bien ubicada.',
        tenantMix: 'Locales, retirados, profesionales y relocalizados nacionales o internacionales.',
        landlordWatchouts: 'Mide profundidad real de demanda, no solo la narrativa de ciudad tranquila.'
      },
      neighborhoods: {
        Pinares: {
          character: 'Sector de ingreso alto cerca de salud y comercio, muy funcional para la vida diaria.',
          bestFor: 'Retiro, salud privada y hogares que quieren comodidad inmediata.',
          rentalProfile: 'Uno de los corredores mas limpios para larga estancia y relocacion.'
        },
        Alamos: {
          character: 'Barrio central consolidado con buena mezcla entre practicidad y demanda profesional.',
          bestFor: 'Locales y relocalizados que quieren centralidad cotidiana.',
          rentalProfile: 'Demanda estable de larga estancia con upside amoblado moderado.'
        },
        Cerritos: {
          character: 'Suburbano de ticket alto con lotes amplios, club y perfil de estilo de vida.',
          bestFor: 'Familias y compradores que quieren formato amplio y ritmo mas abierto.',
          rentalProfile: 'Mejor para renta familiar o de relocacion que para alta rotacion.'
        },
        Dosquebradas: {
          character: 'Entrada de valor metropolitana con demanda laboral y residencial practica.',
          bestFor: 'Compradores sensibles a precio y demanda local de larga estancia.',
          rentalProfile: 'Mercado mas sensible a precio y empleo que a narrativa premium.'
        }
      }
    },
    bucaramanga: {
      tagline: 'Ciudad intermedia ordenada con muy buena logica de vida diaria',
      shortTagline: 'Servicios, clima manejable y barrios donde la comodidad cotidiana pesa mas que la moda.',
      historicalContext: 'Bucaramanga combina salud, educacion, comercio y una escala intermedia que suele sentirse mas gobernable. El mercado favorece a quienes buscan vida practica y menos friccion diaria.',
      investorAppeal: 'Atrae por calidad de vida, demanda local estable y barrios donde el arriendo de larga estancia puede ser mas limpio que el relato de especulacion.',
      lifestyleHighlights: 'Se valora por arboles, servicios, salud, rutina manejable y un costo de vida que todavia puede ser competitivo frente a ciudades mas famosas.',
      introText: [
        'Bucaramanga suele gustar a quienes quieren ciudad intermedia, salud privada razonable y una rutina menos pesada.',
        'No necesita mucho marketing emocional: su fortaleza esta en lo practico, lo habitable y lo bien conectado.',
        'Para locales, jubilados y brokers, el valor esta en barrios donde la vida cotidiana se resuelve sin demasiado ruido.'
      ],
      destinationHighlights: [
        'Escala media con buena oferta de salud y servicios.',
        'Muy buen encaje para retiro y vida diaria sin sobrecarga de ciudad grande.',
        'Barrios con perfiles claros para caminabilidad, familia y formato suburbano.'
      ],
      watchouts: [
        'No todos los sectores ofrecen el mismo nivel de caminabilidad real.',
        'Algunos productos suburbanos sacrifican cercania a servicios por vista o metraje.',
        'La liquidez depende bastante del barrio y del formato del activo.'
      ],
      first30DaysGuide: [
        'Prueba rutas entre vivienda, salud, compras y ocio diario.',
        'Compara barrios centrales con sectores mas nuevos o suburbanos.',
        'Revisa administracion, sombra, ventilacion y mantenimiento del edificio.'
      ],
      relocationSnapshot: {
        bestFor: 'Retiro, familias y compradores que quieren una ciudad ordenada y practicamente vivible.',
        monthlyComfort: 'Muy competitivo para presupuestos medios, con opciones claras entre centralidad y formato suburbano.',
        airport: 'Conexion suficiente para vida regional y nacional, aunque menos amplia que una gran capital.',
        englishSupport: 'Mas bajo que Medellin o Bogota, pero util en salud privada y algunos servicios especializados.'
      },
      rentalMarket: {
        headline: 'Bucaramanga destaca mas por arriendo largo estable y buena vida diaria que por promesas de alta rotacion.',
        longStayDemand: 'Solida en corredores bien servidos y barrios familiares o de retiro.',
        furnishedDemand: 'Existe en nichos de transicion o relocacion, pero no domina el mercado.',
        shortStayReality: 'Secundaria frente a la demanda residencial y profesional.',
        tenantMix: 'Locales, familias, profesionales y hogares de retiro con buena permanencia.',
        landlordWatchouts: 'Evalua profundidad de demanda y liquidez por barrio antes de pagar por reputacion general de ciudad.'
      },
      neighborhoods: {
        'Cabecera del Llano': {
          character: 'Nodo central con comercio, salud y vida caminable bastante resuelta.',
          bestFor: 'Vida diaria comoda, salud cercana y compradores que priorizan practicidad.',
          rentalProfile: 'Muy buen corredor para larga estancia y alquileres de transicion.'
        },
        Cacique: {
          character: 'Stock moderno y perfil familiar cerca de comercio grande.',
          bestFor: 'Familias y compradores que quieren producto mas nuevo con servicios a mano.',
          rentalProfile: 'Estable para arriendo familiar y profesional.'
        },
        Sotomayor: {
          character: 'Area consolidada y mixta con buena base profesional y residencial.',
          bestFor: 'Quienes quieren centralidad tradicional y vida cotidiana ordenada.',
          rentalProfile: 'Predomina la demanda local de larga estancia con buena continuidad.'
        },
        Ruitoque: {
          character: 'Suburbano de ticket alto, ladera y formato amplio orientado a estilo de vida.',
          bestFor: 'Compradores que buscan espacio, vista y un perfil mas residencial que urbano.',
          rentalProfile: 'Nicho de estilo de vida; no se debe leer como mercado masivo de arriendo.'
        }
      }
    }
  }
};
