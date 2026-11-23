import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.POLAR_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "Polar OAuth credentials are not configured" },
      { status: 503 },
    );
  }
  const redirectUri = process.env.POLAR_REDIRECT_URI;
  const url = new URL("https://flow.polar.com/oauth2/authorization");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  if (redirectUri) url.searchParams.set("redirect_uri", redirectUri);
  return NextResponse.redirect(url);
}
