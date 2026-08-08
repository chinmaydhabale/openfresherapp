import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

export const fcmPushService = {
  /**
   * Initialize Firebase Push Notifications
   */
  async init(onNotificationTap) {
    if (!Capacitor.isNativePlatform()) {
      console.log('[FCM] Not a native platform. Push notifications disabled on web.');
      return;
    }

    try {
      // 1. Check existing permission
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn('[FCM] Push Notification permission denied by user.');
        return;
      }

      // 2. Create High-Priority Notification Channel for Android
      await PushNotifications.createChannel({
        id: 'default',
        name: 'OpenFresher Job Alerts',
        description: 'Instant notifications for new job hiring alerts',
        importance: 5,
        visibility: 1,
        sound: 'default',
        vibration: true
      });

      // 3. Register device with FCM
      await PushNotifications.register();

      // 3. Handle Token Registration Event
      PushNotifications.addListener('registration', (token) => {
        console.log('[FCM] Device FCM Registration Token:', token.value);
        // Save token to localStorage for reference
        localStorage.setItem('openfresher_fcm_token', token.value);
      });

      // 4. Handle Registration Error
      PushNotifications.addListener('registrationError', (error) => {
        console.error('[FCM] Registration Error:', JSON.stringify(error));
      });

      // 5. Handle Received Push Notification in Foreground
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('[FCM] Push Notification Received in Foreground:', notification);
      });

      // 6. Handle Push Notification Click / Tap Event
      PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        console.log('[FCM] Notification Tapped by User:', action);
        if (onNotificationTap && action.notification?.data) {
          onNotificationTap(action.notification.data);
        }
      });

      console.log('[FCM] Push Notifications Service Initialized Successfully.');
    } catch (err) {
      console.error('[FCM] Push Notification Initialization Error:', err.message);
    }
  }
};
