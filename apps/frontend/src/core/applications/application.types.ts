import type { LucideIcon } from "lucide-react";

export type ApplicationId =
    | "browser"
    | "help"
    | "about"
    | "files"
    | "experience"
    | "projects"
    | "architecture"
    | "skills"
    | "terminal"
    | "resume"
    | "contact"
    | "system-monitor"
    | "applications";

export type AppIconVariant =
    | "violet"
    | "blue"
    | "amber"
    | "orange"
    | "cyan"
    | "indigo"
    | "neutral"
    | "red"
    | "sky"
    | "emerald"
    | "slate";

export interface PortfolioApplication {
    id: ApplicationId;
    name: string;
    shortName: string;
    description: string;
    icon: LucideIcon;
    iconVariant: AppIconVariant;
    pinnedToDock: boolean;
    desktopVisible: boolean;
    searchable: boolean;
}
