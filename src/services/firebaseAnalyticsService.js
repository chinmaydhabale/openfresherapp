import { Capacitor } from '@capacitor/core';
import { FirebaseAnalytics } from '@capacitor-community/firebase-analytics';

export const firebaseAnalyticsService = {
  /**
   * Initialize Firebase Analytics and log app open event
   */
  async init() {
    if (!Capacitor.isNativePlatform()) return;

    try {
      // Enable analytics collection
      await FirebaseAnalytics.setCollectionEnabled({ enabled: true });

      // Log App Open event
      await FirebaseAnalytics.logEvent({
        name: 'app_open',
        params: { platform: 'android' }
      });

      // Set default screen name
      await FirebaseAnalytics.setScreenName({
        screenName: 'HomeScreen',
        nameOverride: 'HomeScreen'
      });

      console.log('[Analytics] Firebase Analytics Initialized & App Open Event Sent!');
    } catch (err) {
      console.warn('[Analytics] Initialization notice:', err.message);
    }
  },

  /**
   * Log job view event when user opens a job post
   */
  async logJobView(postTitle) {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await FirebaseAnalytics.logEvent({
        name: 'view_job_post',
        params: { job_title: postTitle ? postTitle.substring(0, 50) : 'Unknown' }
      });
    } catch (err) {
      console.warn('[Analytics] Error logging job view:', err.message);
    }
  },

  /**
   * Log apply now click event
   */
  async logApplyClick(postTitle, applyUrl) {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await FirebaseAnalytics.logEvent({
        name: 'click_apply_now',
        params: {
          job_title: postTitle ? postTitle.substring(0, 50) : 'Unknown',
          apply_url: applyUrl ? applyUrl.substring(0, 100) : ''
        }
      });
    } catch (err) {
      console.warn('[Analytics] Error logging apply click:', err.message);
    }
  }
};
