import { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Check, CheckCheck } from 'lucide-react';

const DUMMY_MESSAGES = [
  { id: 1, author: 'Sarah J.', text: 'Hey! Did everyone read chapter 4?', time: '10:42 AM', self: false, read: true },
  { id: 2, author: 'You',      text: 'Yes, the kinematics section was tricky.', time: '10:43 AM', self: true, read: true },
  { id: 3, author: 'Mike T.',  text: 'Same. The net force equation confused me.',  time: '10:44 AM', self: false, read: false },
  { id: 4, author: 'Sarah J.', text: 'Let me explain it to you after class!', time: '10:45 AM', self: false, read: false },
];

export default function RoomChat() {
  const [messages, setMessages] = useState(DUMMY_MESSAGES);
  const [input, setInput] = useState('');
  const [typingUsers, setTypingUsers] = useState(['Mike T.']);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [
      ...prev,
      { id: Date.now(), author: 'You', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), self: true, read: false },
    ]);
    setInput('');
  }

  useEffect(() => {
    if (messages.length > DUMMY_MESSAGES.length && messages[messages.length - 1].self) {
      const t1 = setTimeout(() => {
        setTypingUsers(['Sarah J.']);
        const t2 = setTimeout(() => setTypingUsers([]), 2000);
        return () => clearTimeout(t2);
      }, 1000);
      return () => clearTimeout(t1);
    }
  }, [messages]);

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.self ? 'items-end' : 'items-start'}`}>
            {!msg.self && (
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: 'oklch(0.58 0.22 var(--accent-hue))' }}>
                  {msg.author.charAt(0)}
                </span>
                <span className="text-xs font-medium text-(--text-secondary)">{msg.author}</span>
              </div>
            )}
            <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${
              msg.self
                ? 'rounded-br-md text-white'
                : 'rounded-bl-md border border-(--border-default)'
            }`}
              style={msg.self
                ? { background: 'oklch(0.58 0.22 var(--accent-hue))' }
                : { background: 'var(--bg-surface)' }
              }
            >
              {msg.text}
            </div>
            <div className="flex items-center gap-1 mt-0.5 px-1">
              <span className="text-[9px] text-(--text-muted)">{msg.time}</span>
              {msg.self && (
                <span style={{ color: msg.read ? 'oklch(0.58 0.22 var(--accent-hue))' : 'var(--text-muted)' }}>
                  {msg.read ? <CheckCheck size={10} /> : <Check size={10} />}
                </span>
              )}
            </div>
          </div>
        ))}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-(--text-muted)">
            <div className="flex gap-0.5">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-(--text-muted) animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <span>{typingUsers.length === 1 ? `${typingUsers[0]} is typing...` : `${typingUsers.length} people are typing...`}</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 p-3 border-t border-(--border-default)" style={{ background: 'var(--bg-elevated)' }}>
        <button className="p-2 rounded-lg hover:bg-(--bg-glass) text-(--text-muted) transition-colors">
          <Paperclip size={16} />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          className="flex-1 bg-(--bg-glass) border border-(--border-default) rounded-xl px-4 py-2 text-sm outline-none transition-colors focus:border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.4)] text-(--text-primary) placeholder:text-(--text-muted)"
        />
        <button className="p-2 rounded-lg hover:bg-(--bg-glass) text-(--text-muted) transition-colors">
          <Smile size={16} />
        </button>
        <button onClick={sendMessage} className="p-2 rounded-xl text-white transition-all hover:opacity-90" style={{ background: 'oklch(0.58 0.22 var(--accent-hue))' }}>
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
