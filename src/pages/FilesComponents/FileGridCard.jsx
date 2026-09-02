import { motion } from 'framer-motion';
import { FileText, Image, Video, FileBox, File, Code, Link as LinkIcon, Star, Download, MoreVertical, ArrowDownToLine } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';

const iconMap = { pdf: FileText, image: Image, video: Video, doc: FileText, code: Code, link: LinkIcon, archive: FileBox, default: File };
const colorMap = {
  pdf: { bg: 'bg-red-500/10', text: 'text-red-500', accent: 'from-red-500/20 to-red-500/5' },
  image: { bg: 'bg-blue-500/10', text: 'text-blue-500', accent: 'from-blue-500/20 to-blue-500/5' },
  video: { bg: 'bg-purple-500/10', text: 'text-purple-500', accent: 'from-purple-500/20 to-purple-500/5' },
  doc: { bg: 'bg-sky-500/10', text: 'text-sky-500', accent: 'from-sky-500/20 to-sky-500/5' },
  code: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', accent: 'from-emerald-500/20 to-emerald-500/5' },
  link: { bg: 'bg-teal-500/10', text: 'text-teal-500', accent: 'from-teal-500/20 to-teal-500/5' },
  archive: { bg: 'bg-yellow-600/10', text: 'text-yellow-600', accent: 'from-yellow-600/20 to-yellow-600/5' },
  default: { bg: 'bg-(--bg-glass)', text: 'text-(--text-muted)', accent: 'from-(--bg-glass) to-transparent' },
};

const sourceIcons = { 'study-room': '📥', 'upload': '📤', 'ai-generated': '🤖', 'flashcard': '🃏', 'quiz': '📝' };

export default function FileGridCard({ file, onStar, onPreview, index = 0 }) {
  const Icon = iconMap[file.type] || iconMap.default;
  const colors = colorMap[file.type] || colorMap.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onClick={() => onPreview?.(file.id)}
      className="group relative bg-(--bg-glass) backdrop-blur-xl border border-(--border-default) rounded-2xl overflow-hidden hover:shadow-(--shadow-glow) hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Hover glow orb */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[color:oklch(0.58_0.22_var(--accent-hue))] opacity-0 blur-[60px] group-hover:opacity-10 transition-opacity duration-500 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Preview area */}
      <div className={`relative h-28 bg-gradient-to-b ${colors.accent} flex items-center justify-center`}>
        <Icon size={36} className={`${colors.text} opacity-60`} />
        {/* Star */}
        <button
          onClick={(e) => { e.stopPropagation(); onStar?.(file.id); }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg transition-all ${
            file.isStarred
              ? 'text-yellow-500 bg-yellow-500/10'
              : 'text-(--text-muted) opacity-0 group-hover:opacity-100 hover:bg-(--bg-elevated)'
          }`}
          aria-label="Star file"
        >
          <Star size={14} fill={file.isStarred ? 'currentColor' : 'none'} />
        </button>
        {/* Type badge */}
        <span className={`absolute bottom-2.5 left-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${colors.bg} ${colors.text}`}>
          {file.type}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col relative z-10">
        <h4 className="text-sm font-semibold text-(--text-primary) truncate mb-1 group-hover:text-[color:oklch(0.58_0.22_var(--accent-hue))] transition-colors" title={file.name}>
          {file.name}
        </h4>
        <p className="text-[10px] text-(--text-muted) mb-3">{file.size} · {file.category}</p>

        {/* Source context */}
        {file.source && (
          <div className="text-[10px] text-(--text-secondary) mb-3 flex items-start gap-1.5 leading-snug">
            <span className="shrink-0">{sourceIcons[file.source.type] || '📄'}</span>
            <span className="line-clamp-2">
              {file.source.type === 'study-room' && `From ${file.source.classroomName} · ${file.source.sharedBy}`}
              {file.source.type === 'ai-generated' && file.source.action}
              {file.source.type === 'flashcard' && file.source.action}
              {file.source.type === 'quiz' && file.source.action}
              {file.source.type === 'upload' && 'Manually uploaded'}
            </span>
          </div>
        )}

        {/* Bottom row */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-(--border-default)">
          <div className="flex items-center gap-2">
            <Avatar initials={file.owner.initials} size="xs" />
            <span className="text-[10px] text-(--text-muted)">{file.createdAt}</span>
          </div>
          <span className="text-[10px] text-(--text-muted) flex items-center gap-1">
            <ArrowDownToLine size={10} /> {file.downloadCount}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
