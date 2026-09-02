import { motion } from 'framer-motion';
import { Folder, ChevronRight } from 'lucide-react';

const FOLDER_COLORS = {
  accent: 'from-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.2)] to-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.05)]',
  green: 'from-green-500/20 to-green-500/5',
  red: 'from-red-500/20 to-red-500/5',
  purple: 'from-purple-500/20 to-purple-500/5',
  blue: 'from-blue-500/20 to-blue-500/5',
};

export default function FolderCard({ folder, fileCount = 0, onClick, index = 0 }) {
  const gradient = FOLDER_COLORS[folder.color] || FOLDER_COLORS.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      onClick={() => onClick?.(folder.id)}
      className="group relative bg-(--bg-glass) backdrop-blur-xl border border-(--border-default) rounded-2xl p-4 hover:shadow-(--shadow-glow) hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 pointer-events-none`} />

      <div className="relative z-10 flex items-center gap-3">
        <div className="text-2xl">{folder.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold truncate group-hover:text-[color:oklch(0.58_0.22_var(--accent-hue))] transition-colors">{folder.name}</h4>
          <p className="text-[10px] text-(--text-muted)">{fileCount} {fileCount === 1 ? 'file' : 'files'}</p>
        </div>
        <ChevronRight size={16} className="text-(--text-muted) opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  );
}
