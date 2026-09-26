import Link from "next/link";
import { home } from "@/data/home";
import { StatusChip } from "@/components/home/StatusChip";

export function RecentPrescriptions() {
  return (
    <section className="card recent" aria-labelledby="recent-title">
      <header className="card-header">
        <h2 id="recent-title">Recent prescriptions</h2>
        <Link className="button-ghost" href="/patients">
          Go to Patients
        </Link>
      </header>
      <ul className="recent-list">
        {home.recent.map((item) => (
          <li className="recent-item" key={item.patient}>
            <span className="patient-name">{item.patient}</span>
            <span className="card-caption recent-detail">{item.detail}</span>
            <StatusChip status={item.status} />
          </li>
        ))}
      </ul>
    </section>
  );
}
