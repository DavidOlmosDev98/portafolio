"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ApplicationId } from "@/core/applications/application.types";
import type { Locale } from "@/core/i18n/locale";

type ActivityData =
  | { type: "application"; appId: ApplicationId }
  | { type: "command"; command: string }
  | { type: "download"; locale: Locale }
  | { type: "language"; locale: Locale };
export type Activity = ActivityData & { id: number; timestamp: number };
type SessionState = { activities: Activity[]; applications: ApplicationId[]; commandCount: number; downloadCount: number; totalEvents: number };
const initial: SessionState = { activities: [], applications: [], commandCount: 0, downloadCount: 0, totalEvents: 0 };
export function addActivity(state: SessionState, data: ActivityData, timestamp: number): SessionState {
  return {
    activities: [...state.activities, { ...data, timestamp, id: state.totalEvents + 1 }].slice(-100),
    applications: data.type === "application" && !state.applications.includes(data.appId) ? [...state.applications, data.appId] : state.applications,
    commandCount: state.commandCount + Number(data.type === "command"),
    downloadCount: state.downloadCount + Number(data.type === "download"),
    totalEvents: state.totalEvents + 1,
  };
}
const SessionContext = createContext<SessionState & { record: (activity: ActivityData) => void } | null>(null);
export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initial);
  function record(data: ActivityData) { const timestamp = Date.now(); setState(old => addActivity(old, data, timestamp)); }
  return <SessionContext.Provider value={{ ...state, record }}>{children}</SessionContext.Provider>;
}
export function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useSession requires SessionProvider");
  return session;
}
