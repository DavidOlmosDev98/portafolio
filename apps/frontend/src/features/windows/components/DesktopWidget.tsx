"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { WindowFrame } from "./WindowFrame";

export function DesktopWidget({ name, children, className, minimized, active, onClose, onMinimize, onFocus }: {
  name: string; children: ReactNode; className: string; minimized: boolean; active: boolean;
  onClose: () => void; onMinimize: () => void; onFocus: () => void;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [maximized, setMaximized] = useState(false);
  useEffect(() => {
    const resize = () => { setPosition({ x: 0, y: 0 }); setSize(null); };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  return <WindowFrame name={name} className={`${className} ${size ? "window-user-sized" : ""}`} maximized={maximized} minimized={minimized} active={active} style={{ "--widget-x": position.x, "--widget-y": position.y, zIndex: active ? 350 : 15, width: size?.width, height: size?.height, transform: maximized ? undefined : `translate(${position.x}px, ${position.y}px)` } as CSSProperties} onClose={onClose} onMinimize={onMinimize} onMaximize={() => setMaximized(value => !value)} onFocus={onFocus} onMove={(x, y) => setPosition({ x, y })} onResize={({ x, y, width, height }) => { setPosition({ x, y }); setSize({ width, height }); }}>{children}</WindowFrame>;
}
