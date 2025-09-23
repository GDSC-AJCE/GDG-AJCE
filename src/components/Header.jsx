import React from 'react';

const Header = () => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-14 sm:h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="inline-flex -space-x-1 flex-shrink-0">
                <img src="/gdg-logo.svg" alt="GDG Logo" className="h-6 w-8 sm:h-8 sm:w-12" />
              </span>
              <span className="text-sm sm:text-[15px] font-semibold tracking-tight leading-none">GDG</span>
            </div>
            <div className="h-4 sm:h-5 w-px bg-neutral-200 flex-shrink-0"></div>
            <div className="hidden xs:flex sm:flex flex-col min-w-0">
              <span className="text-xs sm:text-[14px] font-medium tracking-tight truncate">Study Jam</span>
              <span className="text-[10px] sm:text-[12px] text-neutral-500 truncate">Leaderboard</span>
            </div>
          </div>

          {/* Actions - Can be extended with user menu, notifications, etc. */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Future: Add user profile, settings, etc. */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;