'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import {
  Brain,
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  History,
  User,
  LogOut,
  Moon,
  Activity,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDisease } from '@/lib/disease-context';
import { clearUser } from '@/lib/storage';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/chat', label: 'Chat Space', icon: MessageSquare },
  { href: '/journal', label: 'Journal', icon: BookOpen },
  { href: '/history', label: 'History', icon: History },
  { href: '/profile', label: 'Profile', icon: User },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const diseaseIcons: Record<string, any> = {
  ADHD: Brain,
  BIPOLAR: Moon,
  SCHIZOPHRENIA: Activity,
};

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const { disease, theme } = useDisease();
  const DiseaseIcon = diseaseIcons[disease] || Brain;

  const handleLogout = () => {
    clearUser();
    router.push('/signin');
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 w-64 flex flex-col z-40 transition-transform duration-300',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        style={{ backgroundColor: theme.sidebarBg }}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: theme.sidebarActive }}
            >
              <DiseaseIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-none">
                VitaMind
              </div>
              <div className="text-white/40 text-xs mt-0.5">
                {btoa(disease)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.includes(item.href);
            return (
              <Link
                key={item.href}
                href={`/dashboard/${userId}${item.href}`}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-white shadow-lg'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                )}
                style={
                  isActive
                    ? { backgroundColor: theme.sidebarActive }
                    : undefined
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 hover:bg-white/5 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
