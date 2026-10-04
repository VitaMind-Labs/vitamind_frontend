"use client";

import { useState } from "react";
import { CalendarClock, FileText, History } from "lucide-react";
import { MonthlyReport } from "@/components/patient/reports/MonthlyReport";
import { ReportCard, ReportCardSkeleton } from "@/components/patient/reports/ReportCards";
import { ReportView } from "@/components/patient/reports/ReportView";
import { EmptyState, ErrorState, PageIntro } from "@/components/patient/ui/primitives";
import { PatientModal } from "@/components/patient/ui/PatientModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useReports } from "@/hooks/patient/useReports";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import { fill } from "@/lib/i18n/patient";
import { addDaysLocal, formatDay, formatRange, parseDay } from "@/lib/patient/format";
import { cn } from "@/lib/utils";

/** Weekly reports (a grid of weeks that open into a structured, printable report) and the monthly check-in summary. */
export default function ReportsPage() {
  const copy = usePatientCopy();
  const { language } = useLanguage();
  const reports = useReports(12);
  const [openWeek, setOpenWeek] = useState<string | null>(null);
  const [view, setView] = useState<"weekly" | "monthly">("weekly");
  const items = reports.data?.data ?? [];
  const open = items.find((item) => item.weekStart === openWeek);
  // Until the first week is complete there is no ready report: the running week is shown, but cannot be opened.
  const firstWeekPending = items.length > 0 && !items.some((item) => item.status === "READY");

  return (
    <div className="lm-rise">
      <PageIntro eyebrow={copy.shell.eyebrows.reports} icon={History} title={copy.reports.title} subtitle={copy.reports.subtitle} hideTitle />

      <div role="tablist" aria-label={copy.reports.title} className="mb-5 inline-flex gap-1 rounded-full border border-white/80 bg-white/60 p-1">
        {(["weekly", "monthly"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={view === tab}
            onClick={() => setView(tab)}
            className={cn(
              "min-h-9 rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500",
              view === tab ? "bg-teal-600 text-white shadow-brand" : "text-ink-soft hover:bg-white/80",
            )}
          >
            {copy.reports.tabs[tab]}
          </button>
        ))}
      </div>

      {view === "monthly" ? (
        <MonthlyReport />
      ) : (
        <>
      {firstWeekPending && items.length === 1 && (
        <p role="note" className="mb-5 flex items-start gap-3 rounded-2xl border border-teal-100 bg-teal-50/80 px-4 py-3 text-sm text-teal-800">
          <CalendarClock className="mt-0.5 size-4 shrink-0" aria-hidden />
          {fill(copy.reports.firstOpens, { date: formatDay(addDaysLocal(parseDay(items[0].weekEnd), 1), language, { weekday: "long", month: "long", day: "numeric" }) })}
        </p>
      )}

      {reports.error && !reports.data ? (
        <ErrorState onRetry={() => void reports.refresh()} />
      ) : reports.isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <ReportCardSkeleton key={index} />)}</div>
      ) : items.length === 0 ? (
        <EmptyState icon={FileText} title={copy.reports.emptyTitle} body={copy.reports.firstEmpty} />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <li key={item.weekStart} className="flex"><ReportCard item={item} locked={firstWeekPending && item.status === "IN_PROGRESS"} onOpen={() => setOpenWeek(item.weekStart)} /></li>
          ))}
        </ul>
      )}

        </>
      )}

      <PatientModal
        open={Boolean(openWeek)}
        onOpenChange={(value) => !value && setOpenWeek(null)}
        title={open ? fill(copy.reports.weekOf, { range: formatRange(open.weekStart, open.weekEnd, language) }) : copy.reports.title}
        hideTitle
        size="xl"
        layoutId={openWeek ? `report-${openWeek}` : undefined}
      >
        {openWeek && <ReportView weekStart={openWeek} />}
      </PatientModal>
    </div>
  );
}
