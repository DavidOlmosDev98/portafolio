"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { Activity, Boxes, Clock, Monitor, Terminal, Wifi, WifiOff } from "lucide-react";
import { useLanguage } from "@/core/i18n/LanguageProvider";
import { useSession, type Activity as SessionActivity } from "@/core/session/SessionProvider";
import { getApplication } from "@/core/applications/application-registry";
import { PROJECTS } from "@/features/projects/data/projects";
import { EXPERIENCE } from "@/features/experience/data/experience";
import { SKILL_GROUPS } from "@/features/skills/data/skills";

const tabs = [{ id: "system", title: "System", icon: Monitor }, { id: "portfolio", title: "Portfolio", icon: Boxes }, { id: "session", title: "Session", icon: Activity }] as const;
type TabId = (typeof tabs)[number]["id"];
function subscribeConnection(callback: () => void) {
  window.addEventListener("online", callback); window.addEventListener("offline", callback);
  return () => { window.removeEventListener("online", callback); window.removeEventListener("offline", callback); };
}
function getConnection() { return navigator.onLine; }
function serverConnection() { return null; }
const technologyGroups = SKILL_GROUPS.filter(group => !["quality", "design"].includes(group.id));
const technologies = new Set(technologyGroups.flatMap(group => [...group.items]));
const companies = new Set(EXPERIENCE.map(job => job.company));
function formatUptime(seconds: number | null) {
  if (seconds === null) return "--:--:--";
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(value => String(value).padStart(2, "0")).join(":");
}

export function SystemMonitor() {
  const { t, locale } = useLanguage();
  const session = useSession();
  const [tab, setTab] = useState<TabId>("system");
  const [seconds, setSeconds] = useState<number | null>(null);
  const online = useSyncExternalStore(subscribeConnection, getConnection, serverConnection);
  const id = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const tick = () => setSeconds(Math.max(0, Math.floor((Date.now() - performance.timeOrigin) / 1000)));
    const first = window.setTimeout(tick, 0);
    const interval = window.setInterval(tick, 1000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, []);
  function tabKey(event: KeyboardEvent, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault(); setTab(tabs[next].id); tabRefs.current[next]?.focus();
  }
  function activityText(event: SessionActivity) {
    if (event.type === "application") return `${t("Application opened")}: ${t(getApplication(event.appId).name)}`;
    if (event.type === "command") return `${t("Terminal command")}: ${event.command === "unknown" ? t("Unrecognized command") : event.command}`;
    if (event.type === "download") return `${t("Resume download requested")}: ${event.locale === "es" ? "Español" : "English"}`;
    return `${t("Language changed")}: ${event.locale === "es" ? "Español" : "English"}`;
  }
  return <section className="monitor-view">
    <div className="monitor-intro"><span className="monitor-eyebrow"><Activity size={16} aria-hidden="true" />OlmosOS Enterprise 8</span><h3>{t("Your portfolio, in real time.")}</h3><p>{t("System information, portfolio content, and activity from this visit.")}</p></div>
    <div className="monitor-tabs" role="tablist" aria-label={t("Monitor views")}>{tabs.map((item, index) => <button key={item.id} ref={element => { tabRefs.current[index] = element; }} id={`${id}-${item.id}`} role="tab" type="button" aria-selected={tab === item.id} aria-controls={`${id}-panel`} tabIndex={tab === item.id ? 0 : -1} onKeyDown={event => tabKey(event, index)} onClick={() => setTab(item.id)}><item.icon size={16} aria-hidden="true" />{t(item.title)}</button>)}</div>
    <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${tab}`} tabIndex={0} className="monitor-panel">
      {tab === "system" ? <>
        <div className="monitor-metrics"><article><Monitor size={18} /><span>{t("Portfolio version")}</span><strong>Enterprise 8</strong><small>OlmosOS</small></article><article><Clock size={18} /><span>{t("Time on this page")}</span><strong className="monitor-uptime">{formatUptime(seconds)}</strong><small>{t("Since the page was loaded")}</small></article><article>{online === false ? <WifiOff size={18} /> : <Wifi size={18} />}<span>{t("Browser connection")}</span><strong>{t(online === null ? "Checking" : online ? "Online" : "Offline")}</strong><small>{t("Reported by your browser")}</small></article><article><Terminal size={18} /><span>{t("Interface language")}</span><strong>{locale === "es" ? "Español" : "English"}</strong><small>{t("English and Spanish available")}</small></article></div>
        <div className="monitor-info"><h4>{t("Built with")}</h4><p>Next.js · React · TypeScript · Tailwind CSS</p><p className="monitor-note">{t("Connection status reflects the browser and does not guarantee access to external services.")}</p></div>
      </> : tab === "portfolio" ? <>
        <div className="monitor-metrics"><article><span>{t("Projects")}</span><strong>{PROJECTS.length}</strong><small>{t("Documented in the CV")}</small></article><article><span>{t("Companies")}</span><strong>{companies.size}</strong><small>{t("Professional experience")}</small></article><article><span>{t("Technology entries")}</span><strong>{technologies.size}</strong><small>{t("Distinct entries across five technical categories")}</small></article><article><span>{t("Skill categories")}</span><strong>{SKILL_GROUPS.length}</strong><small>{t("Technical skills, quality, and collaboration")}</small></article></div>
        <div className="monitor-info"><h4>{t("Content overview")}</h4><ul className="monitor-content-list">{SKILL_GROUPS.map(group => <li key={group.id}><span>{t(group.title)}</span><strong>{group.items.length}</strong></li>)}</ul><p className="monitor-note">{t("Counts are calculated from the portfolio data. They are not proficiency ratings or visitor totals.")}</p></div>
      </> : <>
        <div className="monitor-metrics monitor-session-metrics"><article><span>{t("Sections explored")}</span><strong>{session.applications.length}</strong></article><article><span>{t("Commands executed")}</span><strong>{session.commandCount}</strong></article><article><span>{t("CV requests")}</span><strong>{session.downloadCount}</strong></article></div>
        <div className="monitor-info"><h4>{t("Sections explored")}</h4><div className="monitor-section-tags">{session.applications.map(app => <span key={app}>{t(getApplication(app).name)}</span>)}</div><h4>{t("Recent activity")}</h4><ol className="monitor-activity" aria-label={t("Recent activity")}>{[...session.activities].reverse().map(event => <li key={event.id}><time dateTime={new Date(event.timestamp).toISOString()}>{new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(event.timestamp)}</time><span>{activityText(event)}</span></li>)}</ol>{session.activities.length === 0 && <p>{t("No activity yet. Explore the desktop to get started.")}</p>}</div>
      </>}
    </div>
    <p className="monitor-privacy">{t("Session activity stays in memory and resets on reload. Only command names are recorded, without arguments or contact messages. The activity list keeps the latest 100 events.")}</p>
  </section>;
}
