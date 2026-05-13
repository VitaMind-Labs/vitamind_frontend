import Link from "next/link";
import { Brain, HeartHandshake } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function PlatformOverview() {
    return (
        <section>
            <div className="relative w-full overflow-hidden rounded-3xl bg-[url('/bg_img.jpg')] bg-cover bg-center bg-no-repeat p-8 md:p-16">
                {/* Overlay - gardé tel quel */}
                <div className="absolute inset-0 bg-[#071013]/80" />

                {/* Glow Effects - gardés tels quels */}
                <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

                <div className="relative z-10 flex flex-col gap-16">
                    {/* TOP CONTENT */}
                    <div className="max-w-5xl space-y-8">
                        <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2 backdrop-blur-md">
                            <Brain className="h-4 w-4 text-[hsl(45,93%,47%)]" />
                            <Label className="font-mono-custom text-xs uppercase tracking-[0.25em] text-white">
                                VitaMind Platform
                            </Label>
                        </div>

                        <div className="space-y-6">
                            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
                                AI-powered mental health triage and emotional
                                <span className="bg-gradient-to-r from-[hsl(45,93%,47%)] to-[hsl(187,27%,40%)] bg-clip-text text-transparent">
                                    {" "}wellbeing support
                                </span>
                                .
                            </h1>

                            <p className="max-w-3xl text-lg leading-relaxed text-white/70 md:text-xl">
                                VitaMind bridges the gap between emotional
                                distress and the first psychiatry appointment
                                through intelligent symptom triage, validated
                                clinical questionnaires, and a personalized
                                wellbeing dashboard designed to guide users
                                safely and compassionately.
                            </p>
                        </div>

                        {/* Mini Stats */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
                                <p className="text-2xl font-bold text-[hsl(45,93%,47%)]">AI + CBT</p>
                                <Label className="text-sm text-white/80">
                                    Therapeutic intelligence
                                </Label>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
                                <p className="text-2xl font-bold text-[hsl(45,93%,47%)]">3 Languages</p>
                                <Label className="text-sm text-white/80">
                                    Arabic • French • English
                                </Label>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
                                <p className="text-2xl font-bold text-[hsl(45,93%,47%)]">24/7</p>
                                <Label className="text-sm text-white/80">
                                    Intelligent support access
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-10 md:flex-row md:items-center">
                        <div className="max-w-2xl">
                            <Label className="mb-2 text-2xl font-semibold text-white">
                                Building the future of accessible mental healthcare
                            </Label>
                            <p className="text-white/60">
                                Combining psychiatry, behavioral AI, and digital
                                wellbeing into one intelligent ecosystem.
                            </p>
                        </div>

                        <Link
                            href="/diagnostic"
                            className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-gradient-to-r from-[hsl(45,93%,47%)] to-[hsl(187,27%,40%)] px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:scale-105"
                        >
                            <HeartHandshake className="h-4 w-4" />
                            Explore VitaMind
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}