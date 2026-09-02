import { useState, useEffect } from 'react';
import { Search, Check, Loader2 } from 'lucide-react';

export default function RoomNotes({ roomId }) {
  const storageKey = `ew_room_notes_${roomId}`;
  const [text, setText] = useState(() => localStorage.getItem(storageKey) ?? '');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState('idle');

  // Debounced auto-save
  useEffect(() => {
    if (saveStatus !== 'saving') return;
    const timer = setTimeout(() => {
      localStorage.setItem(storageKey, text);
      setSaveStatus('saved');
      const resetTimer = setTimeout(() => setSaveStatus('idle'), 2000);
      return () => clearTimeout(resetTimer);
    }, 700);
    return () => clearTimeout(timer);
  }, [text, saveStatus, storageKey]);

  function handleTextChange(e) {
    setText(e.target.value);
    setSaveStatus('saving');
  }

  function getFilteredContent() {
    if (!searchQuery) return text;
    return text.split('\n').filter(l => l.toLowerCase().includes(searchQuery.toLowerCase())).join('\n');
  }

  function getWordCount() {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between gap-3 px-4 py-2 border-b border-(--border-default)" style={{ background: 'var(--bg-elevated)' }}>
        <div className="flex items-center gap-2 flex-1 max-w-xs px-3 py-1.5 rounded-lg bg-(--bg-glass) border border-(--border-default)">
          <Search size={12} className="text-(--text-muted)" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-xs text-(--text-primary) placeholder:text-(--text-muted)"
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-(--text-muted)">
          {saveStatus === 'saving' && <Loader2 size={12} className="animate-spin" />}
          {saveStatus === 'saved' && <Check size={12} className="text-green-500" />}
          <span>{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : ''}</span>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-auto p-4">
        {searchQuery ? (
          <div>
            <div className="text-xs font-medium text-(--text-muted) mb-2">Search Results:</div>
            <pre className="text-sm whitespace-pre-wrap text-(--text-secondary) font-mono">{getFilteredContent() || 'No matches found'}</pre>
          </div>
        ) : (
          <textarea
            className="w-full h-full min-h-[300px] resize-none bg-transparent outline-none text-sm leading-relaxed text-(--text-primary) placeholder:text-(--text-muted)"
            placeholder={'Jot down shared notes for the room...\n\n💡 Use # for headings\n💡 Use - for lists'}
            value={text}
            onChange={handleTextChange}
          />
        )}
      </div>

      <footer className="flex items-center gap-4 px-4 py-2 border-t border-(--border-default) text-[10px] text-(--text-muted)">
        <span>{getWordCount()} words</span>
        <span>{text.length} characters</span>
      </footer>
    </div>
  );
}
