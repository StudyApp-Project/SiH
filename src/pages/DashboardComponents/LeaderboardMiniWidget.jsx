import { motion } from 'framer-motion';
import { useDashboard } from '../../contexts/DashboardContext';
import { Trophy } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';

export default function LeaderboardMiniWidget() {
  const { leaderboard } = useDashboard();

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="p-6 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Trophy size={18} className="text-yellow-500" /> Leaderboard
        </h3>
        <button className="text-xs text-(--text-muted) hover:text-[color:oklch(0.58_0.22_var(--accent-hue))] font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-1">
        {leaderboard.map((user) => (
          <div 
            key={user.id} 
            className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
              user.name === 'You' ? 'bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] border border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.2)]' : 'hover:bg-(--bg-elevated) border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-5 text-center font-bold text-sm ${
                user.rank === 1 ? 'text-yellow-500' :
                user.rank === 2 ? 'text-gray-400' :
                user.rank === 3 ? 'text-amber-600' : 'text-(--text-muted)'
              }`}>
                {user.rank}
              </span>
              <Avatar initials={user.name.charAt(0)} size="sm" />
              <span className={`text-sm font-medium ${user.name === 'You' ? 'text-[color:oklch(0.58_0.22_var(--accent-hue))]' : 'text-(--text-primary)'}`}>
                {user.name}
              </span>
            </div>
            <span className="text-xs font-bold text-(--text-muted)">{user.xp.toLocaleString()} XP</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}