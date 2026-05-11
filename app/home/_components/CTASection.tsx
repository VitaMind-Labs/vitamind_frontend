import { Plus } from "lucide-react";

export default function CTASection() {
    return (
        <section className="space-y-8 py-20 text-center">
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--on-surface-variant)]/70">
                    <div className="h-2 w-2 bg-[var(--secondary-fixed)]" />
                    Platform scope
                </div>

                <h2 className="text-4xl leading-tight md:text-5xl">
                    VitaMind does not diagnose, prescribe, or replace clinicians.
                </h2>

                <p className="text-[var(--on-surface-variant)]">
                    It prepares users for clinical encounters with structured, validated, shareable data, while escalating acute risk and preserving consent and privacy.
                </p>
            </div>

            <div className="group flex cursor-pointer items-center justify-center gap-2">
                <button className="rounded-full bg-[var(--primary)] px-8 py-3 text-xs uppercase tracking-[0.2em] text-white transition-transform group-hover:scale-105">
                    Commencer l'expérience
                </button>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--secondary-fixed)] transition-transform group-hover:rotate-45">
                    <Plus className="h-5 w-5 text-[var(--primary)]" />
                </div>
            </div>
        </section>
    );
}
