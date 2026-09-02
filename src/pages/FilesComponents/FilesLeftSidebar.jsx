import {
  FolderOpen, Clock, ArrowDownToLine, Star, Users, Upload, BookOpen,
  Sparkles, FileText, Layers, Code, Atom, Beaker, BrainCircuit,
  Calculator, GraduationCap, FolderPlus
} from 'lucide-react';

const NAV_SECTIONS = [
  { id: 'all', label: 'All Files', icon: FolderOpen },
  { id: 'recent', label: 'Recent', icon: Clock },
  { id: 'downloads', label: 'Downloads', icon: ArrowDownToLine },
  { id: 'starred', label: 'Starred', icon: Star },
  { id: 'shared', label: 'Shared With Me', icon: Users },
  { id: 'uploaded', label: 'My Uploads', icon: Upload },
  { id: 'classroom', label: 'Classroom Resources', icon: BookOpen },
  { id: 'ai', label: 'AI Generated', icon: Sparkles },
  { id: 'flashcard', label: 'Flashcard Sources', icon: Layers },
  { id: 'quiz', label: 'Quiz Assets', icon: FileText },
];

const CATEGORIES = [
  { id: 'DSA', label: 'DSA', icon: Code },
  { id: 'Physics', label: 'Physics', icon: Atom },
  { id: 'Chemistry', label: 'Chemistry', icon: Beaker },
  { id: 'AI/ML', label: 'AI / ML', icon: BrainCircuit },
  { id: 'Maths', label: 'Maths', icon: Calculator },
  { id: 'Coding', label: 'Coding', icon: Code },
  { id: 'Interview Prep', label: 'Interview Prep', icon: GraduationCap },
];

export default function FilesLeftSidebar({ activeFilter, onFilterChange, activeCategory, onCategoryChange, folders, onFolderClick, fileCounts }) {
  return (
    <div className="h-full flex flex-col bg-(--bg-elevated) border-r border-(--border-default) overflow-y-auto no-scrollbar">
      {/* Navigation */}
      <div className="p-3 space-y-0.5">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
          Browse
        </div>
        {NAV_SECTIONS.map(item => {
          const Icon = item.icon;
          const isActive = activeFilter === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onFilterChange(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))] shadow-(--shadow-glow) border border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.3)]'
                  : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-glass) border border-transparent'
              }`}
            >
              <Icon size={16} />
              <span className="flex-1 text-left">{item.label}</span>
              {fileCounts?.[item.id] > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-[color:oklch(0.58_0.22_var(--accent-hue))] text-white' : 'bg-(--bg-glass) text-(--text-muted)'
                }`}>{fileCounts[item.id]}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="mx-4 my-2 h-px bg-(--border-default)" />

      {/* Folders */}
      {folders?.length > 0 && (
        <div className="p-3 space-y-0.5">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
            Folders
          </div>
          {folders.map(folder => (
            <button
              key={folder.id}
              onClick={() => onFolderClick?.(folder.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-glass) transition-all border border-transparent"
            >
              <span className="text-base">{folder.icon}</span>
              <span className="flex-1 text-left truncate">{folder.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="mx-4 my-2 h-px bg-(--border-default)" />

      {/* Categories */}
      <div className="p-3 space-y-0.5 flex-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
          Subjects
        </div>
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(isActive ? null : cat.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))]'
                  : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-glass)'
              }`}
            >
              <Icon size={14} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
