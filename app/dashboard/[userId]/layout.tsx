'use client';

import React, { useState } from 'react';
import { Sidebar } from './_components/sidebar';
import { AuthGuard } from './_components/auth-guard';
import { useDisease } from '@/lib/disease-context';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useDisease();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen" style={{ backgroundColor: theme.glow }}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="lg:ml-64 min-h-screen">
          {/* Mobile hamburger */}
          <div className="sticky top-0 z-20 flex items-center gap-3 p-4 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md border border-[#2c3e3b]/10 text-[#2c3e3b] transition-all hover:bg-[#f0f0f0]"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 md:p-8">{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
}
