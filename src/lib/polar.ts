import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const APPROVED_HOSTS = new Set([
  "flow.polar.com",
  "polarremote.com",
  "polaraccesslink.com",
]);

export function assertApprovedPolarUrl(url: string) {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" || !APPROVED_HOSTS.has(parsed.hostname)) {
    throw new Error("Outbound request blocked: unapproved Polar endpoint");
  }
  return parsed;
}

export function encryptToken(token: string) {
  const key = process.env.POLAR_TOKEN_ENCRYPTION_KEY;
  if (!key) throw new Error("POLAR_TOKEN_ENCRYPTION_KEY is not configured");
  const keyBuffer = Buffer.from(key, "base64");
  if (keyBuffer.length !== 32) throw new Error("Encryption key must be 32 bytes");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyBuffer, iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${tag.toString("base64")}.${encrypted.toString("base64")}`;
}

export function decryptToken(payload: string) {
  const key = process.env.POLAR_TOKEN_ENCRYPTION_KEY;
  if (!key) throw new Error("POLAR_TOKEN_ENCRYPTION_KEY is not configured");
  const [ivText, tagText, encryptedText] = payload.split(".");
  if (!ivText || !tagText || !encryptedText) throw new Error("Invalid encrypted token");
  const decipher = createDecipheriv(
    "aes-256-gcm",
    Buffer.from(key, "base64"),
    Buffer.from(ivText, "base64"),
  );
  decipher.setAuthTag(Buffer.from(tagText, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedText, "base64")),
    decipher.final(),
  ]).toString("utf8");
}
