/**
 * src/app/(app)/assessment/[id]/AssessmentTimer.tsx
 *
 * Timer display: Shows remaining time, visual warning when <2 min
 */

import { Clock, AlertTriangle } from 'lucide-react';

interface AssessmentTimerProps {
  timeRemaining: number; // in seconds
}

export default function AssessmentTimer({ timeRemaining }: AssessmentTimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isWarning = timeRemaining < 120; // < 2 minutes

  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
        isWarning
          ? 'border-destructive bg-destructive/5 text-destructive'
          : 'border-border bg-secondary text-foreground'
      }`}
    >
      {isWarning ? (
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      ) : (
        <Clock className="w-5 h-5 flex-shrink-0" />
      )}
      <span className="font-mono font-semibold text-lg">{timeString}</span>
    </div>
  );
}
