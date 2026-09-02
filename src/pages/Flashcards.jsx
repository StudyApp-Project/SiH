import { useFlashcards } from '../contexts/FlashcardContext';
import DeckLibrary from '../components/Flashcards/DeckLibrary';
import StudyMode from '../components/Flashcards/StudyMode';

export default function Flashcards() {
  const { activeDeckId } = useFlashcards();

  return (
    <div className="flex-1 h-full w-full bg-(--bg-primary) overflow-hidden flex flex-col">
      {activeDeckId ? <StudyMode /> : <DeckLibrary />}
    </div>
  );
}
