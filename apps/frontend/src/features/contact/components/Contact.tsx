"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, Check, Copy, FolderCode, Mail, MessageCircle } from "lucide-react";
import { useLanguage } from "@/core/i18n/LanguageProvider";
import { PROJECTS } from "@/features/projects/data/projects";
import { CONTACT, emailLink, whatsappLink } from "../contact";

type Intent = "opportunity" | "project" | "message";
const intents = [
  { id: "opportunity", label: "Propose an opportunity", icon: BriefcaseBusiness },
  { id: "project", label: "Discuss a project", icon: FolderCode },
  { id: "message", label: "Send a message", icon: Mail },
] as const;

export function Contact() {
  const { t } = useLanguage();
  const [intent, setIntent] = useState<Intent | null>(null);
  const [preview, setPreview] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState("");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const heading = useRef<HTMLHeadingElement>(null);
  const label = intents.find(item => item.id === intent)?.label ?? "Send a message";
  const project = PROJECTS.find(item => item.id === reference);
  const subject = `OlmosOS · ${t(label)}${intent === "opportunity" && role.trim() ? ` · ${role.trim()}` : ""}`;
  const body = [
    `${t("Hello David,")}`, "", message.trim(), "",
    `${t("Name")}: ${name.trim()}`, `${t("Email")}: ${email.trim()}`,
    ...(intent === "opportunity" ? [`${t("Company")}: ${company.trim()}`, `${t("Position")}: ${role.trim()}`] : []),
    ...(intent === "project" && project ? [`${t("Portfolio reference")}: ${t(project.title)}`] : []),
  ].join("\n");
  function focusHeading() { requestAnimationFrame(() => heading.current?.focus()); }
  async function copyMessage() {
    try { await navigator.clipboard.writeText(`${subject}\n\n${body}`); setCopyStatus("copied"); }
    catch { setCopyStatus("failed"); }
  }

  return <section className="contact-view">
    <div className="contact-prompt"><span>david@olmosos</span>:~$ connect<span className="contact-cursor" aria-hidden="true" /></div>
    <h3 ref={heading} tabIndex={-1}>{t(preview ? "Review your message" : intent ? label : "Let's connect.")}</h3>
    <ol className="contact-steps" aria-label={t("Contact steps")}>
      {["Choose a reason", "Write your message", "Review & connect"].map((step, index) => <li key={step} aria-current={(preview ? 2 : intent ? 1 : 0) === index ? "step" : undefined}><span>{index + 1}</span>{t(step)}</li>)}
    </ol>
    {!intent ? <>
      <p className="contact-lead">{t("How would you like to connect with me?")}</p>
      <div className="contact-options">{intents.map(item => <button key={item.id} onClick={() => { setIntent(item.id); setCopyStatus("idle"); focusHeading(); }}><item.icon size={20} aria-hidden="true" /><span>{t(item.label)}</span><ArrowUpRight size={16} aria-hidden="true" /></button>)}</div>
      <div className="contact-direct"><span>{t("Prefer a direct conversation?")}</span><a href={whatsappLink(t("Hello David, I found your portfolio and would like to connect."))} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} aria-hidden="true" />{t("Open WhatsApp")}<ArrowUpRight size={14} aria-hidden="true" /></a><small>{t("Opens WhatsApp with a draft. You decide when to send it.")}</small></div>
    </> : !preview ? <form className="contact-form" onSubmit={event => { event.preventDefault(); setPreview(true); setCopyStatus("idle"); focusHeading(); }}>
      <div className="contact-field-pair"><label>{t("Name")}<input required maxLength={100} autoComplete="name" value={name} onChange={event => setName(event.target.value)} /></label><label>{t("Email")}<input required type="email" maxLength={254} autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} /></label></div>
      {intent === "opportunity" && <div className="contact-field-pair"><label>{t("Company")}<input required maxLength={120} autoComplete="organization" value={company} onChange={event => setCompany(event.target.value)} /></label><label>{t("Position")}<input required maxLength={120} value={role} onChange={event => setRole(event.target.value)} /></label></div>}
      {intent === "project" && <label>{t("Portfolio reference")} <span className="contact-optional">({t("optional")})</span><select value={reference} onChange={event => setReference(event.target.value)}><option value="">{t("A new project / no reference")}</option>{PROJECTS.map(item => <option key={item.id} value={item.id}>{t(item.title)}</option>)}</select></label>}
      <label>{t(intent === "project" ? "Tell me about your project" : "Message")}<textarea aria-label={t(intent === "project" ? "Tell me about your project" : "Message")} required minLength={10} maxLength={3000} rows={5} value={message} onChange={event => setMessage(event.target.value)} /><span className="contact-counter">{message.length}/3000</span></label>
      <p className="contact-note">{t("Your draft stays in this window. No message is sent from this form.")}</p>
      <div className="contact-actions"><button type="button" className="contact-secondary" onClick={() => { setIntent(null); focusHeading(); }}><ArrowLeft size={15} />{t("Back")}</button><button type="submit" className="contact-primary">{t("Preview message")}<ArrowUpRight size={15} /></button></div>
    </form> : <>
      <div className="contact-preview"><dl><div><dt>{t("To")}</dt><dd>{CONTACT.email}</dd></div><div><dt>{t("Subject")}</dt><dd>{subject}</dd></div></dl><pre>{body}</pre></div>
      <p className="contact-note">{t("Email opens your mail app with this draft. WhatsApp opens a separate conversation. Review and send there; nothing has been sent yet.")}</p>
      <div className="contact-send-actions"><a className="contact-primary" href={emailLink(subject, body)}><Mail size={16} />{t("Open email app")}</a><a className="contact-whatsapp" href={whatsappLink(`${subject}\n\n${body}`)} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} />{t("Open WhatsApp")}</a><button className="contact-secondary" onClick={copyMessage}>{copyStatus === "copied" ? <Check size={16} /> : <Copy size={16} />}{t("Copy message")}</button></div>
      <p role="status" className="contact-copy-status">{copyStatus === "copied" ? t("Message copied.") : copyStatus === "failed" ? t("Copy is unavailable. Select the message above and copy it manually.") : ""}</p>
      <button className="contact-secondary" onClick={() => { setPreview(false); setCopyStatus("idle"); focusHeading(); }}><ArrowLeft size={15} />{t("Edit message")}</button>
    </>}
    <footer className="contact-address"><Mail size={14} aria-hidden="true" /><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></footer>
  </section>;
}
