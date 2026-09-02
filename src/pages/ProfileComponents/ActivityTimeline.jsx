import { motion } from 'framer-motion';
import { BookOpen, Users, HelpCircle, Trophy } from 'lucide-react';

const ACTIVITIES = [
  { id: 1, type: 'quiz', title: 'Aced "Advanced Calculus"', time: '2 hours ago', xp: '+150 XP', icon: HelpCircle, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 2, type: 'room', title: 'Joined "Night Owls Coding"', time: 'Yesterday', xp: '+20 XP', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 3, type: 'note', title: 'Created "Physics Ch.4 Summary"', time: '2 days ago', xp: '+50 XP', icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 4, type: 'achievement', title: 'Unlocked "Bookworm" Badge', time: '3 days ago', xp: '+500 XP', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
];

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function ActivityTimeline() {
  return (
    <motion.div variants={itemVariants} className="h-full bg-(--bg-glass) backdrop-blur-md rounded-3xl border border-(--border-default) p-6 shadow-sm flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-(--text-primary)">Recent Activity</h3>
        <p className="text-sm text-(--text-secondary)">Your latest actions</p>
      </div>

      <div className="flex-1 relative">
        {/* Vertical Line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-(--border-default)" />

        <div className="space-y-6">
          {ACTIVITIES.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="relative flex gap-4"
              >
                {/* Timeline Node */}
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.bg} ${activity.color} ring-4 ring-(--bg-base)`}>
                  <Icon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold text-(--text-primary)">{activity.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-(--text-muted)">{activity.time}</span>
                    <span className="w-1 h-1 rounded-full bg-(--border-default)" />
                    <span className={`text-[10px] font-bold ${activity.color}`}>{activity.xp}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      <button className="mt-6 w-full py-2 rounded-xl text-sm font-medium text-[color:oklch(0.58_0.22_var(--accent-hue))] bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] hover:bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.2)] transition-colors">
        View Full History
      </button>
    </motion.div>
  );
}
