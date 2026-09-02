import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function VoteControls({ upvotes, downvotes = 0, userVote, onVote, size = 'md', vertical = true }) {
  const score = upvotes - downvotes;
  const sizes = {
    sm: { icon: 14, text: 'text-xs', gap: 'gap-0.5', pad: 'p-1' },
    md: { icon: 16, text: 'text-sm', gap: 'gap-1', pad: 'p-1.5' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex ${vertical ? 'flex-col' : 'flex-row'} items-center ${s.gap}`}>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={(e) => { e.stopPropagation(); onVote?.('up'); }}
        className={`${s.pad} rounded-lg transition-colors ${
          userVote === 'up'
            ? 'text-[color:oklch(0.58_0.22_var(--accent-hue))] bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)]'
            : 'text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-elevated)'
        }`}
        aria-label="Upvote"
      >
        <ChevronUp size={s.icon} strokeWidth={2.5} />
      </motion.button>

      <motion.span
        key={score}
        initial={{ scale: 1.3, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`${s.text} font-bold tabular-nums ${
          userVote === 'up' ? 'text-[color:oklch(0.58_0.22_var(--accent-hue))]'
          : userVote === 'down' ? 'text-red-500'
          : 'text-(--text-primary)'
        }`}
      >
        {score}
      </motion.span>

      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={(e) => { e.stopPropagation(); onVote?.('down'); }}
        className={`${s.pad} rounded-lg transition-colors ${
          userVote === 'down'
            ? 'text-red-500 bg-red-500/10'
            : 'text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-elevated)'
        }`}
        aria-label="Downvote"
      >
        <ChevronDown size={s.icon} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}
