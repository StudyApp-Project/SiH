import { motion } from 'framer-motion';
import { useDashboard } from '../../contexts/DashboardContext';
import { Award, FileText, CheckCircle2 } from 'lucide-react';

export default function ActivityFeedWidget() {
  const { recentActivity } = useDashboard();

  const getIcon = (type) => {
    switch(type) {
      case 'badge': return <Award size={14} className="text-yellow-500" />;
      case 'note': return <FileText size={14} className="text-blue-500" />;
      case 'quiz': return <CheckCircle2 size={14} className="text-green-500" />;
      default: return <FileText size={14} className="text-(--text-muted)" />;
    }
  };

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="p-6 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Activity Feed</h3>
      </div>

      <div className="relative pl-3 space-y-6 before:absolute before:inset-y-0 before:left-[17px] before:w-px before:bg-(--border-default)">
        {recentActivity.map((activity) => (
          <div key={activity.id} className="relative flex items-start gap-4 group">
            <div className="absolute left-[-16px] top-1 w-6 h-6 rounded-full bg-(--bg-elevated) border-2 border-(--border-strong) flex items-center justify-center z-10 group-hover:border-[color:oklch(0.58_0.22_var(--accent-hue))] transition-colors">
              {getIcon(activity.type)}
            </div>
            <div>
              <p className="text-sm font-medium text-(--text-primary) leading-snug">{activity.text}</p>
              <span className="text-xs text-(--text-muted) mt-1">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}