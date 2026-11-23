import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polar Tracker",
  description: "Personal athletic readiness and training intelligence",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
