"use client";

import { BrandLogo } from "@/components/shared/BrandLogo";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { BRAND } from "@/lib/config/brand";
import { ROUTES } from "@/lib/config/routes";
import { REVEAL_VIEWPORT, fadeUp, stagger } from "@/lib/motion";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

/** Route for each label in `footer.links` / `footer.companyLinks` (same order). */
const PRODUCT_HREFS = [ROUTES.orientation, `${ROUTES.home}#how-it-works`, ROUTES.plans] as const;
const ACCOUNT_HREFS = [ROUTES.support, ROUTES.signIn, ROUTES.signUp] as const;
const LINK_CLASS = "inline-flex min-h-10 items-center rounded-md text-[0.9375rem] text-ink-muted transition-colors duration-200 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500";

function FooterGroup({ title, children }: { title: string; children: ReactNode }) {
    return (
        <motion.nav variants={fadeUp(0, 12)} aria-label={title}>
            <h2 className="home-label text-ink">{title}</h2>
            <ul className="mt-3">{children}</ul>
        </motion.nav>
    );
}

/** Closing chapter of the home page: mission, navigation, updates, language. */
export const Footer = () => {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.footer;

    return (
        <footer id="contact" className="relative bg-canvas">
            <span aria-hidden className="home-divider" />
            <motion.div
                variants={stagger(0.08)}
                initial="hidden"
                whileInView="show"
                viewport={REVEAL_VIEWPORT}
                className="page-container pb-8 pt-16 md:pt-20"
            >
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                    <motion.div variants={fadeUp(0, 12)} className="lg:col-span-5">
                        <BrandLogo size="lg" priority={false} />
                        <p className="mt-6 max-w-md text-[clamp(1.25rem,0.5vw+1.1rem,1.5rem)] font-light leading-snug tracking-[-0.01em] text-ink rtl:font-normal">
                            {copy.description}
                        </p>
                    </motion.div>

                    {/* Two short groups sit side by side at every size — no stacked single-link columns. */}
                    <div className="grid grid-cols-2 gap-8 lg:col-span-3 lg:col-start-7">
                        <FooterGroup title={copy.product}>
                            {copy.links.map((item, index) => (
                                <li key={item}>
                                    <Link href={PRODUCT_HREFS[index] ?? ROUTES.home} className={LINK_CLASS}>
                                        <span className="home-link-line">{item}</span>
                                    </Link>
                                </li>
                            ))}
                        </FooterGroup>
                        <FooterGroup title={copy.company}>
                            {copy.companyLinks.map((item, index) => (
                                <li key={item}>
                                    <Link href={ACCOUNT_HREFS[index] ?? ROUTES.support} className={LINK_CLASS}>
                                        <span className="home-link-line">{item}</span>
                                    </Link>
                                </li>
                            ))}
                        </FooterGroup>
                    </div>

                    <motion.div variants={fadeUp(0, 12)} className="lg:col-span-3">
                        <label htmlFor="footer-updates-email" className="home-label text-ink">
                            {copy.updates}
                        </label>
                        <div className="mt-4 flex min-w-0 gap-2">
                            <input
                                id="footer-updates-email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                placeholder={copy.email}
                                className="h-12 min-w-0 flex-1 rounded-full border border-line-strong bg-white px-4 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-ink-subtle hover:border-teal-300 focus:border-teal-500 focus:shadow-focus"
                            />
                            <Button type="button" size="icon" className="group h-12 w-12 min-h-12 shrink-0" aria-label={copy.updates}>
                                <ArrowRight className="transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
                            </Button>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    variants={fadeUp(0, 8)}
                    className="mt-14 flex flex-col-reverse items-center gap-5 border-t border-line pt-6 sm:flex-row sm:justify-between"
                >
                    <p className="text-xs text-ink-muted">
                        © {new Date().getFullYear()} {BRAND.name}. {copy.rights}
                    </p>
                    <LanguageSwitcher />
                </motion.div>
            </motion.div>
        </footer>
    );
};
