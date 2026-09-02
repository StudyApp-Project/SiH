import { motion } from 'framer-motion';
import { useDashboard } from '../../contexts/DashboardContext';
import { Clock, Users } from 'lucide-react';

export default function UpcomingSessionsWidget() {
  const { upcomingSessions } = useDashboard();

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="p-6 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Upcoming</h3>
      </div>

      <div className="space-y-3">
        {upcomingSessions.map((session, i) => (
          <div key={session.id} className="flex gap-4 p-3 rounded-2xl hover:bg-(--bg-elevated) transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] flex flex-col items-center justify-center text-[color:oklch(0.58_0.22_var(--accent-hue))] shrink-0 border border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.2)] group-hover:bg-[color:oklch(0.58_0.22_var(--accent-hue))] group-hover:text-white transition-colors">
              <span className="text-[10px] font-bold uppercase">Nov</span>
              <span className="text-sm font-black leading-none">{14 + i}</span>
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h4 className="font-semibold text-sm truncate">{session.title}</h4>
              <div className="flex items-center gap-3 mt-1 text-xs text-(--text-muted)">
                <span className="flex items-center gap-1"><Clock size={12} /> {session.time}</span>
                <span className="flex items-center gap-1"><Users size={12} /> {session.members} going</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}