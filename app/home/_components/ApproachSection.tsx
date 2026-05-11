import { Flashlight, FlaskConical, Sun } from "lucide-react";

const cards = [
    {
        title: "How we design — zero-stigma UX",
        subtitle: "Clinical integrity, human warmth",
        icon: Flashlight,
        dark: true,
        description:
            "The interface feels like a supportive companion, not medical software: no diagnostic language until the user opts in, a single call-to-action, and adaptive chromatherapy that reduces stigma.",
    },
    {
        title: "How we detect — behavioral intelligence",
        subtitle: "Digital phenotyping",
        icon: FlaskConical,
        dark: false,
        description:
            "We analyze typing, scrolling, mouse movement and NLP against each user&apos;s baseline to deliver precise triage without relying on population averages.",
    },
    {
        title: "How we protect — safety by design",
        subtitle: "Compliance first",
        icon: Sun,
        dark: false,
        description:
            "RGPD-compliant, encrypted journaling and audit-grade escalation ensure user safety while preserving privacy and clinical accountability.",
    },
];

export default function ApproachSection() {
    return (
        <section className="space-y-16 py-12">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--on-surface-variant)]/60">
                        <div className="h-2 w-2 bg-[var(--secondary-fixed)]" />
                        Platform Definition
                    </div>

                    <h2 className="max-w-xl text-5xl leading-tight">
                        VitaMind is an AI-powered mental health triage and therapeutic support platform for French and Arabic speaking markets.
                    </h2>
                </div>

                <div className="flex items-end">
                    <p className="max-w-md text-[var(--on-surface-variant)]">
                        It does not replace licensed psychiatric care. Instead, it helps people identify symptoms, prepare for consultation, and live better between appointments.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.title}
                            className={`flex min-h-[340px] flex-col justify-between rounded-2xl p-8 ${card.dark
                                ? "bg-[var(--primary)] text-white"
                                : "border border-[var(--outline-variant)]/20 bg-[var(--surface-container-low)]"
                                }`}
                        >
                            <Icon className="h-12 w-12" />

                            <div className="space-y-4">
                                <span className="font-mono-custom text-[10px] uppercase tracking-[0.2em] opacity-50">
                                    {card.subtitle}
                                </span>

                                <h5 className="text-3xl">{card.title}</h5>

                                <p className="text-sm opacity-70">{card.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
