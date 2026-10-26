"use client";

import { ArrowUpRight, Globe } from "lucide-react";
import { useLanguage } from "@/core/i18n/LanguageProvider";
import { PROFILE_LINKS } from "@/core/profile-links";

export function ProfessionalLinks() {
  const { t } = useLanguage();
  return <section className="dock-utility">
    <div className="utility-eyebrow"><Globe size={16} aria-hidden="true" />{t("Professional links")}</div>
    <h3>{t("Find me beyond OlmosOS.")}</h3>
    <p>{t("Explore my professional profile. External links open in a new tab.")}</p>
    <div className="professional-links">
      <a href={PROFILE_LINKS.linkedin} target="_blank" rel="noopener noreferrer"><span className="professional-linkedin-mark" aria-hidden="true">in</span><div><h4>LinkedIn</h4><p>{t("View my professional background and connect with me.")}</p><span className="professional-link-url">linkedin.com/in/david-antonio-olmos-ruiz-198318204</span></div><ArrowUpRight size={20} aria-hidden="true" /></a>
    </div>
  </section>;
}
