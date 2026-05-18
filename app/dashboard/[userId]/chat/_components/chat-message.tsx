'use client';

import React from 'react';
import { Brain, User } from 'lucide-react';
import { useDisease } from '@/lib/disease-context';

interface ChatMessageProps {
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const { theme } = useDisease();
  const isAgent = role === 'agent';

  return (
    <div className={`flex gap-3 ${isAgent ? '' : 'flex-row-reverse'}`}>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{
          backgroundColor: isAgent ? theme.primary : '#2c3e3b',
        }}
      >
        {isAgent ? (
          <Brain className="w-4 h-4 text-white" />
        ) : (
          <User className="w-4 h-4 text-white" />
        )}
      </div>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
          isAgent
            ? 'bg-white border border-[#2c3e3b]/5 rounded-tl-sm'
            : 'rounded-tr-sm'
        }`}
        style={!isAgent ? { backgroundColor: theme.primary } : undefined}
      >
        <p
          className={`text-sm leading-relaxed ${
            isAgent ? 'text-[#2c3e3b]/80' : 'text-white'
          }`}
        >
          {content}
        </p>
        <p
          className={`text-[10px] mt-1.5 ${
            isAgent ? 'text-[#2c3e3b]/30' : 'text-white/50'
          }`}
        >
          {new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}
