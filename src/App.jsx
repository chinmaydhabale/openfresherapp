import React, { useState, useEffect } from 'react';
import { bloggerApi } from './services/bloggerApi';
import { appUpdateService } from './services/appUpdateService';
import { Header } from './components/Header';
import { CategoryChips } from './components/CategoryChips';
import { JobCard } from './components/JobCard';
import { JobDetailModal } from './components/JobDetailModal';
import { SearchModal } from './components/SearchModal';
import { BookmarksView } from './components/BookmarksView';
import { BottomNav } from './components/BottomNav';
import { FeaturedSlider } from './components/FeaturedSlider';
import { UpdateModal } from './components/UpdateModal';
import { PullToRefresh } from './components/PullToRefresh';
import { Loader2, AlertCircle, Layers } from 'lucide-react';

import { liveOtaService } from './services/liveOtaService';
import { notificationService } from './services/notificationService';
import { fcmPushService } from './services/fcmPushService';

export function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [bookmarks, setBookmarks] = useState([]);
  const [updateInfo, setUpdateInfo] = useState(null);

  // Load bookmarks, initialize Live OTA updates & check for APK updates on mount
  useEffect(() => {
    setBookmarks(bloggerApi.getBookmarks());

    // 1. Silent Live OTA Updater Initialization
    liveOtaService.init();

    // 2. Request Notification Permission & Initialize FCM Push Notifications
    notificationService.requestPermission();
    fcmPushService.init((notificationData) => {
      console.log('[App] Push Notification Tapped with Data:', notificationData);
    });

    // 3. In-App APK update check
    appUpdateService.checkForUpdates().then((info) => {
      if (info && info.hasUpdate) {
        setUpdateInfo(info);
      }
    });
  }, []);

  // Load posts whenever active category changes
  useEffect(() => {
    loadPosts(activeCategory);
  }, [activeCategory]);

  const loadPosts = async (category = 'All', isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    const result = await bloggerApi.fetchPosts(1, 30, category);
    if (result.error) {
      setError(result.error);
    } else {
      setPosts(result.posts);
      // Check for new job posts and trigger native notification
      notificationService.checkAndNotifyNewJobs(result.posts);
    }

    setLoading(false);
    setRefreshing(false);
  };

  const handleToggleBookmark = (post) => {
    bloggerApi.toggleBookmark(post);
    setBookmarks(bloggerApi.getBookmarks());
  };

  const isBookmarked = (postId) => bookmarks.some(b => b.id === postId);

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f19', color: '#f1f5f9', paddingBottom: '72px' }}>
      {/* Top App Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        bookmarkCount={bookmarks.length}
        onRefresh={() => loadPosts(activeCategory, true)}
        isRefreshing={refreshing}
      />

      {/* Categories Filter Bar */}
      {activeTab === 'home' && (
        <CategoryChips
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Main Content with Pull-To-Refresh */}
      {activeTab === 'home' && (
        <PullToRefresh
          onRefresh={() => loadPosts(activeCategory, true)}
          isRefreshing={refreshing}
        >
          <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
            {/* Loading Skeleton */}
            {loading && (
              <div className="space-y-4">
                <div className="h-44 rounded-2xl animate-shimmer" style={{ border: '1px solid rgba(255,255,255,0.05)' }} />
                <div className="h-28 rounded-2xl animate-shimmer" style={{ border: '1px solid rgba(255,255,255,0.05)' }} />
                <div className="h-28 rounded-2xl animate-shimmer" style={{ border: '1px solid rgba(255,255,255,0.05)' }} />
              </div>
            )}

            {/* Error View */}
            {!loading && error && (
              <div style={{ padding: '48px 16px', textAlign: 'center' }} className="glass-card rounded-2xl">
                <AlertCircle style={{ width: 40, height: 40, color: '#fb7185', margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: 4 }}>Unable to fetch job alerts</h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: 16 }}>{error}</p>
                <button
                  onClick={() => loadPosts(activeCategory)}
                  style={{
                    padding: '10px 20px', borderRadius: '12px', border: 'none',
                    background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                    color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer'
                  }}
                >
                  Retry Connection
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && posts.length === 0 && (
              <div style={{ padding: '64px 16px', textAlign: 'center', color: '#94a3b8' }}>
                <Layers style={{ width: 40, height: 40, margin: '0 auto 8px', color: '#475569' }} />
                <p style={{ fontSize: '14px', fontWeight: 600 }}>No posts found in "{activeCategory}"</p>
              </div>
            )}

            {/* Featured Posts Slider / Single Section */}
            {!loading && !error && (
              <FeaturedSlider
                posts={posts}
                onSelectPost={setSelectedPost}
              />
            )}

            {/* All Job Alerts Feed */}
            {!loading && !error && posts.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingTop: '4px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Recent Job Alerts ({posts.length})
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {posts.map((post) => (
                    <JobCard
                      key={post.id}
                      post={post}
                      onSelectPost={setSelectedPost}
                      isBookmarked={isBookmarked(post.id)}
                      onToggleBookmark={handleToggleBookmark}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </PullToRefresh>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Explore Categories</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { name: 'Freshers Jobs', sub: '100+ Jobs', color: '#2563eb' },
              { name: 'MNC Jobs', sub: 'Top Hiring', color: '#7c3aed' },
              { name: 'Software Engineer', sub: 'IT & Dev', color: '#059669' },
              { name: 'Engineering Jobs', sub: 'BE/B.Tech', color: '#d97706' },
              { name: 'Remote Jobs', sub: 'Work From Home', color: '#e11d48' },
              { name: 'Internships', sub: '2025/2026/2027', color: '#0891b2' }
            ].map((cat) => (
              <div
                key={cat.name}
                onClick={() => { setActiveCategory(cat.name); setActiveTab('home'); }}
                className="glass-card"
                style={{ padding: '16px', borderRadius: '16px', cursor: 'pointer' }}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  background: cat.color, marginBottom: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 700, color: '#fff'
                }}>
                  {cat.name.charAt(0)}
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{cat.name}</h3>
                <p style={{ fontSize: '11px', color: '#94a3b8' }}>{cat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookmarks Tab */}
      {activeTab === 'bookmarks' && (
        <BookmarksView
          bookmarks={bookmarks}
          onSelectPost={setSelectedPost}
          onToggleBookmark={handleToggleBookmark}
        />
      )}

      {/* Job Detail Modal */}
      {selectedPost && (
        <JobDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          isBookmarked={isBookmarked(selectedPost.id)}
          onToggleBookmark={handleToggleBookmark}
        />
      )}

      {/* Search Modal */}
      {isSearchOpen && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectPost={(post) => { setSelectedPost(post); setIsSearchOpen(false); }}
        />
      )}

      {/* In-App Update Modal */}
      {updateInfo && (
        <UpdateModal
          updateInfo={updateInfo}
          onClose={() => setUpdateInfo(null)}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookmarkCount={bookmarks.length}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
    </div>
  );
}
