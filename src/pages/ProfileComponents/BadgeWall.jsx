import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { Award, Zap, BookOpen, Star, Target, Crown } from 'lucide-react';

const BADGES = [
  { id: 1, title: 'First Steps', desc: 'Joined EduWrap', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10', unlocked: true },
  { id: 2, title: 'Night Owl', desc: 'Studied past midnight', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10', unlocked: true },
  { id: 3, title: 'Bookworm', desc: 'Read 100 notes', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10', unlocked: true },
  { id: 4, title: 'Sharpshooter', desc: '100% on a Quiz', icon: Target, color: 'text-red-500', bg: 'bg-red-500/10', unlocked: true },
  { id: 5, title: 'Top 1%', desc: 'Reach Diamond League', icon: Crown, color: 'text-emerald-500', bg: 'bg-emerald-500/10', unlocked: false },
  { id: 6, title: 'Social Butterfly', desc: 'Join 10 Rooms', icon: Award, color: 'text-orange-500', bg: 'bg-orange-500/10', unlocked: false },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

// 3D Tilt Card Component
function BadgeCard({ badge }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useMotionTemplate`${mouseYSpring}deg`;
  const rotateY = useMotionTemplate`${mouseXSpring}deg`;

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 30); // Max rotation
    y.set(yPct * -30);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Icon = badge.icon;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      className={`relative h-40 w-full rounded-2xl border ${badge.unlocked ? 'border-(--border-default) bg-(--bg-elevated) cursor-pointer' : 'border-dashed border-(--border-default) bg-(--bg-base) opacity-50 grayscale cursor-not-allowed'} p-4 flex flex-col items-center justify-center gap-3 transition-colors hover:border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.5)]`}
    >
      <div 
        style={{ transform: "translateZ(30px)" }}
        className={`w-14 h-14 rounded-full flex items-center justify-center ${badge.bg} ${badge.unlocked ? badge.color : 'text-(--text-muted)'} shadow-inner`}
      >
        <Icon size={24} />
      </div>
      <div style={{ transform: "translateZ(20px)" }} className="text-center">
        <h4 className="text-sm font-bold text-(--text-primary)">{badge.title}</h4>
        <p className="text-[10px] text-(--text-muted) mt-0.5">{badge.desc}</p>
      </div>

      {/* Glare Effect */}
      {badge.unlocked && (
        <motion.div 
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 60%)`,
            transform: "translateZ(40px)"
          }}
        />
      )}
    </motion.div>
  );
}

export default function BadgeWall() {
  return (
    <motion.div variants={itemVariants} className="h-full bg-(--bg-glass) backdrop-blur-md rounded-3xl border border-(--border-default) p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-(--text-primary)">Badge Wall</h3>
          <p className="text-sm text-(--text-secondary)">Your unlocked achievements</p>
        </div>
        <div className="text-sm font-medium px-3 py-1 bg-(--bg-elevated) rounded-full border border-(--border-default)">
          <span className="text-[color:oklch(0.58_0.22_var(--accent-hue))]">4</span> / 6 Unlocked
        </div>
      </div>

      <div style={{ perspective: 1000 }} className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
        {BADGES.map(badge => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </motion.div>
  );
}
