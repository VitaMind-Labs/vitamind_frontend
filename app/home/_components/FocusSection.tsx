
export default function FocusSection() {
    return (
        <section className="bg-[var(--primary)] text-white rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-16 space-y-8 border-b md:border-b-0 md:border-r border-on-primary/10">
                    <div className="inline-flex items-center gap-2 font-label-sm text-label-sm text-white/40 uppercase">
                        <div className="w-2 h-2 bg-secondary-fixed"></div> Our Focus
                    </div>
                    <h2 className="font-headline-xl text-[48px] leading-tight">
                        People who are struggling without a structured,
                        <br /> culturally appropriate way to understand their distress.
                    </h2>
                </div>

                <div className="p-8 md:p-16 space-y-12 divide-y divide-on-white/10">
                    <div className="pb-8">
                        <h4 className="font-headline-lg text-xl mb-4">Population focus</h4>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Adults aged 18–45 who are experiencing persistent symptoms they cannot name, are on psychiatric waiting lists, or want to arrive at an appointment with structured, data-backed context.
                        </p>
                    </div>

                    <div className="py-8">
                        <h4 className="font-headline-lg text-xl mb-4">Clinical conditions</h4>
                        <p className="text-white/60 text-sm leading-relaxed">
                            ADHD, bipolar, anxiety/PTSD, psychosis spectrum and depression are each supported by validated questionnaires, behavioral detection algorithms, and tailored therapeutic responses.
                        </p>
                    </div>

                    <div className="pt-8">
                        <h4 className="font-headline-lg text-xl mb-4">Geographic markets</h4>
                        <p className="text-white/60 text-sm leading-relaxed">
                            Phase 1: Tunisia and France. Phase 2: Morocco, Algeria, Belgium and Switzerland — with a focus on Arabic and Francophone digital health infrastructure.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
