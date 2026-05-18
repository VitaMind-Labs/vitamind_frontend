'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  trend?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#2c3e3b]/5 p-6 hover:shadow-lg hover:shadow-[#518591]/5 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{ backgroundColor: `${color}10`, color }}
          >
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-[#2c3e3b]">{value}</p>
        <p className="text-sm font-medium text-[#2c3e3b] mt-0.5">{title}</p>
        <p className="text-xs text-[#2c3e3b]/40 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
