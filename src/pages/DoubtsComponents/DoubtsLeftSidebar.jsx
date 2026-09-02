import { motion } from 'framer-motion';
import {
  Home, TrendingUp, Users, CheckCircle2, HelpCircle,
  ArrowUp, Sparkles, Bookmark, User,
  Code, Atom, Beaker, BrainCircuit, Calculator,
  FileText, GraduationCap, Trophy
} from 'lucide-react';

const NAV_SECTIONS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'following', label: 'Following', icon: Users },
  { id: 'solved', label: 'Solved', icon: CheckCircle2 },
  { id: 'unanswered', label: 'Unanswered', icon: HelpCircle },
  { id: 'top', label: 'Most Upvoted', icon: ArrowUp },
  { id: 'ai', label: 'AI Assisted', icon: Sparkles },
  { id: 'saved', label: 'Saved Doubts', icon: Bookmark },
  { id: 'mine', label: 'My Doubts', icon: User },
];

const CATEGORIES = [
  { id: 'DSA', label: 'DSA', icon: Code, count: 3 },
  { id: 'Physics', label: 'Physics', icon: Atom, count: 1 },
  { id: 'Chemistry', label: 'Chemistry', icon: Beaker, count: 1 },
  { id: 'AI/ML', label: 'AI / ML', icon: BrainCircuit, count: 1 },
  { id: 'Maths', label: 'Maths', icon: Calculator, count: 2 },
  { id: 'Coding', label: 'Coding', icon: FileText, count: 3 },
  { id: 'Interview Prep', label: 'Interview Prep', icon: GraduationCap, count: 0 },
  { id: 'Competitive', label: 'Competitive', icon: Trophy, count: 0 },
];

export default function DoubtsLeftSidebar({ activeFilter, onFilterChange, activeCategory, onCategoryChange }) {
  return (
    <div className="h-full flex flex-col bg-(--bg-elevated) border-r border-(--border-default) overflow-y-auto no-scrollbar">
      {/* Navigation */}
      <div className="p-3 space-y-0.5">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
          Explore
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
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="mx-4 my-2 h-px bg-(--border-default)" />

      {/* Categories */}
      <div className="p-3 space-y-0.5 flex-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
          Categories
        </div>
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(isActive ? null : cat.id)}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))]'
                  : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-glass)'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={14} />
                {cat.label}
              </span>
              {cat.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-[color:oklch(0.58_0.22_var(--accent-hue))] text-white'
                    : 'bg-(--bg-glass) text-(--text-muted)'
                }`}>
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
