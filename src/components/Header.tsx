import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-500 shadow-md">
              <svg
                className="w-6 h-6"
                viewBox="0 0 48 48"
                fill="none"
              >
                <circle cx="24" cy="24" r="12" fill="white"/>
                <circle cx="24" cy="24" r="6" fill="#3B82F6"/>
                <circle cx="24" cy="24" r="3" fill="white"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                Icony
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors">
                Customize 2,000+ icons
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/"
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
