# Koala Watch

Koala survey collection mobile-app based on Ionic Framework / Angular.

### Installation

Install the Ionic and Cordova CLI (note: you may need to have root access for this):

```bash
npm install -g ionic cordova
```

This project contains submodules. To clone both the project and submodules, use:

```bash
git clone --recurse-submodules https://github.com/gaiaresources/koala-watch
```

Then install node dependencies:

```bash
npm install
```

### Running

To run the app in a browser, within the project directory use:

```bash
ionic serve
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
* au.com.gaiaresources.koalawatch
* Type is iOS Distribution
* Seletc App Store
* Select certificate Gaia Resources (iOS Distribution)
* Name it Koala Watch Dist

Open XCode, in preferences update the profiles, untick Automatic manage siging and select the Koala Watch Dist provisioning profile

Create an Archive and select to Koala Watch Dist provisioning profile

