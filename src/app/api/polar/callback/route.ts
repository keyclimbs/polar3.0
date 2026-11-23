import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { encryptToken } from "@/lib/polar";

const tokenSchema = z.object({
  access_token: z.string().min(1),
  user_id: z.number().or(z.string()).optional(),
  member_id: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing OAuth authorization code" }, { status: 400 });
  }
  const clientId = process.env.POLAR_CLIENT_ID;
  const clientSecret = process.env.POLAR_CLIENT_SECRET;
  const redirectUri = process.env.POLAR_REDIRECT_URI;
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Polar OAuth credentials are not configured" }, { status: 503 });
  }
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
  });
  if (redirectUri) body.set("redirect_uri", redirectUri);
  const exchange = await fetch("https://polarremote.com/v2/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!exchange.ok) {
    return NextResponse.json({ error: "Polar rejected the authorization code" }, { status: 502 });
  }
  const token = tokenSchema.parse(await exchange.json());
  encryptToken(token.access_token);
  const registration = await fetch("https://www.polaraccesslink.com/v3/users", {
    method: "POST",
    headers: {
      Authorization: ["Bearer", token.access_token].join(" "),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!registration.ok && registration.status !== 409) {
    return NextResponse.json({ error: "Polar user registration failed" }, { status: 502 });
  }
  return NextResponse.redirect(new URL("/", request.url));
}
