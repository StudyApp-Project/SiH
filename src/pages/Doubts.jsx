import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Users, Plus } from 'lucide-react';
import { DoubtProvider, useDoubts } from '../contexts/DoubtContext';
import DoubtsTopBar from './DoubtsComponents/DoubtsTopBar';
import DoubtsLeftSidebar from './DoubtsComponents/DoubtsLeftSidebar';
import DoubtsFeed from './DoubtsComponents/DoubtsFeed';
import DoubtThread from './DoubtsComponents/DoubtThread';
import DoubtsRightSidebar from './DoubtsComponents/DoubtsRightSidebar';
import AskDoubtModal from './DoubtsComponents/AskDoubtModal';

function DoubtsContent() {
  const {
    doubts, userVotes, savedDoubts, topSolvers,
    voteDoubt, voteAnswer, addDoubt, addAnswer, toggleSave, incrementView
  } = useDoubts();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState('latest');
  const [activeFilter, setActiveFilter] = useState('home');
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedDoubtId, setSelectedDoubtId] = useState(null);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [isMobileLeftOpen, setIsMobileLeftOpen] = useState(false);
  const [isMobileRightOpen, setIsMobileRightOpen] = useState(false);

  // Filter and sort doubts
  const filteredDoubts = useMemo(() => {
    let result = [...doubts];

    // Category filter
    if (activeCategory) {
      result = result.filter(d => d.category === activeCategory);
    }

    // Nav filter
    if (activeFilter === 'solved') result = result.filter(d => d.isResolved);
    if (activeFilter === 'unanswered') result = result.filter(d => d.answers.length === 0);
    if (activeFilter === 'saved') result = result.filter(d => savedDoubts.includes(d.id));
    if (activeFilter === 'mine') result = result.filter(d => d.author.id === 'me');
    if (activeFilter === 'top') result = result.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.body.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q)) ||
        d.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (activeSort === 'top') result = result.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    if (activeSort === 'unanswered') result = result.filter(d => d.answers.length === 0);
    if (activeSort === 'trending') result = result.sort((a, b) => b.viewCount - a.viewCount);

    return result;
  }, [doubts, activeCategory, activeFilter, searchQuery, activeSort, savedDoubts]);

  const selectedDoubt = selectedDoubtId ? doubts.find(d => d.id === selectedDoubtId) : null;

  const handleSelectDoubt = (doubtId) => {
    setSelectedDoubtId(doubtId);
    incrementView(doubtId);
  };

  const handleAskSubmit = (data) => {
    return addDoubt(data);
  };

  const handleAskClose = (newDoubtId) => {
    setIsAskModalOpen(false);
    if (newDoubtId) {
      setSelectedDoubtId(newDoubtId);
    }
  };

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden relative">

      {/* LEFT SIDEBAR — Desktop */}
      <div className="hidden lg:flex w-56 shrink-0 z-10">
        <DoubtsLeftSidebar
          activeFilter={activeFilter}
          onFilterChange={(f) => { setActiveFilter(f); setSelectedDoubtId(null); }}
          activeCategory={activeCategory}
          onCategoryChange={(c) => { setActiveCategory(c); setSelectedDoubtId(null); }}
        />
      </div>

      {/* LEFT SIDEBAR — Mobile Drawer */}
      <AnimatePresence>
        {isMobileLeftOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileLeftOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden">
              <DoubtsLeftSidebar
                activeFilter={activeFilter}
                onFilterChange={(f) => { setActiveFilter(f); setSelectedDoubtId(null); setIsMobileLeftOpen(false); }}
                activeCategory={activeCategory}
                onCategoryChange={(c) => { setActiveCategory(c); setSelectedDoubtId(null); setIsMobileLeftOpen(false); }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CENTER — Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-3 border-b border-(--border-default) bg-(--bg-elevated)/80 backdrop-blur-md z-10">
          <button onClick={() => setIsMobileLeftOpen(true)} className="p-2 rounded-lg hover:bg-(--bg-glass)">
            <Menu size={20} />
          </button>
          <div className="font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>Doubt Hub</div>
          <button onClick={() => setIsMobileRightOpen(true)} className="p-2 rounded-lg hover:bg-(--bg-glass) relative">
            <Users size={20} />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-green-500 border-2 border-(--bg-elevated)" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              {selectedDoubt ? (
                <DoubtThread
                  key="thread"
                  doubt={selectedDoubt}
                  userVotes={userVotes}
                  onVoteDoubt={voteDoubt}
                  onVoteAnswer={voteAnswer}
                  onAddAnswer={addAnswer}
                  onBack={() => setSelectedDoubtId(null)}
                />
              ) : (
                <motion.div
                  key="feed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <DoubtsTopBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    activeSort={activeSort}
                    onSortChange={setActiveSort}
                    onAskDoubt={() => setIsAskModalOpen(true)}
                    doubtCount={filteredDoubts.length}
                  />

                  <DoubtsFeed
                    doubts={filteredDoubts}
                    userVotes={userVotes}
                    savedDoubts={savedDoubts}
                    onVote={voteDoubt}
                    onSave={toggleSave}
                    onSelect={handleSelectDoubt}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile FAB */}
        {!selectedDoubt && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="lg:hidden fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-[color:oklch(0.58_0.22_var(--accent-hue))] text-white flex items-center justify-center shadow-[0_4px_20px_oklch(0.58_0.22_var(--accent-hue)_/_0.4)]"
            onClick={() => setIsAskModalOpen(true)}
            whileTap={{ scale: 0.9 }}
          >
            <Plus size={24} />
          </motion.button>
        )}
      </div>

      {/* RIGHT SIDEBAR — Desktop */}
      <div className="hidden xl:flex w-72 shrink-0 z-10">
        <DoubtsRightSidebar topSolvers={topSolvers} />
      </div>

      {/* RIGHT SIDEBAR — Mobile Drawer */}
      <AnimatePresence>
        {isMobileRightOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 xl:hidden backdrop-blur-sm" onClick={() => setIsMobileRightOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="fixed inset-y-0 right-0 w-80 z-50 xl:hidden">
              <DoubtsRightSidebar topSolvers={topSolvers} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Ask Doubt Modal */}
      <AskDoubtModal
        isOpen={isAskModalOpen}
        onClose={handleAskClose}
        onSubmit={handleAskSubmit}
      />
    </div>
  );
}

export default function Doubts() {
  return (
    <DoubtProvider>
      <DoubtsContent />
    </DoubtProvider>
  );
}
