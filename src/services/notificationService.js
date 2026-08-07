import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const LAST_NOTIFIED_POST_KEY = 'openfresher_last_notified_post_id';

export const notificationService = {
  /**
   * Request Android 13+ Notification Permissions
   */
  async requestPermission() {
    try {
      if (!Capacitor.isNativePlatform()) return false;

      const check = await LocalNotifications.checkPermissions();
      if (check.display !== 'granted') {
        const req = await LocalNotifications.requestPermissions();
        return req.display === 'granted';
      }
      return true;
    } catch (err) {
      console.warn('[NotificationService] Permission check notice:', err.message);
      return false;
    }
  },

  /**
   * Check latest fetched posts and send native status bar notification if new job is found
   */
  async checkAndNotifyNewJobs(posts) {
    if (!posts || posts.length === 0) return;

    try {
      const latestPost = posts[0];
      const lastNotifiedId = localStorage.getItem(LAST_NOTIFIED_POST_KEY);

      // If we haven't notified about this post yet
      if (latestPost.id && latestPost.id !== lastNotifiedId) {
        // Update stored last post ID
        localStorage.setItem(LAST_NOTIFIED_POST_KEY, latestPost.id);

        // Send Native Status Bar Notification
        if (Capacitor.isNativePlatform()) {
          const hasPermission = await this.requestPermission();
          if (hasPermission) {
            await LocalNotifications.schedule({
              notifications: [
                {
                  id: Math.floor(Math.random() * 100000),
                  title: `📢 New Job Alert`,
                  body: latestPost.title,
                  largeBody: `Fresh hiring alert added on OpenFresher! Tap to view details and apply now.`,
                  summaryText: 'OpenFresher Job Alert',
                  schedule: { at: new Date(Date.now() + 500) }, // Send in 500ms
                  sound: 'default',
                  extra: { postId: latestPost.id }
                }
              ]
            });
            console.log('[NotificationService] Sent native job alert notification for:', latestPost.title);
          }
        }
      }
    } catch (err) {
      console.warn('[NotificationService] Notification error:', err.message);
    }
  }
};
