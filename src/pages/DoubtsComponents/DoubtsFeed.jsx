import { AnimatePresence } from 'framer-motion';
import DoubtCard from './DoubtCard';

export default function DoubtsFeed({ doubts, userVotes, savedDoubts, onVote, onSave, onSelect }) {
  if (doubts.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] text-[color:oklch(0.58_0.22_var(--accent-hue))] flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>No doubts found</h3>
        <p className="text-sm text-(--text-muted) max-w-xs">Try changing your filters or be the first to ask a doubt in this category!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {doubts.map((doubt, index) => (
          <DoubtCard
            key={doubt.id}
            doubt={doubt}
            index={index}
            userVote={userVotes[doubt.id]}
            isSaved={savedDoubts.includes(doubt.id)}
            onVote={onVote}
            onSave={onSave}
            onClick={() => onSelect(doubt.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
