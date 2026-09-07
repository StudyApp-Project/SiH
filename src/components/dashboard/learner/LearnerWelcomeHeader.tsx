'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface LearnerWelcomeHeaderProps {
  name: string;
  isHindi?: boolean;
}

export function LearnerWelcomeHeader({ name, isHindi = false }: LearnerWelcomeHeaderProps) {
  const t = useTranslations('learnerHome.welcome');

  // Simple time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('greetingMorning');
    if (hour < 17) return t('greetingAfternoon');
    return t('greetingEvening');
  };

  const firstName = name.trim().split(' ')[0] || name;

  return (
    <div className="flex flex-col gap-1 pb-2">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d1f17] tracking-tight">
          {getGreeting()}, {firstName} 👋
        </h1>
      </div>
      <p className="text-xs sm:text-sm text-[#8C5B3E] font-medium">
        {t('subtitle')}
      </p>
    </div>
  );
}
