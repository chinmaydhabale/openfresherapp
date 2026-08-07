import { CapacitorUpdater } from '@capgo/capacitor-updater';

const LIVE_OTA_MANIFEST_URL = 'https://raw.githubusercontent.com/chinmaydhabale/openfresherapp/main/live_update.json';
const CURRENT_BUNDLE_VERSION = '1.0.0';
const OTA_VERSION_KEY = 'openfresher_active_ota_version';

export const liveOtaService = {
  CURRENT_BUNDLE_VERSION,

  /**
   * Initializes Live OTA updater and notifies native bridge that current bundle loaded safely.
   */
  async init() {
    try {
      // 1. Notify native plugin that app booted successfully (prevents automatic rollback)
      await CapacitorUpdater.notifyAppReady();
      console.log('[LiveOTA] App ready notification sent.');

      // 2. Check for silent background updates
      this.checkForSilentUpdate();
    } catch (err) {
      console.log('[LiveOTA] Init notice (running in browser or webview):', err.message);
    }
  },

  /**
   * Checks remote live_update.json silently in the background and applies update without prompt.
   */
  async checkForSilentUpdate() {
    try {
      const activeVersion = localStorage.getItem(OTA_VERSION_KEY) || CURRENT_BUNDLE_VERSION;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(LIVE_OTA_MANIFEST_URL, {
        signal: controller.signal,
        headers: { 'Cache-Control': 'no-cache' }
      });
      clearTimeout(timeoutId);

      if (!response.ok) return;

      const manifest = await response.json();
      if (!manifest || !manifest.version || !manifest.url) return;

      // Compare versions
      if (this.isVersionHigher(manifest.version, activeVersion)) {
        console.log(`[LiveOTA] New silent update found: v${manifest.version}. Downloading in background...`);

        // Silently download new web bundle zip
        const bundle = await CapacitorUpdater.download({
          url: manifest.url,
          version: manifest.version
        });

        if (bundle) {
          // Set new bundle to be active on next launch
          await CapacitorUpdater.set(bundle);
          localStorage.setItem(OTA_VERSION_KEY, manifest.version);
          console.log(`[LiveOTA] Silent update v${manifest.version} ready for next launch!`);
        }
      }
    } catch (err) {
      console.log('[LiveOTA] Silent update check skipped:', err.message);
    }
  },

  /**
   * Compare version strings
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
