import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export function FeaturedSlider({ posts, onSelectPost }) {
  // Filter posts that explicitly contain the 'featured' tag (case-insensitive)
  const featuredPosts = (posts || [])
    .filter(post => 
      post.categories && 
      post.categories.some(cat => cat.trim().toLowerCase() === 'featured')
    )
    .slice(0, 5); // Recent 5 featured posts only

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto slide every 4 seconds if more than 1 featured post
  useEffect(() => {
    if (featuredPosts.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredPosts.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [featuredPosts.length]);

  // If NO post has the featured tag, return null (completely hide section)
  if (featuredPosts.length === 0) {
    return null;
  }

  const currentPost = featuredPosts[currentIndex] || featuredPosts[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % featuredPosts.length);
  };

  // Touch Swipe handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next
      setCurrentIndex((prev) => (prev + 1) % featuredPosts.length);
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev
      setCurrentIndex((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div 
      onClick={() => onSelectPost(currentPost)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="glass-card"
      style={{
        borderRadius: '18px', padding: '20px', marginBottom: '18px',
        borderColor: 'rgba(6, 182, 212, 0.35)', cursor: 'pointer',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(6, 182, 212, 0.12)'
      }}
    >
      {/* Background Radial Glow */}
      <div style={{
        position: 'absolute', top: '-20px', right: '-20px', width: '160px', height: '160px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%)',
        borderRadius: '50%', filter: 'blur(15px)', pointerEvents: 'none'
      }} />

      {/* Top Header Badge & Navigation Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: '#ffffff',
            fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '20px',
            textTransform: 'uppercase', letterSpacing: '0.6px',
            display: 'flex', alignItems: 'center', gap: '5px',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
          }}>
            <Sparkles style={{ width: 12, height: 12 }} /> FEATURED
          </span>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
            {currentPost.publishedDate}
          </span>
        </div>

        {/* If multiple featured posts, show left/right arrow buttons */}
        {featuredPosts.length > 1 && (
          <div style={{ display: 'flex', items: 'center', gap: '4px' }}>
            <button
              onClick={handlePrev}
              style={{
                padding: '5px', borderRadius: '8px', background: 'rgba(30,41,59,0.8)',
                border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', cursor: 'pointer'
              }}
              title="Previous Featured"
            >
              <ChevronLeft style={{ width: 14, height: 14 }} />
            </button>

            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, padding: '0 4px' }}>
              {currentIndex + 1}/{featuredPosts.length}
            </span>

            <button
              onClick={handleNext}
              style={{
                padding: '5px', borderRadius: '8px', background: 'rgba(30,41,59,0.8)',
                border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', cursor: 'pointer'
              }}
              title="Next Featured"
            >
              <ChevronRight style={{ width: 14, height: 14 }} />
            </button>
          </div>
        )}
      </div>

      {/* Featured Title */}
      <h2 style={{
        fontSize: '16px', fontWeight: 800, color: '#ffffff',
        lineHeight: 1.4, marginBottom: '12px', minHeight: '44px',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
      }}>
        {currentPost.title}
      </h2>

      {/* Featured Image */}
      {currentPost.thumbnail && (
        <div style={{
          borderRadius: '12px', overflow: 'hidden', marginBottom: '12px',
          border: '1px solid rgba(255,255,255,0.08)', height: '160px', width: '100%'
        }}>
          <img
            src={currentPost.thumbnail}
            alt={currentPost.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => e.target.style.display = 'none'}
          />
        </div>
      )}

      {/* Footer & Carousel Dots */}
      <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', paddingTop: '4px' }}>
        <span style={{ fontSize: '13px', color: '#22d3ee', fontWeight: 700 }}>
          Read Featured Post & Apply →
        </span>

        {/* Carousel Indicator Dots */}
        {featuredPosts.length > 1 && (
          <div style={{ display: 'flex', gap: '5px' }}>
            {featuredPosts.map((_, idx) => (
              <span
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                style={{
                  width: idx === currentIndex ? '16px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: idx === currentIndex ? '#06b6d4' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
