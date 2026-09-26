"use client";

import { BrandLogo } from "@/components/shared/BrandLogo";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { BRAND } from "@/lib/config/brand";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const LINK_CLASS = "rounded-md text-sm text-ink-muted transition-colors duration-200 hover:text-teal-700";
const PRODUCT_HREFS = ["#features", "#how-it-works", "#pricing"] as const;

export const Footer = () => {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.footer;

    return (
        <footer id="contact" className="relative border-t border-line bg-canvas pb-10 pt-16 md:pt-24">
            <div className="page-container">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-5">
                        <BrandLogo size="lg" priority={false} />
                        <p className="home-body mt-6 max-w-sm">{copy.description}</p>
                    </div>

                    <nav aria-label={copy.product} className="lg:col-span-2 lg:col-start-7">
                        <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">{copy.product}</h4>
                        <ul className="mt-5 space-y-3.5">
                            {copy.links.map((item, index) => (
                                <li key={item}><a href={PRODUCT_HREFS[index]} className={LINK_CLASS}>{item}</a></li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-label={copy.company} className="lg:col-span-2">
                        <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">{copy.company}</h4>
                        <ul className="mt-5 space-y-3.5">
                            {copy.companyLinks.map((item) => (
                                <li key={item}><Link href="/support" className={LINK_CLASS}>{item}</Link></li>
                            ))}
                        </ul>
                    </nav>

                    <div className="lg:col-span-3">
                        <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink">{copy.updates}</h4>
                        <div className="mt-5 flex min-w-0 gap-2">
                            <input
                                type="email"
                                placeholder={copy.email}
                                aria-label={copy.email}
                                className="h-11 min-w-0 flex-1 rounded-full border border-line-strong bg-white px-4 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-subtle focus:border-teal-500 focus:shadow-focus"
                            />
                            <Button type="button" variant="default" size="icon" className="h-11 w-11 shrink-0" aria-label={copy.updates}>
                                <ArrowRight className="rtl:-scale-x-100" aria-hidden />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-xs text-ink-muted md:flex-row">
                    <p>© {new Date().getFullYear()} {BRAND.name}. {copy.rights}</p>
                </div>
            </div>
        </footer>
    );
};
