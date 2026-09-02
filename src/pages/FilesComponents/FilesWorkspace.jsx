import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import FileGridCard from './FileGridCard';
import FileListRow from './FileListRow';
import FolderCard from './FolderCard';

export default function FilesWorkspace({ files, folders, viewMode, activeFolder, onFolderClick, onBackFolder, onStar, onPreview }) {
  // If inside a folder, show only that folder's files
  const currentFolder = activeFolder ? folders.find(f => f.id === activeFolder) : null;
  const visibleFiles = activeFolder ? files.filter(f => f.folder === activeFolder) : files.filter(f => !f.folder);
  const visibleFolders = activeFolder ? [] : folders;

  const isEmpty = visibleFiles.length === 0 && visibleFolders.length === 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      {activeFolder && currentFolder && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm"
        >
          <button onClick={onBackFolder} className="flex items-center gap-1.5 text-(--text-muted) hover:text-(--text-primary) transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            All Files
          </button>
          <ChevronRight size={14} className="text-(--text-muted)" />
          <span className="font-semibold text-(--text-primary) flex items-center gap-1.5">
            <span>{currentFolder.icon}</span> {currentFolder.name}
          </span>
        </motion.div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] text-[color:oklch(0.58_0.22_var(--accent-hue))] flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
          </div>
          <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>No files found</h3>
          <p className="text-sm text-(--text-muted) max-w-xs">Try changing your filters or upload a new file to get started.</p>
        </div>
      )}

      {/* Folders section (only at root) */}
      {visibleFolders.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-3 px-1">Folders</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {visibleFolders.map((folder, i) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                fileCount={files.filter(f => f.folder === folder.id).length}
                onClick={onFolderClick}
                index={i}
              />
            ))}
          </div>
        </div>
      )}

      {/* Files section */}
      {visibleFiles.length > 0 && (
        <div>
          {!activeFolder && visibleFolders.length > 0 && (
            <h3 className="text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-3 px-1">Files</h3>
          )}

          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                {visibleFiles.map((file, i) => (
                  <FileGridCard key={file.id} file={file} onStar={onStar} onPreview={onPreview} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-(--bg-glass) backdrop-blur-xl border border-(--border-default) rounded-2xl divide-y divide-(--border-default) overflow-hidden"
              >
                {visibleFiles.map((file, i) => (
                  <FileListRow key={file.id} file={file} onStar={onStar} onPreview={onPreview} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
