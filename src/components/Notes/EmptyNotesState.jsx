import { FileText, Import } from 'lucide-react';
import { useNotes } from '../../contexts/NotesContext';
import { useRef } from 'react';

export default function EmptyNotesState() {
  const { addNote, importNote } = useNotes();
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importNote(file);
      } catch (err) {
        console.error("Failed to import note", err);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-(--bg-primary)">
      <div className="w-24 h-24 bg-(--bg-elevated) rounded-full flex items-center justify-center mb-6 shadow-sm border border-(--border-subtle)">
        <FileText className="w-12 h-12 text-(--text-tertiary)" />
      </div>
      <h2 className="text-2xl font-semibold mb-2 font-sora">Your Notes Workspace</h2>
      <p className="text-(--text-secondary) max-w-md mb-8">
        Select a note from the sidebar to start writing, or create a new one to jot down your thoughts.
      </p>
      <div className="flex gap-4">
        <button
          onClick={addNote}
          className="bg-(--accent) text-white px-6 py-2.5 rounded-xl font-medium shadow-md shadow-(--accent)/20 hover:-translate-y-0.5 hover:shadow-lg transition-all"
        >
          Create New Note
        </button>
        <button
          onClick={handleImportClick}
          className="flex items-center gap-2 bg-(--bg-elevated) text-(--text-primary) px-6 py-2.5 rounded-xl font-medium border border-(--border-subtle) hover:bg-(--bg-hover) transition-all cursor-pointer"
        >
          <Import className="w-4 h-4" />
          Import File
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".txt,.md"
          className="hidden"
        />
      </div>
    </div>
  );
}
