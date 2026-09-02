import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const SORT_OPTIONS = [
  { id: 'latest', label: 'Latest' },
  { id: 'top', label: 'Most Upvoted' },
  { id: 'trending', label: 'Trending' },
  { id: 'unanswered', label: 'Unanswered' },
];

export default function DoubtsTopBar({ searchQuery, onSearchChange, activeSort, onSortChange, onAskDoubt, doubtCount }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4"
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Doubt Hub
          </h1>
          <p className="text-sm text-(--text-secondary) mt-1">
            {doubtCount} active discussions · Ask, answer, learn together
          </p>
        </div>
        <Button variant="primary" onClick={onAskDoubt} className="shrink-0 shadow-(--shadow-glow)">
          <Plus size={18} className="mr-2" /> Ask a Doubt
        </Button>
      </div>

      {/* Search + Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-(--bg-glass) backdrop-blur-xl border border-(--border-default) rounded-2xl p-2">
        {/* Sort pills */}
        <div className="flex items-center overflow-x-auto no-scrollbar gap-1 p-0.5 flex-1">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => onSortChange(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeSort === opt.id
                  ? 'bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))] shadow-(--shadow-glow)'
                  : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-elevated)'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56 shrink-0">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)" />
          <input
            type="text"
            placeholder="Search doubts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-(--bg-elevated) border border-(--border-default) rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[color:oklch(0.58_0.22_var(--accent-hue))] transition-colors"
          />
        </div>
      </div>
    </motion.div>
  );
}
