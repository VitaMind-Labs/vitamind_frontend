"use client";

import { FormField, IconInput } from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { AmbientBackdrop } from "@/components/shared/AmbientBackdrop";
import { SiteHeader } from "@/components/layout/site-header";
import { EASE_OUT, fadeUp, stagger } from "@/lib/motion";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { CheckCircle2, ChevronDown, Clock, Globe2, LifeBuoy, Lock, Mail, MessageSquare, Send, UserRound } from "lucide-react";
import { Fragment, useState } from "react";
import { cn } from "@/lib/utils";

const rise = fadeUp(0, 10);
const titleStagger = stagger(0.06, 0.1);
const wordIn = { hidden: { y: "110%" }, show: { y: 0, transition: { duration: 0.7, ease: EASE_OUT } } };

const CHANNEL_ICONS = [Clock, Lock, Globe2] as const;
const MESSAGE_MAX = 2000;

function FaqItem({ item, open, onToggle, index }: { item: { question: string; answer: string }; open: boolean; onToggle: () => void; index: number }) {
    return (
        <motion.div variants={fadeUp(0.15 + index * 0.07, 8)} className="relative border-b border-line last:border-b-0">
            {open && <motion.span layoutId="faq-bar" className="absolute inset-y-0 start-0 w-0.5 bg-teal-500" transition={{ duration: 0.35, ease: EASE_OUT }} />}

            <button type="button" aria-expanded={open} onClick={onToggle} className="flex w-full items-center justify-between gap-4 px-4 py-4 text-start text-sm font-semibold text-ink transition-colors hover:bg-teal-50/50 sm:px-5">
                <span className="min-w-0">{item.question}</span>
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, ease: EASE_OUT }} className="shrink-0 text-teal-700">
                    <ChevronDown className="h-4 w-4" aria-hidden />
                </motion.span>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: EASE_OUT }} className="overflow-hidden">
                        <motion.p initial={{ y: -6 }} animate={{ y: 0 }} transition={{ delay: 0.06, duration: 0.3, ease: EASE_OUT }} className="px-4 pb-4 text-sm leading-6 text-ink-muted sm:px-5">
                            {item.answer}
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function SupportScreen() {
    const { dictionary, direction } = useLanguage();
    const copy = dictionary.support;
    const [openFaq, setOpenFaq] = useState(0);
    const [sent, setSent] = useState(false);
    const [subject, setSubject] = useState("");
    const [topic, setTopic] = useState<number | null>(null);
    const [message, setMessage] = useState("");

    const fields = [
        { name: "name", label: copy.name, input: { icon: UserRound, type: "text", placeholder: copy.namePlaceholder, autoComplete: "name" } },
        { name: "email", label: copy.email, input: { icon: Mail, type: "email", placeholder: copy.emailPlaceholder, autoComplete: "email", dir: "ltr" } },
        { name: "subject", label: copy.subject, wide: true, input: { icon: MessageSquare, type: "text", placeholder: copy.subjectPlaceholder } },
    ] as const;

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSent(true);
        event.currentTarget.reset();
        setSubject("");
        setTopic(null);
        setMessage("");
    }

    return (
        <MotionConfig reducedMotion="user">
            <div dir={direction} className="relative isolate flex min-h-dvh flex-col overflow-x-clip bg-canvas text-ink">
                <AmbientBackdrop />

                <SiteHeader variant="support" />

                <main className="page-container flex-1 py-10 sm:py-16 lg:py-20">
                    <motion.div variants={stagger(0.08, 0.08)} initial="hidden" animate="show" className="mx-auto max-w-5xl">
                        <motion.header variants={rise} className="mx-auto max-w-2xl text-center">
                            <p className="home-eyebrow home-eyebrow-pill">
                                <motion.span animate={{ y: [0, -2.5, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="inline-flex">
                                    <MessageSquare className="h-3.5 w-3.5 text-teal-600" aria-hidden />
                                </motion.span>
                                {copy.eyebrow}
                            </p>

                            <motion.h1 variants={titleStagger} aria-label={copy.title} className="home-heading mt-5 font-light">
                                {copy.title.split(" ").map((word, i) => (
                                    <Fragment key={i}>
                                        <span aria-hidden className="-mb-1 inline-block overflow-hidden pb-1 align-bottom">
                                            <motion.span variants={wordIn} className="inline-block">{word}</motion.span>
                                        </span>{" "}
                                    </Fragment>
                                ))}
                            </motion.h1>

                            <p className="home-body mx-auto mt-4 max-w-xl">{copy.description}</p>
                        </motion.header>

                        <motion.ul variants={stagger(0.07, 0.1)} className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
                            {copy.channels.map((channel, i) => {
                                const Icon = CHANNEL_ICONS[i] ?? Clock;
                                return (
                                    <motion.li key={channel.title} variants={rise} className="surface-glass flex items-start gap-3 p-4">
                                        <span className="home-icon !size-10 !rounded-xl"><Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden /></span>
                                        <span className="min-w-0">
                                            <span className="block text-sm font-semibold text-ink">{channel.title}</span>
                                            <span className="mt-0.5 block text-[0.8125rem] leading-5 text-ink-muted">{channel.body}</span>
                                        </span>
                                    </motion.li>
                                );
                            })}
                        </motion.ul>

                        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:items-start lg:gap-8">
                            <motion.section variants={rise} whileHover={{ y: -3 }} transition={{ duration: 0.3, ease: EASE_OUT }} className="surface-glass p-5 sm:p-8" aria-labelledby="support-form-title">
                                <div className="mb-6 flex items-start gap-3">
                                    <motion.span whileHover={{ rotate: -8, scale: 1.1 }} transition={{ type: "spring", stiffness: 300, damping: 14 }} className="home-icon">
                                        <Mail className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                                    </motion.span>
                                    <div className="min-w-0">
                                        <h2 id="support-form-title" className="text-lg font-semibold text-ink">{copy.formTitle}</h2>
                                        <p className="mt-1 text-sm leading-6 text-ink-muted">{copy.formDescription}</p>
                                    </div>
                                </div>

                                <motion.form onSubmit={handleSubmit} variants={stagger(0.07, 0.2)} className="grid gap-4 sm:grid-cols-2">
                                    <motion.div variants={rise} className="sm:col-span-2">
                                        <p id="support-topics" className="mb-2 text-[0.8125rem] font-medium text-ink-soft">{copy.topicLabel}</p>
                                        <div role="group" aria-labelledby="support-topics" className="flex flex-wrap gap-2">
                                            {copy.topics.map((label, i) => (
                                                <button
                                                    key={label}
                                                    type="button"
                                                    aria-pressed={topic === i}
                                                    onClick={() => { setTopic(i); setSubject(label); }}
                                                    className={cn(
                                                        "min-h-9 cursor-pointer rounded-full border px-3.5 text-[0.8125rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500",
                                                        topic === i ? "border-transparent bg-primary text-white shadow-brand" : "border-line-strong bg-white text-ink-soft hover:border-teal-300 hover:text-teal-800",
                                                    )}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {fields.map((f) => (
                                        <motion.div key={f.name} variants={rise} className={"wide" in f ? "sm:col-span-2" : ""}>
                                            <FormField id={`support-${f.name}`} label={f.label} compact>
                                                {f.name === "subject" ? (
                                                    <IconInput id="support-subject" name="subject" required {...f.input} value={subject} onChange={(event) => { setSubject(event.target.value); setTopic(null); }} />
                                                ) : (
                                                    <IconInput id={`support-${f.name}`} name={f.name} required {...f.input} />
                                                )}
                                            </FormField>
                                        </motion.div>
                                    ))}

                                    <motion.div variants={rise} className="sm:col-span-2">
                                        <FormField id="support-message" label={copy.message} compact>
                                            <textarea
                                                id="support-message"
                                                name="message"
                                                placeholder={copy.messagePlaceholder}
                                                value={message}
                                                onChange={(event) => setMessage(event.target.value)}
                                                maxLength={MESSAGE_MAX}
                                                className="min-h-32 w-full resize-y rounded-control border border-line-strong bg-white px-4 py-3 text-[0.9375rem] text-ink shadow-xs outline-none transition-[border-color,box-shadow] placeholder:text-ink-subtle hover:border-teal-300 focus:border-teal-500 focus:shadow-focus"
                                                required
                                            />
                                        </FormField>
                                        <p className="mt-1 text-end text-xs tabular-nums text-ink-subtle" dir="ltr">{copy.counter.replace("{n}", String(message.length)).replace("{max}", String(MESSAGE_MAX))}</p>
                                    </motion.div>

                                    <motion.div variants={rise} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="group sm:col-span-2 sm:justify-self-start">
                                        <Button type="submit" size="lg" className="w-full sm:w-auto">
                                            <Send className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" aria-hidden />
                                            {copy.send}
                                        </Button>
                                    </motion.div>

                                    <AnimatePresence initial={false}>
                                        {sent && (
                                            <motion.p role="status" initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE_OUT }} className="flex items-center gap-2 text-sm text-sage-700 sm:col-span-2">
                                                <motion.span initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 420, damping: 14, delay: 0.1 }} className="inline-flex">
                                                    <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                                                </motion.span>
                                                {copy.success}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.form>
                            </motion.section>

                            <motion.section variants={stagger(0.07, 0.1)} aria-labelledby="support-faq-title">
                                <motion.div variants={rise} className="mb-4">
                                    <p className="home-eyebrow">{copy.faqEyebrow}</p>
                                    <h2 id="support-faq-title" className="mt-2 text-title font-medium text-ink">{copy.faqTitle}</h2>
                                </motion.div>

                                <div className="surface-card overflow-hidden">
                                    {copy.faq.map((item, i) => (
                                        <FaqItem key={item.question} item={item} index={i} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
                                    ))}
                                </div>

                                <motion.aside variants={rise} role="note" className="mt-4 flex items-start gap-3 rounded-2xl border border-gold-100 bg-gold-50/90 p-4">
                                    <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" aria-hidden />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-ink">{copy.urgentTitle}</p>
                                        <p className="mt-0.5 text-[0.8125rem] leading-5 text-ink-soft">{copy.urgentBody}</p>
                                    </div>
                                </motion.aside>
                            </motion.section>
                        </div>
                    </motion.div>
                </main>

                <MinimalFooter showLanguage={false} className="border-t border-line" />
            </div>
        </MotionConfig>
    );
}