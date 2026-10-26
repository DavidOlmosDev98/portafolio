"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSession } from "@/core/session/SessionProvider";
import spanish from "./es.json";
import { isLocale, LOCALE_COOKIE, type Locale } from "./locale";

const translations: Record<string, string> = spanish;
const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (text: string) => string;
} | null>(null);

export function LanguageProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const [locale, updateLocale] = useState(initialLocale);
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  function setLocale(next: Locale) {
    if (!isLocale(next)) return;
    updateLocale(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  }
  function t(text: string) { return locale === "es" ? translations[text] ?? text : text; }
  return <LanguageContext.Provider value={{ locale, setLocale, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage requires LanguageProvider");
  return context;
}

export function LanguageSelector() {
  const { record } = useSession();
  const { locale, setLocale, t } = useLanguage();
  return <label className="language-selector"><span aria-hidden="true">◎</span><select aria-label={t("Language")} value={locale} onChange={event => { if (isLocale(event.target.value) && event.target.value !== locale) { setLocale(event.target.value); record({ type: "language", locale: event.target.value }); } }}><option value="es" lang="es">Español</option><option value="en" lang="en">English</option></select></label>;
}
