import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.centrocristiano.colon',
  appName: 'Centro Cristiano',
  webDir: 'build',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      androidScaleType: 'CENTER_CROP',
      backgroundColor: '#0e0d06',
      showSpinner: false,
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#c8a97e',
      sound: 'default',
    },
    FirebaseMessaging: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
