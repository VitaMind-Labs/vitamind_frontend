import Link from "next/link";
import {
    Brain, HeartHandshake
} from "lucide-react";

export default function PlatformOverview() {


    return (
        <section>
            <div className="relative w-full overflow-hidden rounded-3xl bg-[url('/bg_img.jpg')] bg-cover bg-center bg-no-repeat p-8 text-[var(--on-primary)] md:p-16">
                {/* Overlay */}
                <div className="absolute inset-0 bg-[#071013]/80" />

                {/* Glow Effect */}
                <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

                <div className="relative z-10 flex flex-col gap-16">
                    {/* TOP CONTENT */}
                    <div className="max-w-5xl space-y-8">
                        <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2 backdrop-blur-md">
                            <Brain className="h-4 w-4 text-cyan-300" />

                            <span className="font-mono-custom text-xs  uppercase tracking-[0.25em] text-white/80">
                                VitaMind Platform
                            </span>
                        </div>

                        <div className="space-y-6">
                            <span className="max-w-4xl text-4xl font-semibold text-white leading-[1.05] tracking-tight md:text-6xl">
                                AI-powered mental health triage and emotional
                                wellbeing support.
                            </span>

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
                                <p className="text-2xl font-bold">AI + CBT</p>
                                <span className="text-sm text-white/60">
                                    Therapeutic intelligence
                                </span>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
                                <p className="text-2xl font-bold">3 Languages</p>
                                <span className="text-sm text-white/60">
                                    Arabic • French • English
                                </span>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
                                <p className="text-2xl font-bold">24/7</p>
                                <span className="text-sm text-white/60">
                                    Intelligent support access
                                </span>
                            </div>
                        </div>
                    </div>



                    {/* Bottom CTA */}
                    <div className="flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-10 md:flex-row md:items-center">
                        <div className="max-w-2xl">
                            <span className="mb-2 text-2xl text-white/70 font-semibold">
                                Building the future of accessible mental healthcare
                            </span>

                            <p className="text-white/60">
                                Combining psychiatry, behavioral AI, and digital
                                wellbeing into one intelligent ecosystem.
                            </p>
                        </div>

                        <Link href="/diagnostic" className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-black">
                            <HeartHandshake className="h-4 w-4" />
                            Explore VitaMind
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}