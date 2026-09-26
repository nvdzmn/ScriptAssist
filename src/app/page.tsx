import { ApprovalTable } from "@/components/home/ApprovalTable";
import { HomeHeader } from "@/components/home/HomeHeader";
import { MetricGrid } from "@/components/home/MetricGrid";
import { QuickActions } from "@/components/home/QuickActions";
import { RecentPrescriptions } from "@/components/home/RecentPrescriptions";
import { ResearchPanel } from "@/components/home/ResearchPanel";

export default function HomePage() {
  return (
    <main className="page">
      <HomeHeader />
      <MetricGrid />
      <div className="content">
        <div className="column">
          <ApprovalTable />
          <RecentPrescriptions />
        </div>
        <div className="column">
          <ResearchPanel />
          <QuickActions />
        </div>
      </div>
    </main>
  );
}
