"use client";

import { useEffect, useId, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { Maximize2, Minimize2, Minus, X } from "lucide-react";
import { useLanguage } from "@/core/i18n/LanguageProvider";
import { ResizeHandles } from "./ResizeHandles";
import { clampPosition, resizeWindow, type ResizeEdge, type WindowRect } from "../lib/window-state";

type Props = {
  name: string;
  windowId?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  maximized: boolean;
  minimized?: boolean;
  active?: boolean;
  floating?: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus?: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (rect: WindowRect) => void;
};
export function WindowFrame({ name, windowId, children, className = "", style, maximized, minimized, active = true, floating = false, onClose, onMinimize, onMaximize, onFocus, onMove, onResize }: Props) {
  const { t } = useLanguage();
  const frame = useRef<HTMLElement>(null);
  const hintId = useId();
  useEffect(() => {
    if (floating && active && !minimized && frame.current && !frame.current.contains(document.activeElement)) frame.current.focus({ preventScroll: true });
  }, [floating, active, minimized]);
  const drag = useRef<{ pointerId: number; startX: number; startY: number; x: number; y: number; width: number; height: number } | null>(null);
  const resize = useRef<{ pointerId: number; startX: number; startY: number; rect: WindowRect; edge: ResizeEdge; baseX: number; baseY: number } | null>(null);
  function startResize(event: PointerEvent<HTMLDivElement>, edge: ResizeEdge) {
    if (event.button !== 0 || maximized) return;
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    resize.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, rect: { x: rect.left, y: rect.top, width: rect.width, height: rect.height }, edge,
      baseX: floating ? 0 : rect.left - Number(style?.["--widget-x" as keyof CSSProperties] ?? 0),
      baseY: floating ? 0 : rect.top - Number(style?.["--widget-y" as keyof CSSProperties] ?? 0) };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault(); event.stopPropagation();
  }
  function moveResize(event: PointerEvent<HTMLDivElement>) {
    const current = resize.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const rect = resizeWindow(current.rect, current.edge, event.clientX - current.startX, event.clientY - current.startY, window.innerWidth, window.innerHeight);
    onResize({ ...rect, x: rect.x - current.baseX, y: rect.y - current.baseY });
  }
  function start(event: PointerEvent<HTMLElement>) {
    if (event.button !== 0 || maximized || (event.target as HTMLElement).closest("button")) return;
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    const x = floating ? rect.left : Number(style?.["--widget-x" as keyof CSSProperties] ?? 0);
    const y = floating ? rect.top : Number(style?.["--widget-y" as keyof CSSProperties] ?? 0);
    drag.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x, y, width: rect.width, height: rect.height };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }
  function move(event: PointerEvent<HTMLElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const x = current.x + event.clientX - current.startX;
    const y = current.y + event.clientY - current.startY;
    if (floating) {
      const position = clampPosition(x, y, current.width, current.height, window.innerWidth, window.innerHeight, window.innerWidth <= 760 ? 76 : 48);
      onMove(position.x, position.y);
    } else {
      // Keep the widget title reachable while retaining its place in the desktop grid.
      const rect = frame.current?.getBoundingClientRect();
      if (!rect) return;
      const baseX = rect.left - Number(style?.["--widget-x" as keyof CSSProperties] ?? 0);
      const baseY = rect.top - Number(style?.["--widget-y" as keyof CSSProperties] ?? 0);
      const clampedX = Math.max(-baseX + 8, Math.min(x, window.innerWidth - baseX - Math.min(current.width, 160)));
      const clampedY = Math.max(48 - baseY, Math.min(y, window.innerHeight - baseY - 100));
      onMove(clampedX, clampedY);
    }
  }
  const maxLabel = `${t(maximized ? "Restore window" : "Maximize")} ${name}`;
  return <section ref={frame} data-window-id={windowId} tabIndex={-1} role={floating ? "dialog" : undefined} aria-label={name} hidden={minimized} className={`terminal-window window-frame ${floating ? "floating-window" : "desktop-widget"} ${maximized ? "window-maximized" : ""} ${active ? "window-active" : ""} ${className}`} style={style} onPointerDownCapture={onFocus} onFocusCapture={onFocus}>
    <header tabIndex={0} aria-describedby={hintId} onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (!event.altKey || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key) || maximized) return;
      event.preventDefault();
      const rect = frame.current?.getBoundingClientRect();
      if (!rect) return;
      const dx = event.key === "ArrowLeft" ? -16 : event.key === "ArrowRight" ? 16 : 0;
      const dy = event.key === "ArrowUp" ? -16 : event.key === "ArrowDown" ? 16 : 0;
      const baseX = floating ? 0 : rect.left - Number(style?.["--widget-x" as keyof CSSProperties] ?? 0);
      const baseY = floating ? 0 : rect.top - Number(style?.["--widget-y" as keyof CSSProperties] ?? 0);
      if (event.shiftKey) {
        const next = resizeWindow({ x: rect.left, y: rect.top, width: rect.width, height: rect.height }, dx ? "e" : "s", dx, dy, window.innerWidth, window.innerHeight);
        onResize({ ...next, x: next.x - baseX, y: next.y - baseY });
      } else {
        const next = clampPosition(rect.left + dx, rect.top + dy, rect.width, rect.height, window.innerWidth, window.innerHeight, window.innerWidth <= 760 ? 76 : 48);
        onMove(next.x - baseX, next.y - baseY);
      }
    }} className="terminal-title window-titlebar" aria-label={`${t("Move window")}: ${name}`} onPointerDown={start} onPointerMove={move} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }} onDoubleClick={event => { if (!(event.target as HTMLElement).closest("button")) onMaximize(); }}>
      <div className="traffic-lights" aria-hidden="true"><button tabIndex={-1} aria-label={`${t("Close")} ${name}`} title={t("Close")} onClick={onClose} /><button tabIndex={-1} aria-label={`${t("Minimize")} ${name}`} title={t("Minimize")} onClick={onMinimize} /><button tabIndex={-1} aria-label={maxLabel} title={t(maximized ? "Restore window" : "Maximize")} onClick={onMaximize} /></div>
      <span className="window-caption">{floating ? name : "david@olmosos:~"}</span>
      <div className="window-controls"><button aria-label={`${t("Minimize")} ${name}`} title={t("Minimize")} onClick={onMinimize}><Minus size={14}/></button><button aria-label={maxLabel} title={t(maximized ? "Restore window" : "Maximize")} onClick={onMaximize}>{maximized ? <Minimize2 size={13}/> : <Maximize2 size={13}/>}</button><button aria-label={`${t("Close")} ${name}`} title={t("Close")} onClick={onClose}><X size={15}/></button></div>
    </header>
    <span id={hintId} className="window-keyboard-hint">{t("Alt + arrows: move. Alt + Shift + arrows: resize. Escape: close. Use the title bar controls to minimize or maximize.")}</span>
    <div className="terminal-body window-body">{children}</div>
    {!maximized && <ResizeHandles onStart={startResize} onMove={moveResize} onEnd={() => { resize.current = null; }} />}
  </section>;
}
