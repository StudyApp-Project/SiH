import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Flame, BookOpen, Users } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useDashboard } from '../../contexts/DashboardContext';

const StatCard = ({ icon: Icon, label, value, subtext, delay }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    className="bg-(--bg-glass) backdrop-blur-xl border border-(--border-subtle) rounded-2xl p-5 hover:-translate-y-1 hover:shadow-(--shadow-glow) transition-all duration-300"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] flex items-center justify-center text-[color:oklch(0.58_0.22_var(--accent-hue))] shrink-0">
        <Icon size={24} />
      </div>
      <div>
        <div className="text-(--text-secondary) text-sm font-medium">{label}</div>
        <div className="text-2xl font-bold mt-1" style={{ fontFamily: 'var(--font-display)' }}>{value}</div>
      </div>
    </div>
    {subtext && (
      <div className="mt-4 pt-3 border-t border-(--border-default) text-xs text-(--text-muted) flex items-center gap-1">
        {subtext}
      </div>
    )}
  </motion.div>
);

export default function StatsGrid() {
  const { user } = useUser();
  const { dailyGoal } = useDashboard();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        icon={Flame} 
        label="Total XP" 
        value={user.xp.toLocaleString()} 
        subtext={<><span className="text-green-500 font-medium">+{dailyGoal.xpToday}</span> earned today</>} 
        delay={0.1}
      />
      <StatCard 
        icon={CheckCircle2} 
        label="Current Level" 
        value={`Lvl ${user.level}`} 
        subtext="Scholar Rank" 
        delay={0.2}
      />
      <StatCard 
        icon={Clock} 
        label="Hours Studied" 
        value="34h" 
        subtext="Top 15% this week" 
        delay={0.3}
      />
      <StatCard 
        icon={Users} 
        label="Active Groups" 
        value="3" 
        subtext="2 sessions scheduled" 
        delay={0.4}
      />
    </div>
  );
}