import { motion } from 'framer-motion';
import { Play, Coffee, Music } from 'lucide-react';
import { useState } from 'react';

export default function FocusWidget() {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
      className="bg-gradient-to-br from-[color:oklch(0.58_0.22_var(--accent-hue))] to-[color:oklch(0.50_0.22_calc(var(--accent-hue)-30))] rounded-3xl p-1 shadow-(--shadow-glow) shrink-0 self-start"
    >
      <div className="bg-(--bg-elevated) rounded-[22px] px-4 py-2 flex items-center gap-4">
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-red-500 text-white' : 'bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] text-[color:oklch(0.58_0.22_var(--accent-hue))]'}`}
        >
          {isActive ? <div className="w-3 h-3 rounded-sm bg-white" /> : <Play size={18} className="ml-1" fill="currentColor" />}
        </button>
        
        <div className="flex flex-col min-w-[80px]">
          <span className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">{isActive ? 'Focusing' : 'Focus Mode'}</span>
          <span className="text-lg font-bold font-mono text-(--text-primary)">
            {isActive ? '24:59' : '25:00'}
          </span>
        </div>

        <div className="w-px h-8 bg-(--border-default) mx-1"></div>

        <button className="p-2 text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-glass) rounded-xl transition-colors">
          <Coffee size={16} />
        </button>
        <button className="p-2 text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-glass) rounded-xl transition-colors">
          <Music size={16} />
        </button>
      </div>
    </motion.div>
  );
}