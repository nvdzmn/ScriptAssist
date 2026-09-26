import { NextRequest, NextResponse } from "next/server";
import { lookupPartDCoverage } from "@/lib/medicare-part-d/repository";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const therapyId = request.nextUrl.searchParams.get("therapyId");
  const planId = request.nextUrl.searchParams.get("planId") || undefined;
  if (!therapyId) return NextResponse.json({ message: "therapyId is required." }, { status: 400 });

  try {
    return NextResponse.json(await lookupPartDCoverage(therapyId, planId));
  } catch {
    return NextResponse.json({ message: "CMS Part D coverage data could not be read." }, { status: 503 });
  }
}
