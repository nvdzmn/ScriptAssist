import Link from "next/link";
import { home } from "@/data/home";
import { AskField } from "@/components/home/AskField";

export function ResearchPanel() {
  return (
    <section className="card research" aria-labelledby="research-title">
      <header className="card-header">
        <h2 id="research-title">Research Agent</h2>
        <span className="status status-info">
          <span className="status-icon" aria-hidden="true">
            •
          </span>
          {home.alerts.length} new
        </span>
      </header>
      <p className="research-lead">New evidence that overlaps with drugs you prescribe.</p>
      <ul className="alerts">
        {home.alerts.map((alert) => (
          <li className="alert" key={alert.title}>
            <span className="status status-info">
              <span className="status-icon" aria-hidden="true">
                •
              </span>
              {alert.audience}
            </span>
            <p className="alert-title">{alert.title}</p>
            <div className="alert-meta">
              <span className="card-caption">{alert.source}</span>
              <Link className="button-ghost" href="/research">
                Review
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <AskField />
    </section>
  );
}
