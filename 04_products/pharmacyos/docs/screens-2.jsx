// PharmacyOS — Screens part 2: AI Scanner, Inventory, Patient
const AIScanner = ({ navigate }) => {
  const [confirmed, setConfirmed] = React.useState({});
  const fields = [
    { id:'supplier', label:'Supplier', value:'Pan-Jam Pharmaceuticals Ltd.', conf:98 },
    { id:'invoice', label:'Invoice number', value:'PJP-2026-08412', conf:96, mono:true },
    { id:'date', label:'Invoice date', value:'2026-05-07', conf:99, mono:true },
  ];
  const lines = [
    { drug:'Atorvastatin 20mg', qty:240, lot:'AV-9928-A', exp:'2027-08', cost:'42.50', confs:{drug:97,qty:99,lot:88,exp:94,cost:96} },
    { drug:'Amlodipine 5mg', qty:480, lot:'AML-7733', exp:'2028-02', cost:'18.20', confs:{drug:99,qty:99,lot:96,exp:99,cost:97} },
    { drug:'Metformin 850mg', qty:360, lot:'MF-Q-1141', exp:'2027-12', cost:'14.80', confs:{drug:96,qty:91,lot:62,exp:99,cost:78} },
    { drug:'Salbutamol Inhaler 100mcg', qty:48, lot:'SAL-2245', exp:'2027-04', cost:'285.00', confs:{drug:99,qty:99,lot:99,exp:96,cost:99} },
  ];
  const confClass = (c) => c >= 90 ? 'green' : c >= 80 ? 'amber' : 'red';

  return (
    <>
      <PageHeader
        title="AI Invoice Scanner"
        breadcrumb={['Inventory','AI Scanner']}
        actions={<>
          <button className="btn btn-secondary"><Icon name="upload" size={14}/>Upload another</button>
        </>}
      />
      <div className="content">
        <div className="row-flex" style={{marginBottom:16}}>
          <span className="text-secondary" style={{fontSize:13}}>
            <span className="mono">PJP-2026-08412.pdf</span> · uploaded 08:12 by M. Walker · 4 line items extracted
          </span>
          <span className="spacer"></span>
          <span className="ai-threshold-ref">Auto-accept ≥ 85% (system setting)</span>
        </div>

        <div className="ai-split">
          <div className="ai-doc">
            <div className="ai-doc-img">
              <div className="doc-h">PAN-JAM PHARMACEUTICALS LTD.</div>
              <div className="doc-sub">12 Half Way Tree Road, Kingston · Tel +1 876 555 0188</div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:14, fontSize:10}}>
                <div>Invoice: <strong>PJP-2026-08412</strong></div>
                <div>Date: 07-MAY-2026</div>
              </div>
              <div className="doc-sub" style={{marginBottom:6, fontSize:10}}>Bill to: Winchester Global Pharmacy · 47 Hope Rd</div>
              <div className="doc-row head">
                <div>Item</div><div>Qty</div><div>Lot</div><div>Exp</div><div>Cost</div>
              </div>
              {lines.map((l, i) => (
                <div className="doc-row" key={i}>
                  <div>{l.drug}</div>
                  <div>{l.qty}</div>
                  <div style={{textTransform:'uppercase'}}>{l.lot}</div>
                  <div>{l.exp}</div>
                  <div>${l.cost}</div>
                </div>
              ))}
              <div style={{marginTop:14, textAlign:'right', fontWeight:700, fontSize:11}}>TOTAL: $32,418.00</div>
            </div>
            <div className="ai-zoom">
              <button>−</button><button>+</button><button>⤢</button>
            </div>
          </div>

          <div style={{display:'flex', flexDirection:'column'}}>
            <div className="ai-extracted">
              {fields.map(f => (
                <div className="ai-field" key={f.id}>
                  <div className="ai-field-head">
                    <div className="ai-field-label">{f.label}</div>
                    <span className={`ai-conf ${confClass(f.conf)}`}><span className="dot"></span>{f.conf}%</span>
                  </div>
                  <input className={`input ${f.mono?'input-mono':''}`} defaultValue={f.value} />
                </div>
              ))}

              <div style={{marginTop:8, marginBottom:4}}>
                <div className="ai-field-label">Line items ({lines.length})</div>
              </div>

              {lines.map((l, i) => {
                const flagged = Object.values(l.confs).some(c => c < 85);
                return (
                  <div key={i} style={{padding:14, border:`1px solid ${flagged?'var(--color-warning)':'var(--border)'}`, borderRadius:6, background:flagged?'#FFFBEB':'white', display:'flex', flexDirection:'column', gap:8}}>
                    <div className="row-flex" style={{justifyContent:'space-between'}}>
                      <strong style={{fontSize:13}}>{l.drug}</strong>
                      {flagged
                        ? <span style={{fontSize:11, color:'var(--color-warning)', fontWeight:500}}>Review required</span>
                        : <span style={{fontSize:11, color:'var(--color-success)'}}><Icon name="check" size={12}/> Auto-accept</span>}
                    </div>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1.2fr 1fr 1fr', gap:8}}>
                      <div>
                        <div className="ai-field-label">Qty</div>
                        <input className="input input-mono" defaultValue={l.qty} style={{height:36}}/>
                        <span className={`ai-conf ${confClass(l.confs.qty)}`} style={{marginTop:4}}><span className="dot"></span>{l.confs.qty}%</span>
                      </div>
                      <div>
                        <div className="ai-field-label">Lot</div>
                        <input className={`input input-mono ${l.confs.lot<85?'flagged':''}`} defaultValue={l.lot} style={{height:36}}/>
                        <span className={`ai-conf ${confClass(l.confs.lot)}`} style={{marginTop:4}}><span className="dot"></span>{l.confs.lot}%</span>
                      </div>
                      <div>
                        <div className="ai-field-label">Exp</div>
                        <input className="input input-mono" defaultValue={l.exp} style={{height:36}}/>
                        <span className={`ai-conf ${confClass(l.confs.exp)}`} style={{marginTop:4}}><span className="dot"></span>{l.confs.exp}%</span>
                      </div>
                      <div>
                        <div className="ai-field-label">Cost (JMD)</div>
                        <input className={`input input-mono ${l.confs.cost<85?'flagged':''}`} defaultValue={l.cost} style={{height:36}}/>
                        <span className={`ai-conf ${confClass(l.confs.cost)}`} style={{marginTop:4}}><span className="dot"></span>{l.confs.cost}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="ai-actions">
              <button className="btn btn-destructive"><Icon name="x" size={14}/>Reject</button>
              <button className="btn btn-secondary">Save draft</button>
              <button className="btn btn-primary"><Icon name="check" size={14}/>Confirm all (4)</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Inventory = ({ navigate }) => {
  const [filter, setFilter] = React.useState('All');
  const rows = [
    { name:'Amoxicillin 500mg', generic:'Amoxicillin', cat:'Antibiotic', stock:840, reorder:200, exp:'2027-08', nhf:true, sched:false, status:'ok' },
    { name:'Atorvastatin 20mg', generic:'Atorvastatin', cat:'Statin', stock:240, reorder:120, exp:'2027-08', nhf:true, sched:false, status:'ok' },
    { name:'Atenolol 50mg', generic:'Atenolol', cat:'Beta blocker', stock:240, reorder:200, exp:'2026-05', nhf:true, sched:false, status:'expiring' },
    { name:'Insulin Glargine', generic:'Insulin glargine', cat:'Antidiabetic', stock:3, reorder:10, exp:'2027-02', nhf:false, sched:false, status:'low' },
    { name:'Metformin 850mg', generic:'Metformin HCl', cat:'Antidiabetic', stock:14, reorder:60, exp:'2027-12', nhf:true, sched:false, status:'low' },
    { name:'Oxycodone 5mg', generic:'Oxycodone HCl', cat:'Analgesic', stock:112, reorder:50, exp:'2027-03', nhf:false, sched:true, status:'ok' },
    { name:'Diazepam 5mg', generic:'Diazepam', cat:'Anxiolytic', stock:64, reorder:40, exp:'2028-01', nhf:false, sched:true, status:'ok' },
    { name:'Lisinopril 10mg', generic:'Lisinopril', cat:'ACE inhibitor', stock:1240, reorder:300, exp:'2027-11', nhf:true, sched:false, status:'ok' },
    { name:'Sertraline 50mg', generic:'Sertraline HCl', cat:'SSRI', stock:380, reorder:120, exp:'2028-04', nhf:false, sched:false, status:'ok' },
    { name:'Salbutamol Inhaler', generic:'Salbutamol', cat:'Bronchodilator', stock:42, reorder:20, exp:'2027-04', nhf:false, sched:false, status:'ok' },
  ];
  const statusPill = (s) => s==='low' ? <Pill variant="warning" icon="warning">Low</Pill> : s==='expiring' ? <Pill variant="cancelled" icon="warning">Expiring</Pill> : <Pill variant="success" icon="check">In stock</Pill>;
  return (
    <>
      <PageHeader
        title="Inventory · Stock"
        breadcrumb={['Inventory','Stock']}
        actions={<>
          <button className="btn btn-secondary"><Icon name="ai" size={14}/>AI Scanner</button>
          <button className="btn btn-primary"><Icon name="plus" size={14}/>Receive stock</button>
        </>}
      />
      <div className="filter-bar">
        <div className="seg">
          {['All','Low Stock','Out of Stock','Expiring Soon','Schedule'].map(f => (
            <button key={f} className={filter===f?'active':''} onClick={()=>setFilter(f)}>{f}</button>
          ))}
        </div>
        <div style={{flex:1, maxWidth:320}}>
          <input className="input input-search" placeholder="Search drug…" />
        </div>
      </div>
      <div className="content">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th className="sortable">Drug name <span className="sort">↑</span></th>
                <th>Generic</th>
                <th>Category</th>
                <th style={{textAlign:'right'}}>Stock</th>
                <th style={{textAlign:'right'}}>Reorder pt</th>
                <th>Nearest exp</th>
                <th>Tags</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={{fontWeight:500}}>{r.name}</td>
                  <td className="text-secondary">{r.generic}</td>
                  <td className="text-secondary">{r.cat}</td>
                  <td className="mono" style={{textAlign:'right', color: r.status==='low'?'var(--color-error)': r.status==='expiring'?'var(--color-warning)':'var(--text-primary)'}}>{r.stock.toLocaleString()}</td>
                  <td className="mono text-secondary" style={{textAlign:'right'}}>{r.reorder}</td>
                  <td className="mono">{r.exp}</td>
                  <td>
                    <div style={{display:'flex', gap:4}}>
                      {r.nhf && <Pill variant="nhf" icon="shield">NHF</Pill>}
                      {r.sched && <Pill variant="schedule" icon="lock">Sch</Pill>}
                    </div>
                  </td>
                  <td>{statusPill(r.status)}</td>
                  <td className="row-actions">
                    <button aria-label="View"><Icon name="eye" size={14}/></button>
                    <button aria-label="Edit"><Icon name="edit" size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-footer">
            <span>Showing 1–10 of 412</span>
            <div className="pager">
              <button disabled>‹</button>
              <button className="active">1</button><button>2</button><button>3</button><button>…</button><button>42</button>
              <button>›</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const PatientProfile = ({ navigate }) => {
  const [tab, setTab] = React.useState('Overview');
  return (
    <>
      <PageHeader
        title="Patients"
        breadcrumb={['Patients','Marcus Bennett']}
        actions={<>
          <button className="btn btn-secondary"><Icon name="edit" size={14}/>Edit profile</button>
          <button className="btn btn-primary" onClick={()=>navigate('/prescriptions/new')}><Icon name="plus" size={14}/>New prescription</button>
        </>}
      />
      <div className="patient-head">
        <div className="avatar">MB</div>
        <div className="patient-head-info">
          <h1>Marcus Bennett</h1>
          <div className="sub">DOB 1978-04-12 · 48y · M · +1 876 555 0214 · PT-00824</div>
        </div>
        <span className="spacer"></span>
        <div style={{display:'flex', gap:6}}>
          <Pill variant="allergy" icon="warning">Allergies: Penicillin</Pill>
          <Pill variant="success" icon="check">JDPA consent · v3</Pill>
        </div>
      </div>
      <div className="tabs">
        {['Overview','Medication History','Insurance','JDPA'].map(t => (
          <button key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="content">
        {tab === 'Overview' && (
          <div className="cols-60-40">
            <div>
              <div className="alert alert-warning" style={{marginBottom:16}}>
                <div style={{color:'var(--color-warning)'}}><Icon name="warning" size={20}/></div>
                <div className="alert-body">
                  <div className="alert-title">Allergy: Penicillin (severe — anaphylaxis)</div>
                  <div className="alert-desc">Recorded 2024-08-12 by Dr. A. Henry. Avoid all β-lactam antibiotics.</div>
                </div>
              </div>
              <h3 className="section-h">Active prescriptions</h3>
              <div className="table-wrap" style={{marginBottom:24}}>
                <table className="table">
                  <thead><tr><th>Rx ID</th><th>Drug</th><th style={{textAlign:'right'}}>Qty</th><th>Status</th><th>Issued</th></tr></thead>
                  <tbody>
                    <tr onClick={()=>navigate('/prescriptions/PR-104821')}><td className="mono">PR-104821</td><td>Amoxicillin 500mg</td><td className="mono" style={{textAlign:'right'}}>21</td><td><Pill variant="received" icon="inbox">Received</Pill></td><td className="mono">2026-05-07</td></tr>
                    <tr><td className="mono">PR-103512</td><td>Lisinopril 10mg</td><td className="mono" style={{textAlign:'right'}}>30</td><td><Pill variant="dispensed" icon="archive">Dispensed</Pill></td><td className="mono">2026-04-12</td></tr>
                    <tr><td className="mono">PR-102104</td><td>Atorvastatin 20mg</td><td className="mono" style={{textAlign:'right'}}>30</td><td><Pill variant="dispensed" icon="archive">Dispensed</Pill></td><td className="mono">2026-03-08</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 className="section-h">Recent dispensing</h3>
              <div className="table-wrap">
                <table className="table">
                  <thead><tr><th>Date</th><th>Drug</th><th>Dispensed by</th><th>Pharmacist</th></tr></thead>
                  <tbody>
                    <tr><td className="mono">2026-04-12 14:22</td><td>Lisinopril 10mg · 30</td><td>D. Patel</td><td>A. Clarke</td></tr>
                    <tr><td className="mono">2026-03-08 11:15</td><td>Atorvastatin 20mg · 30</td><td>K. Brown</td><td>A. Clarke</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{display:'flex', flexDirection:'column', gap:16}}>
              <div className="card card-shadow card-pad">
                <h3 className="section-h">Demographics</h3>
                <div className="detail-row"><div className="detail-label">DOB</div><div className="detail-value mono">1978-04-12</div></div>
                <div className="detail-row"><div className="detail-label">Sex</div><div className="detail-value">Male</div></div>
                <div className="detail-row"><div className="detail-label">Phone</div><div className="detail-value mono">+1 876 555 0214</div></div>
                <div className="detail-row"><div className="detail-label">Email</div><div className="detail-value">m.bennett@example.com</div></div>
                <div className="detail-row"><div className="detail-label">Address</div><div className="detail-value">12 Caymanas Way,<br/>Spanish Town</div></div>
              </div>
              <div className="card card-shadow card-pad">
                <h3 className="section-h">Insurance on file</h3>
                <div style={{padding:'10px 0', borderBottom:'1px solid var(--border-subtle)'}}>
                  <div style={{fontWeight:500}}>Sagicor Group Health</div>
                  <div className="text-secondary mono" style={{fontSize:12}}>Card #SAG-447-22198 · exp 2027-12</div>
                </div>
                <div style={{padding:'10px 0'}}>
                  <div style={{fontWeight:500}}>NHF</div>
                  <div className="text-secondary mono" style={{fontSize:12}}>NHF-JM-998-2241 · active</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab !== 'Overview' && (
          <Empty icon="fileText" title={`${tab} view`} desc="Tab content rendered here per the handoff doc spec." />
        )}
      </div>
    </>
  );
};

Object.assign(window, { AIScanner, Inventory, PatientProfile });
