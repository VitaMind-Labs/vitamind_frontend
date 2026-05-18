'use client';

import React from 'react';
import { useDisease } from '@/lib/disease-context';
import { getSubscription } from '@/lib/storage';

export function SubscriptionCard() {
  const { theme } = useDisease();
  const sub = getSubscription();

  const planFeatures =
    sub?.plan === 'pro'
      ? [
          'Unlimited chat sessions',
          'Advanced journal analytics',
          'Detailed progress reports',
          'Priority support',
          'Custom mood tracking',
          'Weekly AI insights',
        ]
      : [
          '5 chat sessions/day',
          'Basic journal',
          'Progress tracking',
          'Clinical guide access',
          'Email support',
        ];

  const usageItems =
    sub?.plan === 'pro'
      ? [
          { label: 'Chat Sessions', used: 12, total: 'Unlimited' },
          { label: 'Journal Entries', used: 8, total: 'Unlimited' },
          { label: 'AI Insights', used: 2, total: 4 },
        ]
      : [
          { label: 'Chat Sessions', used: 3, total: 5 },
          { label: 'Journal Entries', used: 8, total: 'Unlimited' },
          { label: 'AI Insights', used: 0, total: 0 },
        ];

  return (
    <div className="bg-white rounded-2xl border border-[#2c3e3b]/5 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-[#2c3e3b]">
          Subscription
        </h3>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: sub?.status === 'active' ? '#22c55e' : '#ef4444' }}
        >
          {sub?.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
        </span>
      </div>

      <div
        className="p-4 rounded-xl mb-6"
        style={{ backgroundColor: `${theme.primary}08` }}
      >
        <div className="flex items-center justify-between mb-1">
          <span
            className="text-lg font-bold capitalize"
            style={{ color: theme.primary }}
          >
            {sub?.plan || 'No Plan'}
          </span>
          <span className="text-xl font-bold text-[#2c3e3b]">
            {sub?.price?.toFixed(2) || '0.00'}{' '}
            <span className="text-sm font-normal text-[#2c3e3b]/40">TND/mo</span>
          </span>
        </div>
        <p className="text-xs text-[#2c3e3b]/40">
          Started{' '}
          {sub?.startDate
            ? new Date(sub.startDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : 'N/A'}
        </p>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[#2c3e3b] mb-3">
          Plan Features
        </h4>
        <ul className="space-y-2">
          {planFeatures.map((feature, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-sm text-[#2c3e3b]/60"
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: theme.primary }}
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-[#2c3e3b] mb-3">
          Usage This Month
        </h4>
        <div className="space-y-3">
          {usageItems.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#2c3e3b]/60">{item.label}</span>
                <span className="text-xs font-medium text-[#2c3e3b]">
                  {item.used}/{item.total}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[#f0f0f0]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width:
                      item.total === 'Unlimited'
                        ? '30%'
                        : `${Math.min((item.used / (item.total as number)) * 100, 100)}%`,
                    backgroundColor: theme.primary,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
