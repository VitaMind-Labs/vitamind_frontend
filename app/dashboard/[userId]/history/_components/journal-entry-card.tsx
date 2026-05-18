'use client';

import React from 'react';
import { Star, Calendar } from 'lucide-react';
import { useDisease } from '@/lib/disease-context';
import { JournalEntry } from '@/lib/storage';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const { theme } = useDisease();

  return (
    <div className="bg-white rounded-2xl border border-[#2c3e3b]/5 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#2c3e3b]/30" />
          <span className="text-sm font-medium text-[#2c3e3b]">
            {new Date(entry.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        {entry.rating > 0 && (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-3.5 h-3.5"
                fill={star <= entry.rating ? theme.accent : 'none'}
                style={{
                  color: star <= entry.rating ? theme.accent : '#2c3e3b20',
                }}
              />
            ))}
          </div>
        )}
      </div>
      <p className="text-sm text-[#2c3e3b]/60 leading-relaxed line-clamp-3">
        {entry.content}
      </p>
    </div>
  );
}
