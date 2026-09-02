import { useNotes } from '../../contexts/NotesContext';
import { Download, Trash2 } from 'lucide-react';

export default function PDFViewer() {
  const { notes, activeNoteId, deleteNote } = useNotes();
  const activeNote = notes.find((n) => n.id === activeNoteId);

  if (!activeNote || activeNote.type !== 'pdf') return null;

  return (
    <div className="flex-1 flex flex-col h-full bg-(--bg-primary) overflow-hidden relative">
      {/* Top Action Bar */}
      <div className="h-14 border-b border-(--border-subtle) flex items-center justify-between px-6 shrink-0 bg-(--bg-primary)/80 backdrop-blur-md sticky top-0 z-10">
        <div className="font-semibold text-(--text-primary) truncate max-w-md">
          {activeNote.title}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={activeNote.url}
            download={activeNote.title + '.pdf'}
            className="p-2 text-(--text-secondary) hover:text-(--accent) hover:bg-(--bg-hover) rounded-lg transition-colors cursor-pointer"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={() => deleteNote(activeNote.id)}
            className="p-2 text-(--text-secondary) hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            title="Delete Note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF iframe */}
      <div className="flex-1 w-full bg-zinc-900">
        <iframe
          src={activeNote.url}
          className="w-full h-full border-none"
          title={activeNote.title}
        />
      </div>
    </div>
  );
}
