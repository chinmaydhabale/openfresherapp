import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, ArrowDown } from 'lucide-react';

export function PullToRefresh({ onRefresh, isRefreshing, children }) {
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const THRESHOLD = 65; // px distance to trigger refresh

  const handleTouchStart = (e) => {
    // Only allow pull-to-refresh when scrolled to top of page
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  };

  const handleTouchMove = (e) => {
    if (!isPulling.current || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0 && window.scrollY === 0) {
      // Apply elastic damping effect
      const distance = Math.min(diff * 0.45, 90);
      setPullDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    if (!isPulling.current) return;
    isPulling.current = false;

    if (pullDistance >= THRESHOLD && !isRefreshing) {
      onRefresh();
    }

    setPullDistance(0);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ minHeight: '100%', position: 'relative' }}
    >
      {/* Pull To Refresh Top Banner Indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div style={{
          height: isRefreshing ? '50px' : `${pullDistance}px`,
          display: 'flex', alignItems: 'center', justifyCenter: 'center',
          transition: isPulling.current ? 'none' : 'all 0.3s ease',
          overflow: 'hidden', background: 'rgba(15,23,42,0.4)',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            color: pullDistance >= THRESHOLD || isRefreshing ? '#22d3ee' : '#94a3b8',
            fontSize: '12px', fontWeight: 700
          }}>
            {isRefreshing ? (
              <>
                <RefreshCw style={{ width: 16, height: 16 }} className="animate-spin text-cyan-400" />
                <span>Refreshing latest job alerts...</span>
              </>
            ) : pullDistance >= THRESHOLD ? (
              <>
                <RefreshCw style={{ width: 16, height: 16, transform: 'rotate(180deg)', transition: 'transform 0.2s' }} />
                <span>Release to refresh feed</span>
              </>
            ) : (
              <>
                <ArrowDown style={{ width: 16, height: 16 }} />
                <span>Pull down to refresh</span>
              </>
            )}
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
