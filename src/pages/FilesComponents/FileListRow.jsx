import { motion } from 'framer-motion';
import { FileText, Image, Video, FileBox, File, Code, Link as LinkIcon, Star, ArrowDownToLine } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';

const iconMap = { pdf: FileText, image: Image, video: Video, doc: FileText, code: Code, link: LinkIcon, archive: FileBox, default: File };
const colorMap = {
  pdf: 'text-red-500 bg-red-500/10', image: 'text-blue-500 bg-blue-500/10',
  video: 'text-purple-500 bg-purple-500/10', doc: 'text-sky-500 bg-sky-500/10',
  code: 'text-emerald-500 bg-emerald-500/10', link: 'text-teal-500 bg-teal-500/10',
  archive: 'text-yellow-600 bg-yellow-600/10', default: 'text-(--text-muted) bg-(--bg-glass)',
};

export default function FileListRow({ file, onStar, onPreview, index = 0 }) {
  const Icon = iconMap[file.type] || iconMap.default;
  const color = colorMap[file.type] || colorMap.default;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      onClick={() => onPreview?.(file.id)}
      className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent hover:border-(--border-default) hover:bg-(--bg-glass) transition-all duration-200 cursor-pointer"
    >
      {/* Icon */}
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={18} />
      </div>

      {/* Name + source */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-(--text-primary) truncate group-hover:text-[color:oklch(0.58_0.22_var(--accent-hue))] transition-colors">{file.name}</h4>
        <p className="text-[10px] text-(--text-muted) truncate">
          {file.source?.type === 'study-room' && `From ${file.source.classroomName}`}
          {file.source?.type === 'ai-generated' && 'AI Generated'}
          {file.source?.type === 'flashcard' && 'Flashcard Source'}
          {file.source?.type === 'quiz' && 'Quiz Asset'}
          {file.source?.type === 'upload' && 'Uploaded'}
        </p>
      </div>

      {/* Category */}
      <span className="hidden sm:inline-flex text-[10px] font-medium px-2 py-0.5 rounded-md bg-(--bg-elevated) border border-(--border-default) text-(--text-muted) shrink-0">
        {file.category}
      </span>

      {/* Size */}
      <span className="text-xs text-(--text-muted) w-16 text-right shrink-0 hidden md:block">{file.size}</span>

      {/* Owner */}
      <div className="hidden lg:flex items-center gap-1.5 shrink-0 w-24">
        <Avatar initials={file.owner.initials} size="xs" />
        <span className="text-[10px] text-(--text-muted) truncate">{file.owner.name}</span>
      </div>

      {/* Date */}
      <span className="text-[10px] text-(--text-muted) w-14 text-right shrink-0 hidden sm:block">{file.createdAt}</span>

      {/* Downloads */}
      <span className="text-[10px] text-(--text-muted) flex items-center gap-1 w-10 justify-end shrink-0">
        <ArrowDownToLine size={10} /> {file.downloadCount}
      </span>

      {/* Star */}
      <button
        onClick={(e) => { e.stopPropagation(); onStar?.(file.id); }}
        className={`p-1 rounded-lg transition-all shrink-0 ${
          file.isStarred ? 'text-yellow-500' : 'text-(--text-muted) opacity-0 group-hover:opacity-100'
        }`}
        aria-label="Star"
      >
        <Star size={13} fill={file.isStarred ? 'currentColor' : 'none'} />
      </button>
    </motion.div>
  );
}
