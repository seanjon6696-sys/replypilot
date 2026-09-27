import type { Metadata } from "next";
import "./globals.css";
import { APP_NAME, TAGLINE } from "@/lib/config";

export const metadata: Metadata = {
  title: `${APP_NAME} | AI replies to customer reviews`,
  description: TAGLINE,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
