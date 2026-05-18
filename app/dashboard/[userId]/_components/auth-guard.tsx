'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUser, getDisease } from '@/lib/storage';
import { DiseaseType, diseaseDefinitions } from '@/lib/diseases';
import { useDisease } from '@/lib/disease-context';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const { setDisease } = useDisease();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.replace('/auth/signin');
      return;
    }

    if (user.id && user.id !== params.userId) {
      router.replace(`/dashboard/${user.id}/overview`);
      return;
    }

    const storedDisease = getDisease();
    if (storedDisease && storedDisease in diseaseDefinitions) {
      setDisease(storedDisease as DiseaseType);
    } else if (user.disease) {
      setDisease(user.disease);
    }

    setReady(true);
  }, [router, setDisease, params.userId]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0]">
        <div className="w-8 h-8 border-2 border-[#518591] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
