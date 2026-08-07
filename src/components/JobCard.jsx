import React from 'react';
import { Calendar, Bookmark, ChevronRight, Sparkles } from 'lucide-react';

export function JobCard({ post, onSelectPost, isBookmarked, onToggleBookmark }) {
  const mainTag = post.categories && post.categories.length > 0 
    ? post.categories[0] 
    : 'Job Alert';

  return (
    <div 
      onClick={() => onSelectPost(post)}
      className="group glass-card rounded-2xl p-4 transition-all duration-300 hover:border-blue-500/40 hover:bg-slate-800/80 active:scale-[0.99] cursor-pointer relative overflow-hidden shadow-lg"
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all pointer-events-none" />

      <div className="flex gap-4 items-start">
        {/* Post Thumbnail */}
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700/60 relative">
          <img 
            src={post.thumbnail} 
            alt={post.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80';
            }}
          />
        </div>

        {/* Post Metadata & Title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="bg-blue-500/15 text-cyan-400 text-[11px] font-bold px-2 py-0.5 rounded-md border border-cyan-500/20 truncate">
              {mainTag}
            </span>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(post);
              }}
              className={`p-1.5 rounded-lg transition-all ${
                isBookmarked 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          </div>

          <h3 className="font-bold text-slate-100 text-sm leading-snug line-clamp-2 group-hover:text-cyan-300 transition-colors mb-2">
            {post.title}
          </h3>

          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{post.publishedDate}</span>
            </div>

            <div className="flex items-center text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform">
              <span>Read</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
