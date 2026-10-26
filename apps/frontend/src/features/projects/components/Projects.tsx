"use client";

import { useState } from "react";
import { Boxes, ChevronDown, TrendingUp } from "lucide-react";
import { useLanguage } from "@/core/i18n/LanguageProvider";
import { PROJECTS, type ProjectId } from "../data/projects";

export function Projects({ initialProjectId }: { initialProjectId?: ProjectId }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<ProjectId | null>(initialProjectId ?? null);

  return <section className="projects-view" aria-label={t("Project portfolio")}>
    <div className="projects-intro">
      <span className="projects-eyebrow"><Boxes size={16} aria-hidden="true" />{t("Selected work")}</span>
      <h3>{t("Enterprise applications, built in practice.")}</h3>
      <p>{t("Explore projects from my professional experience and engineering training.")}</p>
    </div>
    <div className="project-cards">
      {PROJECTS.map((project, index) => <article key={project.id} className={`project-card ${expanded === project.id ? "is-expanded" : ""}`}>
        <div className="project-card-meta"><span>{t(project.category)}</span><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></div>
        <h4>{t(project.title)}</h4>
        <p className="project-company">{project.company}</p>
        <p className="project-summary">{t(project.summary)}</p>
        {project.metric && <p className="project-metric"><TrendingUp size={16} aria-hidden="true" />{t(project.metric)}</p>}
        <button className="project-expand" aria-label={`${t("Explore project")}: ${t(project.title)}`} aria-expanded={expanded === project.id} aria-controls={`project-${project.id}`} onClick={() => setExpanded(expanded === project.id ? null : project.id)}>
          {t("Explore project")}<ChevronDown size={16} aria-hidden="true" />
        </button>
        <div id={`project-${project.id}`} hidden={expanded !== project.id} className="project-card-details">
          <h5>{t("Project contributions")}</h5>
          <ul className="project-contributions">{project.contributions.map(contribution => <li key={contribution}>{t(contribution)}</li>)}</ul>
          <h5>{t("Technologies and tools")}</h5>
          <ul className="project-technologies">{project.technologies.map(technology => <li key={technology}>{t(technology)}</li>)}</ul>
        </div>
      </article>)}
    </div>
  </section>;
}
