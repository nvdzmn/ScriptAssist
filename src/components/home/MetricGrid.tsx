import { home } from "@/data/home";
import { StatusChip } from "@/components/home/StatusChip";

export function MetricGrid() {
  return (
    <section className="metrics" aria-label="Today">
      {home.metrics.map((metric) => (
        <article className="metric" key={metric.label}>
          <p className="metric-label">{metric.label}</p>
          <p className="metric-value">{metric.value}</p>
          <StatusChip status={metric.status} />
        </article>
      ))}
    </section>
  );
}
