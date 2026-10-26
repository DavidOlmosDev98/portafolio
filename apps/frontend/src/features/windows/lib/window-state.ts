import type { ApplicationId } from "@/core/applications/application.types";

export type AppWindowState = {
  id: ApplicationId;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
};
export type WindowAction =
  | { type: "open"; window: AppWindowState }
  | { type: "focus" | "close" | "minimize" | "maximize"; id: ApplicationId }
  | { type: "move"; id: ApplicationId; x: number; y: number }
  | { type: "resize"; id: ApplicationId; rect: WindowRect }
  | { type: "fit"; width: number; height: number; top: number };

export function clampPosition(x: number, y: number, width: number, height: number, viewportWidth: number, viewportHeight: number, top = 48) {
  return { x: Math.max(8, Math.min(x, Math.max(8, viewportWidth - width - 8))), y: Math.max(top, Math.min(y, Math.max(top, viewportHeight - Math.min(height, 160) - 90))) };
}
export function windowReducer(state: AppWindowState[], action: WindowAction): AppWindowState[] {
  if (action.type === "open") {
    const existing = state.find(item => item.id === action.window.id);
    return [...state.filter(item => item.id !== action.window.id), existing ? { ...existing, minimized: false } : action.window];
  }
  if (action.type === "fit") return state.map(item => {
    const width = Math.min(item.width, action.width - 20);
    const height = Math.min(item.height, Math.max(200, action.height - action.top - 135));
    return { ...item, maximized: action.width <= 760 || item.maximized, width, height, ...clampPosition(item.x, item.y, width, height, action.width, action.height, action.top) };
  });
  if (action.type === "resize") return state.map(item => item.id === action.id && !item.maximized ? { ...item, ...action.rect } : item);
  if (action.type === "close") return state.filter(item => item.id !== action.id);
  if (action.type === "focus") {
    const current = state.find(item => item.id === action.id);
    return current ? [...state.filter(item => item.id !== action.id), { ...current, minimized: false }] : state;
  }
  return state.map(item => item.id !== action.id ? item : action.type === "minimize" ? { ...item, minimized: true } : action.type === "maximize" ? { ...item, maximized: !item.maximized, minimized: false } : action.type === "move" ? { ...item, x: action.x, y: action.y } : item);
}
export function createWindow(id: ApplicationId, index: number, viewportWidth: number, viewportHeight: number): AppWindowState {
  const compact = viewportWidth <= 760;
  const width = Math.min(["projects", "architecture", "skills", "files"].includes(id) ? 1020 : 820, viewportWidth - (compact ? 20 : 140));
  const height = Math.min(660, Math.max(240, viewportHeight - (compact ? 220 : 160)));
  const offset = (index % 5) * 28;
  const position = clampPosition(compact ? 10 : (viewportWidth - width) / 2 + offset, compact ? 85 : 100 + offset, width, height, viewportWidth, viewportHeight, compact ? 76 : 48);
  return { id, ...position, width, height, minimized: false, maximized: compact };
}

export type ResizeEdge = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
export type WindowRect = { x: number; y: number; width: number; height: number };
/** Resize around the opposite edge, within the usable desktop area. */
export function resizeWindow(start: WindowRect, edge: ResizeEdge, dx: number, dy: number, viewportWidth: number, viewportHeight: number): WindowRect {
  const topLimit = viewportWidth <= 760 ? 76 : 48;
  const rightLimit = Math.max(24, viewportWidth - 8);
  const bottomLimit = Math.max(topLimit + 80, viewportHeight - (viewportWidth <= 760 ? 141 : 66));
  const minWidth = Math.min(320, rightLimit - 8);
  const minHeight = Math.min(220, bottomLimit - topLimit);
  const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(value, high));
  let left = clamp(start.x, 8, rightLimit - minWidth);
  let top = clamp(start.y, topLimit, bottomLimit - minHeight);
  let right = clamp(start.x + start.width, left + minWidth, rightLimit);
  let bottom = clamp(start.y + start.height, top + minHeight, bottomLimit);
  if (edge.includes("e")) right = clamp(start.x + start.width + dx, left + minWidth, rightLimit);
  if (edge.includes("w")) left = clamp(start.x + dx, 8, right - minWidth);
  if (edge.includes("s")) bottom = clamp(start.y + start.height + dy, top + minHeight, bottomLimit);
  if (edge.includes("n")) top = clamp(start.y + dy, topLimit, bottom - minHeight);
  return { x: left, y: top, width: right - left, height: bottom - top };
}
