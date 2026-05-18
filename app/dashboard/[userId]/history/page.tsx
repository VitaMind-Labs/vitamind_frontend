'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import { useDisease } from '@/lib/disease-context';
import { getJournalEntries } from '@/lib/storage';
import { DashboardHeader } from '../_components/dashboard-header';
import { JournalEntryCard } from './_components/journal-entry-card';

export default function HistoryPage() {
  const { theme } = useDisease();
  const entries = getJournalEntries();

  return (
    <div>
      <DashboardHeader
        title="Journal History"
        subtitle={`${entries.length} entries recorded`}
      />

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: `${theme.primary}15` }}
          >
            <BookOpen className="w-8 h-8" style={{ color: theme.primary }} />
          </div>
          <h3 className="text-lg font-semibold text-[#2c3e3b] mb-2">
            No journal entries yet
          </h3>
          <p className="text-sm text-[#2c3e3b]/40 max-w-sm">
            Start writing in your journal to see your entries here. Your
            thoughts and reflections will appear in this timeline.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
