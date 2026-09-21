"use client";

import PageHeader from '@/components/dashboard/PageHeader';
import { TrendingUp, Target, Award, Calendar } from 'lucide-react';

export default function ProgressPage() {
  return (
    <>
      <PageHeader title="Your Progress" subtitle="Track your mental health journey and celebrate your wins" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Days Tracked', value: '87', icon: Calendar, gradient: 'from-blue-400 to-blue-600' },
          { label: 'Average Mood', value: '3.8/5', icon: TrendingUp, gradient: 'from-green-400 to-green-600' },
          { label: 'Goals Achieved', value: '12', icon: Target, gradient: 'from-purple-400 to-purple-600' },
          { label: 'Achievements', value: '8', icon: Award, gradient: 'from-orange-400 to-orange-600' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card-wellness group hover:-translate-y-1 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-sm group-hover:shadow-md transition-shadow`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card-wellness">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Mood Trend</h3>
          <div className="h-64 bg-gradient-to-br from-primary/[0.03] to-accent/[0.03] rounded-xl flex items-center justify-center border border-primary/5">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-primary/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Mood trend visualization</p>
            </div>
          </div>
        </div>

        <div className="card-wellness">
          <h3 className="text-lg font-semibold text-foreground mb-4">Mood Distribution</h3>
          <div className="space-y-4">
            {[
              { mood: 'Very Good', percentage: 35, color: 'bg-green-500' },
              { mood: 'Good', percentage: 28, color: 'bg-lime-500' },
              { mood: 'Neutral', percentage: 22, color: 'bg-yellow-500' },
              { mood: 'Sad', percentage: 12, color: 'bg-orange-500' },
              { mood: 'Very Sad', percentage: 3, color: 'bg-red-500' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{item.mood}</span>
                  <span className="text-sm font-semibold text-foreground">{item.percentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-wellness mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Your Goals</h3>
        <div className="space-y-4">
          {[
            { title: 'Daily Meditation', description: 'Practice 10 minutes of meditation daily', progress: 75, target: '30 days', completed: 23 },
            { title: 'Journal Writing', description: 'Write in journal 5 times per week', progress: 100, target: '20 entries', completed: 20 },
            { title: 'Exercise Routine', description: 'Exercise 3 times per week', progress: 60, target: '12 sessions', completed: 7 },
            { title: 'Sleep Schedule', description: 'Maintain consistent sleep schedule', progress: 85, target: '30 days', completed: 26 },
          ].map((goal, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-border hover:border-primary/50 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{goal.title}</h4>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
                <span className="text-sm font-bold text-primary">{goal.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5 mb-2 overflow-hidden">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${goal.progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{goal.completed} of {goal.target}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card-wellness">
        <h3 className="text-lg font-semibold text-foreground mb-4">Achievements Unlocked</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: '🎯', title: 'First Step', description: 'Logged your first mood' },
            { emoji: '📝', title: 'Writer', description: 'Wrote 10 journal entries' },
            { emoji: '🧘', title: 'Mindful', description: 'Completed 5 meditations' },
            { emoji: '📈', title: 'Trending Up', description: 'Mood improved 3 weeks' },
            { emoji: '🎖️', title: 'Consistent', description: '30-day streak' },
            { emoji: '💪', title: 'Resilient', description: 'Overcame a challenge' },
            { emoji: '🌟', title: 'Shining', description: 'Reached 100 mood entries' },
            { emoji: '🏆', title: 'Champion', description: 'Achieved all monthly goals' },
          ].map((ach, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-border hover:border-primary/50 hover:shadow-sm hover:-translate-y-0.5 transition-all text-center">
              <div className="text-3xl mb-2">{ach.emoji}</div>
              <p className="text-sm font-semibold text-foreground mb-1">{ach.title}</p>
              <p className="text-xs text-muted-foreground">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
