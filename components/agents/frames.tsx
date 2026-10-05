import { LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A phone, drawn in CSS: a deep frame, a pill notch and a white screen. The screen is `h-full`, so whatever sits
 * inside should lay itself out with flex and a top padding that clears the notch (`pt-12`).
 */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[9/18.5] w-full max-w-[19rem] rounded-[2.75rem] bg-ink p-[0.5rem] shadow-[0_44px_80px_-32px_rgb(17_76_97/0.6),inset_0_0_0_1px_rgb(255_255_255/0.1)]",
        className,
      )}
    >
      <span aria-hidden className="absolute start-1/2 top-[1.05rem] z-20 h-[1.3rem] w-[5rem] -translate-x-1/2 rounded-full bg-ink rtl:translate-x-1/2" />
      <span aria-hidden className="absolute -end-[3px] top-28 h-14 w-[3px] rounded-e-full bg-ink" />
      <span aria-hidden className="absolute -start-[3px] top-24 h-8 w-[3px] rounded-s-full bg-ink" />
      <span aria-hidden className="absolute -start-[3px] top-36 h-8 w-[3px] rounded-s-full bg-ink" />
      <div className="relative h-full w-full overflow-hidden rounded-[2.3rem] bg-white">{children}</div>
    </div>
  );
}

/** A browser-style window for the dashboard views: three dots, a quiet address pill, and the content below. */
export function BrowserFrame({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-float ring-1 ring-white/70", className)}>
      <div className="flex items-center gap-4 border-b border-line bg-surface-muted/80 px-4 py-3">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-rose/50" />
          <span className="size-2.5 rounded-full bg-gold/70" />
          <span className="size-2.5 rounded-full bg-sage/70" />
        </span>
        <span className="mx-auto inline-flex min-w-0 max-w-[16rem] items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-[0.75rem] font-medium text-ink-soft ring-1 ring-line">
          <LockKeyhole className="size-3 shrink-0 text-teal-600" aria-hidden />
          <span className="truncate">{title}</span>
        </span>
        <span aria-hidden className="w-12 shrink-0" />
      </div>
      {children}
    </div>
  );
}
