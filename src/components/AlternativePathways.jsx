const specialtyPathwaysByDiagnosis = {
  'L40.0': ['stelazio', 'skyrizi', 'cosentyx', 'tremfya', 'otezla'],
  'L20.9': ['dupixent', 'adbry'],
  'L40.50': ['humira', 'cosentyx', 'taltz', 'otezla'],
  'M06.9': ['humira', 'rinvoq'],
  'K50.90': ['entyvio', 'humira']
};

const genericPathwaysByDiagnosis = {
  'L40.0': ['methotrexate'],
  'L20.9': ['tacrolimus'],
  'L40.50': ['methotrexate', 'sulfasalazine'],
  'M06.9': ['methotrexate', 'sulfasalazine'],
  'K50.90': []
};

function diagnosisCode(diagnosis = '') {
  return diagnosis.match(/\(([A-Z]\d+(?:\.\d+)?)\)/)?.[1] || null;
}

export default function AlternativePathways({ patient, drug, drugs, onSelectAlternative }) {
  const code = diagnosisCode(patient?.diagnosis);
  const findCandidates = (ids) => ids
    .map((id) => drugs.find((item) => item.id === id))
    .filter(Boolean)
    .filter((item) => item.id !== drug?.id);
  const candidates = findCandidates(specialtyPathwaysByDiagnosis[code] || []);
  const genericCandidates = findCandidates(genericPathwaysByDiagnosis[code] || []);

  const renderCandidate = (candidate, generic = false) => {
    const configuredItems = candidate.criteria?.length || 0;
    return <article className="alternative-option" key={candidate.id}>
      <div className="alternative-option-top">
        <div>
          <b>{candidate.brandName}</b>
          <span>{candidate.genericName} · {candidate.category}</span>
        </div>
        <span className={generic ? 'review-tag generic-tag' : 'review-tag'}>{generic ? 'Generic pathway' : 'Review'}</span>
      </div>
      <div className="alternative-signals">
        <span>Diagnosis path: {code}</span>
        <span>{configuredItems} demo documentation item{configuredItems === 1 ? '' : 's'} configured</span>
        <span>{generic ? 'Not a direct substitution' : 'Coverage not verified'}</span>
      </div>
      <button onClick={() => onSelectAlternative(candidate)}>Review and select for draft</button>
    </article>;
  };

  return <section className="alternative-pathways" aria-labelledby="alternative-pathways-title">
    <div className="alternative-heading">
      <div>
        <div className="card-label">Clinician review support</div>
        <h3 id="alternative-pathways-title">Alternative pathways</h3>
      </div>
      {code && <span className="diagnosis-code">ICD-10-CM {code}</span>}
    </div>
    <p className="alternative-intro">Possible options in this demonstration catalog with a configured documentation bundle. The current order remains unchanged until you select an option.</p>

    {candidates.length ? <div className="alternative-list">{candidates.map((candidate) => renderCandidate(candidate))}</div> : <div className="alternative-empty">No brand or biologic alternative is configured for this diagnosis code in the demo catalog.</div>}

    <div className="alternative-subheading"><b>Generic / non-biologic pathways</b><span>For clinician review</span></div>
    {genericCandidates.length ? <div className="alternative-list">{genericCandidates.map((candidate) => renderCandidate(candidate, true))}</div> : <div className="alternative-empty">No generic pathway is configured for this diagnosis code. A generic pathway is never assumed to be therapeutically equivalent.</div>}

    <p className="alternative-disclaimer">Demonstration decision support only—not a coverage determination, clinical recommendation, or substitution directive. Generic and biosimilar options are not automatically substitutable. Verify indication, diagnosis-specific dosing, safety, interchangeability, and current payer requirements before prescribing.</p>
  </section>;
}
