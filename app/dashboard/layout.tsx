"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookHeart, CalendarDays, FileText, History, Home, LayoutDashboard,
  LogOut, Menu, Settings, Sparkles, UserRound, X,
} from "lucide-react";
import { useState } from "react";

const sidebarLinks = [
  { href: "/dashboard", label: "Welcome", icon: Home },
  { href: "/dashboard/journal", label: "Journal", icon: BookHeart },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/consultation", label: "Consultation", icon: FileText },
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  { href: "/dashboard/subscription", label: "Subscription", icon: Sparkles },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[-10rem] top-[6rem] h-[30rem] w-[30rem] rounded-full bg-[#dceccb]/50 blur-[120px]" />
        <div className="absolute right-[-8rem] top-[18rem] h-[26rem] w-[26rem] rounded-full bg-[#dfe8f5]/65 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(183,216,156,0.12),transparent_25%),radial-gradient(circle_at_80%_15%,rgba(223,232,245,0.5),transparent_20%),linear-gradient(180deg,#fafaf8_0%,#f6f5ef_48%,#fafaf8_100%)]" />
        <div className="grain-overlay absolute inset-0 opacity-[0.04]" />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[260px] flex-col border-r border-black/8 bg-white/90 backdrop-blur-2xl transition-transform duration-400 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/8 px-5 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">VitaMind</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-5 w-5 text-black/40" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-300 ${
                  active
                    ? "bg-black text-white shadow-md"
                    : "text-black/55 hover:bg-black/6 hover:text-black/80"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-black/8 px-3 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-black/45 transition hover:bg-black/6 hover:text-black/70"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Back home</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="relative z-10 lg:pl-[260px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-black/8 bg-white/80 backdrop-blur-2xl">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5 text-black/60" />
              </button>
              <div className="hidden items-center gap-3 lg:flex">
                <LayoutDashboard className="h-4 w-4 text-black/30" />
                <span className="text-sm text-black/40">
                  {sidebarLinks.find((l) => l.href === pathname)?.label || "Dashboard"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-black text-white grid place-items-center text-xs font-semibold">
                U
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
