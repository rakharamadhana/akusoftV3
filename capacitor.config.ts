import type { CapacitorConfig } from '@capacitor/cli';

// Akusoft v3.0 mobile wrapper — one web build (out/) → Android & iOS.
// See CLAUDE.md §7 and GIGA_PROMPT §3.
const config: CapacitorConfig = {
  appId: 'com.akusoft.app',
  appName: 'Akusoft UKM',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Live reload during development:
    // url: 'http://192.168.1.x:3000',
    // cleartext: true,
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
