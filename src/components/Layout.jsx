import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children, onOpenSettings }) {
  const location = useLocation();
  const isChat = location.pathname === '/chat';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-sm text-white">
              S
            </span>
            StudyAI
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                !isChat ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/chat"
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isChat ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chat Tutor
            </Link>
            <button
              type="button"
              onClick={onOpenSettings}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Pengaturan
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
