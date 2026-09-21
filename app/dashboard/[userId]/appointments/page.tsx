"use client";

import { Button } from '@/components/ui/button';
import PageHeader from '@/components/dashboard/PageHeader';
import { Calendar, Clock, User, MapPin, Plus, CheckCircle } from 'lucide-react';

export default function AppointmentsPage() {
  const upcoming = [
    { id: 1, therapist: 'Dr. Emily Johnson', type: 'Individual Therapy', date: 'Tomorrow', time: '2:00 PM - 3:00 PM', location: 'Virtual (Zoom)', status: 'confirmed', notes: 'Weekly session' },
    { id: 2, therapist: 'Wellness Group', type: 'Group Session', date: 'Friday, March 22', time: '6:00 PM - 7:30 PM', location: 'Virtual', status: 'confirmed', notes: 'Anxiety Support Group' },
    { id: 3, therapist: 'Dr. Michael Chen', type: 'Follow-up Session', date: 'Monday, March 25', time: '10:00 AM - 11:00 AM', location: 'Office - Suite 200', status: 'pending', notes: 'Medication review' },
  ];

  const past = [
    { id: 4, therapist: 'Dr. Emily Johnson', type: 'Individual Therapy', date: 'March 15', time: '2:00 PM - 3:00 PM', notes: 'Discussed coping strategies' },
    { id: 5, therapist: 'Wellness Group', type: 'Group Session', date: 'March 8', time: '6:00 PM - 7:30 PM', notes: 'Shared experiences and support' },
    { id: 6, therapist: 'Dr. Michael Chen', type: 'Initial Consultation', date: 'March 1', time: '10:00 AM - 11:00 AM', notes: 'Assessment and treatment planning' },
  ];

  return (
    <>
      <PageHeader title="Appointments" subtitle="Manage your therapy and wellness sessions" />

      <div className="mb-8">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Book New Appointment
        </Button>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Upcoming Appointments</h2>
        <div className="space-y-4">
          {upcoming.map((apt) => (
            <div key={apt.id} className="card-wellness border-l-4 border-primary hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{apt.therapist}</h3>
                      <p className="text-sm text-muted-foreground">{apt.type}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm text-foreground"><Calendar className="w-4 h-4 text-primary shrink-0" />{apt.date}</div>
                    <div className="flex items-center gap-2 text-sm text-foreground"><Clock className="w-4 h-4 text-primary shrink-0" />{apt.time}</div>
                    <div className="flex items-center gap-2 text-sm text-foreground"><MapPin className="w-4 h-4 text-primary shrink-0" />{apt.location}</div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{apt.notes}</p>
                  <div className="flex gap-2">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">Join Session</Button>
                    <Button variant="outline">Reschedule</Button>
                    <Button variant="ghost">Cancel</Button>
                  </div>
                </div>
                <div className="ml-4 shrink-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${apt.status === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    {apt.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Past Appointments</h2>
        <div className="space-y-3">
          {past.map((apt) => (
            <div key={apt.id} className="card-wellness opacity-75 hover:opacity-100 transition-opacity">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground">{apt.therapist}</h3>
                      <p className="text-sm text-muted-foreground">{apt.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2"><span>{apt.date}</span><span>{apt.time}</span></div>
                  <p className="text-sm text-muted-foreground">{apt.notes}</p>
                </div>
                <Button variant="ghost" className="shrink-0">View Notes</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-wellness">
        <h3 className="text-lg font-semibold text-foreground mb-4">Your Therapists</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Dr. Emily Johnson', specialty: 'Anxiety & Stress', availability: 'Mon, Wed, Fri' },
            { name: 'Dr. Michael Chen', specialty: 'Depression & Mood', availability: 'Tue, Thu, Sat' },
            { name: 'Wellness Group', specialty: 'Group Therapy', availability: 'Every Friday' },
          ].map((t, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-border hover:border-primary/50 hover:shadow-sm transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.specialty}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Available: {t.availability}</p>
              <div className="flex gap-2"><Button variant="outline" className="flex-1 text-xs">Call</Button><Button variant="outline" className="flex-1 text-xs">Message</Button></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
