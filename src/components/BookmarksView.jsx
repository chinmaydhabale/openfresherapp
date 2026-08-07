import React from 'react';
import { Bookmark, Trash2, ChevronRight, Briefcase } from 'lucide-react';
import { JobCard } from './JobCard';

export function BookmarksView({ bookmarks, onSelectPost, onToggleBookmark }) {
  if (bookmarks.length === 0) {
    return (
      <div className="py-20 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Bookmark className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">No Saved Jobs Yet</h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Bookmark job alerts while browsing to save them for offline reading anytime!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 py-4 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
          Saved Jobs ({bookmarks.length})
        </h2>
      </div>

      <div className="grid gap-3">
        {bookmarks.map((post) => (
          <JobCard
            key={post.id}
            post={post}
            onSelectPost={onSelectPost}
            isBookmarked={true}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </div>
    </div>
  );
}
