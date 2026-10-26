"use client";

import { BriefcaseBusiness, ChevronDown, MapPin } from "lucide-react";
import { useLanguage } from "@/core/i18n/LanguageProvider";
import { EXPERIENCE, EXPERIENCE_SUMMARY } from "../data/experience";

export function Experience() {
  const { t } = useLanguage();

  return (
    <section className="experience-view" aria-label={t("Professional experience")}>
      <div className="experience-intro">
        <span className="experience-eyebrow"><BriefcaseBusiness size={16} aria-hidden="true" />{t("Professional journey")}</span>
        <h3>{t("Building enterprise software since 2020.")}</h3>
        <p>{t(EXPERIENCE_SUMMARY)}</p>
        <span className="experience-hint">{t("Expand a role to explore projects, contributions, and technologies.")}</span>
      </div>
      <div className="experience-timeline">
        {EXPERIENCE.map((job, index) => (
          <details className="experience-entry" key={job.id} open={index === 0}>
            <summary>
              <span className="experience-marker" aria-hidden="true" />
              <span className="experience-entry-heading">
                <span className="experience-company">{job.company}{!job.end && <span className="experience-current">{t("Current role")}</span>}</span>
                <span className="experience-role">{t(job.role)}</span>
                <span className="experience-period"><time dateTime={job.start}>{t(job.period).split(" - ")[0]}</time>{" — "}{job.end ? <time dateTime={job.end}>{t(job.period).split(" - ")[1]}</time> : t("Present")}</span>
              </span>
              <ChevronDown className="experience-chevron" size={18} aria-hidden="true" />
            </summary>
            <div className="experience-detail">
              <p className="experience-location"><MapPin size={14} aria-hidden="true" />{t(job.location)}<span>·</span>{t(job.workMode)}</p>
              {job.engagement && <p className="experience-engagement">{t(job.engagement)}</p>}
              {job.projects && <div className="experience-projects"><h4>{t("Selected projects")}</h4><p>{t(job.projects)}</p></div>}
              <h4>{t("Contributions and achievements")}</h4>
              <ul>{job.highlights.map(highlight => <li key={highlight}>{t(highlight)}</li>)}</ul>
              <h4>{t("Technologies and tools")}</h4>
              <ul className="experience-technologies" aria-label={t("Technologies and tools")}>{job.technologies.map(technology => <li key={technology}>{t(technology)}</li>)}</ul>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
