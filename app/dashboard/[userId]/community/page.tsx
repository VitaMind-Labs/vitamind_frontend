"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/dashboard/PageHeader';
import { Users, MessageCircle, Heart, Share2, Plus, Search } from 'lucide-react';

export default function CommunityPage() {
  return (
    <>
      <PageHeader title="Community" subtitle="Connect with others and share your journey" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search groups and discussions..." className="pl-10" />
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> New Post
        </Button>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Support Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Anxiety Support Group', description: 'A safe space to discuss anxiety and share coping strategies', members: 1234, posts: 456 },
            { name: 'Depression & Recovery', description: 'Supporting each other through the journey of recovery', members: 2341, posts: 789 },
            { name: 'Mindfulness & Meditation', description: 'Practice mindfulness together and share experiences', members: 567, posts: 234 },
            { name: 'Sleep & Wellness', description: 'Discuss sleep issues and wellness practices', members: 892, posts: 345 },
          ].map((group, idx) => (
            <div key={idx} className="card-wellness hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Users className="w-6 h-6 text-primary" /></div>
                  <div>
                    <h3 className="font-semibold text-foreground">{group.name}</h3>
                    <p className="text-xs text-muted-foreground">{group.members.toLocaleString()} members</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">Active</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
              <p className="text-xs text-muted-foreground mb-4">{group.posts} posts this month</p>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">Join Group</Button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Recent Discussions</h2>
        <div className="space-y-4">
          {[
            { author: 'Sarah M.', group: 'Anxiety Support Group', title: 'Tips for managing social anxiety', excerpt: 'I recently discovered some techniques that really help me manage my social anxiety...', replies: 24, likes: 156, timestamp: '2 hours ago' },
            { author: 'James K.', group: 'Mindfulness & Meditation', title: 'My 30-day meditation journey', excerpt: 'I started meditating 30 days ago and wanted to share my experience...', replies: 18, likes: 203, timestamp: '4 hours ago' },
            { author: 'Emma L.', group: 'Depression & Recovery', title: 'Finding hope in difficult times', excerpt: 'Recovery is not linear, but I\'ve learned to celebrate small wins...', replies: 31, likes: 287, timestamp: '6 hours ago' },
            { author: 'David R.', group: 'Sleep & Wellness', title: 'Establishing a better sleep routine', excerpt: 'After struggling with insomnia, I finally found a routine that works...', replies: 15, likes: 142, timestamp: '8 hours ago' },
          ].map((post, idx) => (
            <div key={idx} className="card-wellness hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-foreground">{post.author}</span>
                    <span className="text-xs text-muted-foreground">in {post.group}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{post.title}</h3>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{post.timestamp}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <button className="flex items-center gap-2 hover:text-primary transition-colors"><Heart className="w-4 h-4" />{post.likes}</button>
                <button className="flex items-center gap-2 hover:text-primary transition-colors"><MessageCircle className="w-4 h-4" />{post.replies}</button>
                <button className="flex items-center gap-2 hover:text-primary transition-colors"><Share2 className="w-4 h-4" />Share</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-wellness">
        <h3 className="text-lg font-semibold text-foreground mb-4">Community Guidelines</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p><span className="font-medium text-foreground">Be Respectful:</span> Treat all members with kindness and respect.</p>
          <p><span className="font-medium text-foreground">Share Safely:</span> Respect privacy and confidentiality of others.</p>
          <p><span className="font-medium text-foreground">Support Each Other:</span> Offer encouragement and understanding.</p>
          <p><span className="font-medium text-foreground">No Spam:</span> Keep discussions relevant and meaningful.</p>
          <p><span className="font-medium text-foreground">Seek Professional Help:</span> If you&apos;re in crisis, please contact a mental health professional.</p>
        </div>
      </div>
    </>
  );
}
