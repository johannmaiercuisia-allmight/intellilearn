import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

export default function StudentMaterialViewerPage() {
  const { courseId, lessonId, materialId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [material, setMaterial] = useState(state?.material || null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I can answer questions about this material. What would you like to know?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lessonContext, setLessonContext] = useState(null);
  const bottomRef = useRef(null);

  // Fetch material from API if state was lost (page reload)
  useEffect(() => {
    if (!material && materialId) {
      api.get(`/courses/${courseId}/lessons/${lessonId}`)
        .then(res => {
          const found = res.data.lesson?.materials?.find(m => String(m.id) === String(materialId));
          if (found) setMaterial(found);
        })
        .catch(console.error);
    }
  }, [materialId]);

  // Fetch extracted text for AI — use materialId directly so it works even before material loads
  useEffect(() => {
    const id = materialId || material?.id;
    if (!id) return;
    api.get(`/ai/materials/${id}/context`)
      .then(res => {
        if (res.data.has_text) {
          setLessonContext(res.data.extracted_text);
          setMessages([{ from: 'bot', text: 'Hi! I have read this lesson material. Ask me anything about it!' }]);
        }
      })
      .catch(() => {});
  }, [materialId]);

  useEffect(() => {
    if (chatOpen) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { from: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/ai/chatbot', {
        message: text,
        lesson_context: lessonContext,
        material_title: material?.title,
      });
      setMessages(prev => [...prev, { from: 'bot', text: res.data.response }]);
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, the assistant is unavailable right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (!material) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-slate-500">Loading material...</p>
      </div>
    );
  }

  const fileUrl = material.file_url || material.url;

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/student/courses/${courseId}/lessons/${lessonId}`)}
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
            Back to lesson
          </button>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-medium text-slate-800">{material.title}</span>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">{material.type}</span>
        </div>
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" download={material.type !== 'link'}
          className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
          {material.type === 'link' ? 'Open in new tab' : 'Download'}
        </a>
      </div>

      <div className="flex-1">
        {material.type === 'pdf' && fileUrl ? (
          <iframe src={fileUrl} title={material.title} className="w-full h-full"
            style={{ minHeight: 'calc(100vh - 112px)', border: 'none' }} />
        ) : material.type === 'docx' && fileUrl ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 bg-slate-50"
            style={{ minHeight: 'calc(100vh - 112px)' }}>
            <span className="text-6xl">📝</span>
            <p className="text-slate-700 font-medium">{material.title}</p>
            <p className="text-sm text-slate-500">Word documents cannot be previewed in the browser.</p>
            <a href={fileUrl} download className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Download to view
            </a>
          </div>
        ) : material.type === 'link' && fileUrl ? (
          <iframe src={fileUrl} title={material.title} className="w-full h-full"
            style={{ minHeight: 'calc(100vh - 112px)', border: 'none' }} />
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-50"
            style={{ minHeight: 'calc(100vh - 112px)' }}>
            <p className="text-slate-500">Cannot preview this file type.</p>
          </div>
        )}
      </div>

      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
        {chatOpen && (
          <div style={{ width: '320px', height: '420px', background: '#fff', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', marginBottom: '12px', overflow: 'hidden' }}>
            <div style={{ background: '#4f46e5', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#fff', fontWeight: 600, fontSize: '14px', margin: 0 }}>Course Assistant</p>
                <p style={{ color: '#c7d2fe', fontSize: '11px', margin: 0 }}>
                  {lessonContext ? 'Reading this PDF' : 'Ask about your courses'}
                </p>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ color: '#c7d2fe', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>x</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '80%', padding: '8px 12px', borderRadius: '12px', fontSize: '13px', lineHeight: '1.4', background: msg.from === 'user' ? '#4f46e5' : '#f1f5f9', color: msg.from === 'user' ? '#fff' : '#334155' }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ background: '#f1f5f9', padding: '8px 12px', borderRadius: '12px', fontSize: '13px', color: '#94a3b8' }}>Thinking...</div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div style={{ padding: '10px 12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Ask about this material..."
                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none' }} />
              <button onClick={sendMessage} disabled={loading || !input.trim()}
                style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px', opacity: loading || !input.trim() ? 0.5 : 1 }}>
                Send
              </button>
            </div>
          </div>
        )}
        <button onClick={() => setChatOpen(v => !v)}
          style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '22px', boxShadow: '0 4px 16px rgba(79,70,229,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Course Assistant">
          {chatOpen ? 'x' : '💬'}
        </button>
      </div>
    </div>
  );
}
