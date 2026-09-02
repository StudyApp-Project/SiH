import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, Search, MoreVertical, X } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { useState } from 'react';
import RoomChat from './RoomChat';

export default function RightSidebar({ room, isMobile, onClose }) {
  const [activeTab, setActiveTab] = useState('chat'); // chat, members, ai

  if (!room) return null;

  return (
    <div className="w-full h-full flex flex-col bg-(--bg-elevated)/50 backdrop-blur-xl border-l border-(--border-default) overflow-hidden relative">
      {/* Mobile Close */}
      {isMobile && (
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg bg-(--bg-glass) hover:bg-(--border-default) z-10">
          <X size={18} />
        </button>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-(--border-default) shrink-0">
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'chat' ? 'bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))]' : 'text-(--text-muted) hover:text-(--text-primary)'}`}
        >
          Chat
        </button>
        <button 
          onClick={() => setActiveTab('members')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'members' ? 'bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))]' : 'text-(--text-muted) hover:text-(--text-primary)'}`}
        >
          Members
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${activeTab === 'ai' ? 'bg-purple-500/15 text-purple-400' : 'text-(--text-muted) hover:text-(--text-primary)'}`}
        >
          <Sparkles size={12} /> AI
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'chat' && (
            <motion.div key="chat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0">
              <RoomChat roomName={room.name} />
            </motion.div>
          )}

          {activeTab === 'members' && (
            <motion.div key="members" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 overflow-y-auto p-4 space-y-6 no-scrollbar">
              {/* Online */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-(--text-muted) mb-3">Online — {room.members.filter(m => m.status === 'online').length}</div>
                <div className="space-y-3">
                  {room.members.filter(m => m.status === 'online').map(m => (
                    <div key={m.id} className="flex items-center gap-3 group cursor-pointer">
                      <div className="relative">
                        <Avatar initials={m.avatar} size="sm" />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-(--bg-elevated) rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium flex items-center gap-1.5">
                          <span className={`truncate ${m.role === 'admin' ? 'text-[color:oklch(0.58_0.22_var(--accent-hue))]' : m.role === 'moderator' ? 'text-green-400' : ''}`}>{m.name}</span>
                          {m.role === 'admin' && <Sparkles size={10} className="text-[color:oklch(0.58_0.22_var(--accent-hue))]" />}
                        </div>
                        {m.currentClassroom && (
                          <div className="text-[10px] text-(--text-muted) truncate">in {room.classrooms.find(c => c.id === m.currentClassroom)?.name}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offline */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-(--text-muted) mb-3">Offline — {room.members.filter(m => m.status === 'offline').length}</div>
                <div className="space-y-3 opacity-50">
                  {room.members.filter(m => m.status === 'offline').map(m => (
                    <div key={m.id} className="flex items-center gap-3 group cursor-pointer">
                      <div className="relative">
                        <Avatar initials={m.avatar} size="sm" />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gray-500 border-2 border-(--bg-elevated) rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium flex items-center gap-1.5">
                          <span className="truncate">{m.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="absolute inset-0 flex flex-col p-4">
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center animate-[shimmer_3s_infinite]">
                  <Sparkles size={32} className="text-purple-400" />
                </div>
                <h3 className="font-bold text-lg text-purple-100">Study Assistant</h3>
                <p className="text-xs text-(--text-muted) max-w-[200px]">Ask me to summarize discussions, generate quizzes from notes, or find resources.</p>
              </div>
              <div className="shrink-0 relative">
                <input type="text" placeholder="Ask AI..." className="w-full bg-(--bg-glass) border border-(--border-default) focus:border-purple-500/50 rounded-xl py-3 pl-4 pr-10 text-sm focus:outline-none transition-colors" />
                <Sparkles size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}