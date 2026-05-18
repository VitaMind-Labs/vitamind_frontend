'use client';

import React from 'react';
import { useDisease } from '@/lib/disease-context';
import { getUser } from '@/lib/storage';
import { DashboardHeader } from '../_components/dashboard-header';
import { PersonalInfo } from './_components/personal-info';
import { SubscriptionCard } from './_components/subscription-card';

export default function ProfilePage() {
  const { theme, definition } = useDisease();
  const user = getUser();

  return (
    <div>
      <DashboardHeader
        title="Profile"
        subtitle="Manage your account and subscription"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <PersonalInfo />

          <div className="mt-6 bg-white rounded-2xl border border-[#2c3e3b]/5 p-6">
            <h3 className="text-base font-semibold text-[#2c3e3b] mb-4">
              Condition Details
            </h3>
            <div
              className="p-4 rounded-xl mb-4"
              style={{ backgroundColor: `${theme.primary}08` }}
            >
              <p className="text-sm font-semibold" style={{ color: theme.primary }}>
                {definition.fullName}
              </p>
              <p className="text-xs text-[#2c3e3b]/40 mt-1">
                {definition.stats}
              </p>
            </div>
            <p className="text-sm text-[#2c3e3b]/60 leading-relaxed">
              {definition.prognosis}
            </p>
          </div>
        </div>

        <div>
          <SubscriptionCard />

          <div className="mt-6 bg-white rounded-2xl border border-[#2c3e3b]/5 p-6">
            <h3 className="text-base font-semibold text-[#2c3e3b] mb-4">
              Account Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-[#2c3e3b]/5">
                <span className="text-sm text-[#2c3e3b]/50">User ID</span>
                <span className="text-sm font-mono text-[#2c3e3b]">
                  {user?.id || 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#2c3e3b]/5">
                <span className="text-sm text-[#2c3e3b]/50">Plan</span>
                <span className="text-sm font-medium text-[#2c3e3b] capitalize">
                  {user ? 'Active' : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-[#2c3e3b]/50">Theme</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.accent }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
