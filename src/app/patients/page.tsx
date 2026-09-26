import type { Metadata } from "next";
import { SectionPlaceholder } from "@/components/shell/SectionPlaceholder";

export const metadata: Metadata = { title: "Patients · ScriptAssist" };

export default function PatientsPage() {
  return <SectionPlaceholder title="Patients" description="Search, filter by drug or PA status." />;
}
