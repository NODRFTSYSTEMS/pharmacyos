// PharmacyOS — Sidebar + shared shell
const Sidebar = ({ route, navigate }) => {
  const groups = [
    { label: null, items: [
      { route: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    ]},
    { label: 'Inventory', items: [
      { route: '/inventory', icon: 'inventory', label: 'Stock' },
      { route: '/inventory/catalog', icon: 'pill', label: 'Catalog' },
      { route: '/inventory/scanner', icon: 'ai', label: 'AI Scanner' },
      { route: '/inventory/alerts', icon: 'bell', label: 'Alerts', badge: 12 },
      { route: '/inventory/suppliers', icon: 'truck', label: 'Suppliers' },
    ]},
    { label: 'Prescriptions', items: [
      { route: '/prescriptions', icon: 'rx', label: 'Queue' },
      { route: '/prescriptions/new', icon: 'plus', label: 'New' },
      { route: '/prescriptions/scanner', icon: 'ai', label: 'AI Scanner' },
      { route: '/prescriptions/schedule-log', icon: 'fileText', label: 'Schedule Log' },
    ]},
    { label: 'Patients', items: [
      { route: '/patients', icon: 'patients', label: 'Search' },
      { route: '/patients/new', icon: 'plus', label: 'New' },
    ]},
    { label: 'Retail POS', items: [
      { route: '/pos', icon: 'pos', label: 'Open Terminal' },
      { route: '/pos/loyalty', icon: 'shield', label: 'Loyalty' },
      { route: '/pos/reports', icon: 'reports', label: 'Reports' },
    ]},
    { label: 'Reporting', items: [
      { route: '/reports', icon: 'reports', label: 'Hub' },
      { route: '/reports/revenue', icon: 'arrowUp', label: 'Revenue' },
    ]},
    { label: 'AI', items: [
      { route: '/ai/queue', icon: 'ai', label: 'Job Queue' },
    ]},
    { label: 'Admin', items: [
      { route: '/admin/users', icon: 'user', label: 'Users' },
      { route: '/admin/audit', icon: 'history', label: 'Audit Log' },
      { route: '/admin/settings', icon: 'admin', label: 'Settings' },
    ]},
  ];

  const isActive = (r) => {
    if (r === '/dashboard') return route === '/dashboard';
    if (r === '/prescriptions') return route === '/prescriptions';
    return route === r || route.startsWith(r + '/');
  };

  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      <div className="sidebar-logo">
        <div className="mark">
          <div className="mark-glyph">℞</div>
          <div>
            <div className="mark-name">PharmacyOS</div>
          </div>
        </div>
        <div className="mark-sub">Winchester Global</div>
      </div>
      <nav className="sidebar-nav">
        {groups.map((g, i) => (
          <div key={i} className="sidebar-group">
            {g.label && <div className="sidebar-group-label">{g.label}</div>}
            {g.items.map(it => (
              <button key={it.route} className={`sidebar-item ${isActive(it.route) ? 'active' : ''}`} onClick={() => navigate(it.route)}>
                <Icon name={it.icon} size={17} />
                <span>{it.label}</span>
                {it.badge && <span style={{marginLeft:'auto', background:'var(--color-warning)', color:'#1F2937', fontSize:10, fontWeight:600, padding:'1px 6px', borderRadius:999}}>{it.badge}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-user">
        <div className="avatar">AC</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">Andrea Clarke</div>
          <div className="sidebar-user-role">Pharmacist</div>
        </div>
        <button className="logout" aria-label="Sign out"><Icon name="logout" size={16} /></button>
      </div>
    </aside>
  );
};

const PageHeader = ({ title, breadcrumb, greeting, actions }) => (
  <div className="page-header">
    <div className="page-header-left">
      {breadcrumb && (
        <div className="breadcrumb">
          {breadcrumb.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="sep">›</span>}
              <span className={i === breadcrumb.length - 1 ? 'current' : ''}>{b}</span>
            </React.Fragment>
          ))}
        </div>
      )}
      <h1 className="page-title">{title}</h1>
      {greeting && <div className="page-greeting">{greeting}</div>}
    </div>
    {actions && <div className="page-header-actions">{actions}</div>}
  </div>
);

const Pill = ({ variant, icon, children }) => (
  <span className={`pill pill-${variant}`}>
    {icon && <Icon name={icon} size={11} />}
    {children}
  </span>
);

const Stages = ({ stage }) => {
  const stages = [
    { key: 'received', label: 'Received' },
    { key: 'verified', label: 'Verified' },
    { key: 'filled', label: 'Filled' },
    { key: 'dispensed', label: 'Dispensed' },
  ];
  const idx = stages.findIndex(s => s.key === stage);
  return (
    <div className="stage-dots">
      {stages.map((s, i) => (
        <React.Fragment key={s.key}>
          {i > 0 && <div className={`stage-line ${i <= idx ? 'done' : ''}`}></div>}
          <div className={`stage-dot ${i < idx ? 'done' : i === idx ? 'current' : ''}`}>
            <span className="dot"></span>
            <span>{s.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

const Metric = ({ label, value, trend, trendDir }) => (
  <div className="card card-shadow metric-card">
    <div className="metric-label">{label}</div>
    <div className="metric-value">{value}</div>
    {trend && (
      <div className={`metric-trend ${trendDir || 'up'}`}>
        <Icon name={trendDir === 'down' ? 'arrowDown' : 'arrowUp'} size={12} />
        <span>{trend}</span>
      </div>
    )}
  </div>
);

const Empty = ({ icon = 'inbox', title, desc, cta }) => (
  <div style={{padding:'48px 24px', textAlign:'center'}}>
    <div style={{color:'var(--text-disabled)', marginBottom:12}}><Icon name={icon} size={40} /></div>
    <div style={{fontSize:15, fontWeight:600, marginBottom:4}}>{title}</div>
    {desc && <div style={{fontSize:13, color:'var(--text-secondary)', marginBottom:14}}>{desc}</div>}
    {cta}
  </div>
);

Object.assign(window, { Sidebar, PageHeader, Pill, Stages, Metric, Empty });
