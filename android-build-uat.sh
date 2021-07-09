cross-env ENV='uat' ionic cordova build --release android
~/Library/Android/sdk/build-tools/29.0.2/zipalign -v -p 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk $$.1.apk
~/Library/Android/sdk/build-tools/29.0.2/apksigner sign --ks my-release-key.jks --out `date +"%Y%m%d-%H%M%S"`.apk $$.1.apk
rm $$.1.apk
