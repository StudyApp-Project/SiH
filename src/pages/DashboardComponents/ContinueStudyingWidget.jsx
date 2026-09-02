import { motion } from 'framer-motion';
import { BookOpen, Layers, CheckCircle2 } from 'lucide-react';

const ITEMS = [
  { id: 1, title: 'Physics Midterm Deck', type: 'Flashcards', icon: Layers, progress: 65, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 2, title: 'Chapter 4 Summary', type: 'Notes', icon: BookOpen, progress: 40, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 3, title: 'Calculus Quiz', type: 'Quiz', icon: CheckCircle2, progress: 10, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
];

export default function ContinueStudyingWidget() {
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="p-6 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Jump Back In</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ITEMS.map(item => (
          <div key={item.id} className="p-4 rounded-2xl bg-(--bg-elevated) border border-(--border-default) hover:border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.4)] transition-colors cursor-pointer group">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${item.bg} ${item.color}`}>
              <item.icon size={16} />
            </div>
            <h4 className="font-semibold text-sm truncate">{item.title}</h4>
            <div className="text-xs text-(--text-muted) mb-3 mt-0.5">{item.type}</div>
            
            <div className="w-full bg-(--border-default) rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[color:oklch(0.58_0.22_var(--accent-hue))] h-1.5 rounded-full transition-all duration-500 group-hover:shadow-[0_0_8px_oklch(0.58_0.22_var(--accent-hue))]" 
                style={{ width: `${item.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}