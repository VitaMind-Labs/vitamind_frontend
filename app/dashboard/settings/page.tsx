"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import PageHeader from '@/components/dashboard/PageHeader';
import { Lock, User, Bell, Shield } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      <div className="flex gap-2 mb-8 border-b border-border overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
             <Button
               key={tab.id}
               type="button"
               variant="ghost"
               aria-pressed={activeTab === tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`h-auto min-h-0 rounded-none border-b-2 px-4 py-3 font-medium ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
             >
               <Icon className="w-4 h-4" />{tab.label}
             </Button>
          );
        })}
      </div>

      {activeTab === 'profile' && (
        <div className="card-wellness">
          <h3 className="text-lg font-semibold text-foreground mb-6">Profile Information</h3>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-foreground mb-2">Full Name</label><Input defaultValue="Sarah Johnson" /></div>
            <div><label className="block text-sm font-medium text-foreground mb-2">Email</label><Input defaultValue="sarah@example.com" type="email" /></div>
            <div><label className="block text-sm font-medium text-foreground mb-2">Phone</label><Input defaultValue="+1 (555) 123-4567" /></div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
              <textarea className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground transition-shadow" rows={4} defaultValue="Mental health advocate and wellness enthusiast on a journey of self-discovery." />
            </div>
            <div className="flex gap-3 pt-4">
              <Button>Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="card-wellness">
            <h3 className="text-lg font-semibold text-foreground mb-6">Password</h3>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-foreground mb-2">Current Password</label><Input type="password" placeholder="Enter current password" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-2">New Password</label><Input type="password" placeholder="Enter new password" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label><Input type="password" placeholder="Confirm new password" /></div>
              <div className="flex flex-wrap gap-3 pt-4">
                <Button>Update Password</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>
          </div>
          <div className="card-wellness">
            <h3 className="text-lg font-semibold text-foreground mb-4">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>
            <Button variant="outline">Enable 2FA</Button>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="card-wellness">
          <h3 className="text-lg font-semibold text-foreground mb-6">Notification Settings</h3>
          <div className="space-y-4">
            {[
              { label: 'Daily Mood Reminder', description: 'Get reminded to log your mood daily' },
              { label: 'Appointment Reminders', description: 'Receive reminders before your appointments' },
              { label: 'Wellness Tips', description: 'Get daily wellness tips and articles' },
              { label: 'Community Updates', description: 'Notifications from your support groups' },
              { label: 'Goal Milestones', description: 'Celebrate when you reach your goals' },
              { label: 'Email Digest', description: 'Weekly summary of your progress' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <div className="card-wellness">
            <h3 className="text-lg font-semibold text-foreground mb-4">Data & Privacy</h3>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Control how your data is used and shared</p>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div><p className="font-medium text-foreground">Allow Analytics</p><p className="text-sm text-muted-foreground">Help us improve your experience</p></div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between py-3">
                <div><p className="font-medium text-foreground">Share Profile</p><p className="text-sm text-muted-foreground">Make your profile public</p></div>
                <Switch />
              </div>
            </div>
          </div>
          <div className="card-wellness">
            <h3 className="text-lg font-semibold text-foreground mb-4">Account Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">Download Your Data</Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">Delete Account</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
