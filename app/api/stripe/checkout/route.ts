import { NextResponse } from "next/server";
function notImplementedResponse(): NextResponse {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

export async function POST(): Promise<NextResponse> {
  return notImplementedResponse();
}

export async function GET(): Promise<NextResponse> {
  return notImplementedResponse();
}
