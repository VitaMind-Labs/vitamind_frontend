"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/dashboard/PageHeader';
import { Zap, BookOpen, Music, Heart, Search } from 'lucide-react';

export default function ResourcesPage() {
  const resources = [
    {
      category: 'Articles', icon: BookOpen, gradient: 'from-blue-400 to-blue-600',
      items: [
        { title: "Understanding Anxiety: A Beginner's Guide", author: 'Dr. Sarah Mitchell', readTime: '8 min read', description: 'Learn about anxiety and practical techniques to manage it.' },
        { title: 'The Power of Mindfulness', author: 'Prof. James Chen', readTime: '12 min read', description: 'Discover how mindfulness can transform your daily life.' },
        { title: 'Building Resilience', author: 'Emma Rodriguez', readTime: '10 min read', description: 'Strategies to develop emotional resilience and strength.' },
      ],
    },
    {
      category: 'Meditations', icon: Music, gradient: 'from-purple-400 to-purple-600',
      items: [
        { title: '10-Minute Morning Meditation', author: 'Guided by Lisa Wong', readTime: '10 min', description: 'Start your day with calm and focus.' },
        { title: 'Sleep Meditation for Better Rest', author: 'Guided by Michael Park', readTime: '20 min', description: 'Relax and drift into peaceful sleep.' },
        { title: 'Anxiety Relief Meditation', author: 'Guided by Dr. Rachel Green', readTime: '15 min', description: 'Calm your mind during stressful moments.' },
      ],
    },
    {
      category: 'Wellness Tips', icon: Heart, gradient: 'from-pink-400 to-pink-600',
      items: [
        { title: 'Self-Care Routine for Busy People', author: 'Wellness Team', readTime: '6 min read', description: 'Quick and effective self-care practices.' },
        { title: 'Nutrition and Mental Health', author: 'Dr. Amanda Foster', readTime: '9 min read', description: 'How diet affects your emotional well-being.' },
        { title: 'Exercise for Mental Wellness', author: 'Coach David Lee', readTime: '7 min read', description: 'The connection between movement and mood.' },
      ],
    },
  ];

  return (
    <>
      <PageHeader title="Resources" subtitle="Explore articles, meditations, and wellness tips" />

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search resources..." className="pl-10" />
        </div>
      </div>

      <div className="card-wellness mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/[0.03] to-accent/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-start justify-between relative">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Featured</span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">5 Powerful Techniques for Emotional Regulation</h3>
            <p className="text-sm text-muted-foreground mb-4">Learn science-backed techniques to manage your emotions.</p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">Read Now</Button>
          </div>
          <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-xl bg-primary/10">
            <Heart className="w-12 h-12 text-primary" />
          </div>
        </div>
      </div>

      {resources.map((category, catIdx) => {
        const Icon = category.icon;
        return (
          <div key={catIdx} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${category.gradient} text-white shadow-sm`}>
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">{category.category}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item, idx) => (
                <div key={idx} className="card-wellness hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{item.author}</p>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{item.readTime}</span>
                    <Button variant="ghost" className="text-primary hover:bg-primary/10">
                      {category.category === 'Meditations' ? 'Listen' : 'Read'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="card-wellness">
        <h3 className="text-lg font-semibold text-foreground mb-4">Browse All Resources</h3>
        <div className="flex flex-wrap gap-2">
          {['Anxiety', 'Depression', 'Stress', 'Sleep', 'Relationships', 'Self-Esteem', 'Mindfulness', 'Gratitude', 'Resilience', 'Motivation'].map((tag) => (
            <button key={tag} className="px-4 py-2 rounded-full border border-border hover:border-primary hover:bg-primary/5 hover:shadow-sm transition-all text-sm font-medium text-foreground">
              {tag}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
