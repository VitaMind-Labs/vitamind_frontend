"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/dashboard/PageHeader';
import { BookOpen, Plus, Search, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function JournalPage() {
  const [view, setView] = useState<'list' | 'write'>('list');

  return (
    <>
      <PageHeader title="Journal" subtitle="Express yourself and track your thoughts and feelings" />

      {view === 'write' ? (
        <div className="mb-8">
          <div className="card-wellness">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">New Journal Entry</h3>
               <Button type="button" variant="link" size="sm" onClick={() => setView('list')}>Back to entries</Button>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-foreground mb-3">Choose a prompt or write freely</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["What am I grateful for today?", "How did I overcome a challenge?", "What made me smile today?", "What am I worried about?", "What did I learn today?", "How can I be kinder to myself?"].map((prompt) => (
                   <Button key={prompt} type="button" variant="outline" className="h-auto min-h-0 p-3 text-start text-sm">
                     {prompt}
                   </Button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">Entry Title</label>
              <Input placeholder="Give your entry a title..." />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">Your thoughts</label>
              <textarea className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground transition-shadow" rows={10} placeholder="Write your thoughts, feelings, and reflections here..." />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">Add tags (optional)</label>
              <Input placeholder="e.g., #gratitude #reflection #growth" />
            </div>
             <div className="flex flex-wrap gap-3">
              <Button className="flex-1">Save Entry</Button>
              <Button variant="outline" className="flex-1" onClick={() => setView('list')}>Cancel</Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search entries..." className="pl-10" />
            </div>
            <Button onClick={() => setView('write')}>
              <Plus className="w-4 h-4 mr-2" /> New Entry
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Total Entries', value: '42', icon: BookOpen },
              { label: 'This Month', value: '12', icon: Calendar },
              { label: 'Streak', value: '8 days', icon: BookOpen },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="card-wellness">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            {[
              { date: 'Today', title: 'A Day of Growth', preview: 'Today was a wonderful day. I managed to complete my morning meditation and felt more centered...', tags: ['#growth', '#meditation', '#gratitude'], mood: '😄' },
              { date: 'Yesterday', title: 'Overcoming Anxiety', preview: 'I had a challenging moment today, but I used the breathing techniques I learned...', tags: ['#anxiety', '#coping', '#strength'], mood: '🙂' },
              { date: '2 days ago', title: 'Reflection on Progress', preview: 'Looking back at my journal entries from a month ago, I can see how much I\'ve grown...', tags: ['#reflection', '#progress', '#self-love'], mood: '😄' },
              { date: '3 days ago', title: 'A Difficult Day', preview: 'Today was challenging, but I reached out to my support system and felt better...', tags: ['#support', '#vulnerability', '#healing'], mood: '😐' },
              { date: '1 week ago', title: 'New Beginnings', preview: 'Starting this journal has been transformative. I feel more aware of my emotions...', tags: ['#newbeginnings', '#awareness', '#journey'], mood: '🙂' },
            ].map((entry, idx) => (
              <div key={idx} className="card-wellness hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{entry.mood}</span>
                      <div>
                        <p className="text-xs text-muted-foreground">{entry.date}</p>
                        <h4 className="text-lg font-semibold text-foreground">{entry.title}</h4>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{entry.preview}</p>
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" className="ml-2 shrink-0">Read</Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
