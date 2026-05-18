'use client';

import React, { useState } from 'react';
import { Save, BookOpen } from 'lucide-react';
import { useDisease } from '@/lib/disease-context';
import { addJournalEntry } from '@/lib/storage';
import { DashboardHeader } from '../_components/dashboard-header';
import { RatingBar } from './_components/rating-bar';

export default function JournalPage() {
  const { theme, definition } = useDisease();
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!content.trim()) return;
    addJournalEntry({
      id: `entry_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      content,
      rating,
      createdAt: new Date().toISOString(),
    });
    setSaved(true);
    setTimeout(() => {
      setContent('');
      setRating(0);
      setSaved(false);
    }, 1500);
  };

  return (
    <div>
      <DashboardHeader
        title="Journal"
        subtitle="Express your thoughts and feelings"
      />

      <div className="bg-white rounded-2xl border border-[#2c3e3b]/5 overflow-hidden">
        <div
          className="flex items-center gap-3 px-6 py-4 border-b border-[#2c3e3b]/5"
          style={{ backgroundColor: `${theme.primary}08` }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: theme.primary }}
          >
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#2c3e3b]">
              Daily Journal
            </p>
            <p className="text-xs text-[#2c3e3b]/40">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[400px] p-4 rounded-xl border border-[#2c3e3b]/5 bg-[#f0f0f0] text-[#2c3e3b] text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#518591]/20 focus:border-[#518591] transition-all resize-y"
            placeholder="Write about your day, your thoughts, your feelings... This is your safe space to express yourself freely."
          />
        </div>

        <div className="px-6 py-4 border-t border-[#2c3e3b]/5 flex items-center justify-between flex-wrap gap-4">
          <RatingBar rating={rating} onRate={setRating} />

          <button
            onClick={handleSave}
            disabled={!content.trim() || saved}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-50"
            style={{ backgroundColor: saved ? '#22c55e' : theme.primary }}
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save Entry'}
          </button>
        </div>
      </div>

      <div className="mt-6 p-5 rounded-2xl border border-[#2c3e3b]/5 bg-white">
        <h3 className="text-sm font-semibold text-[#2c3e3b] mb-2">
          Writing Tips
        </h3>
        <ul className="space-y-1.5">
          {[
            'Write freely without judgment - this is your private space',
            'Try to write at least a few sentences each day',
            'Rate your day honestly to track your progress over time',
            `Consider how your ${definition.fullName} symptoms affect your day`,
            'Note any coping strategies that worked well for you',
          ].map((tip, i) => (
            <li key={i} className="text-xs text-[#2c3e3b]/50 flex items-start gap-2">
              <span
                className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                style={{ backgroundColor: theme.primary }}
              />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
