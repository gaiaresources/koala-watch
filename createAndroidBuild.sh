ionic cordova build --release android
~/Android/Sdk/build-tools/27.0.3/zipalign -v -p 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk $$.1.apk
~/Android/Sdk/build-tools/25.0.0/apksigner sign --ks my-release-key.jks --out `date +"%Y%m%d-%H%M%S"`.apk $$.1.apk
rm $$.1.apk
