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

      // 3. Attach Listeners BEFORE Registering
      PushNotifications.addListener('registration', (token) => {
        console.log('[FCM] Device FCM Registration Token:', token.value);
        localStorage.setItem('openfresher_fcm_token', token.value);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('[FCM] Registration Error:', JSON.stringify(error));
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('[FCM] Push Notification Received in Foreground:', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        console.log('[FCM] Notification Tapped by User:', action);
        if (onNotificationTap && action.notification?.data) {
          onNotificationTap(action.notification.data);
        }
      });

      // 4. Register device with FCM
      await PushNotifications.register();

      console.log('[FCM] Push Notifications Service Initialized Successfully.');
    } catch (err) {
      console.error('[FCM] Push Notification Initialization Error:', err.message);
    }
  }
};
