"use client";

import { ArrowUpRight, LifeBuoy } from "lucide-react";
import { useLanguage } from "@/core/i18n/LanguageProvider";
import type { ApplicationId } from "@/core/applications/application.types";
import { COMMAND_GROUPS } from "@/features/terminal/lib/terminal";

export function Help({ onOpen, onCommand }: { onOpen: (id: ApplicationId) => void; onCommand: (command: string) => void }) {
  const { t } = useLanguage();
  const guides = [
    ["Explore the desktop", "Use the dock, Applications menu, or search to open sections. Hover over a dock icon or focus it with the keyboard to see its name."],
    ["Window controls", "Focus a window title bar with Tab. Alt + arrows moves it; Alt + Shift + arrows changes its size; Escape closes it. On mobile, applications open maximized. Switch between open windows using the bottom bar."],
    ["Browse files", "Files groups projects, experience, and the CV into folders. Select a project to read its contributions and technologies."],
    ["Download the CV", "Resume.pdf downloads the original PDF in the selected language. Change the language in the top bar before downloading."],
    ["Connect with me", "Contact guides you through a draft and lets you open your email app or WhatsApp. You review and send the message there."],
  ];
  return <section className="dock-utility help-view">
    <div className="utility-eyebrow"><LifeBuoy size={16} aria-hidden="true" />{t("OlmosOS Help")}</div><h3>{t("Make yourself at home.")}</h3><p>{t("A quick guide to exploring this portfolio.")}</p>
    <div className="help-guides">{guides.map(([title, text], index) => <article key={title}><span className="help-step">0{index + 1}</span><h4>{t(title)}</h4><p>{t(text)}</p></article>)}</div>
    <h4 className="help-section-title">{t("Terminal quick reference")}</h4><p className="utility-note">{t("Choose a command to prepare it in Terminal, then press Enter to run it.")}</p>
    <div className="help-command-groups">{COMMAND_GROUPS.map(group => <details key={group.title}><summary>{t(group.title)}</summary><ul>{group.commands.map(([command, description]) => <li key={command}><button onClick={() => onCommand(command)} aria-label={`${t("Try command")}: ${command}`}><code>{command}</code><ArrowUpRight size={13} aria-hidden="true" /></button><span>{t(description)}</span></li>)}</ul></details>)}</div>
    <p className="utility-note">{t("Tab: autocomplete · ↑/↓: history · Ctrl+L: clear")}</p><p className="utility-note">{t("Use the Tab and arrow buttons inside Terminal when using a phone or tablet.")}</p>
    <div className="help-shortcuts"><button onClick={() => onOpen("files")}>{t("Files")}<ArrowUpRight size={14} /></button><button onClick={() => onOpen("contact")}>{t("Contact")}<ArrowUpRight size={14} /></button><button onClick={() => onOpen("system-monitor")}>{t("System Monitor")}<ArrowUpRight size={14} /></button></div>
  </section>;
}
