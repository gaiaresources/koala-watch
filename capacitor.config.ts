import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'au.gov.nsw.dpie.koalawatch',
  appName: 'I Spy Koala',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  android: {
    "allowMixedContent": true
  },
  cordova: {
    preferences: {
      ANDROID_SUPPORT_V4_VERSION: '28.0.0',
      GOOGLE_MAPS_ANDROID_API_KEY: '',
      GOOGLE_MAPS_IOS_API_KEY: '',
      ScrollEnabled: 'false',
      AndroidPersistentFileLocation: 'Compatibility',
      'android-minSdkVersion': '21',
      'android-targetSdkVersion': '33',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      FadeSplashScreenDuration: '300',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenDelay: '3000'
    }
  }
};

export default config;
