import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    connected: false,
    demoMode: !process.env.POLAR_CLIENT_ID,
  });
}
