export const LOCALE_COOKIE = "olmosos-language";
export type Locale = "en" | "es";
export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "es";
}
/** Respect browser preference order and regional variants, e.g. es-MX. */
export function resolveLocale(saved: unknown, acceptLanguage: string | null): Locale {
  if (isLocale(saved)) return saved;
  const preferences = (acceptLanguage ?? "").split(",").map((entry, index) => {
    const [tag, ...params] = entry.trim().split(";");
    const quality = params.find(param => param.trim().startsWith("q="));
    return { locale: tag.toLowerCase().split("-")[0], quality: quality ? Number(quality.trim().slice(2)) : 1, index };
  }).filter(entry => Number.isFinite(entry.quality) && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);
  const preferred = preferences.find(entry => isLocale(entry.locale))?.locale;
  return isLocale(preferred) ? preferred : "en";
}
