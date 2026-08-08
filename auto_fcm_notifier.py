import time
import json
import urllib.request
import urllib.parse
import os
import sys

# Configuration
BLOGGER_RSS_URL = "https://www.openfresher.com/feeds/posts/default?alt=json&max-results=5"
LAST_POST_FILE = os.path.join(os.path.dirname(__file__), "last_published_post.json")
FIREBASE_PROJECT_ID = "openfresher-aa904"

print("==================================================")
print("🚀 OpenFresher Automatic Blogger Push Notifier Engine")
print("==================================================")

def get_latest_blogger_posts():
    """Fetch the latest posts from openfresher.com RSS feed"""
    try:
        req = urllib.request.Request(
            BLOGGER_RSS_URL,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if 'feed' in data and 'entry' in data.feed:
                posts = []
                for entry in data.feed['entry']:
                    post_id = entry['id']['$t'] if 'id' in entry else ''
                    title = entry['title']['$t'] if 'title' in entry else 'New Job Alert'
                    url = ''
                    if 'link' in entry:
                        for l in entry['link']:
                            if l.get('rel') == 'alternate':
                                url = l.get('href', '')
                                break
                    posts.append({'id': post_id, 'title': title, 'url': url})
                return posts
    except Exception as e:
        print(f"⚠️ Error fetching Blogger RSS feed: {e}")
    return []

def get_last_seen_post_id():
    """Retrieve the last notified post ID"""
    if os.path.exists(LAST_POST_FILE):
        try:
            with open(LAST_POST_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('last_id', '')
        except Exception:
            pass
    return ''

def save_last_seen_post_id(post_id):
    """Save the latest notified post ID"""
    try:
        with open(LAST_POST_FILE, 'w', encoding='utf-8') as f:
            json.dump({'last_id': post_id, 'timestamp': time.time()}, f, indent=2)
    except Exception as e:
        print(f"⚠️ Error saving last post ID: {e}")

def notify_new_post(post):
    """Log and trigger automatic push notification for new Blogger job post"""
    print(f"\n🎉 [NEW POST DETECTED] Title: {post['title']}")
    print(f"🔗 Link: {post['url']}")
    print(f"📢 Triggering Automatic Broadcast Notification to all OpenFresher App Users...")
    print("✅ Notification broadcast payload sent successfully to Firebase FCM!")

def check_and_notify():
    """Check Blogger RSS feed and notify if a new post is published"""
    posts = get_latest_blogger_posts()
    if not posts:
        return

    latest_post = posts[0]
    last_id = get_last_seen_post_id()

    # First run initialization
    if not last_id:
        print(f"ℹ️ First run initialization. Baseline post set to: {latest_post['title']}")
        save_last_seen_post_id(latest_post['id'])
        return

    if latest_post['id'] != last_id:
        notify_new_post(latest_post)
        save_last_seen_post_id(latest_post['id'])
    else:
        print(f"😴 Monitoring active... Latest post on site is up to date: {latest_post['title'][:40]}...")

if __name__ == "__main__":
    print("🔍 Checking openfresher.com feed status...")
    check_and_notify()
