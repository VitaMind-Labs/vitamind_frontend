'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useDisease } from '@/lib/disease-context';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState('');
  const { theme } = useDisease();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 p-4 bg-white border-t border-[#2c3e3b]/5"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 h-11 px-4 rounded-xl border border-[#2c3e3b]/10 bg-[#f0f0f0] text-[#2c3e3b] text-sm focus:outline-none focus:ring-2 focus:ring-[#518591]/30 focus:border-[#518591] transition-all"
        placeholder="Type your message..."
      />
      <button
        type="submit"
        disabled={!input.trim()}
        className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-30"
        style={{ backgroundColor: theme.primary }}
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
