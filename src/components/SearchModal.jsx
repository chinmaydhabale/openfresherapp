import React, { useState } from 'react';
import { Search, X, Loader2, ChevronRight } from 'lucide-react';
import { bloggerApi } from '../services/bloggerApi';

export function SearchModal({ isOpen, onClose, onSelectPost }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setSearched(true);
    const posts = await bloggerApi.searchPosts(query);
    setResults(posts);
    setIsSearching(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col h-full w-full p-4 animate-in fade-in duration-150">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Search className="w-5 h-5 text-cyan-400" />
          Search Job Alerts
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSearch} className="relative mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jobs (e.g. HP, Software Engineer, Remote)..."
          className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-3.5 pr-12 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm shadow-inner"
          autoFocus
        />
        <button
          type="submit"
          disabled={isSearching}
          className="absolute right-2 top-2 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all disabled:opacity-50"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
      </form>

      {/* Search Results List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {isSearching && (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
            <p className="text-xs">Searching OpenFresher job posts...</p>
          </div>
        )}

        {!isSearching && searched && results.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            <p className="text-sm font-semibold">No job posts found for "{query}"</p>
            <p className="text-xs text-slate-500 mt-1">Try searching keywords like "Freshers", "Developer", "MNC"</p>
          </div>
        )}

        {!isSearching && results.map((post) => (
          <div
            key={post.id}
            onClick={() => {
              onSelectPost(post);
              onClose();
            }}
            className="glass-card rounded-xl p-3 flex items-center justify-between hover:bg-slate-800/90 cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="min-w-0 pr-3">
              <h4 className="text-xs font-bold text-slate-100 line-clamp-1 mb-1">{post.title}</h4>
              <p className="text-[11px] text-slate-400">{post.publishedDate}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
