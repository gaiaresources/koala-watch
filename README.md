# Koala Watch

Koala survey collection mobile-app based on Ionic Framework / Angular.

### Installation

Install the Ionic and Cordova CLI (note: you may need to have root access for this):

```bash
npm install -g ionic cordova@8.1.1 cordova-res cross-env

ionic cordova plugin add cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID="YOUR_ANDROID_API_KEY_IS_HERE" --variable API_KEY_FOR_IOS="YOUR_IOS_API_KEY_IS_HERE"
```

This project contains submodules. To clone both the project and submodules, use:

```bash
git clone --recurse-submodules https://github.com/gaiaresources/koala-watch
```

Then install node dependencies:

```bash
npm install
```

# Android/Java/local build/run setup
Select java version ( https://chamikakasun.medium.com/how-to-manage-multiple-java-version-in-macos-e5421345f6d0 , https://github.com/jenv/jenv , (gradle) https://reflectoring.io/manage-jdks-with-jenv/ ):

(if you don't have it)
```bash
brew install gradle
```

```bash
jenv local
nvm use
```

```bash
cordova plugin add cordova-android-support-gradle-release --variable ANDROID_SUPPORT_VERSION=27.0.0
```

It may be necessary to remove the duplicate `<uses feature="gps.location...`
from the `AndroidManifest.xml`


### Running

To run the app in a browser, within the project directory use:

envs are prod or uat

```bash
sudo apt install gradle


cross-env ENV='uat' ionic serve

android:
cross-env ENV='uat' ionic cordova run android 
```

NOTE: you need to remove the duplicate location entries manually from `/platforms/android/app/src/main/AndroidManifest.xml`

### Build
envs are prod or uat
```bash
cross-env ENV='uat' ionic cordova build android 
```

OR

```bash
./android-build-uat.sh
```

### Apple App Store

This app was deployed using XCode 9.4 (9F1027a)

Create the XCode project using the command below:

```bash
ionic cordova build ios
```

The XCode project should be located at

```bash
platforms/ios/Koala Watch.xcodeproj
```

Fix the XCode project app icons and splash images using the bash script makeIcons.sh

```bash
./makeIcons.sh
```

In Xcode:

* Set the development team to Gaia Resources, from there the ios build command should succeed
* Drag the spash image Default-Portrait.png -> iPad Portrait Without Status Bar iOS 5,6 1x
* Drag the spash image Default-Portrait@2x.png -> iPad Portrait Without Status Bar iOS 5,6 2x
* Drag the spash image Default-Landscape.png -> iPad Landscape Without Status Bar iOS 5,6 1x
* Drag the spash image Default-Landscape@2x.png -> iPad Landscape Without Status Bar iOS 5,6 2x

Deploy to an iphone using the command:

```bash
ionic cordova run ios --device
```

Log into the Apple Developer Portal and create a Distribution provisioning profile

* https://developer.apple.com/account/#/overview/
* Select application id Koala Watch
* au.gov.nsw.dpie.koalawatch
* Type is iOS Distribution
* Seletc App Store
* Select certificate Gaia Resources (iOS Distribution)
* Name it Koala Watch Dist

Open XCode, in preferences update the profiles, untick Automatic manage siging and select the Koala Watch Dist provisioning profile

Create an Archive and select to Koala Watch Dist provisioning profile

