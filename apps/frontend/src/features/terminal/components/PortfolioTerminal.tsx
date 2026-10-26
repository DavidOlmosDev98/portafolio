"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { ApplicationId } from "@/core/applications/application.types";
import { useLanguage } from "@/core/i18n/LanguageProvider";
import { useSession } from "@/core/session/SessionProvider";
import { activityCommand, HOME, completeCommand, interpret, PROFILE_LINKS, type TerminalEntry } from "../lib/terminal";

export function usePortfolioTerminal(onOpen: (id: ApplicationId) => void, onClose: () => void) {
  const { t } = useLanguage();
  const { record } = useSession();
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [commands, setCommands] = useState<string[]>([]);
  const [cwd, setCwd] = useState(HOME);
  const [cursor, setCursor] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  function edit(value: string) { setInput(value); setCursor(null); setMatches([]); }
  function run() {
    const command = input.trim();
    if (!command) return;
    record({ type: "command", command: activityCommand(command) });
    const entry = { command, cwd, history: [...commands, command] };
    const result = interpret(entry, t);
    setCommands(old => [...old, command].slice(-200));
    setEntries(old => result.clear ? [] : [...old, entry].slice(-100));
    if (result.cwd) setCwd(result.cwd);
    if (result.open) onOpen(result.open);
    if (result.close) onClose();
    if (result.profile) window.open(PROFILE_LINKS[result.profile], "_blank", "noopener,noreferrer");
    setInput(""); setCursor(null); setDraft(""); setMatches([]);
  }
  function complete() {
    const options = completeCommand(input, cwd);
    setMatches(options.length > 1 ? options : []);
    if (options.length === 1) setInput(options[0]);
    else if (options.length > 1) {
      let prefix = options[0];
      while (prefix && !options.every(option => option.startsWith(prefix))) prefix = prefix.slice(0, -1);
      if (prefix.length > input.length) setInput(prefix);
    }
  }
  function navigate(direction: -1 | 1) {
    if (!commands.length) return;
    if (cursor === null && direction === 1) return;
    if (cursor === null) setDraft(input);
    const next = cursor === null ? commands.length - 1 : Math.max(0, Math.min(commands.length, cursor + direction));
    if (next === commands.length) { setInput(draft); setCursor(null); }
    else { setInput(commands[next]); setCursor(next); }
    setMatches([]);
  }
  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Tab" && !event.shiftKey) { event.preventDefault(); complete(); }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") { event.preventDefault(); navigate(event.key === "ArrowUp" ? -1 : 1); }
    if (event.ctrlKey && event.key.toLowerCase() === "l") { event.preventDefault(); setEntries([]); }
  }
  return { input, setInput: edit, entries, cwd, matches, run, complete, navigate, onKeyDown };
}

export function PortfolioTerminal({ terminal }: { terminal: ReturnType<typeof usePortfolioTerminal> }) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "nearest" }); }, [terminal.entries.length, terminal.matches]);
  const path = (cwd: string) => cwd.replace(HOME, "~");
  return <div className="portfolio-terminal">
    <p className="terminal-welcome">{t("OlmosOS Enterprise 8 — type help to get started.")}</p>
    <p className="terminal-keyboard-hint">{t("Tab: autocomplete · ↑/↓: history · Ctrl+L: clear")}<br />{t("Type exit to close this terminal.")}</p>
    <div role="log" aria-label={t("Terminal output")} aria-live="polite" aria-relevant="additions">
      {terminal.entries.map((entry, index) => {
        const result = interpret(entry, t);
        return <div className="terminal-entry" key={index}>
          <div className="terminal-command-line"><span>david@olmosos:{path(entry.cwd)}$</span> {entry.command}</div>
          {result.output && <pre className={`command-output ${entry.command.trim().toLowerCase() === "neofetch" ? "terminal-neofetch" : ""}`}>{result.output}</pre>}
          {result.profile && <a className="terminal-profile-link" href={PROFILE_LINKS[result.profile]} target="_blank" rel="noopener noreferrer">{t("Open profile")}: {result.profile} ↗</a>}
        </div>;
      })}
    </div>
    <form onSubmit={event => { event.preventDefault(); terminal.run(); inputRef.current?.focus(); }}>
      <label className="terminal-input"><span>david@olmosos:{path(terminal.cwd)}$</span><input ref={inputRef} autoFocus aria-label={t("Terminal command")} value={terminal.input} onChange={event => terminal.setInput(event.target.value)} onKeyDown={terminal.onKeyDown} autoComplete="off" autoCapitalize="none" spellCheck={false} enterKeyHint="send" /></label>
    </form>
    {terminal.matches.length > 0 && <div className="terminal-completions" aria-label={t("Autocomplete suggestions")}>{terminal.matches.map(match => <button key={match} onClick={() => { terminal.setInput(match); inputRef.current?.focus(); }}>{match}</button>)}</div>}
    <div className="terminal-touch-controls" role="group" aria-label={t("Terminal shortcuts")}>
      <button onClick={() => { terminal.complete(); inputRef.current?.focus(); }}>Tab</button>
      <button aria-label={t("Previous command")} onClick={() => { terminal.navigate(-1); inputRef.current?.focus(); }}>↑</button>
      <button aria-label={t("Next command")} onClick={() => { terminal.navigate(1); inputRef.current?.focus(); }}>↓</button>
      <button onClick={() => { terminal.setInput("help"); inputRef.current?.focus(); }}>help</button>
    </div>
    <div ref={endRef} />
  </div>;
}
