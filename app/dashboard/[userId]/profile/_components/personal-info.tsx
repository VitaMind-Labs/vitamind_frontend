'use client';

import React, { useState } from 'react';
import { useDisease } from '@/lib/disease-context';
import { getUser, setUser } from '@/lib/storage';

export function PersonalInfo() {
  const { theme } = useDisease();
  const user = getUser();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (user) {
      setUser({ ...user, fullName, email });
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#2c3e3b]/5 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-[#2c3e3b]">
          Personal Information
        </h3>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-sm font-medium transition-colors"
            style={{ color: theme.primary }}
          >
            Edit
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#2c3e3b]/50 mb-1.5">
            Full Name
          </label>
          {editing ? (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#2c3e3b]/10 bg-[#f0f0f0] text-[#2c3e3b] text-sm focus:outline-none focus:ring-2 focus:ring-[#518591]/30 focus:border-[#518591] transition-all"
            />
          ) : (
            <p className="text-sm text-[#2c3e3b]">{fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-[#2c3e3b]/50 mb-1.5">
            Email
          </label>
          {editing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#2c3e3b]/10 bg-[#f0f0f0] text-[#2c3e3b] text-sm focus:outline-none focus:ring-2 focus:ring-[#518591]/30 focus:border-[#518591] transition-all"
            />
          ) : (
            <p className="text-sm text-[#2c3e3b]">{email}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-[#2c3e3b]/50 mb-1.5">
            Condition
          </label>
          <p className="text-sm text-[#2c3e3b]">{user?.disease}</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#2c3e3b]/50 mb-1.5">
            Member Since
          </label>
          <p className="text-sm text-[#2c3e3b]">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })
              : 'N/A'}
          </p>
        </div>
      </div>

      {editing && (
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-white text-sm font-semibold transition-all"
            style={{ backgroundColor: theme.primary }}
          >
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="px-5 py-2 rounded-xl border border-[#2c3e3b]/10 text-sm font-medium text-[#2c3e3b]/60 hover:bg-[#f0f0f0] transition-all"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
