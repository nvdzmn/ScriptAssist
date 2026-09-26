import { useEffect, useMemo, useState } from 'react';
import { dosingOptionsFor } from '../data/dosingOptions';

export default function EHRLayout({ patient, drugs, selectedDrug, order, onOrderChange, onDosePlanChange, onSelectDrug, copayAttached, onSwitchPatient, onSave, onCancel, onTransmit, transmitted }) {
  const [search, setSearch] = useState(selectedDrug?.fullName || '');
  const [open, setOpen] = useState(false);
  const options = useMemo(() => drugs.filter((drug) => `${drug.fullName} ${drug.genericName}`.toLowerCase().includes(search.toLowerCase())), [drugs, search]);
  useEffect(() => setSearch(selectedDrug?.fullName || ''), [selectedDrug?.id]);
  const dosePlans = useMemo(() => dosingOptionsFor(selectedDrug), [selectedDrug]);
  const update = (field) => (event) => onOrderChange({ ...order, ...(field === 'dosage' || field === 'frequency' || field === 'quantity' ? { dosingPlan: 'custom' } : {}), [field]: event.target.value });
  const choose = (drug) => { setSearch(drug.fullName); setOpen(false); onSelectDrug(drug); };
  const chooseDosePlan = (event) => { const plan = dosePlans.find((item) => item.id === event.target.value); if (plan) onDosePlanChange(plan); else onOrderChange({ ...order, dosingPlan: 'custom' }); };

  return <section className="ehr ehr-workspace">
    <div className="patient-bar"><div><div className="eyebrow">Active patient</div><div className="patient-name">{patient.name} <span>Age {patient.age}</span></div><div className="patient-meta">DOB: {patient.dob} · ID: {patient.id}</div></div><div className="diagnosis"><div className="eyebrow">Active problem list</div><strong>{patient.diagnosis}</strong><small>{patient.secondaryProblem}</small></div></div>
    <div className="insurance"><span className="shield">◆</span><div><b>{patient.insurance}</b><small>Commercial comprehensive · Member coverage active</small></div><span className="coverage-dot">Eligibility verified</span></div>
    <div className="order">
      <div className="order-head"><div><h1>E-Prescribing Order</h1><small>Encounter #CP-47592 · Outpatient dermatology</small></div><span className={transmitted ? 'draft sent' : 'draft'}>{transmitted ? 'SENT' : 'DRAFT'}</span></div>
      {transmitted ? <div className="transmitted"><div>✓</div><h2>Order signed and transmitted</h2><p>{selectedDrug?.brandName} and available coverage details were sent to the specialty pharmacy.</p></div> : <div className="form">
        <label className="field-label" htmlFor="medication">Medication</label><div className="drug-search"><input id="medication" value={search} onFocus={() => setOpen(true)} onChange={(event) => { setSearch(event.target.value); setOpen(true); }} placeholder="Search medications…" autoComplete="off" />{open && search && <div className="suggestions">{options.map((drug) => <button key={drug.id} onMouseDown={() => choose(drug)}><b>{drug.fullName}</b><small>{drug.genericName} · {drug.category}</small></button>)}</div>}</div>
        <div className="order-grid"><label className="dose-plan"><span className="field-label">Dosing plan</span><select value={order.dosingPlan} onChange={chooseDosePlan}>{dosePlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.label}</option>)}{!dosePlans.some((plan) => plan.id === 'custom') && <option value="custom">Custom values below</option>}</select><small>Changing a plan updates dose, frequency, quantity, and ScriptAssist support details. Verify the final plan against current prescribing information.</small></label><label><span className="field-label">Dosage</span><input value={order.dosage} onChange={update('dosage')} placeholder="Select medication" /></label><label><span className="field-label">Frequency</span><input value={order.frequency} onChange={update('frequency')} placeholder="Select medication" /></label><label><span className="field-label">Quantity</span><input value={order.quantity} onChange={update('quantity')} /></label><label><span className="field-label">Refills</span><input value={order.refills} onChange={update('refills')} inputMode="numeric" /></label><label><span className="field-label">Dispense as written</span><select value={order.daw} onChange={update('daw')}><option>DAW-1</option><option>DAW-0</option><option>Substitution permitted</option></select></label></div>
        <label className="field-label notes-label" htmlFor="notes">Encounter clinical notes</label><textarea id="notes" value={order.notes} onChange={update('notes')} />
        {copayAttached && <div className="coverage-badge">✓ Secondary Coverage Verified: {selectedDrug.copay.patientCost} copay attached</div>}
      </div>}
      <div className="actions"><button onClick={onSwitchPatient}>Back to patient queue</button><button onClick={onCancel}>Cancel</button><button onClick={onSave}>Save draft</button><button className="primary" onClick={onTransmit}>Sign &amp; Transmit Order</button></div>
    </div>
  </section>;
}
