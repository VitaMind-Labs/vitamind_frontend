"use client";

import { Button } from '@/components/ui/button';
import PageHeader from '@/components/dashboard/PageHeader';
import { Heart, Zap, BookOpen, Calendar, TrendingUp, Smile, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Welcome back, Sarah"
        subtitle="How are you feeling today? Let's check in on your wellness journey."
      />

      {/* Today's Mood Check-in */}
      <div className="mb-8">
        <div className="card-wellness relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center justify-between mb-4 relative">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Today&apos;s Check-in</h3>
              <p className="text-sm text-muted-foreground">How are you feeling right now?</p>
            </div>
            <div className="p-2 rounded-lg bg-primary/10">
              <Heart className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="mood-tracker relative">
            {[
              { emoji: '😢', label: 'Sad', value: 1 },
              { emoji: '😟', label: 'Anxious', value: 2 },
              { emoji: '😐', label: 'Neutral', value: 3 },
              { emoji: '🙂', label: 'Good', value: 4 },
              { emoji: '😄', label: 'Great', value: 5 },
            ].map((mood) => (
              <button key={mood.value} className="mood-button group hover:scale-105">
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">{mood.emoji}</span>
                <span className="text-xs font-medium text-foreground">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Mood Streak', value: '7 days', subtitle: 'Keep it going!', icon: Smile, gradient: 'from-primary to-teal-400' },
          { title: 'Journal Entries', value: '24', subtitle: 'This month', icon: BookOpen, gradient: 'from-accent to-purple-400' },
          { title: 'Resources Read', value: '12', subtitle: 'Last 30 days', icon: Zap, gradient: 'from-yellow-400 to-orange-400' },
          { title: 'Appointments', value: '2', subtitle: 'This month', icon: Calendar, gradient: 'from-pink-400 to-rose-400' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card-wellness group hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-sm group-hover:shadow-md transition-shadow`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card-wellness">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Your Mood Trend</h3>
              <p className="text-sm text-muted-foreground">Last 7 days</p>
            </div>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="h-64 bg-gradient-to-br from-primary/[0.03] to-accent/[0.03] rounded-xl flex items-center justify-center border border-primary/5">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Mood chart visualization</p>
            </div>
          </div>
        </div>

        <div className="card-wellness">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Today&apos;s Tip</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
              <p className="text-sm font-semibold text-foreground mb-2">Practice Gratitude</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Take 5 minutes to write down 3 things you&apos;re grateful for today.
              </p>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">Start Now</Button>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-wellness">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Entries</h3>
          <div className="space-y-3">
            {[
              { date: 'Today', title: 'Morning Reflection', preview: 'Started the day with positive thoughts...' },
              { date: 'Yesterday', title: 'Evening Thoughts', preview: 'Reflecting on the day\'s achievements...' },
              { date: '2 days ago', title: 'Gratitude Journal', preview: 'Thankful for family and friends...' },
            ].map((entry, idx) => (
              <div key={idx} className="p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">{entry.date}</p>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{entry.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{entry.preview}</p>
                  </div>
                  <BookOpen className="w-4 h-4 text-muted-foreground mt-1 group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-wellness">
          <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming</h3>
          <div className="space-y-3">
            {[
              { date: 'Tomorrow, 2:00 PM', therapist: 'Dr. Emily Johnson', type: 'Therapy Session' },
              { date: 'Friday, 10:00 AM', therapist: 'Wellness Group', type: 'Group Session' },
              { date: 'Next Week', therapist: 'Dr. Michael Chen', type: 'Follow-up' },
            ].map((apt, idx) => (
              <div key={idx} className="p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer border border-primary/10 group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">{apt.date}</p>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{apt.therapist}</p>
                    <p className="text-xs text-primary mt-1 font-medium">{apt.type}</p>
                  </div>
                  <Calendar className="w-4 h-4 text-primary mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
