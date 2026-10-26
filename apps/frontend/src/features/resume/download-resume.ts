import type { Locale } from "@/core/i18n/locale";

export const RESUME_FILES: Record<Locale, string> = {
  es: "David_Antonio_Olmos_Ruiz_CV_ES.pdf",
  en: "David_Antonio_Olmos_Ruiz_Resume_EN.pdf",
};

/** Called directly from the visitor's click or terminal submission. */
export function downloadResume(locale: Locale) {
  const link = document.createElement("a");
  link.href = `/resumes/${RESUME_FILES[locale]}`;
  link.download = RESUME_FILES[locale];
  document.body.appendChild(link);
  link.click();
  link.remove();
}
