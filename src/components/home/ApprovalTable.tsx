import { home } from "@/data/home";
import { StatusChip } from "@/components/home/StatusChip";

export function ApprovalTable() {
  return (
    <section className="card" aria-labelledby="approvals-title">
      <header className="card-header card-header-block">
        <div>
          <h2 id="approvals-title">Awaiting insurance approval</h2>
          <p className="card-caption">Pending prior authorizations, oldest first</p>
        </div>
        <button type="button" className="button-ghost">
          View all
        </button>
      </header>
      <div className="table-scroll">
        <div className="approval-table">
          <div className="approval-head" role="row">
            <span role="columnheader">PATIENT</span>
            <span role="columnheader">MEDICATION</span>
            <span role="columnheader">WAITING</span>
            <span role="columnheader">STATUS</span>
            <span role="columnheader">
              <span className="sr-only">Action</span>
            </span>
          </div>
          <ul className="approval-rows">
            {home.approvals.map((row) => (
              <li className="approval-row" key={row.mrn}>
                <div className="patient-cell">
                  <span className="patient-name">{row.patient}</span>
                  <span className="mrn">{row.mrn}</span>
                </div>
                <span>{row.medication}</span>
                <span className="waiting">{row.waiting}</span>
                <StatusChip status={row.status} />
                <button type="button" className="button-row">
                  {row.action}
                  <span aria-hidden="true">→</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
