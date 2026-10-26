"use client";

import type { PointerEvent } from "react";
import { useLanguage } from "@/core/i18n/LanguageProvider";
import type { ResizeEdge } from "../lib/window-state";

const labels: Record<ResizeEdge, string> = { n: "top", ne: "top right", e: "right", se: "bottom right", s: "bottom", sw: "bottom left", w: "left", nw: "top left" };
export function ResizeHandles({ onStart, onMove, onEnd }: {
  onStart: (event: PointerEvent<HTMLDivElement>, edge: ResizeEdge) => void;
  onMove: (event: PointerEvent<HTMLDivElement>) => void;
  onEnd: () => void;
}) {
  const { t } = useLanguage();
  return <>{(Object.keys(labels) as ResizeEdge[]).map(edge => <div key={edge} className={`window-resize-handle resize-${edge}`} title={`${t("Resize window")}: ${t(labels[edge])}`} aria-hidden="true" onPointerDown={event => onStart(event, edge)} onPointerMove={onMove} onPointerUp={onEnd} onPointerCancel={onEnd} onLostPointerCapture={onEnd} />)}</>;
}
