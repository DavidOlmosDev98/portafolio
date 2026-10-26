"use client";

import { useEffect, useState } from "react";

import { useLanguage } from "@/core/i18n/LanguageProvider";

import { formatDesktopDate } from "../utils/format-date";

export function Clock() {
    const { locale, t } = useLanguage();
    const [currentDate, setCurrentDate] = useState<Date | null>(null);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, []);

    return (
        <time
            className="select-none text-sm font-medium text-slate-100"
            dateTime={currentDate?.toISOString()}
            aria-label={t("Current date and time")}
        >
            {currentDate ? formatDesktopDate(currentDate, locale) : t("Loading time...")}
        </time>
    );
}