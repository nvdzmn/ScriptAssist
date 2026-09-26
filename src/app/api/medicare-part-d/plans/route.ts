import { NextResponse } from "next/server";
import { listImportedPartDPlans } from "@/lib/medicare-part-d/repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.json(await listImportedPartDPlans());
  } catch {
    return NextResponse.json({ message: "CMS Part D plans could not be read." }, { status: 503 });
  }
}
