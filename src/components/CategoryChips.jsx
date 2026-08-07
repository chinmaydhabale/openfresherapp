import React from 'react';

const CATEGORIES = [
  'All',
  'Freshers Jobs',
  'MNC Jobs',
  'Software Engineer',
  'Engineering Jobs',
  'Computer Science',
  'Remote Jobs',
  'Internships'
];

export function CategoryChips({ activeCategory, onSelectCategory }) {
  return (
    <div className="px-4 py-2.5 overflow-x-auto scrollbar-none flex items-center gap-2 bg-slate-900/60 border-b border-slate-800/60">
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 ${
              isActive
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25 border border-cyan-400/40 scale-[1.02]'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
