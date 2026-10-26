import type { Metadata } from "next";
import "./globals.css";
import { cookies, headers } from "next/headers";
import { SessionProvider } from "@/core/session/SessionProvider";
import { LanguageProvider } from "@/core/i18n/LanguageProvider";
import { LOCALE_COOKIE, resolveLocale } from "@/core/i18n/locale";

export const metadata: Metadata = {
  title: "David Olmos | Software Engineer",
  description:
    "An interactive Linux-inspired portfolio for Senior Software Engineer David Antonio Olmos Ruiz.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const [cookieStore, requestHeaders] = await Promise.all([cookies(), headers()]);
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value, requestHeaders.get("accept-language"));
  return (
    <html lang={locale}>
      <body><LanguageProvider initialLocale={locale}><SessionProvider>{children}</SessionProvider></LanguageProvider></body>
    </html>
  );
}