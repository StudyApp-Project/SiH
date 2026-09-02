import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function ProductivityHeatmapWidget() {
  const cols = 12;
  const rows = 7;
  
  // Generate pseudo-random heatmap data without Math.random() to satisfy purity rules
  const data = useMemo(() => {
    return Array.from({ length: cols * rows }, (_, i) => (i * 7 + 13) % 5);
  }, []);

  const getColor = (level) => {
    if (level === 0) return 'bg-(--border-subtle)';
    if (level === 1) return 'bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.3)]';
    if (level === 2) return 'bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.5)]';
    if (level === 3) return 'bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.8)]';
    return 'bg-[color:oklch(0.58_0.22_var(--accent-hue))] shadow-[0_0_6px_oklch(0.58_0.22_var(--accent-hue)_/_0.6)]';
  };

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="p-6 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Consistency</h3>
        <div className="text-xs text-(--text-muted) font-medium">Last 3 months</div>
      </div>

      <div className="flex justify-between items-end gap-2 overflow-x-auto no-scrollbar pb-2">
        <div className="flex flex-col gap-1.5 text-[10px] text-(--text-muted) font-medium justify-around h-[84px] pr-2 shrink-0">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        <div className="flex gap-1.5 shrink-0">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-1.5">
              {Array.from({ length: rows }).map((_, rowIndex) => {
                const i = colIndex * rows + rowIndex;
                const level = data[i];
                return (
                  <div 
                    key={rowIndex} 
                    className={`w-3 h-3 rounded-sm ${getColor(level)} transition-colors hover:ring-2 hover:ring-(--text-primary) cursor-pointer`}
                    title={`${level} hours studied`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-[10px] text-(--text-muted) font-medium mt-2 justify-end w-full">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-[1px] bg-(--border-subtle)"></div>
          <div className="w-2 h-2 rounded-[1px] bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.3)]"></div>
          <div className="w-2 h-2 rounded-[1px] bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.5)]"></div>
          <div className="w-2 h-2 rounded-[1px] bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.8)]"></div>
          <div className="w-2 h-2 rounded-[1px] bg-[color:oklch(0.58_0.22_var(--accent-hue))]"></div>
        </div>
        <span>More</span>
      </div>
    </motion.div>
  );
}