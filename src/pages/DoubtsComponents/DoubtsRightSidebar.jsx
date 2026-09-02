import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Flame, Award, MessageSquare, Zap } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';

const RANK_COLORS = {
  Gold: 'text-yellow-500',
  Silver: 'text-gray-400',
  Bronze: 'text-amber-700',
};

const TRENDING_TOPICS = [
  { tag: 'dynamic-programming', count: 23, hot: true },
  { tag: 'newtons-laws', count: 18, hot: true },
  { tag: 'react-hooks', count: 15, hot: false },
  { tag: 'fourier', count: 12, hot: false },
  { tag: 'cnn-vs-rnn', count: 9, hot: false },
];

const LIVE_ACTIVITY = [
  { user: 'Marcus Lee', action: 'answered a doubt', topic: 'DSA', time: '2m ago' },
  { user: 'Priya Sharma', action: 'asked a doubt', topic: 'Coding', time: '5m ago' },
  { user: 'Dr. Lisa Wong', action: 'marked best answer', topic: 'Physics', time: '12m ago' },
  { user: 'Jordan Kim', action: 'upvoted an answer', topic: 'Maths', time: '18m ago' },
];

export default function DoubtsRightSidebar({ topSolvers }) {
  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto no-scrollbar p-4 bg-(--bg-elevated) border-l border-(--border-default)">

      {/* AI Helper */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.05)] border border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] rounded-2xl p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))] flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="text-sm font-bold">AI Study Buddy</h4>
            <p className="text-[10px] text-(--text-muted)">Powered by EduWrap AI</p>
          </div>
        </div>
        <p className="text-xs text-(--text-secondary) mb-3 leading-relaxed">
          Struggling with a concept? Ask the AI for a quick explanation before posting.
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI anything..."
            className="flex-1 bg-(--bg-glass) border border-(--border-default) rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[color:oklch(0.58_0.22_var(--accent-hue))] transition-colors"
          />
          <button className="p-1.5 rounded-lg bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))] hover:bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.25)] transition-colors">
            <Zap size={14} />
          </button>
        </div>
      </motion.div>

      {/* Trending Topics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-(--bg-glass) backdrop-blur-xl border border-(--border-default) rounded-2xl p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={15} className="text-(--text-muted)" />
          <h4 className="text-sm font-bold">Trending Topics</h4>
        </div>
        <div className="space-y-2">
          {TRENDING_TOPICS.map(topic => (
            <div key={topic.tag} className="flex items-center justify-between py-1 group cursor-pointer">
              <span className="text-xs text-(--text-secondary) group-hover:text-[color:oklch(0.58_0.22_var(--accent-hue))] transition-colors flex items-center gap-1.5">
                {topic.hot && <Flame size={11} className="text-orange-500" />}
                #{topic.tag}
              </span>
              <span className="text-[10px] text-(--text-muted) bg-(--bg-elevated) px-1.5 py-0.5 rounded-full">{topic.count}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Solvers */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-(--bg-glass) backdrop-blur-xl border border-(--border-default) rounded-2xl p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Award size={15} className="text-yellow-500" />
          <h4 className="text-sm font-bold">Top Solvers</h4>
        </div>
        <div className="space-y-3">
          {topSolvers?.slice(0, 5).map((solver, i) => (
            <div key={solver.id} className="flex items-center gap-2.5">
              <span className="text-[10px] font-bold text-(--text-muted) w-4 text-right">{i + 1}</span>
              <Avatar initials={solver.initials} size="xs" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate">{solver.name}</div>
                <div className="text-[10px] text-(--text-muted) flex items-center gap-1">
                  <span className={`font-bold ${RANK_COLORS[solver.rank]}`}>{solver.rank}</span>
                  · {solver.solvedCount} solved
                </div>
              </div>
              <span className="text-[10px] font-bold text-[color:oklch(0.58_0.22_var(--accent-hue))]">{solver.xp} XP</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Live Activity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-(--bg-glass) backdrop-blur-xl border border-(--border-default) rounded-2xl p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h4 className="text-sm font-bold">Live Activity</h4>
        </div>
        <div className="space-y-2.5">
          {LIVE_ACTIVITY.map((activity, i) => (
            <div key={i} className="flex items-start gap-2">
              <MessageSquare size={12} className="text-(--text-muted) shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-(--text-secondary) leading-snug">
                  <span className="font-semibold text-(--text-primary)">{activity.user}</span>{' '}
                  {activity.action} in <span className="text-[color:oklch(0.58_0.22_var(--accent-hue))]">{activity.topic}</span>
                </p>
                <span className="text-[10px] text-(--text-muted)">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
