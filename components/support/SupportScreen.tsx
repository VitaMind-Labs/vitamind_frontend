"use client";

import { FormField, IconInput } from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { SiteHeader } from "@/components/layout/site-header";
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronDown, Mail, MessageSquare, Send, UserRound } from "lucide-react";
import { useState } from "react";

export function SupportScreen() {
    const { dictionary, direction } = useLanguage();
    const copy = dictionary.support;
    const [openFaq, setOpenFaq] = useState(0);
    const [sent, setSent] = useState(false);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSent(true);
        event.currentTarget.reset();
    }

    return (
        <div dir={direction} className="relative isolate flex min-h-dvh flex-col overflow-x-clip bg-canvas text-ink">
            <div aria-hidden className="canvas-glow pointer-events-none absolute inset-0 -z-10" />

            <SiteHeader variant="support" />

            <main className="page-container flex-1 py-10 sm:py-16 lg:py-20">
                <motion.div variants={stagger(0.08, 0.08)} initial="hidden" animate="show" className="mx-auto max-w-5xl">
                    <motion.header variants={fadeUp(0, 10)} className="mx-auto max-w-2xl text-center">
                        <p className="home-eyebrow home-eyebrow-pill">
                            <MessageSquare className="h-3.5 w-3.5 text-teal-600" aria-hidden />
                            {copy.eyebrow}
                        </p>
                        <h1 className="home-heading mt-5 font-light">{copy.title}</h1>
                        <p className="home-body mx-auto mt-4 max-w-xl">{copy.description}</p>
                    </motion.header>

                    <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:items-start lg:gap-8">
                        <motion.section variants={fadeUp(0, 12)} className="surface-glass p-5 sm:p-8" aria-labelledby="support-form-title">
                            <div className="mb-6 flex items-start gap-3">
                                <span className="home-icon"><Mail className="h-5 w-5" strokeWidth={1.75} aria-hidden /></span>
                                <div className="min-w-0">
                                    <h2 id="support-form-title" className="text-lg font-semibold text-ink">{copy.formTitle}</h2>
                                    <p className="mt-1 text-sm leading-6 text-ink-muted">{copy.formDescription}</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormField id="support-name" label={copy.name} compact>
                                        <IconInput id="support-name" icon={UserRound} type="text" name="name" placeholder={copy.namePlaceholder} autoComplete="name" required />
                                    </FormField>
                                    <FormField id="support-email" label={copy.email} compact>
                                        <IconInput id="support-email" icon={Mail} type="email" name="email" placeholder={copy.emailPlaceholder} autoComplete="email" dir="ltr" required />
                                    </FormField>
                                </div>

                                <FormField id="support-subject" label={copy.subject} compact>
                                    <IconInput id="support-subject" icon={MessageSquare} type="text" name="subject" placeholder={copy.subjectPlaceholder} required />
                                </FormField>

                                <FormField id="support-message" label={copy.message} compact>
                                    <textarea
                                        id="support-message"
                                        name="message"
                                        placeholder={copy.messagePlaceholder}
                                        className="min-h-32 w-full resize-y rounded-control border border-line-strong bg-white px-4 py-3 text-[0.9375rem] text-ink shadow-xs outline-none transition-[border-color,box-shadow] placeholder:text-ink-subtle hover:border-teal-300 focus:border-teal-500 focus:shadow-focus"
                                        required
                                    />
                                </FormField>

                                <Button type="submit" size="lg" className="mt-1 w-full sm:w-auto sm:self-start">
                                    <Send className="h-4 w-4" aria-hidden />
                                    {copy.send}
                                </Button>

                                <AnimatePresence initial={false}>
                                    {sent && (
                                        <motion.p role="status" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease: EASE_OUT }} className="flex items-center gap-2 text-sm text-sage-700">
                                            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                                            {copy.success}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </form>
                        </motion.section>

                        <motion.section variants={fadeUp(0, 12)} aria-labelledby="support-faq-title">
                            <div className="mb-4">
                                <p className="home-eyebrow">{copy.faqEyebrow}</p>
                                <h2 id="support-faq-title" className="mt-2 text-title font-medium text-ink">{copy.faqTitle}</h2>
                            </div>
                            <div className="surface-card overflow-hidden">
                                {copy.faq.map((item, index) => {
                                    const isOpen = openFaq === index;
                                    return (
                                        <div key={item.question} className="border-b border-line last:border-b-0">
                                            <button type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? -1 : index)} className="flex w-full items-center justify-between gap-4 px-4 py-4 text-start text-sm font-semibold text-ink transition-colors hover:bg-teal-50/50 sm:px-5">
                                                <span className="min-w-0">{item.question}</span>
                                                <ChevronDown className={`h-4 w-4 shrink-0 text-teal-700 transition-transform duration-300 ease-out-soft ${isOpen ? "rotate-180" : ""}`} aria-hidden />
                                            </button>
                                            <AnimatePresence initial={false}>
                                                {isOpen && (
                                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: EASE_OUT }} className="overflow-hidden">
                                                        <p className="px-4 pb-4 text-sm leading-6 text-ink-muted sm:px-5">{item.answer}</p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.section>
                    </div>
                </motion.div>
            </main>

            <MinimalFooter className="border-t border-line" />
        </div>
    );
}