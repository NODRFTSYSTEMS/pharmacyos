// PharmacyOS — App router
const { useState, useEffect } = React;

const App = () => {
  const [route, setRoute] = useState(() => (window.location.hash || '#/dashboard').slice(1));

  useEffect(() => {
    const onHash = () => setRoute((window.location.hash || '#/dashboard').slice(1));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (r) => {
    window.location.hash = r;
    window.scrollTo({top:0, behavior:'instant'});
  };

  const isPOS = route === '/pos';

  let screen = null;
  if (route === '/dashboard') screen = <Dashboard navigate={navigate} />;
  else if (route === '/prescriptions') screen = <PrescriptionsKanban navigate={navigate} />;
  else if (route.startsWith('/prescriptions/')) {
    const id = route.split('/')[2];
    if (id === 'new') screen = <Empty icon="plus" title="New prescription form" desc="Form per spec — see screens-1." />;
    else if (id === 'scanner') screen = <Empty icon="ai" title="Rx AI scanner" desc="Same split-view as Inventory AI scanner, tuned for prescription extraction." />;
    else if (id === 'schedule-log') screen = <ScheduleLog navigate={navigate}/>;
    else screen = <RxDetail id={id} navigate={navigate}/>;
  }
  else if (route === '/inventory') screen = <Inventory navigate={navigate} />;
  else if (route === '/inventory/scanner') screen = <AIScanner navigate={navigate} />;
  else if (route === '/inventory/catalog') screen = <Inventory navigate={navigate} />;
  else if (route === '/inventory/alerts') screen = <Alerts navigate={navigate} />;
  else if (route === '/inventory/suppliers') screen = <Suppliers navigate={navigate} />;
  else if (route === '/patients') screen = <Patients navigate={navigate} />;
  else if (route === '/patients/new') screen = <NewPatient navigate={navigate} />;
  else if (route.startsWith('/patients/')) screen = <PatientProfile navigate={navigate} />;
  else if (route === '/pos') screen = null;
  else if (route === '/pos/loyalty') screen = <Empty icon="shield" title="Loyalty customer search" desc="Phone-number lookup. See spec section 5.8." />;
  else if (route === '/pos/reports') screen = <Empty icon="reports" title="POS reports" desc="Daily sales, top products, hourly chart." />;
  else if (route === '/reports') screen = <Reports navigate={navigate} />;
  else if (route === '/reports/revenue') screen = <RevenueReport navigate={navigate} />;
  else if (route === '/ai/queue') screen = <AIQueue navigate={navigate} />;
  else if (route === '/admin/users') screen = <AdminUsers navigate={navigate} />;
  else if (route === '/admin/audit') screen = <AuditLog navigate={navigate} />;
  else if (route === '/admin/settings') screen = <AdminSettings navigate={navigate} />;
  else screen = <Empty title="Coming soon" desc={`Route ${route} not yet wired in this prototype.`} />;

  if (isPOS) return <POS navigate={navigate} />;

  return (
    <div className="app">
      <Sidebar route={route} navigate={navigate} />
      <main className="app-main">{screen}</main>
    </div>
  );
};

const ScheduleLog = ({ navigate }) => {
  const rows = [
    { t:'09:02:55', drug:'Oxycodone 5mg', cls:'II', pt:'Tracy Powell', qty:14, ph:'A. Clarke', by:'D. Patel' },
    { t:'08:30:11', drug:'Diazepam 5mg', cls:'IV', pt:'Carl Morgan', qty:10, ph:'A. Clarke', by:'A. Clarke' },
    { t:'2026-05-06 15:14:02', drug:'Alprazolam 0.5mg', cls:'IV', pt:'Lisa Walker', qty:14, ph:'A. Clarke', by:'K. Brown' },
    { t:'2026-05-06 11:08:33', drug:'Codeine 30mg', cls:'III', pt:'James Henry', qty:20, ph:'M. Walker', by:'M. Walker' },
  ];
  return (
    <>
      <PageHeader title="Schedule drug log" breadcrumb={['Prescriptions','Schedule Log']} actions={<>
        <button className="btn btn-secondary"><Icon name="download" size={14}/>Export CSV</button>
        <button className="btn btn-primary"><Icon name="download" size={14}/>Export PDF</button>
      </>}/>
      <div className="filter-bar">
        <input className="input input-mono" placeholder="2026-05-01 → 2026-05-07" style={{maxWidth:240}}/>
        <select className="input" style={{maxWidth:160}}><option>All schedules</option><option>II</option><option>III</option><option>IV</option></select>
        <input className="input input-search" placeholder="Drug, patient or pharmacist…" style={{maxWidth:280}}/>
      </div>
      <div className="content">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Timestamp</th><th>Drug</th><th>Class</th><th>Patient</th><th style={{textAlign:'right'}}>Qty</th><th>Pharmacist</th><th>Dispensed by</th></tr></thead>
            <tbody>
              {rows.map((r,i) => (
                <tr key={i}>
                  <td className="mono">{r.t.length<=8?'2026-05-07 '+r.t:r.t}</td>
                  <td style={{fontWeight:500}}>{r.drug}</td>
                  <td><Pill variant="schedule" icon="lock">Sch {r.cls}</Pill></td>
                  <td>{r.pt}</td>
                  <td className="mono" style={{textAlign:'right'}}>{r.qty}</td>
                  <td>{r.ph}</td>
                  <td>{r.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const Alerts = ({ navigate }) => (
  <>
    <PageHeader title="Inventory alerts" breadcrumb={['Inventory','Alerts']} actions={<button className="btn btn-secondary">Configure thresholds</button>}/>
    <div className="content">
      <h3 className="section-h">Low stock · 4</h3>
      <div style={{display:'flex', flexDirection:'column', gap:10, marginBottom:24}}>
        {[
          { name:'Insulin Glargine', qty:3, reorder:10 },
          { name:'Metformin 850mg', qty:14, reorder:60 },
          { name:'Salbutamol Inhaler', qty:18, reorder:20 },
          { name:'Sertraline 50mg', qty:42, reorder:50 },
        ].map((a,i) => (
          <div className="alert alert-warning" key={i}>
            <div style={{color:'var(--color-warning)'}}><Icon name="warning" size={20}/></div>
            <div className="alert-body">
              <div className="alert-title">{a.name}</div>
              <div className="alert-desc"><span className="mono">{a.qty}</span> units left · reorder at <span className="mono">{a.reorder}</span></div>
            </div>
            <div className="alert-actions">
              <button className="btn btn-secondary" style={{height:30}}>Adjust</button>
              <button className="btn btn-primary" style={{height:30}}>Reorder</button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="section-h">Expiring · 3</h3>
      <div style={{display:'flex', flexDirection:'column', gap:10}}>
        {[
          { name:'Atenolol 50mg', lot:'LT-22841', exp:'2026-05-19', days:12, severity:'error' },
          { name:'Cetirizine 10mg', lot:'LT-22198', exp:'2026-06-02', days:26, severity:'error' },
          { name:'Loratadine 10mg', lot:'LT-22302', exp:'2026-06-22', days:46, severity:'warning' },
        ].map((a,i) => (
          <div className={`alert alert-${a.severity}`} key={i}>
            <div style={{color: a.severity==='error'?'var(--color-error)':'var(--color-warning)'}}><Icon name="warning" size={20}/></div>
            <div className="alert-body">
              <div className="alert-title">{a.name} <span className="text-secondary" style={{fontWeight:400, fontSize:13}}>· lot <span className="mono">{a.lot}</span></span></div>
              <div className="alert-desc">Expires <span className="mono">{a.exp}</span> · {a.days} days remaining</div>
            </div>
            <div className="alert-actions">
              <button className="btn btn-secondary" style={{height:30}}>Adjust</button>
              <button className="btn btn-destructive" style={{height:30}}>Dispose</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

const Suppliers = ({ navigate }) => {
  const rows = [
    { name:'Pan-Jam Pharmaceuticals Ltd.', contact:'Karen Thomas', phone:'+1 876 555 0188', email:'orders@panjam.co.jm', last:'2026-05-07' },
    { name:'CARI-MED Group Ltd.', contact:'Andrew Lee', phone:'+1 876 555 0211', email:'sales@carimed.com', last:'2026-05-04' },
    { name:'GraceKennedy Health', contact:'Donna Sterling', phone:'+1 876 555 0299', email:'rx@gkhealth.com', last:'2026-05-02' },
    { name:'Lasco Distributors', contact:'Hugh Brown', phone:'+1 876 555 0322', email:'orders@lasco.com', last:'2026-04-28' },
  ];
  return (
    <>
      <PageHeader title="Suppliers" breadcrumb={['Inventory','Suppliers']} actions={<button className="btn btn-primary"><Icon name="plus" size={14}/>Add supplier</button>}/>
      <div className="content">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Supplier</th><th>Primary contact</th><th>Phone</th><th>Email</th><th>Last delivery</th><th></th></tr></thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={i}>
                  <td style={{fontWeight:500}}>{r.name}</td>
                  <td>{r.contact}</td>
                  <td className="mono">{r.phone}</td>
                  <td className="mono text-secondary">{r.email}</td>
                  <td className="mono">{r.last}</td>
                  <td className="row-actions"><button><Icon name="eye" size={14}/></button><button><Icon name="edit" size={14}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const NewPatient = ({ navigate }) => (
  <>
    <PageHeader title="New patient" breadcrumb={['Patients','New']} actions={<>
      <button className="btn btn-secondary" onClick={()=>navigate('/patients')}>Cancel</button>
      <button className="btn btn-primary"><Icon name="check" size={14}/>Save patient</button>
    </>}/>
    <div className="content">
      <div style={{maxWidth:760, display:'flex', flexDirection:'column', gap:24}}>
        <div className="card card-shadow card-pad">
          <h3 className="section-h">Demographics</h3>
          <div className="form-grid-2">
            <div className="field"><div className="label">First name<span className="req">*</span></div><input className="input" defaultValue=""/></div>
            <div className="field"><div className="label">Last name<span className="req">*</span></div><input className="input" defaultValue=""/></div>
            <div className="field"><div className="label">DOB<span className="req">*</span></div><input className="input input-mono" placeholder="YYYY-MM-DD"/></div>
            <div className="field"><div className="label">Sex</div><select className="input"><option>Female</option><option>Male</option><option>Other</option><option>Prefer not to say</option></select></div>
            <div className="field"><div className="label">Phone<span className="req">*</span></div><input className="input input-mono" placeholder="+1 876 …" inputMode="tel"/></div>
            <div className="field"><div className="label">Email</div><input className="input" type="email"/></div>
          </div>
          <div className="field"><div className="label">Address</div><textarea className="input" rows="2" style={{height:'auto', padding:12}}/></div>
        </div>

        <div className="card card-shadow card-pad">
          <h3 className="section-h">Allergies</h3>
          <div className="field"><div className="label">Known allergies</div>
            <div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:8}}>
              {['Penicillin','Sulfa','NSAIDs','Aspirin','Codeine','Latex'].map(a => (
                <label key={a} style={{display:'flex', alignItems:'center', gap:4, padding:'6px 10px', border:'1px solid var(--border)', borderRadius:4, fontSize:13, cursor:'pointer'}}>
                  <input type="checkbox"/>{a}
                </label>
              ))}
            </div>
            <textarea className="input" rows="2" placeholder="Additional notes…" style={{height:'auto', padding:12}}/>
          </div>
        </div>

        <div className="card card-shadow card-pad">
          <h3 className="section-h">JDPA consent</h3>
          <p className="section-sub">Read consent text aloud to patient before checking the box. Date and version auto-populate.</p>
          <div style={{padding:14, background:'var(--color-bg-subtle)', borderRadius:6, fontSize:12.5, color:'var(--text-secondary)', lineHeight:1.6, marginBottom:14}}>
            By giving consent, the patient authorizes Winchester Global Pharmacy to collect, store, and process their personal and health information for the purposes of dispensing medication, regulatory compliance under the Jamaica Data Protection Act, and continuity of care. Consent may be withdrawn in writing at any time.
          </div>
          <label style={{display:'flex', alignItems:'center', gap:10, fontSize:14, fontWeight:500}}>
            <input type="checkbox"/>Consent given by patient
          </label>
          <div className="form-grid-2" style={{marginTop:14}}>
            <div className="field"><div className="label">Date</div><input className="input input-mono" defaultValue="2026-05-07" disabled/></div>
            <div className="field"><div className="label">Consent version</div><input className="input input-mono" defaultValue="v3" disabled/></div>
          </div>
        </div>
      </div>
    </div>
  </>
);

const RevenueReport = ({ navigate }) => {
  const data = [320,360,310,380,420,395,440,470,455,490,520,540];
  const months = ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'];
  const max = Math.max(...data);
  const w = 720, h = 240, padL = 40, padR = 16, padT = 16, padB = 28;
  const sx = i => padL + (i*(w-padL-padR))/(data.length-1);
  const sy = v => padT + (h-padT-padB) * (1 - v/max);
  const path = data.map((v,i) => (i===0?'M':'L') + sx(i) + ' ' + sy(v)).join(' ');
  return (
    <>
      <PageHeader title="Revenue" breadcrumb={['Reports','Revenue']} actions={<button className="btn btn-secondary"><Icon name="download" size={14}/>Export</button>}/>
      <div className="filter-bar">
        <div className="seg">
          {['Today','Week','Month','Quarter','Year'].map(p => <button key={p} className={p==='Year'?'active':''}>{p}</button>)}
        </div>
      </div>
      <div className="content">
        <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:20}}>
          <Metric label="Total revenue" value="$5.12M" trend="+12.4% YoY" trendDir="up" />
          <Metric label="Prescription rev." value="$3.84M" trend="+9.8%" trendDir="up" />
          <Metric label="Retail rev." value="$1.28M" trend="+22.1%" trendDir="up" />
          <Metric label="Avg basket" value="$2,240" trend="+4.2%" trendDir="up" />
        </div>
        <div className="chart-wrap">
          <h3 className="section-h">Revenue over time</h3>
          <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{maxWidth:900}}>
            {[0,0.25,0.5,0.75,1].map(p => (
              <line key={p} x1={padL} x2={w-padR} y1={padT+(h-padT-padB)*(1-p)} y2={padT+(h-padT-padB)*(1-p)} stroke="#F3F4F6"/>
            ))}
            <path d={path} stroke="#0F6FFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d={path + ` L ${sx(data.length-1)} ${h-padB} L ${sx(0)} ${h-padB} Z`} fill="rgba(15,111,255,0.07)"/>
            {data.map((v,i)=>(<circle key={i} cx={sx(i)} cy={sy(v)} r="3" fill="#0F6FFF"/>))}
            {months.map((m,i)=>(<text key={i} x={sx(i)} y={h-8} fontSize="10" fill="#6B7280" textAnchor="middle" fontFamily="JetBrains Mono">{m}</text>))}
            {[0,0.5,1].map(p => (
              <text key={p} x={padL-6} y={padT+(h-padT-padB)*(1-p)+3} fontSize="10" fill="#6B7280" textAnchor="end" fontFamily="JetBrains Mono">${Math.round(max*p)}k</text>
            ))}
          </svg>
        </div>
      </div>
    </>
  );
};

const AdminUsers = ({ navigate }) => {
  const rows = [
    { name:'Andrea Clarke', email:'a.clarke@winchester.jm', role:'Pharmacist', status:'Active', last:'09:14', tfa:true },
    { name:'Devon Patel', email:'d.patel@winchester.jm', role:'Technician', status:'Active', last:'09:08', tfa:true },
    { name:'Marcus Walker', email:'m.walker@winchester.jm', role:'Technician', status:'Active', last:'08:51', tfa:true },
    { name:'Kareem Brown', email:'k.brown@winchester.jm', role:'Front Desk', status:'Active', last:'08:42', tfa:true },
    { name:'Janelle Reid', email:'j.reid@winchester.jm', role:'Manager', status:'Active', last:'2026-05-06', tfa:true },
    { name:'Trevor Spence', email:'t.spence@winchester.jm', role:'Front Desk', status:'Inactive', last:'2026-04-12', tfa:false },
  ];
  return (
    <>
      <PageHeader title="Users" breadcrumb={['Admin','Users']} actions={<button className="btn btn-primary"><Icon name="plus" size={14}/>Add user</button>}/>
      <div className="content">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last login</th><th>2FA</th><th></th></tr></thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={i}>
                  <td><div className="row-flex"><div className="avatar" style={{width:28, height:28, fontSize:11}}>{r.name.split(' ').map(s=>s[0]).join('')}</div><span style={{fontWeight:500}}>{r.name}</span></div></td>
                  <td className="mono text-secondary">{r.email}</td>
                  <td>{r.role}</td>
                  <td>{r.status==='Active' ? <Pill variant="success" icon="check">Active</Pill> : <Pill variant="neutral">Inactive</Pill>}</td>
                  <td className="mono">{r.last}</td>
                  <td>{r.tfa ? <span style={{color:'var(--color-success)'}}><Icon name="check" size={14}/> Enabled</span> : <span className="text-secondary">Off</span>}</td>
                  <td className="row-actions"><button><Icon name="edit" size={14}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const AdminSettings = ({ navigate }) => (
  <>
    <PageHeader title="System settings" breadcrumb={['Admin','Settings']} actions={<button className="btn btn-primary">Save changes</button>}/>
    <div className="content">
      <div style={{maxWidth:760, display:'flex', flexDirection:'column', gap:24}}>
        <div className="card card-shadow card-pad">
          <h3 className="section-h">Pharmacy</h3>
          <div className="form-grid-2">
            <div className="field"><div className="label">Pharmacy name</div><input className="input" defaultValue="Winchester Global Pharmacy"/></div>
            <div className="field"><div className="label">Phone</div><input className="input input-mono" defaultValue="+1 876 555 0100"/></div>
          </div>
          <div className="field"><div className="label">Address</div><input className="input" defaultValue="47 Hope Road, Kingston 6"/></div>
        </div>

        <div className="card card-shadow card-pad">
          <h3 className="section-h">Alert thresholds</h3>
          <div className="form-grid-2">
            <div className="field"><div className="label">Reorder point lead time (days)</div><input className="input input-mono" defaultValue="7"/></div>
            <div className="field"><div className="label">Expiry warning window (days)</div><input className="input input-mono" defaultValue="60"/></div>
          </div>
        </div>

        <div className="card card-shadow card-pad">
          <h3 className="section-h">AI</h3>
          <div className="field">
            <div className="label">Auto-accept confidence threshold</div>
            <div className="row-flex" style={{gap:12}}>
              <input type="range" min="50" max="100" defaultValue="85" style={{flex:1}}/>
              <span className="mono" style={{fontSize:14, fontWeight:600}}>85%</span>
            </div>
            <div className="help">Fields scoring below this threshold are flagged amber and require review.</div>
          </div>
        </div>

        <div className="card card-shadow card-pad">
          <h3 className="section-h">JDPA</h3>
          <div className="row-flex" style={{justifyContent:'space-between'}}>
            <div>
              <div style={{fontWeight:500}}>Active consent version: <span className="mono">v3</span></div>
              <div className="text-secondary" style={{fontSize:12}}>Published 2025-09-01 · 824 patients consented</div>
            </div>
            <button className="btn btn-secondary">Publish new version</button>
          </div>
        </div>
      </div>
    </div>
  </>
);

Object.assign(window, { App, ScheduleLog, Alerts, Suppliers, NewPatient, RevenueReport, AdminUsers, AdminSettings });

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
