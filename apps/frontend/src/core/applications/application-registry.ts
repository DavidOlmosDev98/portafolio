import {
    AppWindow,
    Globe,
    LifeBuoy,
    BarChart3,
    BriefcaseBusiness,
    Boxes,
    FileText,
    FolderOpen,
    Mail,
    Network,
    TerminalSquare,
    UserRound,
    Wrench,
} from "lucide-react";

import type {
    ApplicationId,
    PortfolioApplication,
} from "./application.types";

export const APPLICATIONS: readonly PortfolioApplication[] = [
    {
        id: "browser", name: "Professional links", shortName: "Links",
        description: "Visit my professional profiles.", icon: Globe, iconVariant: "orange",
        pinnedToDock: false, desktopVisible: false, searchable: true,
    },
    {
        id: "help", name: "OlmosOS Help", shortName: "Help",
        description: "Learn how to explore the portfolio and use the terminal.", icon: LifeBuoy, iconVariant: "red",
        pinnedToDock: false, desktopVisible: false, searchable: true,
    },
    {
        id: "about",
        name: "About Me",
        shortName: "About",
        description: "Professional profile and personal introduction.",
        icon: UserRound,
        iconVariant: "violet",
        pinnedToDock: true,
        desktopVisible: true,
        searchable: true,
    },
    {
        id: "files",
        name: "Files",
        shortName: "Files",
        description: "Browse experience, projects and documents.",
        icon: FolderOpen,
        iconVariant: "blue",
        pinnedToDock: true,
        desktopVisible: false,
        searchable: true,
    },
    {
        id: "experience",
        name: "Experience",
        shortName: "Experience",
        description: "Explore professional roles and achievements.",
        icon: BriefcaseBusiness,
        iconVariant: "amber",
        pinnedToDock: true,
        desktopVisible: true,
        searchable: true,
    },
    {
        id: "projects",
        name: "Projects",
        shortName: "Projects",
        description: "View software engineering projects and case studies.",
        icon: Boxes,
        iconVariant: "orange",
        pinnedToDock: true,
        desktopVisible: true,
        searchable: true,
    },
    {
        id: "architecture",
        name: "Architecture",
        shortName: "Architecture",
        description: "Review system designs and technical decisions.",
        icon: Network,
        iconVariant: "cyan",
        pinnedToDock: true,
        desktopVisible: true,
        searchable: true,
    },
    {
        id: "skills",
        name: "Skills",
        shortName: "Skills",
        description: "Technical skills and engineering capabilities.",
        icon: BarChart3,
        iconVariant: "indigo",
        pinnedToDock: false,
        desktopVisible: true,
        searchable: true,
    },
    {
        id: "terminal",
        name: "Terminal",
        shortName: "Terminal",
        description: "Interactive OlmosOS command-line interface.",
        icon: TerminalSquare,
        iconVariant: "neutral",
        pinnedToDock: true,
        desktopVisible: true,
        searchable: true,
    },
    {
        id: "resume",
        name: "Resume",
        shortName: "Resume.pdf",
        description: "Open or download the professional resume.",
        icon: FileText,
        iconVariant: "red",
        pinnedToDock: true,
        desktopVisible: true,
        searchable: true,
    },
    {
        id: "contact",
        name: "Contact",
        shortName: "Contact",
        description: "Send a professional message.",
        icon: Mail,
        iconVariant: "sky",
        pinnedToDock: true,
        desktopVisible: true,
        searchable: true,
    },
    {
        id: "system-monitor",
        name: "System Monitor",
        shortName: "Monitor",
        description: "Portfolio statistics and system information.",
        icon: Wrench,
        iconVariant: "emerald",
        pinnedToDock: false,
        desktopVisible: true,
        searchable: true,
    },
    {
        id: "applications",
        name: "Show Applications",
        shortName: "Applications",
        description: "Browse all installed OlmosOS applications.",
        icon: AppWindow,
        iconVariant: "slate",
        pinnedToDock: true,
        desktopVisible: false,
        searchable: false,
    },
] as const;

export function getApplication(
    applicationId: ApplicationId,
): PortfolioApplication {
    const application = APPLICATIONS.find(
        ({ id }) => id === applicationId,
    );

    if (!application) {
        throw new Error(`Application "${applicationId}" is not registered.`);
    }

    return application;
}

export const DOCK_APPLICATIONS = APPLICATIONS.filter(
    ({ pinnedToDock }) => pinnedToDock,
);

export const DESKTOP_APPLICATIONS = APPLICATIONS.filter(
    ({ desktopVisible }) => desktopVisible,
);