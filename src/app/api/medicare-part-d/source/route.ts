import { NextResponse } from "next/server";
import { getLatestCmsPartDSource } from "@/lib/medicare-part-d/cms";

export async function GET() {
  try {
    return NextResponse.json(await getLatestCmsPartDSource());
  } catch {
    return NextResponse.json({ message: "CMS Part D source metadata is temporarily unavailable." }, { status: 502 });
  }
}
