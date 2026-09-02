import { motion, AnimatePresence } from 'framer-motion';
import { Upload } from 'lucide-react';

export default function DragDropOverlay({ isDragging }) {
  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.05)] backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="flex flex-col items-center gap-4 p-12 rounded-3xl border-2 border-dashed border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.5)] bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.05)]"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-2xl bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))] flex items-center justify-center shadow-(--shadow-glow)"
            >
              <Upload size={28} />
            </motion.div>
            <div className="text-center">
              <p className="text-lg font-bold text-(--text-primary)" style={{ fontFamily: 'var(--font-display)' }}>
                Drop files to upload
              </p>
              <p className="text-sm text-(--text-muted) mt-1">Release to add to your resource hub</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
