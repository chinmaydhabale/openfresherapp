import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Bookmark, Share2, ExternalLink, Calendar, Tag, CheckCircle2 } from 'lucide-react';

export function JobDetailModal({ post, onClose, isBookmarked, onToggleBookmark }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  if (!post) return null;

  const handleNativeShare = async () => {
    const shareText = `📢 Job Alert on OpenFresher\n\n💼 ${post.title}\n\n🔗 ${post.url}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: shareText, url: post.url });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(post.url);
      alert('Link copied!');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 100, background: '#0b0f19',
      display: 'flex', flexDirection: 'column',
      width: '100%', height: '100%'
    }}>

      {/* ====== Top Header Bar ====== */}
      <div className="glass-header" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', flexShrink: 0
      }}>
        <button
          onClick={onClose}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 12px', borderRadius: '12px',
            background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#e2e8f0', fontSize: '12px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
          Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onToggleBookmark(post)}
            style={{
              padding: '8px', borderRadius: '12px', cursor: 'pointer', border: 'none',
              background: isBookmarked ? 'rgba(245,158,11,0.2)' : 'rgba(30,41,59,0.8)',
              color: isBookmarked ? '#f59e0b' : '#94a3b8'
            }}
          >
            <Bookmark style={{ width: 16, height: 16 }} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={handleNativeShare}
            style={{
              padding: '8px', borderRadius: '12px', cursor: 'pointer', border: 'none',
              background: 'rgba(30,41,59,0.8)', color: '#94a3b8'
            }}
          >
            <Share2 style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {/* ====== Scrollable Content Area ====== */}
      <div
        ref={scrollRef}
        className="scroll-container"
        style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '80px'
        }}
      >
        <div style={{ padding: '16px' }}>

          {/* Category Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
            {post.categories && post.categories.map((cat, idx) => (
              <span key={idx} style={{
                background: 'rgba(59,130,246,0.12)', color: '#22d3ee',
                border: '1px solid rgba(6,182,212,0.25)', fontSize: '11px', fontWeight: 700,
                padding: '4px 10px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '4px'
              }}>
                <Tag style={{ width: 10, height: 10 }} />
                {cat}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '20px', fontWeight: 800, color: '#ffffff',
            lineHeight: 1.35, marginBottom: '12px', letterSpacing: '-0.3px'
          }}>
            {post.title}
          </h1>

          {/* Date & Verified Badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            fontSize: '12px', color: '#94a3b8', marginBottom: '16px',
            paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar style={{ width: 13, height: 13, color: '#22d3ee' }} />
              <span>{post.publishedDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399', fontWeight: 600 }}>
              <CheckCircle2 style={{ width: 13, height: 13 }} />
              <span>Verified</span>
            </div>
          </div>



          {/* ====== Direct HTML Blog Content ====== */}
          <div
            className="native-post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

        </div>
      </div>

      {/* ====== Bottom Apply Now Bar ====== */}
      <div className="glass-nav" style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 16px', flexShrink: 0
      }}>
        <button
          onClick={handleNativeShare}
          style={{
            padding: '14px', borderRadius: '14px', border: 'none', cursor: 'pointer',
            background: 'rgba(16,185,129,0.15)', color: '#34d399',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <Share2 style={{ width: 20, height: 20 }} />
        </button>

        <a
          href={post.applyUrl || post.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, padding: '14px 20px', borderRadius: '14px', border: 'none',
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            color: '#ffffff', fontWeight: 800, fontSize: '14px', textAlign: 'center',
            textDecoration: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 8px 24px rgba(37,99,235,0.3)'
          }}
        >
          APPLY NOW
          <ExternalLink style={{ width: 16, height: 16 }} />
        </a>
      </div>
    </div>
  );
}
