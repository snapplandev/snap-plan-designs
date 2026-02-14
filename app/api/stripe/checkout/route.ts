import { NextResponse } from "next/server";

function notImplementedResponse() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

export async function GET() {
  return notImplementedResponse();
}

export async function POST() {
  return notImplementedResponse();
}
