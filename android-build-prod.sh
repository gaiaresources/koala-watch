cross-env ENV='prod' ionic cordova build --release android

# change this to your own android sdk path

# linux: ANDROID_SDK_PATH=~/Android/Sdk/build-tools
ANDROID_SDK_PATH=~/Library/Android/sdk/build-tools

$ANDROID_SDK_PATH/29.0.2/zipalign -v -p 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk $$.1.apk
$ANDROID_SDK_PATH/29.0.2/apksigner sign --ks my-release-key.jks --out `date +"%Y%m%d-%H%M%S"`.apk $$.1.apk
rm $$.1.apk
