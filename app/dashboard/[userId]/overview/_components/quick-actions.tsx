'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MessageSquare, BookOpen, Brain } from 'lucide-react';
import { useDisease } from '@/lib/disease-context';

export function QuickActions() {
  const params = useParams();
  const userId = params.userId as string;
  const { theme, definition } = useDisease();

  const actions = [
    {
      href: `/dashboard/${userId}/chat`,
      icon: MessageSquare,
      label: 'Chat with Lumina',
      description: 'Start a conversation with your AI companion',
    },
    {
      href: `/dashboard/${userId}/journal`,
      icon: BookOpen,
      label: 'Write in Journal',
      description: 'Record your thoughts and feelings',
    },
    {
      href: '/clinical-guide',
      icon: Brain,
      label: 'Clinical Guide',
      description: `Learn about ${definition.fullName}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="group p-5 rounded-2xl border border-[#2c3e3b]/5 bg-white hover:shadow-lg transition-all duration-300"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ backgroundColor: `${theme.primary}15` }}
          >
            <action.icon
              className="w-5 h-5 group-hover:scale-110 transition-transform"
              style={{ color: theme.primary }}
            />
          </div>
          <h3 className="text-sm font-semibold text-[#2c3e3b] mb-1">
            {action.label}
          </h3>
          <p className="text-xs text-[#2c3e3b]/40">{action.description}</p>
        </Link>
      ))}
    </div>
  );
}
