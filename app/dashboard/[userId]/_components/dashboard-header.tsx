'use client';

import React from 'react';
import { useDisease } from '@/lib/disease-context';
import { getUser } from '@/lib/storage';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { theme } = useDisease();
  const user = getUser();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-[#2c3e3b]">{title}</h1>
        {subtitle && (
          <p className="text-sm text-[#2c3e3b]/50 mt-1">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-[#2c3e3b]">
            {user?.fullName || 'User'}
          </p>
          <p className="text-xs text-[#2c3e3b]/40">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: theme.primary }}
        >
          {(user?.fullName || 'U').charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}
