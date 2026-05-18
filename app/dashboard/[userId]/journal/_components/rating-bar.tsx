'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useDisease } from '@/lib/disease-context';

interface RatingBarProps {
  rating: number;
  onRate: (r: number) => void;
}

export function RatingBar({ rating, onRate }: RatingBarProps) {
  const { theme } = useDisease();
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-[#2c3e3b]/60">
        Rate your day with Lumina:
      </span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onRate(star)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className="w-6 h-6 transition-colors"
              fill={star <= (hovered || rating) ? theme.accent : 'none'}
              style={{
                color:
                  star <= (hovered || rating) ? theme.accent : '#2c3e3b20',
              }}
            />
          </button>
        ))}
      </div>
      {rating > 0 && (
        <span className="text-sm font-semibold" style={{ color: theme.accent }}>
          {rating}/5
        </span>
      )}
    </div>
  );
}
