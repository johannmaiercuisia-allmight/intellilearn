import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function StudentMaterialViewerPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  // material passed via navigation state: { title, type, file_url, url }
  const material = state?.material;

  if (!material) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-slate-500">No material to display.</p>
        <button onClick={() => navigate(-1)} className="text-sm text-indigo-600 hover:underline">← Go back</button>
      </div>
    );
  }

  const fileUrl = material.file_url || material.url;

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 'calc(100vh - 64px)' }}>
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/student/courses/${courseId}/lessons/${lessonId}`)}
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
          >
            ← Back to lesson
          </button>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-medium text-slate-800">{material.title}</span>
          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">{material.type}</span>
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          download={material.type !== 'link'}
          className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {material.type === 'link' ? 'Open in new tab' : 'Download'}
        </a>
      </div>

      {/* Viewer area */}
      <div className="flex-1">
        {material.type === 'pdf' && fileUrl ? (
          <iframe
            src={fileUrl}
            title={material.title}
            className="w-full h-full"
            style={{ minHeight: 'calc(100vh - 112px)', border: 'none' }}
          />
        ) : material.type === 'docx' && fileUrl ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 bg-slate-50" style={{ minHeight: 'calc(100vh - 112px)' }}>
            <span className="text-6xl">📝</span>
            <p className="text-slate-700 font-medium">{material.title}</p>
            <p className="text-sm text-slate-500">Word documents can't be previewed in the browser.</p>
            <a
              href={fileUrl}
              download
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Download to view
            </a>
          </div>
        ) : material.type === 'link' && fileUrl ? (
          <iframe
            src={fileUrl}
            title={material.title}
            className="w-full h-full"
            style={{ minHeight: 'calc(100vh - 112px)', border: 'none' }}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-50" style={{ minHeight: 'calc(100vh - 112px)' }}>
            <p className="text-slate-500">Cannot preview this file type.</p>
          </div>
        )}
      </div>
    </div>
  );
}
