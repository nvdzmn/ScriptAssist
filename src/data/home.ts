export type StatusTone = "action" | "cleared" | "blocked" | "info";

export type Status = {
  tone: StatusTone;
  icon: string;
  label: string;
};

export type Metric = {
  label: string;
  value: string;
  status: Status;
};

export type ApprovalRow = {
  patient: string;
  mrn: string;
  medication: string;
  waiting: string;
  status: Status;
  action: string;
};

export type RecentPrescription = {
  patient: string;
  detail: string;
  status: Status;
};

export type ResearchAlert = {
  audience: string;
  title: string;
  source: string;
};

export type QuickAction = {
  title: string;
  detail: string;
  href?: string;
};

export const home = {
  date: "Saturday, September 26",
  greeting: "Good morning, Dr. Rivera",
  summary: "6 patients are waiting on insurance. 2 need something from you.",
  initials: "AR",
  metrics: [
    {
      label: "Awaiting insurance approval",
      value: "6",
      status: { tone: "action", icon: "!", label: "2 need more info" },
    },
    {
      label: "Scripts this week",
      value: "23",
      status: { tone: "cleared", icon: "✓", label: "18 cleared first pass" },
    },
    {
      label: "Bridge supplies shipped",
      value: "4",
      status: { tone: "info", icon: "•", label: "Patients started on day 1" },
    },
    {
      label: "New research matches",
      value: "3",
      status: { tone: "info", icon: "•", label: "Tied to your prescribing" },
    },
  ] satisfies Metric[],
  approvals: [
    {
      patient: "Maria Chen",
      mrn: "MRN 004821",
      medication: "Stelazio 45 mg",
      waiting: "9 days",
      status: { tone: "action", icon: "!", label: "Needs TB screening" },
      action: "Order lab",
    },
    {
      patient: "James Okafor",
      mrn: "MRN 003377",
      medication: "Dermavance 150 mg",
      waiting: "7 days",
      status: { tone: "blocked", icon: "×", label: "Denied, appeal available" },
      action: "Build brief",
    },
    {
      patient: "Priya Nair",
      mrn: "MRN 005102",
      medication: "Stelazio 45 mg",
      waiting: "4 days",
      status: { tone: "info", icon: "•", label: "Submitted to payer" },
      action: "Track",
    },
    {
      patient: "Luis Ortega",
      mrn: "MRN 002968",
      medication: "Tralvexa 300 mg",
      waiting: "3 days",
      status: { tone: "action", icon: "!", label: "Payer requested notes" },
      action: "Attach",
    },
    {
      patient: "Hannah Weiss",
      mrn: "MRN 006015",
      medication: "Rinvora 15 mg",
      waiting: "1 day",
      status: { tone: "cleared", icon: "✓", label: "Approved today" },
      action: "Send script",
    },
  ] satisfies ApprovalRow[],
  recent: [
    {
      patient: "Ana Silva",
      detail: "Stelazio 45 mg  ·  Today, 9:14 AM",
      status: { tone: "cleared", icon: "✓", label: "Sent, co-pay card attached" },
    },
    {
      patient: "Tom Becker",
      detail: "Rinvora 15 mg  ·  Yesterday",
      status: { tone: "info", icon: "•", label: "14-day bridge shipped" },
    },
    {
      patient: "Grace Kim",
      detail: "Dermavance 150 mg  ·  Sep 24",
      status: { tone: "cleared", icon: "✓", label: "Handout sent to portal" },
    },
  ] satisfies RecentPrescription[],
  alerts: [
    {
      audience: "Affects 12 of your patients",
      title: "Phase 3 extension: Stelazio 45 mg durability at 104 weeks",
      source: "Journal of Dermatology · Sep 24",
    },
    {
      audience: "Affects 3 patients",
      title: "FDA label update: Tralvexa hepatic monitoring",
      source: "FDA · Sep 22",
    },
    {
      audience: "Affects 1 patient",
      title: "Case report: nausea with GLP-1 in CKD stage 3",
      source: "Case Reports in Medicine · Sep 19",
    },
  ] satisfies ResearchAlert[],
  quickActions: [
    {
      title: "Find a patient",
      detail: "Open profile and prescription history",
      href: "/patients",
    },
    {
      title: "Check coverage for a drug",
      detail: "Formulary tier and cost before prescribing",
      href: "/prescribe",
    },
    {
      title: "Restock starter kits",
      detail: "Clinic stock: 0 units of Stelazio",
    },
  ] satisfies QuickAction[],
};
