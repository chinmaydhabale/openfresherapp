import { cleanAdSense } from '../utils/cleanAdSense';

const BLOG_DOMAIN = 'https://www.openfresher.com';
const BOOKMARKS_STORAGE_KEY = 'openfresher_saved_jobs';

/**
 * Extract image URL from Blogger post entry or raw HTML content
 */
function extractThumbnail(entry) {
  if (entry['media$thumbnail'] && entry['media$thumbnail'].url) {
    return entry['media$thumbnail'].url.replace('/s72-c/', '/s1600/');
  }

  const html = entry.content ? entry.content['$t'] : (entry.summary ? entry.summary['$t'] : '');
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }

  return null;
}

/**
 * Check if a URL is an image link (not a job application link)
 */
function isImageUrl(url) {
  const lower = url.toLowerCase();
  return (
    lower.includes('bp.blogspot.com') ||
    lower.includes('blogger.googleusercontent.com') ||
    lower.includes('lh3.googleusercontent.com') ||
    lower.includes('imgur.com') ||
    lower.includes('imgbb.com') ||
    lower.includes('unsplash.com') ||
    lower.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?|$)/i) !== null
  );
}

/**
 * Extract the actual "Apply Now" or job application link from post HTML.
 * Looks for links with text like "Apply", "Click Here", "Register", etc.
 * Falls back to first external non-image link.
 */
function extractApplyLink(htmlContent, alternateLink) {
  if (!htmlContent) return alternateLink;

  // Step 1: Look for anchor tags with "Apply" or "Click Here" text
  const anchorRegex = /<a\s+[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  const applyKeywords = ['apply', 'click here', 'register', 'submit', 'careers', 'job link', 'official link'];
  const candidateLinks = [];

  while ((match = anchorRegex.exec(htmlContent)) !== null) {
    const url = match[1];
    const linkText = match[2].replace(/<[^>]*>/g, '').trim().toLowerCase();

    // Skip internal/image links
    if (url.includes('openfresher.com') ||
        url.includes('blogger.com') ||
        url.includes('google.com') ||
        url.includes('gstatic.com') ||
        isImageUrl(url)) {
      continue;
    }

    // Check if link text contains apply-related keywords
    for (const keyword of applyKeywords) {
      if (linkText.includes(keyword)) {
        return url; // Found exact apply link!
      }
    }

    // Store as candidate external link
    candidateLinks.push(url);
  }

  // Step 2: Return first external non-image link as fallback
  if (candidateLinks.length > 0) {
    return candidateLinks[0];
  }

  // Step 3: Final fallback - the blog post URL itself
  return alternateLink;
}

/**
 * Strip inline style attributes from HTML to prevent color conflicts
 */
function stripInlineStyles(html) {
  if (!html) return '';
  // Remove style attributes but keep class and other attributes
  return html.replace(/\s+style\s*=\s*"[^"]*"/gi, '')
             .replace(/\s+style\s*=\s*'[^']*'/gi, '');
}

/**
 * Normalize raw Blogger RSS JSON feed entry into clean Native Job Object
 */
function formatPostEntry(entry) {
  const id = entry.id ? entry.id['$t'] : Math.random().toString(36).substr(2, 9);
  const title = entry.title ? entry.title['$t'] : 'Job Opportunity';

  const rawHtml = entry.content ? entry.content['$t'] : (entry.summary ? entry.summary['$t'] : '');
  const cleanedHtml = stripInlineStyles(cleanAdSense(rawHtml));

  let alternateLink = BLOG_DOMAIN;
  if (entry.link && Array.isArray(entry.link)) {
    const alt = entry.link.find(l => l.rel === 'alternate');
    if (alt && alt.href) alternateLink = alt.href;
  }

  const categories = entry.category
    ? entry.category.map(c => c.term).filter(Boolean)
    : ['Jobs'];

  const publishedRaw = entry.published ? entry.published['$t'] : null;
  const publishedDate = publishedRaw
    ? new Date(publishedRaw).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently';

  const thumbnail = extractThumbnail(entry);
  // Extract apply link from ORIGINAL HTML (before stripping styles) to preserve href attributes
  const applyUrl = extractApplyLink(cleanAdSense(rawHtml), alternateLink);

  return {
    id,
    title,
    content: cleanedHtml,
    categories,
    publishedDate,
    thumbnail,
    url: alternateLink,
    applyUrl
  };
}

/**
 * Fetch JSON with retry and timeout handling
 */
async function fetchWithRetry(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.warn(`[BloggerAPI] Fetch attempt ${attempt + 1} failed:`, err.message);
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
}

export const bloggerApi = {
  async fetchPosts(startIndex = 1, maxResults = 20, category = null) {
    try {
      let feedUrl = `${BLOG_DOMAIN}/feeds/posts/default?alt=json&start-index=${startIndex}&max-results=${maxResults}`;
      if (category && category !== 'All') {
        feedUrl = `${BLOG_DOMAIN}/feeds/posts/default/-/${encodeURIComponent(category)}?alt=json&start-index=${startIndex}&max-results=${maxResults}`;
      }

      console.log('[BloggerAPI] Fetching:', feedUrl);
      const data = await fetchWithRetry(feedUrl);

      if (!data.feed || !data.feed.entry) {
        return { posts: [], totalResults: 0 };
      }

      const posts = data.feed.entry.map(formatPostEntry);
      const totalResults = data.feed['openSearch$totalResults']
        ? parseInt(data.feed['openSearch$totalResults']['$t'], 10)
        : posts.length;

      return { posts, totalResults };
    } catch (error) {
      console.error('[BloggerAPI] Error:', error);
      return { posts: [], totalResults: 0, error: error.message };
    }
  },

  async searchPosts(query) {
    try {
      if (!query || !query.trim()) return [];
      const feedUrl = `${BLOG_DOMAIN}/feeds/posts/default?alt=json&q=${encodeURIComponent(query.trim())}&max-results=30`;
      const data = await fetchWithRetry(feedUrl);
      if (!data.feed || !data.feed.entry) return [];
      return data.feed.entry.map(formatPostEntry);
    } catch (error) {
      console.error('[BloggerAPI] Search error:', error);
      return [];
    }
  },

  getBookmarks() {
    try {
      const data = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  isBookmarked(postId) {
    return this.getBookmarks().some(b => b.id === postId);
  },

  toggleBookmark(post) {
    let bookmarks = this.getBookmarks();
    const exists = bookmarks.some(b => b.id === post.id);
    if (exists) {
      bookmarks = bookmarks.filter(b => b.id !== post.id);
    } else {
      bookmarks.unshift(post);
    }
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    return !exists;
  }
};
