import { ArrowUp } from "lucide-react";

export default function FooterSection() {
    return (
        <footer className="relative w-full bg-[url('/bg_img.jpg')] bg-cover bg-center bg-no-repeat overflow-hidden rounded-3xl px-5 py-16 text-white md:px-16">
                        {/* Overlay */}
                <div className="absolute inset-0 bg-[#071013]/80" />

            <div className="mx-auto flex max-w-[1280px] flex-col gap-12">
                <div className="flex flex-col justify-between gap-12 md:flex-row">
                    <div className="space-y-6">
                        <p className="font-mono-custom text-xs uppercase tracking-[0.2em] opacity-40">
                            Navigate
                        </p>

                        <div className="flex flex-col gap-3">
                            <a href="#" className="font-bold">
                                Platform
                            </a>

                            <a href="#" className="opacity-60 transition-opacity hover:opacity-100">
                                Company
                            </a>

                            <a href="#" className="opacity-60 transition-opacity hover:opacity-100">
                                Newsroom
                            </a>
                        </div>
                    </div>

                    <div className="self-end">
                        <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/10">
                            <ArrowUp className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                <div className="space-y-8 border-t border-white/10 pt-12">
                    <p className="font-mono-custom text-xs opacity-60">
                        © 2026 VitaMind BIOSCIENCES. ALL RIGHTS RESERVED.
                    </p>

                    <div className="select-none text-[120px] font-bold uppercase leading-none tracking-tighter opacity-90 md:text-[240px]">
                        VitaMind
                    </div>
                </div>
            </div>
        </footer>
    );
}
