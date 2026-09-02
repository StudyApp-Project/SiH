import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function WeeklyGoalRing() {
  const [progress, setProgress] = useState(0);
  const targetHours = 10;
  const currentHours = 8.5;
  const percentage = Math.min((currentHours / targetHours) * 100, 100);

  useEffect(() => {
    // Animate progress on mount
    const timer = setTimeout(() => setProgress(percentage), 500);
    return () => clearTimeout(timer);
  }, [percentage]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div variants={itemVariants} className="h-full bg-(--bg-glass) backdrop-blur-md rounded-3xl border border-(--border-default) p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Decorative Blur */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[color:oklch(0.58_0.22_var(--accent-hue))] rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="flex items-center gap-2 mb-4 text-(--text-primary)">
        <Target size={20} className="text-[color:oklch(0.58_0.22_var(--accent-hue))]" />
        <h3 className="font-bold">Weekly Goal</h3>
      </div>

      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Background Ring */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          <circle
            className="text-(--bg-elevated)"
            strokeWidth="12"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="70"
            cy="70"
          />
          {/* Progress Ring */}
          <motion.circle
            className="text-[color:oklch(0.58_0.22_var(--accent-hue))] drop-shadow-md"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="70"
            cy="70"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-black text-(--text-primary)"
          >
            {currentHours}
          </motion.span>
          <span className="text-xs text-(--text-muted) uppercase tracking-wider font-semibold">/ {targetHours} hrs</span>
        </div>
      </div>

      <p className="mt-6 text-sm text-(--text-secondary) text-center px-4">
        You're <strong className="text-(--text-primary)">{targetHours - currentHours} hours</strong> away from your weekly goal! Keep pushing.
      </p>
    </motion.div>
  );
}
