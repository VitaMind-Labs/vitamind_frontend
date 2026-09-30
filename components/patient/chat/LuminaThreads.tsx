"use client";

import { MessageSquareText, PanelLeftClose, PanelLeftOpen, SquarePen } from "lucide-react";
import { ErrorState, Skeleton } from "@/components/patient/ui/primitives";
import { PatientModal } from "@/components/patient/ui/PatientModal";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import type { useLuminaConversations } from "@/hooks/patient/useLumina";
import { usePatientCopy } from "@/hooks/usePatientCopy";
import { formatDay, formatTime, localDay } from "@/lib/patient/format";
import { cn } from "@/lib/utils";

type Threads = ReturnType<typeof useLuminaConversations>;

const ICON_BUTTON =
  "inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-white/80 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-teal-500 [&_svg]:size-[1.125rem]";

/** The patient's threads, newest activity first; the open one is marked as current. */
export function ThreadList({ threads, activeId, onSelect }: { threads: Threads; activeId: string | null; onSelect: (id: string) => void }) {
  const copy = usePatientCopy();
  const t = copy.chat.threads;
  const { language } = useLanguage();

  if (threads.error) return <ErrorState message={t.error} onRetry={() => void threads.refresh()} />;
  if (threads.isLoading) {
    return <div className="space-y-2 p-1" aria-hidden>{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-12" />)}</div>;
  }
  if (!threads.items.length) return <p className="px-3 py-6 text-center text-sm text-ink-muted">{t.empty}</p>;

  return (
    <nav aria-label={t.title}>
      <ul className="space-y-1">
        {threads.items.map((thread) => {
          const active = thread.id === activeId;
          const when = localDay(new Date(thread.lastMessageAt)) === localDay()
            ? formatTime(thread.lastMessageAt, language)
            : formatDay(new Date(thread.lastMessageAt), language, { month: "short", day: "numeric" });
          return (
            <li key={thread.id}>
              <button
                type="button"
                onClick={() => onSelect(thread.id)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex w-full cursor-pointer items-start gap-2.5 rounded-2xl px-3 py-2.5 text-start transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-500",
                  active ? "bg-white/90 shadow-xs" : "hover:bg-white/60",
                )}
              >
                <MessageSquareText className={cn("mt-0.5 size-4 shrink-0", active ? "text-teal-700" : "text-ink-subtle")} aria-hidden />
                <span className="min-w-0 flex-1">
                  <span dir="auto" className={cn("block truncate text-sm", active ? "font-semibold text-ink" : "font-medium text-ink-soft")}>
                    {thread.title ?? t.earlier}
                  </span>
                  <span className="mt-0.5 block text-xs tabular-nums text-ink-muted">{when}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {threads.hasMore && (
        <div className="mt-2 flex justify-center">
          <Button variant="ghost" size="sm" disabled={threads.loadingMore} onClick={() => void threads.loadMore()}>{t.loadMore}</Button>
        </div>
      )}
    </nav>
  );
}

/**
 * The history rail at the start edge of the pane (laptop and up). Collapsed it is two quiet
 * buttons - show conversations, start a new one - so the conversation keeps the room.
 */
export function ThreadRail({
  open,
  onOpenChange,
  threads,
  activeId,
  onSelect,
  onNew,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  threads: Threads;
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  const t = usePatientCopy().chat.threads;
  return (
    <aside
      aria-label={t.title}
      className={cn(
        "hidden shrink-0 flex-col border-e border-white/70 bg-white/35 backdrop-blur-sm transition-[width] duration-300 ease-out-soft motion-reduce:transition-none lg:flex",
        open ? "w-72" : "w-[4.25rem]",
      )}
    >
      <div className={cn("flex items-center gap-1 p-3", open ? "justify-between" : "flex-col")}>
        {open && <p className="ps-2 text-sm font-semibold text-ink">{t.title}</p>}
        <button
          type="button"
          onClick={() => onOpenChange(!open)}
          aria-expanded={open}
          aria-label={open ? t.close : t.open}
          title={open ? t.close : t.open}
          className={ICON_BUTTON}
        >
          {open ? <PanelLeftClose className="rtl:-scale-x-100" aria-hidden /> : <PanelLeftOpen className="rtl:-scale-x-100" aria-hidden />}
        </button>
        {!open && (
          <button type="button" onClick={onNew} aria-label={t.newChat} title={t.newChat} className={ICON_BUTTON}>
            <SquarePen aria-hidden />
          </button>
        )}
      </div>
      {open && (
        <>
          <div className="px-3 pb-2">
            <Button variant="outline" className="w-full justify-start" onClick={onNew}>
              <SquarePen aria-hidden />{t.newChat}
            </Button>
          </div>
          <div className="diagnostic-scroll-area min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-3">
            <ThreadList threads={threads} activeId={activeId} onSelect={onSelect} />
          </div>
        </>
      )}
    </aside>
  );
}

/** The same history on phones and tablets, as a sheet opened from the conversation header. */
export function ThreadSheet({
  open,
  onOpenChange,
  threads,
  activeId,
  onSelect,
  onNew,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  threads: Threads;
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  const t = usePatientCopy().chat.threads;
  return (
    <PatientModal open={open} onOpenChange={onOpenChange} title={t.title} size="md">
      <div className="mt-4 space-y-3">
        <Button variant="outline" className="w-full justify-start" onClick={() => { onNew(); onOpenChange(false); }}>
          <SquarePen aria-hidden />{t.newChat}
        </Button>
        <ThreadList threads={threads} activeId={activeId} onSelect={(id) => { onSelect(id); onOpenChange(false); }} />
      </div>
    </PatientModal>
  );
}

/** Header buttons for the history on phones and tablets (the rail covers laptop and up). */
export function ThreadHeaderActions({ onOpenHistory, onNew, showNew }: { onOpenHistory: () => void; onNew: () => void; showNew: boolean }) {
  const t = usePatientCopy().chat.threads;
  return (
    <div className="flex items-center gap-1 lg:hidden">
      <button type="button" onClick={onOpenHistory} aria-label={t.open} title={t.open} className={ICON_BUTTON}>
        <PanelLeftOpen className="rtl:-scale-x-100" aria-hidden />
      </button>
      {showNew && (
        <button type="button" onClick={onNew} aria-label={t.newChat} title={t.newChat} className={ICON_BUTTON}>
          <SquarePen aria-hidden />
        </button>
      )}
    </div>
  );
}
