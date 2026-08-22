import { Link, useLocation } from 'react-router-dom';

/**
 * Header component with navigation
 */
export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            📔 Daily Journal
          </Link>
          <div className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1">
            <span className="text-sm font-medium text-blue-700">Mood Tracker App</span>
          </div>
        </div>

        <nav aria-label="Primary navigation" className="flex gap-6">
          <Link
            to="/"
            aria-current={isActive('/') ? 'page' : undefined}
            className={`pb-2 text-sm font-medium transition-colors ${
              isActive('/')
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Home
          </Link>
          <Link
            to="/journals"
            aria-current={isActive('/journals') ? 'page' : undefined}
            className={`pb-2 text-sm font-medium transition-colors ${
              isActive('/journals')
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Journals
          </Link>
          <Link
            to="/new"
            aria-current={isActive('/new') ? 'page' : undefined}
            className={`pb-2 text-sm font-medium transition-colors ${
              isActive('/new')
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            New Entry
          </Link>
        </nav>
      </div>
    </header>
  );
}
