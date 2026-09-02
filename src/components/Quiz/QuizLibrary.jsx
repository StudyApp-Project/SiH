import { useQuiz } from '../../contexts/QuizContext';
import { ClipboardList, Play, Plus, Trash2, RotateCcw, Trophy, Target, Award } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import CreateQuizModal from './CreateQuizModal';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function QuizLibrary() {
  const { quizzes, setActiveQuizId, deleteQuiz, resetQuiz } = useQuiz();
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
            <span className="bg-gradient-to-r from-[color:oklch(0.58_0.22_var(--accent-hue))] to-[color:oklch(0.68_0.17_var(--accent-hue))] text-transparent bg-clip-text">Quiz</span>
          </h1>
          <p className="text-(--text-secondary)">Test your knowledge with AI-generated quizzes from your study materials.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[color:oklch(0.58_0.22_var(--accent-hue))] to-[color:oklch(0.50_0.22_calc(var(--accent-hue)-30))] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.3)] cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          New Quiz
        </motion.button>
      </motion.div>

      {/* Empty State */}
      {quizzes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-24 h-24 bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-12 h-12 text-[color:oklch(0.58_0.22_var(--accent-hue))]" />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>No quizzes yet</h2>
          <p className="text-(--text-secondary) mb-6 max-w-sm mx-auto">Create your first quiz by selecting PDFs from your notes. Our AI will generate questions automatically.</p>
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-[color:oklch(0.58_0.22_var(--accent-hue))] to-[color:oklch(0.50_0.22_calc(var(--accent-hue)-30))] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.3)] cursor-pointer"
          >
            Create Your First Quiz
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {quizzes.map(quiz => {
            const isCompleted = quiz.score !== null;
            const scorePercent = isCompleted ? Math.round((quiz.score / quiz.totalQuestions) * 100) : null;
            const grade = scorePercent >= 90 ? 'A+' : scorePercent >= 80 ? 'A' : scorePercent >= 70 ? 'B' :
                          scorePercent >= 60 ? 'C' : scorePercent >= 50 ? 'D' : scorePercent !== null ? 'F' : null;

            return (
              <motion.div
                key={quiz.id}
                variants={cardVariants}
                whileHover={{ y: -4, boxShadow: 'var(--shadow-glow)' }}
                className="bg-(--bg-glass) backdrop-blur-xl rounded-2xl p-6 border border-(--border-subtle) flex flex-col h-64 transition-all duration-300 group relative overflow-hidden"
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isCompleted
                      ? scorePercent >= 70
                        ? 'bg-green-500/10 text-green-500'
                        : scorePercent >= 40
                          ? 'bg-orange-500/10 text-orange-500'
                          : 'bg-red-500/10 text-red-500'
                      : 'bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] text-[color:oklch(0.58_0.22_var(--accent-hue))]'
                  }`}>
                    {isCompleted ? <Trophy className="w-6 h-6" /> : <ClipboardList className="w-6 h-6" />}
                  </div>
                  <div className="flex items-start gap-2">
                    {isCompleted && grade && (
                      <div className="flex items-center gap-1.5 bg-(--bg-glass) backdrop-blur-md border border-(--border-subtle) rounded-full px-3 py-1">
                        <Award className="w-3.5 h-3.5 text-[color:oklch(0.58_0.22_var(--accent-hue))]" />
                        <span className={`text-sm font-bold ${
                          scorePercent >= 70 ? 'text-green-500' :
                          scorePercent >= 40 ? 'text-orange-500' : 'text-red-500'
                        }`}>{grade}</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteQuiz(quiz.id); }}
                      className="p-1.5 text-(--text-muted) hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                      title="Delete Quiz"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-(--text-primary) mb-1 truncate relative z-10" style={{ fontFamily: 'var(--font-display)' }}>{quiz.title}</h3>
                <p className="text-sm text-(--text-secondary) line-clamp-2 mb-auto relative z-10">{quiz.description}</p>

                {/* Score bar */}
                {isCompleted && (
                  <div className="w-full bg-(--border-default) rounded-full h-1.5 mb-3 overflow-hidden relative z-10">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        scorePercent >= 70 ? 'bg-green-500' : scorePercent >= 40 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${scorePercent}%` }}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-(--border-default) relative z-10">
                  <div className="flex items-center gap-3 text-sm text-(--text-muted)">
                    <span className="flex items-center gap-1.5">
                      <Target className="w-4 h-4" />
                      {quiz.totalQuestions} questions
                    </span>
                    {isCompleted && (
                      <button
                        onClick={() => resetQuiz(quiz.id)}
                        className="text-[color:oklch(0.58_0.22_var(--accent-hue))] hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <RotateCcw className="w-3 h-3" /> Retake
                      </button>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveQuizId(quiz.id)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[color:oklch(0.58_0.22_var(--accent-hue))] to-[color:oklch(0.50_0.22_calc(var(--accent-hue)-30))] text-white flex items-center justify-center cursor-pointer shadow-lg shadow-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.3)]"
                  >
                    <Play className="w-4 h-4 translate-x-[1px]" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <CreateQuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
