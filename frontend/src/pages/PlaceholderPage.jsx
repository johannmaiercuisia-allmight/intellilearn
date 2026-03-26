export function PlaceholderPage({ title }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <p className="text-sm text-slate-500 mt-2">This page is coming soon.</p>
    </div>
  );
}

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800">403</h1>
        <p className="text-slate-500 mt-2">You don't have permission to access this page.</p>
      </div>
    </div>
  );
}
