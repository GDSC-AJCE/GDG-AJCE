import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
    { path: '/core', label: 'Core' },
    { path: '/leaderboard', label: 'Leaderboard' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-14 sm:h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0 hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="inline-flex -space-x-1 flex-shrink-0">
                <img src="/gdg-logo.svg" alt="GDG Logo" className="h-6 w-8 sm:h-8 sm:w-12" />
              </span>
              <span className="text-sm sm:text-[15px] font-semibold tracking-tight leading-none">GDG</span>
            </div>
            <div className="h-4 sm:h-5 w-px bg-neutral-200 flex-shrink-0"></div>
            <div className="hidden xs:flex sm:flex flex-col min-w-0">
              <span className="text-xs sm:text-[14px] font-medium tracking-tight truncate">AJCE</span>
              <span className="text-[10px] sm:text-[12px] text-neutral-500 truncate">Community</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            <div className="relative">
              <select 
                className="text-sm border border-neutral-200 rounded-lg px-3 py-1.5 bg-white appearance-none pr-8"
                value={location.pathname}
                onChange={(e) => {
                  // Navigate to selected route
                  window.location.href = e.target.value;
                }}
              >
                {navItems.map((item) => (
                  <option key={item.path} value={item.path}>
                    {item.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;