import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { Flame, Clock, Trophy } from 'lucide-react';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function UserHeroWidget() {
  const { user } = useUser();
  const xpForNextLevel = user?.level * 500;
  const xpProgress = ((user?.xp || 0) / xpForNextLevel) * 100;

  return (
    <motion.div variants={itemVariants} className="h-full bg-(--bg-glass) backdrop-blur-md rounded-3xl border border-(--border-default) p-8 shadow-sm flex flex-col justify-between gap-8 relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[color:oklch(0.58_0.22_var(--accent-hue))] rounded-full blur-[100px] opacity-10 pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
        
        {/* Dynamic Level Aura Avatar */}
        <div className="relative shrink-0">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[color:oklch(0.58_0.22_var(--accent-hue))] to-[color:oklch(0.70_0.15_var(--accent-hue))] opacity-70 blur-sm"
          />
          <div className="relative w-24 h-24 rounded-full bg-(--bg-elevated) border-4 border-(--bg-base) flex items-center justify-center text-3xl font-bold text-(--text-primary) shadow-(--shadow-glow) overflow-hidden">
             {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[color:oklch(0.58_0.22_var(--accent-hue))] text-white text-xs font-bold px-2 py-1 rounded-lg border-2 border-(--bg-base) shadow-md">
            Lvl {user?.level || 1}
          </div>
        </div>

        <div className="text-center sm:text-left flex-1">
          <h2 className="text-3xl font-bold text-(--text-primary)">{user?.name || 'Student User'}</h2>
          <p className="text-(--text-secondary) mt-1">{user?.bio || 'Dedicated learner exploring the world of knowledge.'}</p>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-(--bg-elevated) border border-(--border-default) text-xs font-medium text-(--text-primary)">
               <Flame size={14} className="text-orange-500" />
               {user?.streak || 0} Day Streak
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-(--bg-elevated) border border-(--border-default) text-xs font-medium text-(--text-primary)">
               <Clock size={14} className="text-blue-500" />
               124 Hours Total
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-(--bg-elevated) border border-(--border-default) text-xs font-medium text-(--text-primary)">
               <Trophy size={14} className="text-yellow-500" />
               Top 5% Global
             </div>
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="relative z-10 w-full mt-auto">
        <div className="flex justify-between text-xs font-medium text-(--text-secondary) mb-2">
          <span>{user?.xp || 0} XP</span>
          <span>{xpForNextLevel} XP to Level {user?.level ? user.level + 1 : 2}</span>
        </div>
        <div className="h-3 w-full bg-(--bg-elevated) rounded-full overflow-hidden shadow-inner">
          <motion.div 
            className="h-full bg-gradient-to-r from-[color:oklch(0.58_0.22_var(--accent-hue))] to-[color:oklch(0.70_0.15_var(--accent-hue))]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(xpProgress, 100)}%` }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          />
        </div>
      </div>

    </motion.div>
  );
}
