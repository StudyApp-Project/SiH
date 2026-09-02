import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { Zap } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';

export default function WelcomeHeader() {
  const { user } = useUser();
  const { dailyGoal } = useDashboard();
  
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  const progress = (dailyGoal.current / dailyGoal.target) * 100;

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          {greeting}, <span className="bg-gradient-to-r from-[color:oklch(0.58_0.22_var(--accent-hue))] to-[color:oklch(0.50_0.22_var(--accent-hue))] text-transparent bg-clip-text">{user.name.split(' ')[0]}</span>.
        </h1>
        <p className="text-(--text-secondary)">Let's make today count. You have {dailyGoal.target - dailyGoal.current} hours left to hit your goal.</p>
      </div>

      <div className="flex items-center gap-4 bg-(--bg-glass) backdrop-blur-md border border-(--border-subtle) rounded-2xl p-4 shadow-(--shadow-glow) w-full md:w-auto">
        {/* Circular Progress */}
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-(--border-default)" />
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-[color:oklch(0.58_0.22_var(--accent-hue))]" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * progress) / 100} strokeLinecap="round" />
          </svg>
          <Zap size={16} className="absolute text-[color:oklch(0.58_0.22_var(--accent-hue))] fill-current" />
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs text-(--text-muted) uppercase font-bold tracking-wider">Daily Goal</span>
          <span className="text-sm font-semibold">{dailyGoal.current} / {dailyGoal.target} hrs</span>
        </div>
        
        <div className="w-px h-8 bg-(--border-default) mx-2"></div>
        
        <div className="flex flex-col">
          <span className="text-xs text-(--text-muted) uppercase font-bold tracking-wider">Streak</span>
          <span className="text-sm font-semibold flex items-center gap-1">{dailyGoal.streak} Days 🔥</span>
        </div>
      </div>
    </motion.div>
  );
}