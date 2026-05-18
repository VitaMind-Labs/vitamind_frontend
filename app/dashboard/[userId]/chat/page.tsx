'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { useDisease } from '@/lib/disease-context';
import { addChatMessage, getChatMessages } from '@/lib/storage';
import { DashboardHeader } from '../_components/dashboard-header';
import { ChatMessage } from './_components/chat-message';
import { ChatInput } from './_components/chat-input';

const staticResponses = [
  "I understand how you're feeling. It's important to acknowledge these emotions. Would you like to talk more about what's on your mind?",
  "That sounds challenging. Remember, it's okay to take things one step at a time. What would feel most helpful right now?",
  "I hear you. Your feelings are valid. Let's explore some strategies that might help you manage this situation.",
  "Thank you for sharing that with me. It takes courage to open up. How long have you been experiencing this?",
  "I appreciate your honesty. Based on what you've shared, here are a few things that might help: practicing mindfulness, maintaining a consistent routine, and reaching out to your support network.",
  "That's a great observation about yourself. Self-awareness is an important step. Would you like to discuss some coping techniques?",
  "I'm here for you. Let's work through this together. What part of this feels most overwhelming right now?",
  "It sounds like you're making progress, even if it doesn't always feel that way. Small steps count. What would you like to focus on today?",
];

export default function ChatPage() {
  const { theme, definition } = useDisease();
  const [messages, setMessages] = useState(getChatMessages());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = (content: string) => {
    const userMsg = {
      id: `msg_${Date.now()}_user`,
      role: 'user' as const,
      content,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);

    setTimeout(() => {
      const agentMsg = {
        id: `msg_${Date.now()}_agent`,
        role: 'agent' as const,
        content: staticResponses[Math.floor(Math.random() * staticResponses.length)],
        timestamp: new Date().toISOString(),
      };
      addChatMessage(agentMsg);
      setMessages(getChatMessages());
    }, 1000);

    setMessages(getChatMessages());
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <DashboardHeader
        title="Chat Space"
        subtitle="Talk to Lumina, your AI companion"
      />

      <div className="flex-1 bg-white rounded-2xl border border-[#2c3e3b]/5 flex flex-col overflow-hidden">
        <div
          className="flex items-center gap-3 px-6 py-4 border-b border-[#2c3e3b]/5"
          style={{ backgroundColor: `${theme.primary}08` }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: theme.primary }}
          >
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#2c3e3b]">Lumina</p>
            <p className="text-xs text-[#2c3e3b]/40">
              {definition.fullName} specialist
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-[#2c3e3b]/40">Online</span>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${theme.primary}15` }}
              >
                <Brain className="w-8 h-8" style={{ color: theme.primary }} />
              </div>
              <h3 className="text-lg font-semibold text-[#2c3e3b] mb-2">
                Start a conversation
              </h3>
              <p className="text-sm text-[#2c3e3b]/40 max-w-sm">
                Lumina is here to support you. Share what&apos;s on your mind,
                ask questions, or just chat.
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}
        </div>

        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
