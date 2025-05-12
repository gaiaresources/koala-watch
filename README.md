

- JAVA_HOME must be set to JDK 21 (Capacitor V7)

Setup Android:
```agsl
- npx cap sync android
- npm run build
- androidStartDev.sh
```

Setup Ios:

```agsl
- npx cap sync android
- npm run build
- xcode must be installed
- ionic cap run ios -l
```

Publishing to Apple testflight:
```agsl
- npm run build
- npx cap sync ios
- open xcode
- product -> archive -> distribute app -> app store connect
```

Publishing to Google play store:
```agsl
- npm run build
- npx cap sync android
- increment version number in android/app/build.gradle
- open android studio
- build -> generate signed app bundles
- select bundles
- enter keystore info
- release
- Google play store -> Internal testing -> create new release -> upload .aab file
```
