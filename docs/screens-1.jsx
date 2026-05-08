// PharmacyOS — Screens part 1: Dashboard, Prescriptions, Rx Detail
const Dashboard = ({ navigate }) => {
  const queue = {
    received: [
      { id: 'PR-104821', name: 'Marcus Bennett', drug: 'Amoxicillin 500mg · 21 caps', time: '08:42', tags: [] },
      { id: 'PR-104822', name: 'Sandra Williams', drug: 'Lisinopril 10mg · 30 tabs', time: '08:51', tags: ['nhf'] },
      { id: 'PR-104823', name: 'Devon Reid', drug: 'Oxycodone 5mg · 14 tabs', time: '09:03', tags: ['schedule'] },
      { id: 'PR-104824', name: 'Janet Forbes', drug: 'Metformin 850mg · 60 tabs', time: '09:11', tags: ['nhf'] },
    ],
    verified: [
      { id: 'PR-104815', name: 'Roy Thompson', drug: 'Atorvastatin 20mg · 30 tabs', time: '08:15', tags: [] },
      { id: 'PR-104816', name: 'Nadia Henry', drug: 'Salbutamol Inhaler · 1 unit', time: '08:22', tags: [] },
      { id: 'PR-104818', name: 'Carl Morgan', drug: 'Diazepam 5mg · 10 tabs', time: '08:30', tags: ['schedule'] },
    ],
    filled: [
      { id: 'PR-104810', name: 'Patricia Lyons', drug: 'Amlodipine 5mg · 30 tabs', time: '08:01', tags: ['nhf'] },
      { id: 'PR-104812', name: 'Errol Daley', drug: 'Omeprazole 20mg · 14 caps', time: '08:08', tags: [] },
    ],
    dispensed: [
      { id: 'PR-104801', name: 'Tracy Powell', drug: 'Cetirizine 10mg · 14 tabs', time: '07:42', tags: [] },
      { id: 'PR-104803', name: 'Jermaine Cole', drug: 'Ibuprofen 400mg · 20 tabs', time: '07:48', tags: [] },
    ],
  };

  return (
    <>
      <PageHeader title="Dashboard" greeting="Tuesday, May 7 — 09:14 · Counter A" />
      <div className="content" style={{display:'flex', flexDirection:'column', gap:24}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16}}>
          <Metric label="Prescriptions Today" value="47" trend="+12% vs yesterday" trendDir="up" />
          <Metric label="Active Alerts" value="12" trend="3 critical" trendDir="down" />
          <Metric label="Revenue Today" value="$184,520" trend="+8.4%" trendDir="up" />
          <Metric label="Patients Seen" value="38" trend="+4 from yesterday" trendDir="up" />
        </div>

        <div className="cols-60-40">
          <div>
            <div className="row-flex" style={{marginBottom:12}}>
              <h2 className="section-h" style={{margin:0}}>Prescription Queue</h2>
              <span className="text-secondary" style={{fontSize:12}}>Top 10 per stage</span>
              <span className="spacer"></span>
              <button className="btn btn-tertiary" onClick={() => navigate('/prescriptions')}>Open full board <Icon name="chevron" size={14}/></button>
            </div>
            <div className="kanban">
              {[
                { key: 'received', label: 'Received', items: queue.received },
                { key: 'verified', label: 'Verified', items: queue.verified },
                { key: 'filled', label: 'Filled', items: queue.filled },
                { key: 'dispensed', label: 'Dispensed', items: queue.dispensed },
              ].map(col => (
                <div className="kan-col" key={col.key}>
                  <div className={`kan-col-bar ${col.key}`}></div>
                  <div className="kan-col-head">
                    <div className="kan-col-title">{col.label}</div>
                    <div className="kan-count">{col.items.length}</div>
                  </div>
                  <div className="kan-body">
                    {col.items.slice(0, 4).map(c => (
                      <div className="rx-card" key={c.id} onClick={() => navigate('/prescriptions/' + c.id)} style={{padding:'10px'}}>
                        <div className="rx-card-name" style={{fontSize:13}}>{c.name}</div>
                        <div className="rx-card-meta" style={{fontSize:11}}>{c.drug.split(' · ')[0]}</div>
                        <div className="rx-card-bottom" style={{marginTop:6}}>
                          <span className="rx-card-time">{c.time}</span>
                          <div className="rx-card-tags">
                            {c.tags.includes('schedule') && <Pill variant="schedule" icon="lock">Sch</Pill>}
                            {c.tags.includes('nhf') && <Pill variant="nhf" icon="shield">NHF</Pill>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="section-h">Alerts</h2>
            <div style={{display:'flex', flexDirection:'column', gap:10}}>
              <div className="alert alert-error">
                <div style={{color:'var(--color-error)'}}><Icon name="warning" size={20} /></div>
                <div className="alert-body">
                  <div className="alert-title">Atenolol 50mg expiring in 12 days</div>
                  <div className="alert-desc">Lot <span className="mono">LT-22841</span> · 240 tabs · Exp May 19</div>
                </div>
                <div className="alert-actions"><button className="btn btn-secondary" style={{height:30, fontSize:12}}>Adjust</button></div>
              </div>
              <div className="alert alert-warning">
                <div style={{color:'var(--color-warning)'}}><Icon name="warning" size={20} /></div>
                <div className="alert-body">
                  <div className="alert-title">Insulin Glargine — low stock</div>
                  <div className="alert-desc">3 units left · reorder at 10</div>
                </div>
                <div className="alert-actions"><button className="btn btn-primary" style={{height:30, fontSize:12}}>Reorder</button></div>
              </div>
              <div className="alert alert-warning">
                <div style={{color:'var(--color-warning)'}}><Icon name="warning" size={20} /></div>
                <div className="alert-body">
                  <div className="alert-title">Metformin 850mg — low stock</div>
                  <div className="alert-desc">14 tabs · reorder at 60</div>
                </div>
                <div className="alert-actions"><button className="btn btn-primary" style={{height:30, fontSize:12}}>Reorder</button></div>
              </div>
              <div className="alert alert-info">
                <div style={{color:'var(--color-info)'}}><Icon name="info" size={20} /></div>
                <div className="alert-body">
                  <div className="alert-title">3 AI invoices awaiting review</div>
                  <div className="alert-desc">From Pan-Jam Pharma · uploaded 08:12</div>
                </div>
                <div className="alert-actions"><button className="btn btn-tertiary" onClick={() => navigate('/inventory/scanner')}>Review</button></div>
              </div>
            </div>

            <h2 className="section-h" style={{marginTop:24}}>Recent activity</h2>
            <div className="table-wrap">
              <table className="table">
                <tbody>
                  {[
                    { t: '09:11', u: 'A. Clarke', a: 'Verified Rx', e: 'PR-104815' },
                    { t: '09:08', u: 'D. Patel', a: 'Filled Rx', e: 'PR-104810' },
                    { t: '09:02', u: 'A. Clarke', a: 'Dispensed Rx', e: 'PR-104803' },
                    { t: '08:51', u: 'M. Walker', a: 'Received stock', e: 'INV-02211' },
                    { t: '08:42', u: 'K. Brown', a: 'New patient', e: 'PT-00824' },
                  ].map((r, i) => (
                    <tr key={i}>
                      <td className="mono" style={{color:'var(--text-secondary)', fontSize:12, width:60}}>{r.t}</td>
                      <td style={{fontSize:12.5}}>{r.u}</td>
                      <td style={{fontSize:12.5, color:'var(--text-secondary)'}}>{r.a}</td>
                      <td className="mono" style={{fontSize:12}}>{r.e}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const PrescriptionsKanban = ({ navigate }) => {
  const [filter, setFilter] = React.useState('All');
  const cols = [
    { key:'received', label:'Received', items: [
      { id:'PR-104821', name:'Marcus Bennett', dob:'1978-04-12', drug:'Amoxicillin 500mg', qty:21, time:'08:42', tags:[] },
      { id:'PR-104822', name:'Sandra Williams', dob:'1962-11-30', drug:'Lisinopril 10mg', qty:30, time:'08:51', tags:['nhf'] },
      { id:'PR-104823', name:'Devon Reid', dob:'1990-02-08', drug:'Oxycodone 5mg', qty:14, time:'09:03', tags:['schedule'] },
      { id:'PR-104824', name:'Janet Forbes', dob:'1955-07-19', drug:'Metformin 850mg', qty:60, time:'09:11', tags:['nhf'] },
      { id:'PR-104825', name:'Howard Singh', dob:'1981-09-02', drug:'Levothyroxine 50mcg', qty:30, time:'09:14', tags:[] },
    ]},
    { key:'verified', label:'Verified', items: [
      { id:'PR-104815', name:'Roy Thompson', dob:'1948-03-22', drug:'Atorvastatin 20mg', qty:30, time:'08:15', tags:[] },
      { id:'PR-104816', name:'Nadia Henry', dob:'1995-12-04', drug:'Salbutamol Inhaler', qty:1, time:'08:22', tags:[] },
      { id:'PR-104818', name:'Carl Morgan', dob:'1972-06-15', drug:'Diazepam 5mg', qty:10, time:'08:30', tags:['schedule'] },
      { id:'PR-104819', name:'Latoya James', dob:'1988-08-25', drug:'Sertraline 50mg', qty:30, time:'08:35', tags:[] },
    ]},
    { key:'filled', label:'Filled', items: [
      { id:'PR-104810', name:'Patricia Lyons', dob:'1957-01-09', drug:'Amlodipine 5mg', qty:30, time:'08:01', tags:['nhf'] },
      { id:'PR-104812', name:'Errol Daley', dob:'1969-11-18', drug:'Omeprazole 20mg', qty:14, time:'08:08', tags:[] },
      { id:'PR-104813', name:'Yvonne Grant', dob:'1976-05-30', drug:'Hydrochlorothiazide 25mg', qty:30, time:'08:12', tags:['nhf'] },
    ]},
    { key:'dispensed', label:'Dispensed', items: [
      { id:'PR-104801', name:'Tracy Powell', dob:'1984-10-04', drug:'Cetirizine 10mg', qty:14, time:'07:42', tags:[] },
      { id:'PR-104803', name:'Jermaine Cole', dob:'1991-03-17', drug:'Ibuprofen 400mg', qty:20, time:'07:48', tags:[] },
      { id:'PR-104805', name:'Marcia Burke', dob:'1963-08-21', drug:'Loratadine 10mg', qty:30, time:'07:55', tags:[] },
    ]},
  ];
  return (
    <>
      <PageHeader
        title="Prescriptions"
        breadcrumb={['PharmacyOS','Prescriptions']}
        actions={<>
          <button className="btn btn-secondary"><Icon name="search" size={14}/>Find Rx</button>
          <button className="btn btn-primary" onClick={() => navigate('/prescriptions/new')}><Icon name="plus" size={14}/>New prescription</button>
        </>}
      />
      <div className="filter-bar">
        <div className="seg">
          {['All','Mine','Today','Schedule'].map(f => (
            <button key={f} className={filter===f?'active':''} onClick={()=>setFilter(f)}>{f}</button>
          ))}
        </div>
        <div style={{flex:1, maxWidth:360}}>
          <input className="input input-search" placeholder="Search by patient name or Rx ID…" />
        </div>
        <span className="spacer"></span>
        <span className="text-secondary" style={{fontSize:12}}>{cols.reduce((s,c)=>s+c.items.length,0)} prescriptions</span>
      </div>
      <div className="content">
        <div className="kanban">
          {cols.map(col => (
            <div className="kan-col" key={col.key}>
              <div className={`kan-col-bar ${col.key}`}></div>
              <div className="kan-col-head">
                <div className="kan-col-title">{col.label}</div>
                <div className="kan-count">{col.items.length}</div>
              </div>
              <div className="kan-body">
                {col.items.map(c => (
                  <div className="rx-card" key={c.id} onClick={() => navigate('/prescriptions/' + c.id)}>
                    <div className="rx-card-name">{c.name}</div>
                    <div className="rx-card-meta">DOB {c.dob} · <span className="mono">{c.id}</span></div>
                    <div className="rx-card-drug">{c.drug} · <span className="mono">qty {c.qty}</span></div>
                    <div className="rx-card-bottom">
                      <span className="rx-card-time">{c.time}</span>
                      <div className="rx-card-tags">
                        {c.tags.includes('schedule') && <Pill variant="schedule" icon="lock">Schedule</Pill>}
                        {c.tags.includes('nhf') && <Pill variant="nhf" icon="shield">NHF</Pill>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const RxDetail = ({ id, navigate }) => {
  const rx = {
    id: id || 'PR-104823',
    patient: 'Devon Reid', dob: '1990-02-08', phone: '+1 876 555 0142',
    prescriber: 'Dr. Allison Henry', regNo: 'JM-MED-44218',
    drug: 'Oxycodone 5mg tablets', dosage: '1 tab every 6 hours as needed', qty: 14, refills: 0,
    issued: '2026-05-06', received: '2026-05-07 09:03',
    schedule: true, nhf: false,
    notes: 'Patient post-op (knee replacement). Confirmed allergy: none. Pain management for 5 days only.',
  };
  return (
    <>
      <PageHeader
        title={<span className="mono" style={{fontWeight:600, fontSize:22}}>Rx {rx.id}</span>}
        breadcrumb={['Prescriptions', rx.id]}
        greeting={<span><strong style={{color:'var(--text-primary)'}}>{rx.patient}</strong> · DOB {rx.dob} · <span className="mono">{rx.phone}</span></span>}
        actions={<>
          <button className="btn btn-secondary" onClick={()=>navigate('/prescriptions')}><Icon name="x" size={14}/>Close</button>
          <button className="btn btn-secondary"><Icon name="edit" size={14}/>Edit</button>
        </>}
      />
      <div className="content">
        <div className="card card-shadow card-pad" style={{marginBottom:20}}>
          <Stages stage="received" />
        </div>
        <div className="cols-60-40">
          <div className="card card-shadow card-pad">
            <h3 className="section-h">Prescription details</h3>
            <div style={{display:'flex', gap:6, marginBottom:16}}>
              {rx.schedule && <Pill variant="schedule" icon="lock">Schedule II</Pill>}
              {rx.nhf && <Pill variant="nhf" icon="shield">NHF</Pill>}
              <Pill variant="received" icon="inbox">Received</Pill>
            </div>
            <div>
              <div className="detail-row"><div className="detail-label">Patient</div><div className="detail-value">{rx.patient}</div></div>
              <div className="detail-row"><div className="detail-label">DOB</div><div className="detail-value">{rx.dob}</div></div>
              <div className="detail-row"><div className="detail-label">Prescriber</div><div className="detail-value">{rx.prescriber}</div></div>
              <div className="detail-row"><div className="detail-label">Reg. number</div><div className="detail-value mono">{rx.regNo}</div></div>
              <div className="detail-row"><div className="detail-label">Drug</div><div className="detail-value">{rx.drug}</div></div>
              <div className="detail-row"><div className="detail-label">Dosage</div><div className="detail-value">{rx.dosage}</div></div>
              <div className="detail-row"><div className="detail-label">Quantity</div><div className="detail-value mono">{rx.qty} tabs</div></div>
              <div className="detail-row"><div className="detail-label">Refills</div><div className="detail-value mono">{rx.refills}</div></div>
              <div className="detail-row"><div className="detail-label">Date issued</div><div className="detail-value mono">{rx.issued}</div></div>
              <div className="detail-row"><div className="detail-label">Received at</div><div className="detail-value mono">{rx.received}</div></div>
              <div className="detail-row"><div className="detail-label">Attached image</div><div className="detail-value"><a className="btn btn-tertiary" style={{padding:0}}><Icon name="eye" size={14}/>View Rx scan</a></div></div>
            </div>
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:16}}>
            <div className="card card-shadow card-pad">
              <h3 className="section-h">Dispensing actions</h3>
              <div className="alert alert-error" style={{marginBottom:16}}>
                <div style={{color:'var(--color-error)'}}><Icon name="lock" size={18}/></div>
                <div className="alert-body">
                  <div className="alert-title">Schedule II controlled substance</div>
                  <div className="alert-desc">Pharmacist signoff required at dispense. Auto-logs to Schedule Log.</div>
                </div>
              </div>
              <button className="btn btn-primary btn-lg" style={{width:'100%', marginBottom:8, justifyContent:'center'}}><Icon name="check" size={16}/>Verify prescription</button>
              <button className="btn btn-secondary btn-lg" style={{width:'100%', marginBottom:8, justifyContent:'center'}} disabled><Icon name="pkg" size={16}/>Mark filled</button>
              <button className="btn btn-secondary btn-lg" style={{width:'100%', justifyContent:'center'}} disabled><Icon name="archive" size={16}/>Dispense</button>
              <div style={{marginTop:14, fontSize:12, color:'var(--text-secondary)'}}>Insurance claim: <span className="text-secondary">[Phase 2]</span></div>
            </div>

            <div className="card card-shadow card-pad">
              <h3 className="section-h">Stock check</h3>
              <div className="row-flex" style={{justifyContent:'space-between'}}>
                <div>
                  <div style={{fontWeight:500}}>Oxycodone 5mg</div>
                  <div className="text-secondary" style={{fontSize:12}}>Lot LT-22189 · Exp 2027-03</div>
                </div>
                <div className="mono" style={{fontSize:18, color:'var(--color-success)'}}>112 tabs</div>
              </div>
            </div>

            <div className="card card-shadow card-pad">
              <h3 className="section-h">Notes</h3>
              <textarea className="input" rows="4" defaultValue={rx.notes} style={{height:'auto', padding:12}}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { Dashboard, PrescriptionsKanban, RxDetail });
