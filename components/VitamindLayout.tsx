"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Activity,
    BookOpen,
    CalendarDays,
    HeartPulse,
    Home,
    LogOut,
    MessageCircle,
    Settings,
    Sparkles,
    TrendingUp,
} from "lucide-react";

const navigation = [
    { label: "Overview", path: "", icon: Home },
    { label: "Mood tracker", path: "mood", icon: Activity },
    { label: "Journal", path: "journal", icon: BookOpen },
    { label: "Progress", path: "progress", icon: TrendingUp },
    { label: "Appointments", path: "appointments", icon: CalendarDays },
    { label: "Community", path: "community", icon: MessageCircle },
    { label: "Resources", path: "resources", icon: Sparkles },
];

export default function VitamindLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const userId = segments[1] || "me";
    const dashboardRoot = `/dashboard/${userId}`;

    return (
        <div className="min-h-screen bg-background text-foreground lg:flex">
            <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
                <div className="flex h-20 items-center gap-3 border-b border-border px-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <HeartPulse className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-lg font-bold tracking-tight">VitaMind</p>
                        <p className="text-xs text-muted-foreground">Your wellness space</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 p-4" aria-label="Dashboard navigation">
                    {navigation.map(({ label, path, icon: Icon }) => {
                        const href = path ? `${dashboardRoot}/${path}` : dashboardRoot;
                        const isActive = path ? pathname === href : pathname === dashboardRoot;

                        return (
                            <Link
                                key={label}
                                href={href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="space-y-1 border-t border-border p-4">
                    <Link
                        href={`${dashboardRoot}/settings`}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                    <Link
                        href="/auth/signin"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign out
                    </Link>
                </div>
            </aside>

            <main className="min-w-0 flex-1">
                <div className="border-b border-border bg-card px-4 py-4 lg:hidden">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <HeartPulse className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="font-bold tracking-tight">VitaMind</p>
                            <p className="text-xs text-muted-foreground">Your wellness space</p>
                        </div>
                    </div>
                    <nav className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Dashboard navigation">
                        {navigation.map(({ label, path }) => {
                            const href = path ? `${dashboardRoot}/${path}` : dashboardRoot;
                            const isActive = path ? pathname === href : pathname === dashboardRoot;

                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
            </main>
        </div>
    );
}