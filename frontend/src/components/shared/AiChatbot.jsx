import { useState, useRef, useEffect } from 'react';
import api from '../../services/api';

export default function AiChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I\'m your course assistant. Ask me anything about your courses, grades, or assessments.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { from: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chatbot', { message: text });
      setMessages((prev) => [...prev, { from: 'bot', text: res.data.response }]);
    } catch {
      setMessages((prev) => [...prev, { from: 'bot', text: 'Sorry, the assistant is unavailable right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
      {/* Chat window */}
      {open && (
        <div style={{
          width: '320px', height: '420px', background: '#fff',
          borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column',
          marginBottom: '12px', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ background: '#4f46e5', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: '14px', margin: 0 }}>Course Assistant</p>
              <p style={{ color: '#c7d2fe', fontSize: '11px', margin: 0 }}>Ask about your courses</p>
            </div>
            <button onClick={() => setOpen(false)} style={{ color: '#c7d2fe', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '8px 12px', borderRadius: '12px', fontSize: '13px', lineHeight: '1.4',
                  background: msg.from === 'user' ? '#4f46e5' : '#f1f5f9',
                  color: msg.from === 'user' ? '#fff' : '#334155',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: '#f1f5f9', padding: '8px 12px', borderRadius: '12px', fontSize: '13px', color: '#94a3b8' }}>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a question..."
              style={{
                flex: 1, padding: '8px 12px', borderRadius: '8px',
                border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: '#4f46e5', color: '#fff', border: 'none',
                borderRadius: '8px', padding: '8px 14px', cursor: 'pointer',
                fontSize: '13px', opacity: loading || !input.trim() ? 0.5 : 1,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: '#4f46e5', color: '#fff', border: 'none',
          cursor: 'pointer', fontSize: '22px', boxShadow: '0 4px 16px rgba(79,70,229,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        title="Course Assistant"
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}
