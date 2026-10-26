"use client";

import { useState } from "react";
import { BarChart3, Boxes, BriefcaseBusiness, FileText, Network, TerminalSquare, Wrench } from "lucide-react";
import { useLanguage } from "@/core/i18n/LanguageProvider";
import { SKILL_GROUPS } from "../data/skills";

const categoryIcons = { languages: TerminalSquare, backend: Boxes, frontend: FileText, data: Network, cloud: Wrench, quality: BarChart3, design: BriefcaseBusiness };
const contexts = {
  languages: "Java-based enterprise modernization, web development, and SQL reporting.",
  backend: "Enterprise services, REST integrations, and microservices development.",
  frontend: "Interfaces for healthcare, retail, logistics, and government applications.",
  data: "Enterprise data integration, databases, and monitoring workflows.",
  cloud: "Cloud delivery, containerized applications, and Linux server administration.",
  quality: "Testing, production incident analysis, QA collaboration, and technical documentation.",
  design: "Solution design, architecture discussions, technical planning, and delivery coordination.",
};
export function Skills() {
  const { t } = useLanguage();
  const [category, setCategory] = useState("all");
  return <section className="skills-view">
    <div className="skills-eyebrow"><Wrench size={16} aria-hidden="true" />{t("Engineering toolkit")}</div>
    <h3>{t("The skills behind my work.")}</h3>
    <p className="skills-intro">{t("Technologies and capabilities from my CV, organized by category and professional context.")}</p>
    <label className="skills-category">{t("Filter by category")}<select value={category} onChange={event => setCategory(event.target.value)}><option value="all">{t("All categories")}</option>{SKILL_GROUPS.map(group => <option key={group.id} value={group.id}>{t(group.title)}</option>)}</select></label>
    <div className="skills-cards" aria-label={t("Skill categories")}>{SKILL_GROUPS.filter(group => category === "all" || category === group.id).map(group => {
      const Icon = categoryIcons[group.id];
      return <article className="skills-card" key={group.id}>
        <div className="skills-card-heading"><Icon size={20} aria-hidden="true" /><h4>{t(group.title)}</h4></div>
        <p>{t(contexts[group.id])}</p>
        <ul>{group.items.map(item => <li key={item}>{t(item)}</li>)}</ul>
      </article>;
    })}</div>
    <p className="skills-footnote">{t("Skills are presented without percentage ratings. Kubernetes is listed with working knowledge, as stated in my CV.")}</p>
  </section>;
}
