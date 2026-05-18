import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (

        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#518591]/10">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                <div className="flex h-16 items-center justify-between">
                    {/* LEFT - Logo */}
                    <Link
                        href="/"
                        className="group flex items-center gap-3 transition-all duration-300"
                    >
                        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white p-2 shadow-sm">
                            <Image
                                src="/logo.png"
                                alt="VitaMind Logo"
                                width={42}
                                height={42}
                                className="h-8 w-8 object-contain md:h-9 md:w-9"
                                priority
                            />
                        </div>
                    </Link>

                 
                    {/* Login button */}
                    <Link
                        href="/login"
                        className="hidden md:inline-flex items-center gap-2 rounded-full border border-[#518591]/20 px-4 py-2 text-sm font-medium text-[#2c3e3b] transition-all duration-300 hover:border-[#518591] hover:bg-[#518591]/5 hover:text-[#518591]"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </header>
    );
}