// PharmacyOS — Screens part 3: POS, Patients list, AI Queue, Audit, Reports
const POS = ({ navigate }) => {
  const [cart, setCart] = React.useState([
    { id:1, name:'Panadol Extra Tablets', barcode:'5012345678901', qty:2, price:285 },
    { id:2, name:'Vicks VapoRub 50g', barcode:'5012345678918', qty:1, price:680 },
    { id:3, name:'Centrum Multivitamin 30ct', barcode:'5012345678925', qty:1, price:1850 },
    { id:4, name:'Listerine Cool Mint 250ml', barcode:'5012345678932', qty:1, price:725 },
  ]);
  const [pay, setPay] = React.useState('Cash');
  const [tender, setTender] = React.useState(5000);
  const [redeem, setRedeem] = React.useState(false);

  const subtotal = cart.reduce((s,l)=>s + l.qty*l.price, 0);
  const tax = Math.round(subtotal * 0.15);
  const loyaltyDisc = redeem ? 225 : 0;
  const total = subtotal + tax - loyaltyDisc;
  const change = Math.max(0, tender - total);

  const fmt = (n) => 'JMD ' + n.toLocaleString('en-JM', {minimumFractionDigits:2, maximumFractionDigits:2});

  const updateQty = (id, d) => setCart(c => c.map(l => l.id===id ? {...l, qty: Math.max(1, l.qty+d)} : l));
  const remove = (id) => setCart(c => c.filter(l => l.id !== id));

  return (
    <div className="pos-shell">
      <div className="pos-left">
        <div className="pos-topbar">
          <div className="pos-cashier">
            Counter: <strong>POS-1</strong> · Cashier: <strong>Andrea Clarke</strong> · Shift opened 08:00
          </div>
          <button className="btn btn-secondary" onClick={()=>navigate('/dashboard')}><Icon name="x" size={14}/>Close POS</button>
        </div>

        <input className="pos-search" placeholder="Scan barcode or search product…" autoFocus />

        <div className="pos-cart">
          {cart.length === 0 ? (
            <Empty icon="pos" title="Cart is empty" desc="Scan a barcode or search to add a product." />
          ) : cart.map(l => (
            <div className="pos-line" key={l.id}>
              <div>
                <div className="pos-line-name">{l.name}</div>
                <div className="pos-line-meta">{l.barcode} · @ {fmt(l.price).replace('JMD ','')}</div>
              </div>
              <div className="qty-step">
                <button onClick={()=>updateQty(l.id,-1)}>−</button>
                <span className="v">{l.qty}</span>
                <button onClick={()=>updateQty(l.id,+1)}>+</button>
              </div>
              <div className="pos-line-total">{fmt(l.qty*l.price)}</div>
              <button className="pos-line-rm" onClick={()=>remove(l.id)} aria-label="Remove"><Icon name="trash" size={16}/></button>
            </div>
          ))}
        </div>

        <div className="row-flex" style={{justifyContent:'space-between', fontSize:13, color:'var(--text-secondary)'}}>
          <span>{cart.length} items · {cart.reduce((s,l)=>s+l.qty,0)} units</span>
          <span>Press ⌫ to remove last · F2 to scan again</span>
        </div>
      </div>

      <div className="pos-right">
        <div>
          <div style={{fontSize:12, fontWeight:500, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:8}}>Loyalty</div>
          <input className="input input-mono" placeholder="Phone number…" defaultValue="+1 876 555 0188" style={{height:48, marginBottom:8}}/>
          <div className="pos-loyalty">
            <div>
              <div style={{fontWeight:600}}>Patricia Lyons</div>
              <div style={{fontSize:11, color:'#92400E'}}>Member since 2024 · last visit 2026-04-22</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontWeight:600}}><strong>450</strong> pts</div>
              <div style={{fontSize:11}}>worth {fmt(225)}</div>
            </div>
          </div>
          <label style={{display:'flex', alignItems:'center', gap:8, marginTop:10, fontSize:13, cursor:'pointer'}}>
            <input type="checkbox" checked={redeem} onChange={e=>setRedeem(e.target.checked)}/>
            Apply 450 pts ({fmt(225)}) to this purchase
          </label>
        </div>

        <div>
          <div style={{fontSize:12, fontWeight:500, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:8}}>Payment method</div>
          <div className="pos-pay-tabs" style={{borderRadius:6, border:'1px solid var(--border)', overflow:'hidden'}}>
            {['Cash','Card','Lynk'].map(p => (
              <button key={p} className={`pos-pay-tab ${pay===p?'active':''}`} onClick={()=>setPay(p)}>{p}</button>
            ))}
          </div>
        </div>

        <div className="pos-totals">
          <div className="pos-total-row"><span className="lbl">Subtotal</span><span className="val">{fmt(subtotal)}</span></div>
          <div className="pos-total-row"><span className="lbl">GCT (15%)</span><span className="val">{fmt(tax)}</span></div>
          {redeem && <div className="pos-total-row"><span className="lbl" style={{color:'var(--color-warning)'}}>Loyalty discount</span><span className="val" style={{color:'var(--color-warning)'}}>− {fmt(loyaltyDisc)}</span></div>}
          <div className="pos-total-row grand"><span className="lbl" style={{color:'var(--text-primary)'}}>Total</span><span className="val">{fmt(total)}</span></div>
        </div>

        {pay === 'Cash' && (
          <div>
            <div className="label">Tender</div>
            <input className="pos-tender" type="number" value={tender} onChange={e=>setTender(Number(e.target.value)||0)} />
            <div style={{marginTop:14}}>
              <div style={{fontSize:12, color:'var(--text-secondary)', marginBottom:4}}>Change</div>
              <div className="pos-change">{fmt(change)}</div>
            </div>
          </div>
        )}
        {pay === 'Card' && (
          <div className="alert alert-info">
            <div style={{color:'var(--color-info)'}}><Icon name="info" size={20}/></div>
            <div className="alert-body">
              <div className="alert-title">Insert or tap card on terminal</div>
              <div className="alert-desc">Awaiting card response · {fmt(total)}</div>
            </div>
          </div>
        )}
        {pay === 'Lynk' && (
          <div className="alert alert-info">
            <div style={{color:'var(--color-info)'}}><Icon name="info" size={20}/></div>
            <div className="alert-body">
              <div className="alert-title">Show QR to customer</div>
              <div className="alert-desc">Generated · expires in 02:00</div>
            </div>
          </div>
        )}

        <span className="spacer"></span>
        <button className="btn btn-primary btn-pos" style={{width:'100%', justifyContent:'center'}}><Icon name="check" size={18}/>Confirm sale · {fmt(total)}</button>
        <button className="btn btn-secondary btn-pos" style={{width:'100%', justifyContent:'center'}}>Cancel transaction</button>
      </div>
    </div>
  );
};

const Patients = ({ navigate }) => {
  const cards = [
    { initials:'MB', name:'Marcus Bennett', dob:'1978-04-12', phone:'+1 876 555 0214', insurance:['Sagicor','NHF'], allergy:'Penicillin', consent:true },
    { initials:'PL', name:'Patricia Lyons', dob:'1957-01-09', phone:'+1 876 555 0188', insurance:['NHF'], allergy:null, consent:true },
    { initials:'DR', name:'Devon Reid', dob:'1990-02-08', phone:'+1 876 555 0142', insurance:['Sagicor'], allergy:null, consent:true },
    { initials:'SW', name:'Sandra Williams', dob:'1962-11-30', phone:'+1 876 555 0167', insurance:['NHF'], allergy:'Sulfa', consent:true },
    { initials:'NH', name:'Nadia Henry', dob:'1995-12-04', phone:'+1 876 555 0193', insurance:['CGM'], allergy:null, consent:false },
    { initials:'JF', name:'Janet Forbes', dob:'1955-07-19', phone:'+1 876 555 0102', insurance:['NHF'], allergy:null, consent:true },
  ];
  return (
    <>
      <PageHeader
        title="Patients"
        breadcrumb={['Patients']}
        actions={<button className="btn btn-primary" onClick={()=>navigate('/patients/new')}><Icon name="plus" size={14}/>New patient</button>}
      />
      <div className="content">
        <div className="card card-shadow" style={{padding:20, marginBottom:20, display:'flex', alignItems:'center', gap:12}}>
          <div style={{flex:1}}>
            <input className="input input-search" placeholder="Search by name, DOB, phone, or insurance card #…" style={{height:52, fontSize:15}}/>
          </div>
          <div className="text-secondary" style={{fontSize:13}}>or scan insurance card →</div>
          <button className="btn btn-secondary"><Icon name="barcode" size={14}/>Scan</button>
        </div>

        <h3 className="section-h">Search results · 6</h3>
        <div className="patient-grid">
          {cards.map((p, i) => (
            <div className="card card-shadow" style={{padding:14, cursor:'pointer'}} key={i} onClick={()=>navigate('/patients/' + i)}>
              <div className="row-flex" style={{marginBottom:10}}>
                <div className="avatar" style={{width:36, height:36, fontSize:13}}>{p.initials}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600, fontSize:14}}>{p.name}</div>
                  <div className="text-secondary" style={{fontSize:12}}>DOB {p.dob} · <span className="mono">{p.phone}</span></div>
                </div>
              </div>
              <div style={{display:'flex', gap:4, flexWrap:'wrap'}}>
                {p.insurance.map(x => <Pill variant="info" key={x}>{x}</Pill>)}
                {p.allergy && <Pill variant="allergy" icon="warning">{p.allergy}</Pill>}
                {p.consent
                  ? <Pill variant="success" icon="check">Consent on file</Pill>
                  : <Pill variant="warning" icon="warning">Consent pending</Pill>}
              </div>
            </div>
          ))}
        </div>

        <h3 className="section-h" style={{marginTop:24}}>Recently accessed</h3>
        <div className="text-secondary" style={{fontSize:13}}>Last 10 patients you opened</div>
      </div>
    </>
  );
};

const AIQueue = ({ navigate }) => {
  const rows = [
    { id:'AI-9921', type:'Invoice', sub:'M. Walker', t:'08:12:04', status:'In review', conf:88, by:'A. Clarke' },
    { id:'AI-9920', type:'Rx',      sub:'D. Patel',  t:'08:08:41', status:'In review', conf:62, by:'A. Clarke' },
    { id:'AI-9919', type:'Invoice', sub:'M. Walker', t:'07:59:11', status:'Accepted',  conf:96, by:'A. Clarke' },
    { id:'AI-9918', type:'Rx',      sub:'K. Brown',  t:'07:48:33', status:'Accepted',  conf:94, by:'A. Clarke' },
    { id:'AI-9917', type:'Photo',   sub:'D. Patel',  t:'07:42:18', status:'Rejected',  conf:48, by:'A. Clarke' },
    { id:'AI-9916', type:'Rx',      sub:'A. Clarke', t:'07:31:02', status:'Accepted',  conf:97, by:'A. Clarke' },
  ];
  const statusPill = (s) => s==='In review' ? <Pill variant="warning">In review</Pill> : s==='Accepted' ? <Pill variant="success" icon="check">Accepted</Pill> : <Pill variant="cancelled" icon="x">Rejected</Pill>;
  return (
    <>
      <PageHeader title="AI Job Queue" breadcrumb={['AI','Queue']} actions={<button className="btn btn-secondary"><Icon name="download" size={14}/>Export</button>}/>
      <div className="filter-bar">
        <div className="seg">
          {['All','Pending','In review','Accepted','Rejected'].map(f => <button key={f} className={f==='All'?'active':''}>{f}</button>)}
        </div>
        <div className="seg">
          {['Invoice','Rx','Photo'].map(f => <button key={f}>{f}</button>)}
        </div>
        <span className="spacer"></span>
        <input className="input input-search" placeholder="Filter by submitter…" style={{maxWidth:220}}/>
      </div>
      <div className="content">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Job ID</th><th>Type</th><th>Submitted by</th><th>Submitted at</th><th>Status</th><th style={{textAlign:'right'}}>Confidence</th><th>Reviewed by</th><th></th></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td className="mono">{r.id}</td>
                  <td>{r.type}</td>
                  <td>{r.sub}</td>
                  <td className="mono text-secondary">2026-05-07 {r.t}</td>
                  <td>{statusPill(r.status)}</td>
                  <td className="mono" style={{textAlign:'right'}}>
                    <div style={{display:'inline-flex', alignItems:'center', gap:8}}>
                      <span style={{color: r.conf>=90?'var(--color-success)': r.conf>=80?'var(--color-warning)':'var(--color-error)'}}>{r.conf}%</span>
                      <div className="conf-bar"><div style={{width:r.conf+'%', background: r.conf>=90?'var(--color-success)': r.conf>=80?'var(--color-warning)':'var(--color-error)'}}></div></div>
                    </div>
                  </td>
                  <td>{r.by}</td>
                  <td className="row-actions"><button aria-label="Open"><Icon name="eye" size={14}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const AuditLog = ({ navigate }) => {
  const [open, setOpen] = React.useState(null);
  const rows = [
    { i:0, t:'09:11:42', u:'A. Clarke', a:'Verify Rx', e:'Prescription', eid:'PR-104815', ip:'10.0.4.12' },
    { i:1, t:'09:08:11', u:'D. Patel', a:'Mark filled', e:'Prescription', eid:'PR-104810', ip:'10.0.4.18' },
    { i:2, t:'09:02:55', u:'A. Clarke', a:'Dispense', e:'Prescription', eid:'PR-104803', ip:'10.0.4.12' },
    { i:3, t:'08:51:21', u:'M. Walker', a:'Receive stock', e:'InventoryLot', eid:'LT-29914', ip:'10.0.4.31' },
    { i:4, t:'08:42:08', u:'K. Brown', a:'Create patient', e:'Patient', eid:'PT-00824', ip:'10.0.4.22' },
  ];
  return (
    <>
      <PageHeader title="Audit Log" breadcrumb={['Admin','Audit']} actions={<button className="btn btn-secondary"><Icon name="download" size={14}/>Export</button>}/>
      <div className="filter-bar">
        <input className="input" placeholder="User…" style={{maxWidth:160}}/>
        <input className="input" placeholder="Entity type…" style={{maxWidth:160}}/>
        <input className="input input-mono" placeholder="2026-05-01 → 2026-05-07" style={{maxWidth:240}}/>
        <span className="spacer"></span>
        <span className="text-secondary" style={{fontSize:12}}>Read-only · {rows.length} of 1,422 today</span>
      </div>
      <div className="content">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Entity</th><th>Entity ID</th><th>IP</th><th></th></tr></thead>
            <tbody>
              {rows.map(r => (
                <React.Fragment key={r.i}>
                  <tr onClick={()=>setOpen(open===r.i?null:r.i)}>
                    <td className="mono" style={{fontSize:12}}>2026-05-07 {r.t}</td>
                    <td>{r.u}</td>
                    <td>{r.a}</td>
                    <td>{r.e}</td>
                    <td className="mono">{r.eid}</td>
                    <td className="mono text-secondary">{r.ip}</td>
                    <td className="row-actions"><button><Icon name="chevronDown" size={14}/></button></td>
                  </tr>
                  {open===r.i && (
                    <tr><td colSpan={7} style={{padding:0, background:'var(--color-bg-subtle)'}}>
                      <div className="diff">
                        <div>
                          <div style={{fontSize:11, color:'var(--text-secondary)', marginBottom:6, fontWeight:600}}>BEFORE</div>
                          <pre>{`{
  "status": "received",
  "verified_by": null,
  "verified_at": null
}`}</pre>
                        </div>
                        <div>
                          <div style={{fontSize:11, color:'var(--text-secondary)', marginBottom:6, fontWeight:600}}>AFTER</div>
                          <pre>{`{
  "status": "verified",
  "verified_by": "A. Clarke",
  "verified_at": "2026-05-07T09:11:42Z"
}`}</pre>
                        </div>
                      </div>
                    </td></tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const Reports = ({ navigate }) => {
  const cards = [
    { route:'/reports/inventory', title:'Inventory', desc:'Current stock and expiry reporting.', last:'Today 08:00' },
    { route:'/reports/dispensing', title:'Dispensing', desc:'Volume, top drugs, revenue contribution.', last:'Today 08:00' },
    { route:'/reports/schedule-log', title:'Schedule Log', desc:'Controlled-substance regulatory log.', last:'Today 06:00' },
    { route:'/reports/revenue', title:'Revenue', desc:'Pharmacy and retail revenue breakdown.', last:'Today 08:00' },
    { route:null, title:'Insurance claims', desc:'AIS-linked claims reporting.', last:'—', phase2:true },
  ];
  return (
    <>
      <PageHeader title="Reports" breadcrumb={['Reports']} />
      <div className="content">
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:16}}>
          {cards.map(c => (
            <div key={c.title} className="card card-shadow card-pad" style={{cursor: c.route?'pointer':'default', opacity: c.phase2?0.6:1}} onClick={()=>c.route && navigate(c.route)}>
              <div className="row-flex" style={{marginBottom:8}}>
                <div style={{width:36, height:36, background:'var(--color-primary-50)', color:'var(--color-primary)', borderRadius:6, display:'grid', placeItems:'center'}}>
                  <Icon name="reports" size={18}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:15, fontWeight:600}}>{c.title}{c.phase2 && <span className="text-secondary" style={{fontSize:11, marginLeft:8}}>[Phase 2]</span>}</div>
                  <div className="text-secondary" style={{fontSize:12}}>{c.desc}</div>
                </div>
              </div>
              <div className="text-secondary" style={{fontSize:11}}>Last generated: <span className="mono">{c.last}</span></div>
            </div>
          ))}
        </div>

        <h3 className="section-h" style={{marginTop:32}}>Top drugs by dispensing volume · last 30 days</h3>
        <div className="card card-shadow card-pad">
          {[
            { name:'Lisinopril 10mg', val:412 },
            { name:'Amlodipine 5mg', val:368 },
            { name:'Metformin 850mg', val:341 },
            { name:'Atorvastatin 20mg', val:298 },
            { name:'Hydrochlorothiazide 25mg', val:212 },
            { name:'Amoxicillin 500mg', val:188 },
            { name:'Salbutamol Inhaler', val:142 },
          ].map((b, i) => (
            <div className="bar-row" key={i}>
              <div className="name">{b.name}</div>
              <div><div className="bar" style={{width: (b.val/412*100) + '%'}}></div></div>
              <div className="val">{b.val}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

Object.assign(window, { POS, Patients, AIQueue, AuditLog, Reports });
