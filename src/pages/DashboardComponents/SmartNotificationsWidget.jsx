import { motion } from 'framer-motion';
import { useDashboard } from '../../contexts/DashboardContext';
import { Bell } from 'lucide-react';

export default function SmartNotificationsWidget() {
  const { notifications } = useDashboard();

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      className="p-6 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-(--text-muted)" />
          <h3 className="font-bold text-lg">Inbox</h3>
        </div>
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map(notif => (
          <div key={notif.id} className={`p-3 rounded-xl border ${notif.read ? 'border-transparent bg-transparent' : 'border-(--border-default) bg-(--bg-elevated)'} hover:bg-(--bg-elevated) transition-colors cursor-pointer flex items-center gap-3`}>
            {!notif.read && <div className="w-2 h-2 rounded-full bg-[color:oklch(0.58_0.22_var(--accent-hue))] shrink-0" />}
            <span className={`text-sm ${notif.read ? 'text-(--text-muted)' : 'text-(--text-primary) font-medium'}`}>{notif.text}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}