import React from 'react';
import { Search, RefreshCw } from 'lucide-react';

export function Header({ onOpenSearch, bookmarkCount, onRefresh, isRefreshing }) {
  return (
    <header className="sticky top-0 z-30 glass-header px-4 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-cyan-500/30 p-0.5 shadow-lg shadow-cyan-500/20 flex-shrink-0">
          <img src="/logo.png" alt="OpenFresher" className="w-full h-full object-contain rounded-[8px]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-extrabold text-lg text-white tracking-tight leading-none">
              Open<span className="text-cyan-400">Fresher</span>
            </h1>
            <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-blue-500/30">
              PRO
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Latest Job & Hiring Alerts</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 transition-all active:scale-95 disabled:opacity-50"
          title="Refresh Feed"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        <button
          onClick={onOpenSearch}
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 transition-all active:scale-95"
          title="Search Jobs"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
