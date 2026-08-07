/**
 * Modular State Manager for 4-Hour Access & Future Rewarded Ad Unlock System.
 * 
 * - Currently disabled (isAdMobEnabled = false) as requested by user.
 * - Ready for instant activation once AdMob account receives approval.
 */

const ACCESS_KEY = 'openfresher_app_last_ad_watch';
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

export const adAccessStore = {
  // Master toggle: Set to true after AdMob approval to enable 4-hour ad lock
  isAdMobEnabled: false,

  /**
   * Check if the user currently has valid app access.
   */
  hasValidAccess() {
    if (!this.isAdMobEnabled) return true; // Always unlocked if AdMob disabled
    
    const lastWatch = localStorage.getItem(ACCESS_KEY);
    if (!lastWatch) return false;

    const elapsed = Date.now() - parseInt(lastWatch, 10);
    return elapsed < FOUR_HOURS_MS;
  },

  /**
   * Record a successful rewarded ad view to grant 4 hours of access.
   */
  grantAccess() {
    localStorage.setItem(ACCESS_KEY, Date.now().toString());
  },

  /**
   * Get remaining access time formatted string (e.g. "3h 45m").
   */
  getRemainingTimeString() {
    if (!this.isAdMobEnabled) return 'Unlimited Access';

    const lastWatch = localStorage.getItem(ACCESS_KEY);
    if (!lastWatch) return 'Expired';

    const elapsed = Date.now() - parseInt(lastWatch, 10);
    const remainingMs = FOUR_HOURS_MS - elapsed;

    if (remainingMs <= 0) return 'Expired';

    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  }
};
