import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GripHorizontal, Maximize2, Minimize2 } from 'lucide-react';
import { IconButton } from './Button';

export function FloatingPanel({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  defaultPosition = { x: 50, y: 50 },
  defaultSize = { width: 320, height: 400 }
}) {
  const [isMinimized, setIsMinimized] = useState(false);
  const panelRef = useRef(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        drag
        dragMomentum={false}
        dragListener={false} // Only drag via handle
        initial={{ opacity: 0, scale: 0.9, ...defaultPosition }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          height: isMinimized ? 48 : defaultSize.height,
          width: defaultSize.width 
        }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed z-50 bg-(--bg-elevated) border border-(--border-strong) rounded-xl shadow-(--shadow-lg) overflow-hidden flex flex-col"
        style={{ x: defaultPosition.x, y: defaultPosition.y }}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-(--border-default) bg-(--bg-surface) shrink-0 touch-none cursor-move">
          {/* Drag Handle (Full Header) */}
          <motion.div dragControls dragListener className="absolute inset-0 z-0" />
          
          <div className="relative z-10 flex items-center gap-2 pointer-events-none">
            <GripHorizontal size={14} className="text-(--text-muted)" />
            <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
              {title}
            </span>
          </div>
          
          <div className="relative z-10 flex items-center gap-1">
            <IconButton size="sm" onClick={() => setIsMinimized(!isMinimized)} aria-label={isMinimized ? "Maximize" : "Minimize"}>
              {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </IconButton>
            <IconButton size="sm" onClick={onClose} aria-label="Close">
              <X size={14} />
            </IconButton>
          </div>
        </div>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-auto p-4 bg-(--bg-base)"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
