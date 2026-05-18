'use client';

import React from 'react';
import {
  MessageSquare,
  BookOpen,
  Calendar,
  TrendingUp,
  Brain,
  Heart,
} from 'lucide-react';
import { useDisease } from '@/lib/disease-context';
import { DashboardHeader } from '../_components/dashboard-header';
import { StatsCard } from './_components/stats-card';
import { QuickActions } from './_components/quick-actions';

export default function OverviewPage() {
  const { theme, definition } = useDisease();

  return (
    <div>
      <DashboardHeader
        title="Overview"
        subtitle={`Your ${definition.fullName} dashboard`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Chat Sessions"
          value="12"
          subtitle="This month"
          icon={MessageSquare}
          color={theme.primary}
          trend="+3"
        />
        <StatsCard
          title="Journal Entries"
          value="8"
          subtitle="This month"
          icon={BookOpen}
          color={theme.accent}
          trend="+2"
        />
        <StatsCard
          title="Day Streak"
          value="5"
          subtitle="Consecutive days"
          icon={Calendar}
          color={theme.primary}
        />
        <StatsCard
          title="Mood Score"
          value="7.2"
          subtitle="Out of 10"
          icon={Heart}
          color={theme.accent}
          trend="+0.5"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#2c3e3b] mb-4">
          Quick Actions
        </h2>
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#2c3e3b]/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${theme.primary}15` }}
            >
              <Brain className="w-4 h-4" style={{ color: theme.primary }} />
            </div>
            <h3 className="text-sm font-semibold text-[#2c3e3b]">
              About Your Condition
            </h3>
          </div>
          <p className="text-sm text-[#2c3e3b]/60 leading-relaxed mb-3">
            {definition.description}
          </p>
          <p className="text-xs text-[#2c3e3b]/40">{definition.stats}</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#2c3e3b]/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${theme.accent}15` }}
            >
              <TrendingUp className="w-4 h-4" style={{ color: theme.accent }} />
            </div>
            <h3 className="text-sm font-semibold text-[#2c3e3b]">
              Weekly Progress
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Chat Engagement', value: 75 },
              { label: 'Journal Consistency', value: 60 },
              { label: 'Mood Improvement', value: 45 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#2c3e3b]/60">
                    {item.label}
                  </span>
                  <span className="text-xs font-medium text-[#2c3e3b]">
                    {item.value}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#f0f0f0]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: theme.primary,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
