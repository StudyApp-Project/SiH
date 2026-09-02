import { useQuiz } from '../contexts/QuizContext';
import QuizLibrary from '../components/Quiz/QuizLibrary';
import QuizSession from '../components/Quiz/QuizSession';

export default function Quiz() {
  const { activeQuizId } = useQuiz();

  return (
    <div className="flex-1 h-full w-full bg-(--bg-primary) overflow-hidden flex flex-col">
      {activeQuizId ? <QuizSession /> : <QuizLibrary />}
    </div>
  );
}
