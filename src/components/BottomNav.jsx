import React from 'react';
import { Home, Grid, Bookmark, Search } from 'lucide-react';

export function BottomNav({ activeTab, setActiveTab, bookmarkCount, onOpenSearch }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'bookmarks', label: 'Saved', icon: Bookmark, badge: bookmarkCount > 0 ? bookmarkCount : null },
    { id: 'search', label: 'Search', icon: Search, isAction: true }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 glass-nav z-40 px-4 py-2 flex items-center justify-around shadow-2xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.isAction) {
                onOpenSearch();
              } else {
                setActiveTab(tab.id);
              }
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
              isActive
                ? 'text-cyan-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {tab.badge && (
                <span className="absolute -top-1.5 -right-2.5 bg-amber-500 text-slate-950 font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-slate-900">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
