import type { ApplicationId } from "@/core/applications/application.types";
import { EXPERIENCE, EXPERIENCE_SUMMARY } from "@/features/experience/data/experience";
import { PROJECTS } from "@/features/projects/data/projects";
import { SKILL_GROUPS } from "@/features/skills/data/skills";

export const HOME = "/home/david";
export const COMMAND_GROUPS = [
  { title: "Profile and work", commands: [["about", "Show information about me"], ["experience", "Show my work experience"], ["projects", "List and open projects"], ["skills", "Show my technical skills"], ["skills --backend", "Show backend technologies"], ["skills --frontend", "Show frontend technologies"], ["architecture", "Show system architectures"]] },
  { title: "Files and navigation", commands: [["ls", "List files and folders"], ["cd projects", "Change directory"], ["pwd", "Show current directory"], ["cat about.txt", "Read a portfolio file"], ["cat projects/sppi.txt", "Read a project file"]] },
  { title: "Connect", commands: [["contact", "Open contact information"], ["resume", "Download my resume"], ["linkedin", "Open my LinkedIn profile"], ["hire", "Hire me :)"]] },
  { title: "Terminal and system", commands: [["help", "Show command reference"], ["neofetch", "Show developer system information"], ["whoami", "Who am I?"], ["history", "Show command history"], ["clear", "Clear terminal"], ["exit", "Close terminal"]] },
] as const;
const COMMANDS = ["help", "about", "experience", "projects", "skills", "architecture", "resume", "contact", "linkedin", "hire", "clear", "exit", "whoami", "neofetch", "ls", "cat", "cd", "pwd", "history"];
const FILES = ["about.txt", "experience.txt", "skills.txt", "contact.txt", "architecture.txt"];
export type Translate = (text: string) => string;
export type TerminalEntry = { command: string; cwd: string; history?: string[] };
export type TerminalResult = { output: string; cwd?: string; open?: ApplicationId; profile?: "linkedin"; clear?: boolean; close?: boolean };
import { PROFILE_LINKS } from "@/core/profile-links";
export { PROFILE_LINKS } from "@/core/profile-links";
function resolvePath(path: string, cwd: string) {
  const parts = (path.startsWith("/") ? path : `${cwd}/${path}`).replace(/^~(?=\/|$)/, HOME).split("/");
  const resolved: string[] = [];
  for (const part of parts) { if (!part || part === ".") continue; if (part === "..") resolved.pop(); else resolved.push(part); }
  return "/" + resolved.join("/");
}
function pathFor(path: string, cwd: string) { return path.startsWith("~") ? resolvePath(path.replace(/^~/, HOME), HOME) : resolvePath(path, cwd); }
function skillText(t: Translate, id?: string) {
  return SKILL_GROUPS.filter(group => !id || group.id === id).map(group => `${t(group.title)}\n${group.items.map(item => "  • " + t(item)).join("\n")}`).join("\n\n");
}
function projectText(id: string, t: Translate) {
  const project = PROJECTS.find(item => item.id === id);
  return project ? `${t(project.title)}\n${project.company}\n\n${t(project.summary)}\n\n${project.contributions.map(item => "• " + t(item)).join("\n")}\n\n${t("Technologies and tools")}: ${project.technologies.map(item => t(item)).join(", ")}` : undefined;
}
function distance(a: string, b: string) {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) { const row = [i]; for (let j = 1; j <= b.length; j++) row[j] = Math.min(row[j - 1] + 1, previous[j] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); previous = row; }
  return previous[b.length];
}
export function completeCommand(input: string, cwd: string): string[] {
  const trimmed = input.trimStart();
  if (!trimmed.includes(" ")) return COMMANDS.filter(command => command.startsWith(trimmed.toLowerCase()));
  const [command, ...args] = trimmed.split(/\s+/);
  const prefix = args.join(" ").toLowerCase();
  let values: string[] = [];
  if (command === "skills") values = SKILL_GROUPS.map(group => "--" + group.id);
  if (["ls", "cd", "cat"].includes(command)) {
    values = command === "cd" ? ["~", "..", "projects/"] : [...FILES, "projects/", ...PROJECTS.map(project => `projects/${project.id}.txt`)];
    if (cwd === `${HOME}/projects`) values = command === "cd" ? ["~", ".."] : PROJECTS.map(project => `${project.id}.txt`);
  }
  return values.filter(value => value.startsWith(prefix)).map(value => `${command} ${value}`);
}
export function interpret(entry: TerminalEntry, t: Translate): TerminalResult {
  const [command, ...args] = entry.command.trim().toLowerCase().split(/\s+/);
  const argument = args.join(" ");
  const noArgs = () => ({ output: `${t("Usage")}: ${command}` });
  if (command === "exit") return args.length ? noArgs() : { output: t("Terminal closed."), close: true };
  if (command === "clear") return args.length ? noArgs() : { output: "", clear: true };
  if (command === "help") return { output: COMMAND_GROUPS.map(group => `${t(group.title)}\n${group.commands.map(([name, text]) => `  ${name.padEnd(24)} ${t(text)}`).join("\n")}`).join("\n\n") + "\n\n" + t("Tab: autocomplete · ↑/↓: history · Ctrl+L: clear") };
  if (command === "pwd") return { output: entry.cwd };
  if (command === "history") return { output: (entry.history ?? []).map((item, index) => `${String(index + 1).padStart(3)}  ${item}`).join("\n") };
  if (command === "cd") {
    const target = argument ? pathFor(argument, entry.cwd) : HOME;
    return [HOME, `${HOME}/projects`].includes(target) ? { output: "", cwd: target } : { output: `${t("Directory not found")}: ${argument}` };
  }
  if (command === "ls") {
    const target = argument ? pathFor(argument, entry.cwd) : entry.cwd;
    if (target === HOME) return { output: [...FILES, "projects/"].join("  ") };
    if (target === `${HOME}/projects`) return { output: PROJECTS.map(project => `${project.id}.txt — ${t(project.title)}`).join("\n") };
    return { output: `${t("Directory not found")}: ${argument}` };
  }
  if (command === "skills") {
    const id = argument.replace(/^--/, "");
    return !argument || SKILL_GROUPS.some(group => group.id === id) ? { output: skillText(t, id || undefined) } : { output: `${t("Usage")}: skills [${SKILL_GROUPS.map(group => "--" + group.id).join(" | ")}]` };
  }
  if (command === "cat") {
    if (!argument) return { output: `${t("Usage")}: cat about.txt | cat projects/sppi.txt` };
    const path = pathFor(argument, entry.cwd);
    const file = path.slice(HOME.length + 1);
    if (path.startsWith(`${HOME}/projects/`) && path.endsWith(".txt")) {
      const output = projectText(file.slice("projects/".length, -4), t);
      if (output) return { output };
    }
    if (path === `${HOME}/about.txt`) return { output: `David Antonio Olmos Ruiz\n${t(EXPERIENCE_SUMMARY)}` };
    if (path === `${HOME}/experience.txt`) return { output: EXPERIENCE.map(job => `${job.company} · ${t(job.role)}\n${t(job.period)}\n${job.highlights.map(item => "• " + t(item)).join("\n")}`).join("\n\n") };
    if (path === `${HOME}/skills.txt`) return { output: skillText(t) };
    if (path === `${HOME}/contact.txt`) return { output: "david.antonio.olmos.r@gmail.com\n" + t("Run contact to open the guided contact terminal.") };
    if (path === `${HOME}/architecture.txt`) return { output: t("Next.js · React · TypeScript · Tailwind CSS") + "\n" + t("Run architecture to explore the current portfolio diagram.") };
    return { output: `${t("File not found")}: ${argument}` };
  }
  if (command === "linkedin") {
    if (args.length) return noArgs();
    const profile = "linkedin" as const;
    return { output: t("Profile link") + ": " + PROFILE_LINKS[profile], profile };
  }
  if (command === "neofetch") return { output: `  .oOOo.
 .OO  OO.  David Antonio Olmos Ruiz
 OO    OO  ${t("Senior Software Engineer")}
 'OOooOO'  OlmosOS Enterprise 8
   'OO'    Next.js · React · TypeScript
           Java 21 · Spring Boot · Angular
           PostgreSQL · Oracle · AWS
           Docker · Linux` };
  if (command === "whoami") return { output: `David Antonio Olmos Ruiz · ${t("Senior Software Engineer")}` };
  const app = command === "hire" ? "contact" : command;
  if (["about", "experience", "projects", "architecture", "contact", "resume"].includes(app)) {
    if (args.length) return noArgs();
    return { output: app === "resume" ? t("Resume download requested.") : t("Opening") + " " + t(app === "about" ? "About Me" : app === "experience" ? "Experience" : app === "projects" ? "Projects" : app === "architecture" ? "Architecture" : "Contact") + "…", open: app as ApplicationId };
  }
  const closest = COMMANDS.map(value => ({ value, score: distance(command, value) })).sort((a, b) => a.score - b.score)[0];
  return { output: `${t("Command not found")}: ${command}. ${closest.score <= 2 ? t("Did you mean") + ` '${closest.value}'?` : t("Type help to see available commands.")}` };
}

/** Keep visitor input and file paths out of session activity. */
export function activityCommand(input: string) {
  const verb = input.trim().toLowerCase().split(/\s+/)[0];
  return COMMANDS.includes(verb) ? verb : "unknown";
}
