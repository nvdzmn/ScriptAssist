import Link from "next/link";
import { home, type QuickAction } from "@/data/home";

function ActionRow({ action }: { action: QuickAction }) {
  const content = (
    <>
      <span>
        <span className="patient-name">{action.title}</span>
        <span className="card-caption">{action.detail}</span>
      </span>
      <span aria-hidden="true">→</span>
    </>
  );

  if (action.href) {
    return (
      <Link className="qa-row" href={action.href}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className="qa-row">
      {content}
    </button>
  );
}

export function QuickActions() {
  return (
    <section className="card quick-actions" aria-labelledby="quick-actions-title">
      <h2 id="quick-actions-title">Quick actions</h2>
      <div className="qa-list">
        {home.quickActions.map((action) => (
          <ActionRow key={action.title} action={action} />
        ))}
      </div>
    </section>
  );
}
