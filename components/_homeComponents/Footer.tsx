"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
    const { dictionary } = useLanguage();
    const copy = dictionary.homeLanding.footer;
    return (
        <footer id="contact" className="bg-white text-gray-900 pt-24 md:pt-32 pb-12 relative overflow-hidden border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
                    <div className="lg:col-span-5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                                <Image src="/logo.png" alt="Logo" width={40} height={40} className="h-full w-full object-contain" />
                            </div>
                        </div>
                        <p className="text-gray-500 leading-relaxed max-w-sm mb-8">
                            {copy.description}
                        </p>
                        <div className="flex gap-3">
                            {["Twitter", "LinkedIn", "Instagram"].map((social) => (
                                <a key={social} href="#" className="px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-sm font-medium text-gray-500 hover:text-gray-900 hover:border-gray-200 transition-all">
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 lg:col-start-7">
                        <h4 className="font-semibold text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">{copy.product}</h4>
                        <ul className="space-y-4">
                            {copy.links.map((item) => (
                                <li key={item}><a href="#" className="text-sm text-gray-500 hover:text-[#518591] transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="font-semibold text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">{copy.company}</h4>
                        <ul className="space-y-4">
                            {copy.companyLinks.map((item) => (
                                <li key={item}><a href="#" className="text-sm text-gray-500 hover:text-[#518591] transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <h4 className="font-semibold text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">{copy.updates}</h4>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder={copy.email}
                                className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#518591]/30 transition-colors text-sm"
                            />
                            <button className="px-4 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                    <p>© {new Date().getFullYear()} VitaMind Inc. {copy.rights}</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-gray-900 transition-colors">{copy.privacy}</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">{copy.terms}</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">{copy.cookies}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
