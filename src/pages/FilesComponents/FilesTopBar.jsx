import { motion } from 'framer-motion';
import { Search, Upload, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const SORT_OPTIONS = [
  { id: 'recent', label: 'Recent' },
  { id: 'name', label: 'Name' },
  { id: 'size', label: 'Size' },
  { id: 'downloads', label: 'Popular' },
];

export default function FilesTopBar({ searchQuery, onSearchChange, activeSort, onSortChange, viewMode, onViewChange, onUpload, fileCount }) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Resource Hub
          </h1>
          <p className="text-sm text-(--text-secondary) mt-1">
            {fileCount} resources · Your academic memory
          </p>
        </div>
        <Button variant="primary" onClick={onUpload} className="shrink-0 shadow-(--shadow-glow)">
          <Upload size={18} className="mr-2" /> Upload Files
        </Button>
      </div>

      {/* Controls Row */}
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

        {/* View toggle + Search */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex bg-(--bg-elevated) rounded-lg border border-(--border-default) p-0.5">
            <button
              onClick={() => onViewChange('grid')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))]' : 'text-(--text-muted) hover:text-(--text-primary)'}`}
              aria-label="Grid view"
            >
              <Grid3X3 size={14} />
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))]' : 'text-(--text-muted) hover:text-(--text-primary)'}`}
              aria-label="List view"
            >
              <List size={14} />
            </button>
          </div>

          <div className="relative w-full sm:w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-(--bg-elevated) border border-(--border-default) rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[color:oklch(0.58_0.22_var(--accent-hue))] transition-colors"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
