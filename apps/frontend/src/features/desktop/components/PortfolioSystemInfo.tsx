"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/core/i18n/LanguageProvider";
import { PROJECTS } from "@/features/projects/data/projects";
import { SKILL_GROUPS } from "@/features/skills/data/skills";

export function PortfolioSystemInfo() {
  const { t, locale } = useLanguage();
  const [viewport, setViewport] = useState("—");
  useEffect(() => {
    const update = () => setViewport(`${window.innerWidth} × ${window.innerHeight}`);
    const timer = window.setTimeout(update, 0);
    window.addEventListener("resize", update);
    return () => { window.clearTimeout(timer); window.removeEventListener("resize", update); };
  }, []);
  const facts = [["Portfolio", "OlmosOS Enterprise 8"], ["Author", "David Antonio Olmos Ruiz"], ["Role", t("Senior Software Engineer")], ["Framework", "Next.js"], ["Interface", "React · TypeScript"], ["Styling", "CSS · Tailwind CSS"], ["Projects", String(PROJECTS.length)], ["Skill categories", String(SKILL_GROUPS.length)], ["Languages", "Español · English"], ["Language", locale === "es" ? "Español" : "English"], ["Viewport", viewport]];
  return <>{facts.map(([key, value]) => <div key={key}><span>{t(key)}:</span> {value}</div>)}<div className="color-swatches" aria-hidden="true">{["#333", "#b00013", "#548b3c", "#bc9437", "#487799", "#a029a5", "#83b2d6", "#ddd"].map(color => <i key={color} style={{ background: color }}/>)}</div></>;
}
