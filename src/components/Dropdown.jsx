import React, { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useDropdown } from '../hooks/useLeaderboard';

const Dropdown = ({ 
  label, 
  value, 
  options, 
  onChange, 
  icon: Icon,
  className = ""
}) => {
  const { isOpen, toggle, close } = useDropdown();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close]);

  return (
    <div className={`relative w-full sm:w-auto ${className}`} ref={dropdownRef}>
      <button
        onClick={toggle}
        className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-2 rounded-md border border-neutral-200 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium shadow-sm hover:bg-neutral-50 hover:border-neutral-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 transition-colors min-w-0"
      >
        {Icon && <Icon className="h-4 w-4 text-neutral-700 flex-shrink-0" />}
        <span className="truncate flex-1 text-left sm:flex-initial">{label}</span>
        <ChevronDown className={`h-4 w-4 text-neutral-700 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-full sm:w-44 rounded-md border border-neutral-200 bg-white shadow-lg overflow-hidden z-50">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                close();
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 transition-colors ${
                value === option.value ? 'bg-neutral-100 font-medium' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;