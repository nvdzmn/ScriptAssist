import type { Status } from "@/data/home";

export function StatusChip({ status }: { status: Status }) {
  return (
    <span className={`status status-${status.tone}`}>
      <span className="status-icon" aria-hidden="true">
        {status.icon}
      </span>
      {status.label}
    </span>
  );
}
