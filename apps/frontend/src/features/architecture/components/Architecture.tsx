"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Network, Minus, Plus, RotateCcw } from "lucide-react";
import { useLanguage } from "@/core/i18n/LanguageProvider";

const nodes = [
  { id: "visitor", x: 340, y: 20, title: "Visitor", detail: "Browser request" },
  { id: "language", x: 340, y: 120, title: "Next.js · Initial language", detail: "Server-side rendering" },
  { id: "desktop", x: 340, y: 220, title: "OlmosOS desktop", detail: "React · TypeScript · Tailwind CSS" },
  { id: "navigation", x: 340, y: 320, title: "Dock, menu & search", detail: "Application registry" },
  { id: "window", x: 340, y: 420, title: "Application window", detail: "Local React state" },
  { id: "content", x: 190, y: 540, title: "Profile · Experience · Projects", detail: "Components & local data" },
  { id: "terminal", x: 560, y: 540, title: "Interactive terminal", detail: "Commands & project listing" },
  { id: "translations", x: 40, y: 420, title: "Content & translations", detail: "TypeScript data · Spanish dictionary" },
  { id: "cookie", x: 650, y: 120, title: "Saved language preference", detail: "Cookie · English / Spanish" },
] as const;

const explanations = [
  { title: "Code organization", text: "The desktop, experience, and projects live in separate feature folders. Shared application definitions and language handling live in core. Professional content is stored locally in TypeScript data files." },
  { title: "Interaction", text: "React state controls the selected application, window maximization, search, project details, and terminal history. The terminal interprets supported portfolio commands directly in the browser." },
  { title: "Languages", text: "Next.js resolves the initial language from a saved cookie or the browser's Accept-Language header. A shared React provider updates the interface immediately, saves the choice in a cookie, and updates the page language and clock." },
];

export function Architecture() {
  const { t } = useLanguage();
  const [zoom, setZoom] = useState(1);
  const viewport = useRef<HTMLDivElement>(null);
  const markerId = useId().replaceAll(":", "");
  useEffect(() => {
    const element = viewport.current;
    if (element) element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
  }, []);
  return <section className="architecture-view" aria-label={t("OlmosOS architecture")}>
    <div className="architecture-intro">
      <span className="architecture-eyebrow"><Network size={16} aria-hidden="true" />{t("Inside the portfolio")}</span>
      <h3>{t("OlmosOS · Inside the portfolio")}</h3>
      <p>{t("A Linux desktop built for the web.")}</p>
      <span className="architecture-current">{t("Current implementation")}</span>
    </div>
    <figure className="architecture-figure">
      <div className="architecture-toolbar" role="group" aria-label={t("Diagram controls")}>
        <span>{t("Application flow")}</span>
        <div><button aria-label={t("Zoom out")} disabled={zoom <= .75} onClick={() => setZoom(value => Math.max(.75, Math.round((value - .25) * 100) / 100))}><Minus size={16} /></button><output aria-live="polite" aria-label={t("Zoom level")}>{Math.round(zoom * 100)}%</output><button aria-label={t("Zoom in")} disabled={zoom >= 1.75} onClick={() => setZoom(value => Math.min(1.75, Math.round((value + .25) * 100) / 100))}><Plus size={16} /></button><button aria-label={t("Reset zoom")} onClick={() => { setZoom(1); const element = viewport.current; if (element) element.scrollTo({ left: Math.max(0, (900 - element.clientWidth) / 2), top: 0 }); }}><RotateCcw size={15} /></button></div>
      </div>
      <div ref={viewport} className="architecture-viewport" tabIndex={0} role="region" aria-label={t("Scrollable architecture diagram")}>
        <svg className="architecture-diagram" viewBox="0 0 900 650" style={{ width: `${900 * zoom}px`, height: `${650 * zoom}px` }} role="img" aria-labelledby={`${markerId}-title ${markerId}-description`}>
          <title id={`${markerId}-title`}>{t("OlmosOS application architecture")}</title>
          <desc id={`${markerId}-description`}>{t("The visitor reaches Next.js, which selects the language using browser preferences or a saved cookie. The desktop launches application windows through the dock, menu, and search. Profile, experience, projects, and terminal use local content and translations.")}</desc>
          <defs><marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#739fbe" /></marker></defs>
          <g className="architecture-connections" fill="none" stroke="#739fbe" strokeWidth="1.5" markerEnd={`url(#${markerId})`}>
            <path d="M450 92V120" /><path d="M450 192V220" /><path d="M450 292V320" /><path d="M450 392V420" />
            <path d="M450 492V515H300V540" /><path d="M450 492V515H670V540" />
            <path d="M650 156H560" className="architecture-data-connection" />
            <path d="M150 492V576H190" className="architecture-data-connection" />
            <path d="M150 492V630H670V612" className="architecture-data-connection" />
          </g>
          {nodes.map(node => <g key={node.id} transform={`translate(${node.x} ${node.y})`}>
            <rect width="220" height="72" rx="9" className={`architecture-node ${node.id === "cookie" || node.id === "translations" ? "architecture-data-node" : ""}`} />
            <text x="110" y="29" textAnchor="middle" className="architecture-node-title">{t(node.title)}</text>
            <text x="110" y="50" textAnchor="middle" className="architecture-node-detail">{t(node.detail)}</text>
          </g>)}
        </svg>
      </div>
      <figcaption>{t("Solid lines: navigation flow. Dashed lines: content and language preferences. Scroll to explore the diagram or use the zoom controls.")}</figcaption>
    </figure>
    <div className="architecture-explanations">{explanations.map((item, index) => <article key={item.title}><span className="architecture-step">0{index + 1}</span><h4>{t(item.title)}</h4><p>{t(item.text)}</p></article>)}</div>
    <p className="architecture-scope">{t("This diagram represents the current portfolio: Next.js and React with local content. A backend API and database are planned, and will be added to the diagram when implemented.")}</p>
  </section>;
}
