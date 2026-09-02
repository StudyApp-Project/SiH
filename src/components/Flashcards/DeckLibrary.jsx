import { useFlashcards } from '../../contexts/FlashcardContext';
import { Layers, Play, Plus, Trash2, Sparkles, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import CreateDeckModal from './CreateDeckModal';
import { MagicBentoGrid, MagicBentoCard } from '../ui/MagicBento';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DeckLibrary() {
  const { decks, setActiveDeckId, deleteDeck } = useFlashcards();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="bg-gradient-to-r from-[color:oklch(0.58_0.22_var(--accent-hue))] to-[color:oklch(0.68_0.17_var(--accent-hue))] text-transparent bg-clip-text">Flashcards</span>
          </h1>
          <p className="text-(--text-secondary)">Master your subjects with active recall and spaced repetition.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[color:oklch(0.58_0.22_var(--accent-hue))] to-[color:oklch(0.50_0.22_calc(var(--accent-hue)-30))] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.3)] cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          New Deck
        </motion.button>
      </motion.div>

      {/* Empty State */}
      {decks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-24 h-24 bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Layers className="w-12 h-12 text-[color:oklch(0.58_0.22_var(--accent-hue))]" />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>No decks yet</h2>
          <p className="text-(--text-secondary) mb-6 max-w-sm mx-auto">Create your first flashcard deck by selecting PDFs from your notes.</p>
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-[color:oklch(0.58_0.22_var(--accent-hue))] to-[color:oklch(0.50_0.22_calc(var(--accent-hue)-30))] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.3)] cursor-pointer"
          >
            Create Your First Deck
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
        >
          <MagicBentoGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map(deck => {
              const totalCards = deck.cards.length;
              const knownCards = deck.cards.filter(c => c.status === 'known').length;
              const progress = totalCards === 0 ? 0 : Math.round((knownCards / totalCards) * 100);

              return (
                <motion.div
                  key={deck.id}
                  variants={cardVariants}
                  className="block h-full"
                >
                  <MagicBentoCard className="bg-(--bg-glass) backdrop-blur-xl rounded-2xl p-6 border border-(--border-subtle) flex flex-col h-64 group relative overflow-hidden transition-none">
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] text-[color:oklch(0.58_0.22_var(--accent-hue))] flex items-center justify-center">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div className="flex items-start gap-2">
                        {/* Circular progress */}
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-(--border-default)" />
                            <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-[color:oklch(0.58_0.22_var(--accent-hue))]" strokeDasharray={113} strokeDashoffset={113 - (113 * progress) / 100} strokeLinecap="round" />
                          </svg>
                          <span className="absolute text-xs font-bold text-(--text-primary)">{progress}%</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteDeck(deck.id); }}
                          className="p-1.5 text-(--text-muted) hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                          title="Delete Deck"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-(--text-primary) mb-1 truncate relative z-10" style={{ fontFamily: 'var(--font-display)' }}>{deck.title}</h3>
                    <p className="text-sm text-(--text-secondary) line-clamp-2 mb-auto relative z-10">{deck.description}</p>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-(--border-default) relative z-10">
                      <div className="flex items-center gap-2 text-sm text-(--text-muted)">
                        <BookOpen className="w-4 h-4" />
                        {totalCards} cards
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setActiveDeckId(deck.id)}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-[color:oklch(0.58_0.22_var(--accent-hue))] to-[color:oklch(0.50_0.22_calc(var(--accent-hue)-30))] text-white flex items-center justify-center cursor-pointer shadow-lg shadow-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.3)]"
                      >
                        <Play className="w-4 h-4 translate-x-[1px]" />
                      </motion.button>
                    </div>
                  </MagicBentoCard>
                </motion.div>
              );
            })}
          </MagicBentoGrid>
        </motion.div>
      )}

      <CreateDeckModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
