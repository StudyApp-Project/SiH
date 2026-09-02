import { motion } from 'framer-motion';
import { Trophy, Target, Award, Clock } from 'lucide-react';
import { useQuiz } from '../../contexts/QuizContext';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function QuizHistory() {
  const { quizzes } = useQuiz();
  
  const completedQuizzes = quizzes
    .filter(q => q.score !== null)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  const totalAttempted = completedQuizzes.length;
  const averageScore = totalAttempted > 0
    ? Math.round(completedQuizzes.reduce((acc, q) => acc + (q.score / q.totalQuestions) * 100, 0) / totalAttempted)
    : 0;
  const bestScore = totalAttempted > 0
    ? Math.max(...completedQuizzes.map(q => Math.round((q.score / q.totalQuestions) * 100)))
    : 0;

  const getGrade = (percent) => {
    if (percent >= 90) return { grade: 'A+', color: 'text-green-500', bg: 'bg-green-500/10' };
    if (percent >= 80) return { grade: 'A', color: 'text-green-500', bg: 'bg-green-500/10' };
    if (percent >= 70) return { grade: 'B', color: 'text-blue-500', bg: 'bg-blue-500/10' };
    if (percent >= 60) return { grade: 'C', color: 'text-orange-500', bg: 'bg-orange-500/10' };
    if (percent >= 50) return { grade: 'D', color: 'text-orange-500', bg: 'bg-orange-500/10' };
    return { grade: 'F', color: 'text-red-500', bg: 'bg-red-500/10' };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div variants={itemVariants} className="h-full bg-(--bg-glass) backdrop-blur-md rounded-3xl border border-(--border-default) p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-(--text-primary)">Quiz Performance</h3>
          <p className="text-sm text-(--text-secondary)">Your quiz scores and grades</p>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium px-3 py-1 bg-(--bg-elevated) rounded-full border border-(--border-default)">
          <Trophy className="w-3.5 h-3.5 text-[color:oklch(0.58_0.22_var(--accent-hue))]" />
          <span className="text-[color:oklch(0.58_0.22_var(--accent-hue))]">{totalAttempted}</span>
          <span className="text-(--text-muted)">Completed</span>
        </div>
      </div>

      {/* Stats Summary */}
      {totalAttempted > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-(--bg-elevated) rounded-xl p-3 text-center border border-(--border-default)">
            <div className="text-xl font-bold text-[color:oklch(0.58_0.22_var(--accent-hue))]" style={{ fontFamily: 'var(--font-display)' }}>{averageScore}%</div>
            <div className="text-[10px] text-(--text-muted) uppercase font-bold tracking-wider mt-1">Avg Score</div>
          </div>
          <div className="bg-(--bg-elevated) rounded-xl p-3 text-center border border-(--border-default)">
            <div className="text-xl font-bold text-green-500" style={{ fontFamily: 'var(--font-display)' }}>{bestScore}%</div>
            <div className="text-[10px] text-(--text-muted) uppercase font-bold tracking-wider mt-1">Best</div>
          </div>
          <div className="bg-(--bg-elevated) rounded-xl p-3 text-center border border-(--border-default)">
            <div className="text-xl font-bold text-(--text-primary)" style={{ fontFamily: 'var(--font-display)' }}>
              {getGrade(averageScore).grade}
            </div>
            <div className="text-[10px] text-(--text-muted) uppercase font-bold tracking-wider mt-1">Avg Grade</div>
          </div>
        </div>
      )}

      {/* Quiz List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {completedQuizzes.length === 0 ? (
          <div className="text-center py-8 text-(--text-muted) text-sm">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-40" />
            No quizzes completed yet.
          </div>
        ) : (
          completedQuizzes.slice(0, 10).map(quiz => {
            const percent = Math.round((quiz.score / quiz.totalQuestions) * 100);
            const { grade, color, bg } = getGrade(percent);
            
            return (
              <div
                key={quiz.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-(--bg-elevated) border border-(--border-default) hover:border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.3)] transition-colors"
              >
                {/* Grade badge */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} shrink-0`}>
                  <span className={`text-sm font-bold ${color}`}>{grade}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-(--text-primary) truncate">{quiz.title}</div>
                  <div className="text-xs text-(--text-muted) flex items-center gap-2 mt-0.5">
                    <span>{quiz.score}/{quiz.totalQuestions} correct</span>
                    <span className="text-(--border-default)">•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(quiz.completedAt)}
                    </span>
                  </div>
                </div>

                {/* Score bar */}
                <div className="w-16 flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-sm font-bold ${color}`}>{percent}%</span>
                  <div className="w-full bg-(--border-default) rounded-full h-1 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        percent >= 70 ? 'bg-green-500' : percent >= 50 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
