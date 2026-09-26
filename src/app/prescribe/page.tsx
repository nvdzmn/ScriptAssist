import type { Metadata } from "next";
import { PrescribeWorkspace } from "@/components/prescribe/PrescribeWorkspace";

export const metadata: Metadata = { title: "Prescribe · ScriptAssist" };

export default function PrescribePage() {
  return <PrescribeWorkspace />;
}
