import { motion } from 'framer-motion';
import { useRoom } from '../../../contexts/RoomContext';
import { Plus, GripVertical, CheckCircle2, Clock, CheckSquare } from 'lucide-react';
import { Avatar } from '../../../components/ui/Avatar';

export default function ProjectWorkspace() {
  const { activeRoom, activeClassroom } = useRoom();

  if (!activeClassroom) return null;

  return (
    <div className="flex flex-col h-full bg-(--bg-primary) overflow-hidden">
      {/* Topbar */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-(--border-default) flex flex-wrap items-center justify-between gap-3 shrink-0 bg-(--bg-elevated)/50 backdrop-blur-md">
        <div>
          <h2 className="font-bold text-lg">{activeClassroom.name}</h2>
          <p className="text-xs text-(--text-muted)">Project tasks and milestones</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-(--bg-glass) border border-(--border-subtle)">
            <CheckSquare size={14} className="text-(--text-muted)" />
            <span className="text-xs font-medium text-(--text-primary)">64% Completed</span>
          </div>
          <button onClick={() => alert("Task creation functionality will be available in Phase 8.")} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[color:oklch(0.58_0.22_var(--accent-hue))] text-white text-xs font-bold hover:opacity-90 transition-opacity">
            <Plus size={14} /> New Task
          </button>
        </div>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 overflow-x-auto p-3 sm:p-6 flex gap-4 sm:gap-6">
        {/* TO DO Column */}
        <div className="w-72 sm:w-80 shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-sm text-(--text-secondary) flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span> To Do
            </h3>
            <span className="text-xs font-bold bg-(--bg-elevated) px-2 py-0.5 rounded-md text-(--text-muted)">3</span>
          </div>
          
          <div className="bg-(--bg-glass) border border-(--border-subtle) rounded-2xl p-4 shadow-sm group cursor-grab">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-red-500 bg-red-500/10 px-2 py-0.5 rounded">High Priority</span>
              <GripVertical size={14} className="text-(--text-muted) opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="font-medium text-sm mb-4">Design database schema for user profiles</p>
            <div className="flex items-center justify-between">
              <Avatar initials="A" size="sm" />
              <span className="flex items-center gap-1 text-xs text-(--text-muted)"><Clock size={12} /> Today</span>
            </div>
          </div>
          
          <div className="bg-(--bg-glass) border border-(--border-subtle) rounded-2xl p-4 shadow-sm group cursor-grab">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">Feature</span>
            </div>
            <p className="font-medium text-sm mb-4">Implement dark mode toggle</p>
            <div className="flex items-center justify-between">
              <div className="w-6 h-6 rounded-full border border-dashed border-(--border-strong) flex items-center justify-center text-(--text-muted)"><Plus size={12} /></div>
              <span className="flex items-center gap-1 text-xs text-(--text-muted)"><Clock size={12} /> Next week</span>
            </div>
          </div>
        </div>

        {/* IN PROGRESS Column */}
        <div className="w-72 sm:w-80 shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-sm text-(--text-secondary) flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[color:oklch(0.58_0.22_var(--accent-hue))] animate-pulse"></span> In Progress
            </h3>
            <span className="text-xs font-bold bg-(--bg-elevated) px-2 py-0.5 rounded-md text-(--text-muted)">1</span>
          </div>
          
          <div className="bg-(--bg-glass) border border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.4)] rounded-2xl p-4 shadow-(--shadow-glow) group cursor-grab relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[color:oklch(0.58_0.22_var(--accent-hue))]"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">Core</span>
            </div>
            <p className="font-medium text-sm mb-4">Build the polymorphic workspace switching logic</p>
            <div className="flex items-center justify-between">
              <Avatar initials="S" size="sm" />
              <span className="flex items-center gap-1 text-xs font-semibold text-[color:oklch(0.58_0.22_var(--accent-hue))]">Active now</span>
            </div>
          </div>
        </div>

        {/* COMPLETED Column */}
        <div className="w-72 sm:w-80 shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-sm text-(--text-secondary) flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Completed
            </h3>
            <span className="text-xs font-bold bg-(--bg-elevated) px-2 py-0.5 rounded-md text-(--text-muted)">12</span>
          </div>
          
          <div className="bg-(--bg-elevated) border border-(--border-default) rounded-2xl p-4 opacity-60">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={14} className="text-green-500" />
              <p className="font-medium text-sm line-through text-(--text-muted)">Setup Vite project</p>
            </div>
            <div className="flex items-center justify-between pl-6">
              <Avatar initials="A" size="sm" className="grayscale" />
              <span className="text-[10px] text-(--text-muted)">Oct 24</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}