import { motion } from 'framer-motion';
import { Hash, FileText, Video, LayoutList, ChevronLeft, Settings, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getIcon = (type) => {
  switch(type) {
    case 'discussion': return <Hash size={16} />;
    case 'notes': return <FileText size={16} />;
    case 'live': return <Video size={16} />;
    case 'project': return <LayoutList size={16} />;
    default: return <Hash size={16} />;
  }
};

export default function LeftSidebar({ room, activeClassroomId, onSelectClassroom, onBack }) {
  if (!room) return null;

  return (
    <div className="w-full h-full flex flex-col bg-(--bg-elevated)/50 backdrop-blur-xl border-r border-(--border-default) overflow-hidden">
      {/* Room Header */}
      <div className="p-4 border-b border-(--border-default) shrink-0">
        <button onClick={onBack} className="flex items-center gap-1 text-xs font-semibold text-(--text-muted) hover:text-(--text-primary) transition-colors mb-3">
          <ChevronLeft size={14} /> Back to Campus
        </button>
        <h2 className="text-xl font-bold truncate group cursor-pointer flex items-center justify-between" style={{ fontFamily: 'var(--font-display)' }}>
          {room.name}
          <Settings size={16} className="text-(--text-muted) opacity-0 group-hover:opacity-100 transition-opacity" />
        </h2>
      </div>

      {/* Classroom List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 no-scrollbar">
        <div className="text-xs font-bold uppercase tracking-wider text-(--text-muted) px-2 mb-2">Classrooms</div>
        
        {room.classrooms.map(cr => {
          const isActive = cr.id === activeClassroomId;
          return (
            <button
              key={cr.id}
              onClick={() => onSelectClassroom(cr.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all group ${
                isActive 
                  ? 'bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))] shadow-(--shadow-glow)' 
                  : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-glass)'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className={`${isActive ? 'text-[color:oklch(0.58_0.22_var(--accent-hue))]' : 'text-(--text-muted) group-hover:text-(--text-primary)'}`}>
                  {getIcon(cr.type)}
                </span>
                <span className="truncate">{cr.name}</span>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center gap-2 shrink-0">
                {cr.typing && cr.typing.length > 0 && !isActive && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-(--text-muted) animate-bounce" />
                    <span className="w-1 h-1 rounded-full bg-(--text-muted) animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 rounded-full bg-(--text-muted) animate-bounce" style={{ animationDelay: '300ms' }} />
                  </motion.div>
                )}
                {cr.unread > 0 && !isActive && (
                  <span className="min-w-[1.25rem] h-5 px-1 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center">
                    {cr.unread > 9 ? '9+' : cr.unread}
                  </span>
                )}
                {cr.type === 'live' && cr.activeParticipants > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* User Profile Mini */}
      <div className="p-3 border-t border-(--border-default) shrink-0 bg-(--bg-glass)">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[color:oklch(0.58_0.22_var(--accent-hue))] to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              YOU
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-(--bg-elevated) rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold truncate">You</div>
            <div className="text-[10px] text-(--text-muted) truncate">Ready to study</div>
          </div>
        </div>
      </div>
    </div>
  );
}