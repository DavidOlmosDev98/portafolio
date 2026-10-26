"use client";

import { useState } from "react";
import { ArrowLeft, ChevronRight, FileText, Folder, FolderOpen } from "lucide-react";
import { useLanguage } from "@/core/i18n/LanguageProvider";
import type { ApplicationId } from "@/core/applications/application.types";
import { PROJECTS, type ProjectId } from "@/features/projects/data/projects";
import { EXPERIENCE } from "@/features/experience/data/experience";

type FolderId = "projects" | "experience" | "documents";
const folders = [{ id: "projects", title: "Projects", count: PROJECTS.length }, { id: "experience", title: "Experience", count: EXPERIENCE.length }, { id: "documents", title: "Documents", count: 1 }] as const;
export function FileExplorer({ onOpen, onProject }: { onOpen: (id: ApplicationId) => void; onProject: (id: ProjectId) => void }) {
  const { t, locale } = useLanguage();
  const [folder, setFolder] = useState<FolderId | null>(null);
  const current = folders.find(item => item.id === folder);
  return <section className="dock-utility file-explorer">
    <div className="utility-eyebrow"><FolderOpen size={16} aria-hidden="true" />{t("Portfolio explorer")}</div>
    <h3>{t("Your route through my work.")}</h3>
    <p>{t("Open a folder, then select a file to view its section or download the CV.")}</p>
    <nav className="files-breadcrumb" aria-label={t("Folder path")}><button onClick={() => setFolder(null)} aria-label={t("Back to portfolio folders")} disabled={!folder}><ArrowLeft size={16} /></button><button onClick={() => setFolder(null)}>OlmosOS</button>{current && <><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">{t(current.title)}</span></>}</nav>
    <div className="files-layout"><nav className="files-sidebar" aria-label={t("Portfolio folders")}>{folders.map(item => <button key={item.id} aria-pressed={folder === item.id} onClick={() => setFolder(item.id)}><Folder size={16} aria-hidden="true" />{t(item.title)}</button>)}</nav>
      <div className="files-content" aria-label={t(current?.title ?? "Portfolio folders")}>
        {!folder ? <div className="file-grid">{folders.map(item => <button className="file-tile" key={item.id} onClick={() => setFolder(item.id)}><Folder size={34} aria-hidden="true" /><strong>{t(item.title)}</strong><span>{item.count} {t(item.count === 1 ? "file" : "files")}</span></button>)}</div>
        : folder === "projects" ? <div className="file-grid">{PROJECTS.map(project => <button className="file-tile" key={project.id} onClick={() => onProject(project.id)}><FileText size={28} aria-hidden="true" /><strong>{project.id}.txt</strong><span>{t(project.title)}</span></button>)}</div>
        : folder === "experience" ? <div className="file-grid">{EXPERIENCE.map(job => <button className="file-tile" key={job.id} onClick={() => onOpen("experience")}><FileText size={28} aria-hidden="true" /><strong>{job.company}</strong><span>{t(job.role)}</span><small>{t(job.period)}</small></button>)}</div>
        : <div className="file-grid"><button className="file-tile" onClick={() => onOpen("resume")}><FileText size={34} aria-hidden="true" /><strong>{t("Resume.pdf")}</strong><span>{t("Download my resume")}</span><small>{locale === "es" ? "PDF · Español" : "PDF · English"}</small></button></div>}
      </div>
    </div>
    {folder === "experience" && <p className="utility-note">{t("Experience files open the complete professional timeline.")}</p>}
    {folder === "documents" && <p className="utility-note">{t("The CV is downloaded in the currently selected interface language.")}</p>}
  </section>;
}
