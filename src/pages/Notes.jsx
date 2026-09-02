import { useNotes } from '../contexts/NotesContext';
import NotesSidebar from '../components/Notes/NotesSidebar';
import NotesEditor from '../components/Notes/NotesEditor';
import EmptyNotesState from '../components/Notes/EmptyNotesState';
import PDFViewer from '../components/Notes/PDFViewer';

export default function Notes() {
  const { notes, activeNoteId } = useNotes();
  const activeNote = notes.find(n => n.id === activeNoteId);

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-(--bg-primary) rounded-tl-xl border-l border-t border-(--border-subtle)">
      <NotesSidebar />
      {!activeNote ? (
        <EmptyNotesState />
      ) : activeNote.type === 'pdf' ? (
        <PDFViewer />
      ) : (
        <NotesEditor />
      )}
    </div>
  );
}
