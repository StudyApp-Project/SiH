import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Flashcard({ front, back }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="w-full h-full cursor-pointer relative [perspective:1200px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative [transform-style:preserve-3d] will-change-transform transform-gpu"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {/* Front — fully opaque background so cards behind don't bleed through */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-(--bg-elevated) rounded-3xl border border-(--border-subtle) flex flex-col items-center justify-center p-10 text-center shadow-xl transition-shadow duration-300 will-change-transform transform-gpu overflow-hidden">
          {/* Decorative corner gradient */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.08)] to-transparent rounded-br-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.05)] to-transparent rounded-tl-full pointer-events-none" />
          
          <div className="text-xs font-bold uppercase tracking-widest text-[color:oklch(0.58_0.22_var(--accent-hue))] mb-4 relative z-10">Question</div>
          <h3 className="text-2xl md:text-3xl text-(--text-primary) font-semibold tracking-tight leading-relaxed relative z-10 whitespace-pre-line" style={{ fontFamily: 'var(--font-display)' }}>{front}</h3>
          <div className="mt-6 text-xs text-(--text-muted) relative z-10 font-medium">Tap to reveal answer</div>
        </div>
        
        {/* Back — also fully opaque */}
        <div 
          className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-(--bg-elevated) rounded-3xl border-2 border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.3)] flex flex-col items-center justify-center p-10 text-center shadow-xl will-change-transform transform-gpu relative overflow-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          {/* Accent glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.06)] to-transparent pointer-events-none" />
          
          <div className="text-xs font-bold uppercase tracking-widest text-[color:oklch(0.58_0.22_var(--accent-hue))] mb-4 relative z-10">Answer</div>
          <p className="text-xl md:text-2xl text-(--text-primary) leading-relaxed relative z-10 whitespace-pre-line font-medium">{back}</p>
        </div>
      </motion.div>
    </div>
  );
}
