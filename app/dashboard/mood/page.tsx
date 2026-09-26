"use client";

import { Button } from '@/components/ui/button';
import PageHeader from '@/components/dashboard/PageHeader';
import { Heart, Plus, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function MoodTrackerPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  return (
    <>
      <PageHeader title="Mood Tracker" subtitle="Track your emotional well-being and identify patterns" />

      <div className="mb-8">
        <div className="card-wellness">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">How are you feeling?</h3>
              <p className="text-sm text-muted-foreground">Select your current mood</p>
            </div>
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <div className="mood-tracker mb-6">
            {[
              { emoji: '😢', label: 'Very Sad', value: 1 },
              { emoji: '😟', label: 'Sad', value: 2 },
              { emoji: '😐', label: 'Neutral', value: 3 },
              { emoji: '🙂', label: 'Good', value: 4 },
              { emoji: '😄', label: 'Very Good', value: 5 },
            ].map((mood) => (
               <Button
                 key={mood.value}
                 type="button"
                 variant="ghost"
                 aria-pressed={selectedMood === mood.value}
                 onClick={() => setSelectedMood(mood.value)}
                 className={`mood-button h-auto min-h-0 flex-col p-2 hover:scale-105 ${selectedMood === mood.value ? 'selected' : ''}`}
               >
                 <span className="text-4xl mb-2">{mood.emoji}</span>
                 <span className="text-xs font-medium text-foreground">{mood.label}</span>
               </Button>
            ))}
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-3">What&apos;s affecting your mood?</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Sleep', 'Work', 'Relationships', 'Health', 'Weather', 'Exercise', 'Diet', 'Stress'].map((factor) => (
                 <Button key={factor} type="button" variant="outline" className="text-sm font-medium">
                   {factor}
                 </Button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">Add a note (optional)</label>
            <textarea className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground transition-shadow" rows={4} placeholder="How are you feeling? What's on your mind?" />
          </div>

          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Save Mood Entry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 card-wellness">
          <h3 className="text-lg font-semibold text-foreground mb-4">This Week</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Average Mood</span>
                <span className="text-sm font-bold text-primary">3.8/5</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-2 rounded-full" style={{ width: '76%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Best Day</span>
                <span className="text-sm font-bold text-accent">Wednesday</span>
              </div>
              <p className="text-xs text-muted-foreground">Mood: 5/5</p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Entries Logged</span>
                <span className="text-sm font-bold text-primary">6/7</span>
              </div>
              <p className="text-xs text-muted-foreground">Keep the streak going!</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 card-wellness">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Weekly Trend</h3>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="h-64 bg-gradient-to-br from-primary/[0.03] to-accent/[0.03] rounded-xl flex items-center justify-center border border-primary/5">
            <div className="text-center">
              <TrendingUp className="w-12	h-12 text-primary/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Mood trend visualization</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card-wellness">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Entries</h3>
        <div className="space-y-3">
          {[
            { date: 'Today, 2:30 PM', mood: 4, emoji: '🙂', factors: ['Work', 'Exercise'], note: 'Had a great workout session this morning' },
            { date: 'Yesterday, 8:00 PM', mood: 3, emoji: '😐', factors: ['Sleep', 'Weather'], note: 'Feeling a bit tired today' },
            { date: '2 days ago, 3:15 PM', mood: 5, emoji: '😄', factors: ['Relationships', 'Health'], note: 'Wonderful day with friends!' },
            { date: '3 days ago, 6:00 PM', mood: 2, emoji: '😟', factors: ['Stress', 'Work'], note: 'Stressful day at work' },
          ].map((entry, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{entry.emoji}</span>
                    <div>
                      <p className="text-xs text-muted-foreground">{entry.date}</p>
                      <p className="text-sm font-medium text-foreground">Mood: {entry.mood}/5</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground mb-2">{entry.note}</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.factors.map((factor) => (
                      <span key={factor} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">{factor}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
