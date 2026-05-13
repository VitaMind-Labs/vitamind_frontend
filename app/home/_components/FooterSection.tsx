import { ArrowUp } from "lucide-react";

export default function FooterSection() {
    return (
        <footer className="relative w-full bg-[url('/bg_img.jpg')] bg-cover bg-center bg-no-repeat overflow-hidden rounded-3xl px-5 py-16 text-white md:px-16">
            {/* Overlay - gardé tel quel */}
            <div className="absolute inset-0 bg-[#071013]/80" />

            {/* Ajout d'un glow effet Teal & Gold subtil */}
            <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[hsl(45,93%,47%)]/5 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[hsl(187,27%,40%)]/5 blur-3xl" />

            <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col gap-12">
                <div className="flex flex-col justify-between gap-12 md:flex-row">
                    <div className="space-y-6">
                        <p className="font-mono-custom text-xs uppercase tracking-[0.2em] text-white/40">
                            Navigate
                        </p>

                        <div className="flex flex-col gap-3">
                            <a href="#" className="font-bold text-[hsl(45,93%,47%)]">
                                Platform
                            </a>

                            <a href="#" className="text-white/60 transition-opacity hover:text-white hover:opacity-100">
                                Company
                            </a>

                            <a href="#" className="text-white/60 transition-opacity hover:text-white hover:opacity-100">
                                Newsroom
                            </a>
                        </div>
                    </div>

                    <div className="self-end">
                        <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/5 transition-all duration-300 hover:bg-gradient-to-r hover:from-[hsl(45,93%,47%)] hover:to-[hsl(187,27%,40%)] hover:border-transparent hover:scale-105">
                            <ArrowUp className="h-5 w-5 transition-colors group-hover:text-white" />
                        </div>
                    </div>
                </div>

                <div className="space-y-8 border-t border-white/10 pt-12">
                    <p className="font-mono-custom text-xs text-white/60">
                        © 2026 VitaMind BIOSCIENCES. ALL RIGHTS RESERVED.
                    </p>

                    <div className="select-none text-[120px] font-bold uppercase leading-none tracking-tighter md:text-[240px]">
                        <span className="text-white">Vita</span>
                        <span className="bg-gradient-to-r from-[hsl(45,93%,47%)] to-[hsl(187,27%,40%)] bg-clip-text text-transparent">Mind</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}