import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/shell/SectionPlaceholder";

export const metadata: Metadata = { title: "Research Agent · ScriptAssist" };

export default function ResearchPage() {
  return (
    <SectionPlaceholder
      title="Research Agent"
      description="Feed of new evidence matched to your prescribing."
    />
  );
}
