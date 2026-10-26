"use client";
import { useEffect, useReducer, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { PortfolioSystemInfo } from "./PortfolioSystemInfo";
import { WindowFrame } from "@/features/windows/components/WindowFrame";
import { DesktopWidget } from "@/features/windows/components/DesktopWidget";
import { createWindow, windowReducer } from "@/features/windows/lib/window-state";
import { BatteryCharging, ChevronDown, Network, Search, Volume2, X, Coffee } from "lucide-react";
import { LanguageSelector, useLanguage } from "@/core/i18n/LanguageProvider";
import { useSession } from "@/core/session/SessionProvider";
import { SystemMonitor } from "@/features/system-monitor/components/SystemMonitor";
import { downloadResume } from "@/features/resume/download-resume";
import { PortfolioTerminal, usePortfolioTerminal } from "@/features/terminal/components/PortfolioTerminal";
import { Skills } from "@/features/skills/components/Skills";
import { SKILL_GROUPS } from "@/features/skills/data/skills";
import { ProfessionalLinks } from "@/features/browser/components/ProfessionalLinks";
import { FileExplorer } from "@/features/files/components/FileExplorer";
import { Help } from "@/features/help/components/Help";
import { Contact } from "@/features/contact/components/Contact";
import { Architecture } from "@/features/architecture/components/Architecture";
import { Projects } from "@/features/projects/components/Projects";
import { PROJECTS, type ProjectId } from "@/features/projects/data/projects";
import { Experience } from "@/features/experience/components/Experience";
import { Clock } from "@/features/topbar/components/Clock";
import { APPLICATIONS, DESKTOP_APPLICATIONS, getApplication } from "@/core/applications/application-registry";
import type { ApplicationId } from "@/core/applications/application.types";
const commands = [
    ["about", "Show information about me"], ["experience", "Show my work experience"],
    ["projects", "List and open projects"], ["skills", "Show my technical skills"],
    ["architecture", "Show system architectures"], ["resume", "Download my resume"],
    ["contact", "Open contact information"],
    ["linkedin", "Open my LinkedIn profile"], ["clear", "Clear terminal"], ["exit", "Close terminal"],
    ["whoami", "Who am I?"], ["hire", "Hire me :)"],
];
const ascii = `      .oOOOOOOo.\n    .OOOO°°°°OOOO.\n   .OOO°      °OOO.\n   OOO°        °OOO\n   °OOOo.    .oOOO°\n     °OOOOOOOOOO°\n    .oOOOOOOOOOOo.\n   .OOOO°    °OOOO.\n  .OOO°        °OOO.\n  OOOO          OOOO\n  OOOO.        .OOOO\n  °OOOOoooooooOOOO°\n    °OOOOOOOOOOO°\n       °°°°°°°`;
function Icon({ id }: {
    id: string;
}) { return <Image className="os-icon" src={`/icons/${id === "about" ? "folder" : id}.svg`} alt="" width={56} height={56}/>; }
function Prompt({ children }: {
    children?: ReactNode;
}) { return <div className="prompt"><span>david@olmosos</span>:~$ {children}</div>; }
export function Desktop() {
    const { t, locale } = useLanguage();
    const { record } = useSession();
    const [selectedProject, setSelectedProject] = useState<ProjectId | undefined>();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [hidden, setHidden] = useState<string[]>([]);
    const [windows, dispatch] = useReducer(windowReducer, []);
    const [minimizedWidgets, setMinimizedWidgets] = useState<string[]>([]);
    const [activeWidget, setActiveWidget] = useState<string | null>(null);
    const [menu, setMenu] = useState(false);
    const [status, setStatus] = useState(false);
    const launchers = useRef(new Map<ApplicationId, HTMLElement>());
    function dismissWindow(id: ApplicationId, type: "close" | "minimize") {
        dispatch({ type, id });
        requestAnimationFrame(() => {
            const next = [...windows].reverse().find(item => item.id !== id && !item.minimized);
            const target = next ? document.querySelector<HTMLElement>(`[data-window-id="${next.id}"]`) : launchers.current.get(id);
            if (target?.isConnected) target.focus({ preventScroll: true });
            else document.querySelector<HTMLElement>(".dock-launcher")?.focus({ preventScroll: true });
        });
    }
    const terminal = usePortfolioTerminal(open, () => dismissWindow("terminal", "close"));
    const close = (id: string) => { setActiveWidget(null); setHidden(old => [...old, id]); setMinimizedWidgets(old => old.filter(value => value !== id)); };
    const widgetNames: Record<string, string> = { system: "System information", help: "Command help", skills: "Backend skills", projects: "Project list" };
    const activeWindow = [...windows].reverse().find(item => !item.minimized)?.id;
    useEffect(() => {
        const fit = () => dispatch({ type: "fit", width: window.innerWidth, height: window.innerHeight, top: window.innerWidth <= 760 ? 76 : 48 });
        window.addEventListener("resize", fit);
        return () => window.removeEventListener("resize", fit);
    }, []);
    function focusWindow(id: ApplicationId) { setActiveWidget(null); dispatch({ type: "focus", id }); }
    function minimizeWidget(id: string) { setMinimizedWidgets(old => [...new Set([...old, id])]); setActiveWidget(null); }
    function open(id: ApplicationId) {
        setMenu(false);
        if (id === "resume") {
            downloadResume(locale);
            record({ type: "download", locale });
            return;
        }
        if (!windows.some(item => item.id === id) && document.activeElement instanceof HTMLElement) launchers.current.set(id, document.activeElement);
        record({ type: "application", appId: id });
        if (!windows.some(item => item.id === id) && id === "projects") setSelectedProject(undefined);
        setActiveWidget(null);
        dispatch({ type: "open", window: createWindow(id, windows.length, window.innerWidth, window.innerHeight) });
    }
    function openProject(id: ProjectId) { open("projects"); setSelectedProject(id); }
    const desktopOrder: ApplicationId[] = ["about", "experience", "projects", "architecture", "skills", "resume", "contact", "terminal", "system-monitor"];
    const apps = [...DESKTOP_APPLICATIONS].sort((a, b) => desktopOrder.indexOf(a.id) - desktopOrder.indexOf(b.id)).filter(app => `${t(app.name)} ${app.name}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()) && (filter === "all" || app.pinnedToDock));
    return <div className="os-desktop">
  <div className="wallpaper" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i}/>)}</div>
  <header className="os-topbar"><button className="applications-button" onClick={() => setMenu(!menu)} aria-expanded={menu}><span className="system-emblem">⚙</span><span>{t("Applications")}</span><ChevronDown size={15}/></button><Clock /><div className="topbar-actions"><LanguageSelector /><button className="system-status" aria-label={t("System status")} aria-expanded={status} onClick={() => setStatus(!status)}><Network size={20}/><Volume2 size={21}/><BatteryCharging size={20}/><span>100%</span><ChevronDown size={14}/></button></div></header>
  {status && <div className="status-popover"><strong>OlmosOS Enterprise 8</strong><p>{t("Network connected")}</p><p>{t("Volume \u00B7 100%")}</p><p>{t("Portfolio system \u00B7 Online")}</p></div>}
  <div className="desktop-search"><Search size={23}/><input aria-label={t("Search applications")} placeholder={t("Type to search...")} value={search} onChange={event => setSearch(event.target.value)}/>{search && <button aria-label={t("Clear search")} onClick={() => setSearch("")}><X size={18}/></button>}</div>
  <aside className="linux-dock" aria-label={t("Application dock")}>{["browser", "files", "resume", "help", "terminal", "applications"].map(id => {
    const applicationId = id as ApplicationId;
    const label = t(getApplication(applicationId).name);
    return <button key={id} className="dock-launcher" aria-label={`${t("Open")} ${label}`} aria-describedby={`dock-tooltip-${id}`} aria-expanded={id === "applications" ? menu : undefined} onClick={() => id === "applications" ? setMenu(!menu) : open(applicationId)}>
      <Icon id={id}/>
      {windows.some(item => item.id === applicationId) && <span className="dock-running-indicator" aria-hidden="true" />}
      <span id={`dock-tooltip-${id}`} className="dock-tooltip" role="tooltip">{label}</span>
    </button>;
  })}</aside>
  {menu && <nav className="applications-menu" aria-label={t("Applications")}>{APPLICATIONS.filter(app => app.id !== "applications").map(app => <button key={app.id} onClick={() => open(app.id)}><Icon id={app.id}/>{t(app.name)}</button>)}</nav>}
  <main className="desktop-stage">
   {!hidden.includes("system") && <DesktopWidget name={t("System information")} className="system-terminal" onClose={() => close("system")} minimized={minimizedWidgets.includes("system")} active={activeWidget === "system"} onMinimize={() => minimizeWidget("system")} onFocus={() => setActiveWidget("system")}><Prompt>neofetch</Prompt><div className="neofetch"><pre className="ascii-logo">{ascii}</pre><div className="system-specs"><PortfolioSystemInfo /></div></div><Prompt><b className="cursor"/></Prompt></DesktopWidget>}
   <section className="desktop-identity"><h1>OlmosOS</h1><h2>Enterprise 8</h2><p>{t("Senior Software Engineer")}</p><div className="technology-row"><div><Coffee className="java-logo"/><span>Java 21</span></div><div><Image src="/icons/spring.svg" width={43} height={43} alt=""/><span>Spring Boot</span></div><div><Image src="/icons/docker.svg" width={43} height={43} alt=""/><span>Docker</span></div><div><b className="aws-logo">aws</b><span>AWS</span></div><div><Image src="/icons/postgres.svg" width={43} height={43} alt=""/><span>PostgreSQL</span></div><div><Image src="/icons/angular.svg" width={43} height={43} alt=""/><span>Angular</span></div><div><Image src="/icons/oracle.svg" width={43} height={43} alt=""/><span>Oracle</span></div><div><Image src="/icons/javascript.svg" width={43} height={43} alt=""/><span>JavaScript</span></div><div><Image src="/icons/react.svg" width={43} height={43} alt=""/><span>React</span></div></div></section>
   {!hidden.includes("help") && <DesktopWidget name={t("Command help")} className="help-terminal" onClose={() => close("help")} minimized={minimizedWidgets.includes("help")} active={activeWidget === "help"} onMinimize={() => minimizeWidget("help")} onFocus={() => setActiveWidget("help")}><Prompt>help</Prompt><p>{t("Available commands:")}</p><div className="command-list">{commands.map(([command, description]) => <div key={command}><button onClick={() => { open("terminal"); terminal.setInput(command); }}>{command}</button><span>{t(description)}</span></div>)}</div><Prompt><b className="cursor"/></Prompt></DesktopWidget>}
   {!hidden.includes("skills") && <DesktopWidget name={t("Backend skills")} className="skills-terminal" onClose={() => close("skills")} minimized={minimizedWidgets.includes("skills")} active={activeWidget === "skills"} onMinimize={() => minimizeWidget("skills")} onFocus={() => setActiveWidget("skills")}><Prompt>skills --backend</Prompt><p>{t("Backend Skills")}</p><ul className="desktop-backend-skills">{SKILL_GROUPS.find(group => group.id === "backend")!.items.map(skill => <li key={skill}>{t(skill)}</li>)}</ul><Prompt><b className="cursor"/></Prompt></DesktopWidget>}
   <section className="desktop-applications" aria-label={t("Portfolio applications")}>{apps.map(app => <button key={app.id} onClick={() => open(app.id)}><Icon id={app.id}/><span>{t(app.shortName === "Monitor" ? "System Monitor" : app.id === "about" ? "About Me" : app.shortName)}</span></button>)}{apps.length === 0 && <p className="no-results">{t("No applications found.")}</p>}</section>
   {!hidden.includes("projects") && <DesktopWidget name={t("Project list")} className="projects-terminal" onClose={() => close("projects")} minimized={minimizedWidgets.includes("projects")} active={activeWidget === "projects"} onMinimize={() => minimizeWidget("projects")} onFocus={() => setActiveWidget("projects")}><Prompt>ls projects</Prompt><div className="project-list">{PROJECTS.map(project => <div key={project.id}><button onClick={() => openProject(project.id)}>{project.id}</button><span>- {t(project.title)}</span></div>)}</div><Prompt><b className="cursor"/></Prompt></DesktopWidget>}
   <div className="application-filters" aria-label={t("Application filter")}><button className={filter === "frequent" ? "selected" : ""} onClick={() => setFilter("frequent")}>{t("Frequent")}</button><button className={filter === "all" ? "selected" : ""} onClick={() => setFilter("all")}>{t("All")}</button></div>
   <footer>{t("Building scalable solutions,")}<br />{t("one commit at a time.")}</footer>
  </main>
  <div className="window-layer">
    {windows.map((item, index) => <WindowFrame key={item.id} windowId={item.id} name={t(getApplication(item.id).name)} floating active={!activeWidget && activeWindow === item.id} minimized={item.minimized} maximized={item.maximized}
      className={`application-dialog managed-application ${item.id === "experience" ? "experience-dialog" : item.id === "projects" ? "projects-dialog" : item.id === "architecture" ? "architecture-dialog" : item.id === "contact" ? "contact-dialog" : item.id === "terminal" ? "portfolio-terminal-dialog" : item.id === "system-monitor" ? "monitor-dialog" : item.id === "skills" ? "skills-dialog" : "dock-utility-dialog"}`}
      style={{ left: item.x, top: item.y, width: item.width, height: item.height, zIndex: 100 + index }}
      onFocus={() => focusWindow(item.id)} onMove={(x, y) => dispatch({ type: "move", id: item.id, x, y })} onResize={rect => dispatch({ type: "resize", id: item.id, rect })} onClose={() => dismissWindow(item.id, "close")} onMinimize={() => dismissWindow(item.id, "minimize")} onMaximize={() => { focusWindow(item.id); dispatch({ type: "maximize", id: item.id }); }}>
        <h2 className="app-heading">{t(getApplication(item.id).name)}</h2>
        {item.id === "terminal" ? <PortfolioTerminal terminal={terminal} />
        : item.id === "skills" ? <Skills />
        : item.id === "browser" ? <ProfessionalLinks />
        : item.id === "files" ? <FileExplorer onOpen={open} onProject={openProject} />
        : item.id === "help" ? <Help onOpen={open} onCommand={command => { open("terminal"); terminal.setInput(command); }} />
        : item.id === "contact" ? <Contact />
        : item.id === "architecture" ? <Architecture />
        : item.id === "projects" ? <Projects key={selectedProject ?? "overview"} initialProjectId={selectedProject} />
        : item.id === "experience" ? <Experience />
        : item.id === "system-monitor" ? <SystemMonitor />
        : item.id === "about" ? <div className="about-profile">
          <h3>{t("Hi, I’m David Antonio Olmos Ruiz")}</h3><p className="about-role">{t("Senior Software Engineer")}</p>
          <p>{t("I enjoy turning complex problems into clear, practical, and well-structured solutions. My approach combines backend development with Java and Spring Boot, building interfaces with Angular and React, and designing systems that are easy to maintain and evolve.")}</p>
          <p>{t("I like understanding how every part of an application fits together—from data and business logic to the experience of the people using it.")}</p>
          <p>{t("OlmosOS is a way to share how I think about and build software. Here, you can explore my projects, learn about my experience, and discover the technologies I work with.")}</p>
        </div>
        : <><p>{t(getApplication(item.id).description)}</p><p className="pending-content">{t("This section is ready for your professional information.")}</p></>}
    </WindowFrame>)}
  </div>
  {(windows.length > 0 || minimizedWidgets.length > 0) && <nav className="window-taskbar" aria-label={t("Open windows")}>
    {windows.map(item => <button key={item.id} className={!activeWidget && activeWindow === item.id && !item.minimized ? "task-active" : ""} aria-label={`${t(item.minimized ? "Restore window" : "Focus window")}: ${t(getApplication(item.id).name)}`} aria-pressed={!item.minimized && activeWindow === item.id && !activeWidget} onClick={() => focusWindow(item.id)}><span className={`task-indicator ${item.minimized ? "task-minimized" : ""}`} aria-hidden="true" />{t(getApplication(item.id).name)}{item.minimized && <span className="task-status">{t("Minimized")}</span>}</button>)}
    {minimizedWidgets.map(id => <button key={`widget-${id}`} aria-label={`${t("Restore window")}: ${t(widgetNames[id])}`} onClick={() => { setMinimizedWidgets(old => old.filter(value => value !== id)); setActiveWidget(id); }}><span className="task-indicator task-minimized" aria-hidden="true" />{t(widgetNames[id])}<span className="task-status">{t("Minimized")}</span></button>)}
  </nav>}
 </div>;
}
