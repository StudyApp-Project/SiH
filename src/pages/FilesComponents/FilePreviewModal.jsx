import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Star, ExternalLink, FileText, Image, Video, Code, File, Link as LinkIcon, FileBox, Sparkles, BookOpen, MessageSquare } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button, IconButton } from '../../components/ui/Button';

const iconMap = { pdf: FileText, image: Image, video: Video, doc: FileText, code: Code, link: LinkIcon, archive: FileBox, default: File };
const colorMap = {
  pdf: 'text-red-500 bg-red-500/10', image: 'text-blue-500 bg-blue-500/10',
  video: 'text-purple-500 bg-purple-500/10', doc: 'text-sky-500 bg-sky-500/10',
  code: 'text-emerald-500 bg-emerald-500/10', default: 'text-(--text-muted) bg-(--bg-glass)',
};
const sourceLabels = { 'study-room': 'Study Room', 'upload': 'Manual Upload', 'ai-generated': 'AI Generated', 'flashcard': 'Flashcard Source', 'quiz': 'Quiz Asset' };

export default function FilePreviewModal({ isOpen, file, onClose, onStar, onDownload }) {
  if (!file) return null;
  const Icon = iconMap[file.type] || iconMap.default;
  const color = colorMap[file.type] || colorMap.default;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-(--bg-elevated) border border-(--border-strong) rounded-2xl shadow-(--shadow-lg) overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-(--border-default) shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold truncate" style={{ fontFamily: 'var(--font-display)' }}>{file.name}</h2>
                  <p className="text-[10px] text-(--text-muted)">{file.size} · {file.type.toUpperCase()} · {file.createdAt}</p>
                </div>
              </div>
              <IconButton size="sm" onClick={onClose} aria-label="Close">
                <X size={18} />
              </IconButton>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-5 space-y-5">
              {/* Preview placeholder */}
              <div className={`h-48 rounded-xl flex items-center justify-center ${color} border border-(--border-default)`}>
                <div className="text-center">
                  <Icon size={48} className="mx-auto mb-2 opacity-40" />
                  <p className="text-xs text-(--text-muted)">Preview for .{file.type} files</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="primary" className="flex-1 shadow-(--shadow-glow)" onClick={() => onDownload?.(file.id)}>
                  <Download size={16} className="mr-2" /> Download
                </Button>
                <Button variant="secondary" onClick={() => onStar?.(file.id)}>
                  <Star size={16} className="mr-2" fill={file.isStarred ? 'currentColor' : 'none'} />
                  {file.isStarred ? 'Starred' : 'Star'}
                </Button>
              </div>

              {/* Source Context */}
              <div className="bg-(--bg-glass) border border-(--border-default) rounded-xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-3">Source</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="accent" size="sm">{sourceLabels[file.source?.type] || 'Unknown'}</Badge>
                  </div>
                  {file.source?.action && (
                    <p className="text-(--text-secondary) text-xs">{file.source.action}</p>
                  )}
                  {file.source?.roomName && (
                    <p className="text-xs text-(--text-secondary) flex items-center gap-1.5">
                      <BookOpen size={12} /> {file.source.roomName} → {file.source.classroomName}
                    </p>
                  )}
                  {file.source?.sharedBy && (
                    <p className="text-xs text-(--text-secondary)">Shared by <span className="font-semibold text-(--text-primary)">{file.source.sharedBy}</span></p>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-(--bg-glass) border border-(--border-default) rounded-xl p-3">
                  <p className="text-[10px] text-(--text-muted) uppercase tracking-wider mb-1">Owner</p>
                  <div className="flex items-center gap-2">
                    <Avatar initials={file.owner.initials} size="xs" />
                    <span className="text-xs font-medium">{file.owner.name}</span>
                  </div>
                </div>
                <div className="bg-(--bg-glass) border border-(--border-default) rounded-xl p-3">
                  <p className="text-[10px] text-(--text-muted) uppercase tracking-wider mb-1">Downloads</p>
                  <p className="text-sm font-bold">{file.downloadCount}</p>
                </div>
                <div className="bg-(--bg-glass) border border-(--border-default) rounded-xl p-3">
                  <p className="text-[10px] text-(--text-muted) uppercase tracking-wider mb-1">Category</p>
                  <p className="text-xs font-medium">{file.category}</p>
                </div>
                <div className="bg-(--bg-glass) border border-(--border-default) rounded-xl p-3">
                  <p className="text-[10px] text-(--text-muted) uppercase tracking-wider mb-1">Last Accessed</p>
                  <p className="text-xs font-medium">{file.lastAccessedAt}</p>
                </div>
              </div>

              {/* Related Content */}
              {(file.related?.doubts?.length > 0 || file.related?.rooms?.length > 0) && (
                <div className="bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.05)] border border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] rounded-xl p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[color:oklch(0.58_0.22_var(--accent-hue))] mb-2 flex items-center gap-1.5">
                    <Sparkles size={12} /> Ecosystem Connections
                  </h4>
                  <div className="space-y-1.5">
                    {file.related.doubts?.length > 0 && (
                      <p className="text-xs text-(--text-secondary) flex items-center gap-1.5">
                        <MessageSquare size={11} /> Linked to {file.related.doubts.length} {file.related.doubts.length === 1 ? 'doubt' : 'doubts'}
                      </p>
                    )}
                    {file.related.rooms?.length > 0 && (
                      <p className="text-xs text-(--text-secondary) flex items-center gap-1.5">
                        <BookOpen size={11} /> Used in {file.related.rooms.length} study {file.related.rooms.length === 1 ? 'room' : 'rooms'}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
