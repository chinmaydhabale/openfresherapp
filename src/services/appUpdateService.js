const CURRENT_VERSION = '1.0.0';
const VERSION_CHECK_URL = 'https://www.openfresher.com/app_version.json';

export const appUpdateService = {
  CURRENT_VERSION,

  /**
   * Checks remote version JSON on openfresher.com to determine if a newer version exists.
   */
  async checkForUpdates() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(VERSION_CHECK_URL, {
        signal: controller.signal,
        headers: { 'Cache-Control': 'no-cache' }
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.version && this.isVersionHigher(data.version, CURRENT_VERSION)) {
          return {
            hasUpdate: true,
            latestVersion: data.version,
            apkUrl: data.apkUrl || 'https://www.openfresher.com',
            releaseNotes: data.releaseNotes || 'New features, performance improvements, and bug fixes.',
            forceUpdate: !!data.forceUpdate
          };
        }
      }
    } catch (err) {
      console.log('[UpdateService] Offline or no app_version.json on server:', err.message);
    }

    return { hasUpdate: false };
  },

  /**
   * Helper to compare version strings e.g. "1.0.1" > "1.0.0"
   */
  isVersionHigher(v1, v2) {
    const p1 = v1.split('.').map(Number);
    const p2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
      const n1 = p1[i] || 0;
      const n2 = p2[i] || 0;
      if (n1 > n2) return true;
      if (n1 < n2) return false;
    }
    return false;
  }
};
