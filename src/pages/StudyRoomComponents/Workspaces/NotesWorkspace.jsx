import { useState } from 'react';
import { Bold, Italic, List, CheckSquare, Sparkles, Share2, Plus } from 'lucide-react';
import { useRoom } from '../../../contexts/RoomContext';
import { Avatar } from '../../../components/ui/Avatar';

export default function NotesWorkspace() {
  const { activeRoom, activeClassroom } = useRoom();
  const [content, setContent] = useState('');

  if (!activeClassroom) return null;

  return (
    <div className="flex flex-col h-full bg-(--bg-primary)">
      {/* Topbar */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-(--border-default) flex flex-wrap items-center justify-between gap-3 shrink-0 bg-(--bg-elevated)/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-lg">{activeClassroom.name}</h2>
          <div className="h-4 w-px bg-(--border-default)"></div>
          <div className="flex -space-x-2">
            <Avatar initials="S" size="sm" className="border-2 border-(--bg-primary)" />
            <Avatar initials="A" size="sm" className="border-2 border-(--bg-primary)" />
          </div>
          <span className="text-xs text-(--text-muted) whitespace-nowrap">{activeClassroom.activeCursors || 2} editing</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => alert("Create note functionality will be available in Phase 8.")} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-(--bg-glass) border border-(--border-subtle) text-xs font-bold hover:bg-(--bg-elevated) transition-colors">
            <Plus size={14} /> New Note
          </button>
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-500 text-xs font-bold hover:bg-purple-500/20 transition-colors">
            <Sparkles size={14} /> AI Summarize
          </button>
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] text-[color:oklch(0.58_0.22_var(--accent-hue))] text-xs font-bold hover:bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.2)] transition-colors">
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 sm:px-6 py-2 border-b border-(--border-subtle) flex items-center gap-1 shrink-0 bg-(--bg-glass)">
        <button className="p-1.5 rounded hover:bg-(--bg-elevated) text-(--text-secondary)"><Bold size={16} /></button>
        <button className="p-1.5 rounded hover:bg-(--bg-elevated) text-(--text-secondary)"><Italic size={16} /></button>
        <div className="w-px h-4 bg-(--border-default) mx-2"></div>
        <button className="p-1.5 rounded hover:bg-(--bg-elevated) text-(--text-secondary)"><List size={16} /></button>
        <button className="p-1.5 rounded hover:bg-(--bg-elevated) text-(--text-secondary)"><CheckSquare size={16} /></button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-12 lg:px-24">
        <div className="max-w-3xl mx-auto w-full relative">
          
          {/* Simulated Collaborative Cursors */}
          <div className="absolute top-10 left-1/4 z-10 flex flex-col items-start pointer-events-none animate-pulse">
            <svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.999955 0.380482C0.68369 0.0526978 0.155823 0.288277 0.165215 0.748366L0.596001 21.849C0.605393 22.3091 1.18957 22.4578 1.45892 22.0683L5.35242 16.4357C5.46747 16.2693 5.65683 16.166 5.8596 16.1593L11.5173 15.9698C11.9961 15.9538 12.1643 15.3409 11.7831 15.0506L0.999955 0.380482Z" fill="#F59E0B"/>
            </svg>
            <div className="bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm mt-1 font-medium">Sarah</div>
          </div>

          <h1 className="text-4xl font-bold mb-6 text-(--text-primary) outline-none" contentEditable suppressContentEditableWarning>
            Algorithm Notes
          </h1>
          <p className="text-lg text-(--text-secondary) leading-relaxed outline-none min-h-[500px]" contentEditable suppressContentEditableWarning>
            Start typing your notes here...
          </p>
        </div>
      </div>
    </div>
  );
}