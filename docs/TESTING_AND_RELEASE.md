# Testing and Release Checklist

Use this checklist after copying the template for a new Android app and before publishing it. Native ads, RevenueCat purchases, and development builds do not fully work in Expo Go, so test with an Expo development build or production build.

## 1. Configure the app

1. Copy `.env.example` to `.env`.
2. Set the app identity:
   - `EXPO_PUBLIC_APP_NAME`
   - `EXPO_PUBLIC_APP_SLUG`
   - `EXPO_PUBLIC_ANDROID_PACKAGE`
3. Confirm `app.config.ts` falls back to the intended Android package name. This matters because `.env` is usually not committed.
4. If this project has a committed or copied `android/` directory, update the native Android identity to match `EXPO_PUBLIC_ANDROID_PACKAGE`:
   - `android/app/build.gradle`: `namespace` and `defaultConfig.applicationId`
   - `android/app/src/main/java/<package path>/MainActivity.kt`
   - `android/app/src/main/java/<package path>/MainApplication.kt`
   - `android/app/src/main/res/values/strings.xml`
   - `android/settings.gradle`
   - `android/app/src/main/AndroidManifest.xml` dev-client scheme, if present
5. During development, keep the Google test AdMob app ID and banner unit ID.
6. Before release, replace the AdMob IDs with the real app ID and banner unit ID.
7. Before release, create the RevenueCat project, product, offering, and entitlement, then set:
   - `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY`
   - `EXPO_PUBLIC_REMOVE_ADS_ENTITLEMENT_ID`
8. Before creating a new release, update the app version and build release number:
   - In `app.config.ts`, update `version` to the next release version.
   - If you maintain a committed `android/` directory, also update the Android `versionCode` in `android/app/build.gradle` or `app.config.ts` under `android.versionCode`.
   - Rebuild the AAB with EAS after updating version values.

## Remove Ads setup

1. Google Play Console
   - Build an AAB with EAS: `npx eas build --platform android`.
   - Upload the AAB to the Internal testing track.
   - Go to Monetize > Products > One-time products.
   - Click Create product.
   - Set the Product ID (for example, `remove_ads_lifetime`), Name, Description, and Price.
   - Save and activate the product.

2. RevenueCat (shared project option)
   - Open your existing RevenueCat project.
   - Add a new Android app with the new package name (for example, `com.readernook.newapp`).
   - Upload the Google Cloud Service Account JSON if prompted.
   - Copy the new app's public API key (`goog_...`).
   - Go to Product Setup > Products and click New.
   - Enter the exact Google Play Product ID from Step 1.
   - Go to Entitlements, open the existing `remove_ads` entitlement, and attach the new product.
   - (Optional) Add the product to your default offering.

3. App / `.env` configuration
   - Update `EXPO_PUBLIC_ANDROID_PACKAGE`.
   - Update `EXPO_PUBLIC_ADMOB_ANDROID_APP_ID` and `EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID`.
   - Update `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY` with the new key from RevenueCat.
   - Keep `EXPO_PUBLIC_REMOVE_ADS_ENTITLEMENT_ID="remove_ads"`.

## 2. Run local checks

Run these from the project root:

```powershell
npm install
npm run typecheck
npx expo-doctor
npx expo config --type public
```

Confirm:

- TypeScript has no errors.
- Expo Doctor passes.
- The public config shows the expected app name, slug, Android package, billing permission, AdMob IDs, and RevenueCat values.
- If `android/` exists, Gradle and the generated APK use the same package as Expo public config.

## 3. Build and smoke test on Android

Use a real Android device or emulator with USB debugging enabled.

```powershell
npm run android
```

If you want to test the native build path directly:

```powershell
cd android
.\gradlew.bat assembleDebug
cd ..
```

The debug APK is created at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

To install the generated APK manually:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install -r android\app\build\outputs\apk\debug\app-debug.apk
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" reverse tcp:8081 tcp:8081
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" shell am start -n your.android.package/.MainActivity
```

Replace `your.android.package` with the package name from `.env`.

To verify the package embedded in a local APK:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\build-tools\36.0.0\aapt.exe" dump badging android\app\build\outputs\apk\debug\app-debug.apk
```

The first line should include the exact Play Console package, for example:

```text
package: name='com.readernook.fourinarow'
```

## 4. Manual app checks

On the device, verify:

1. The app opens without a red error screen or crash.
2. The converted app screen renders correctly on the target phone size.
3. The header is visible and does not overlap the app content.
4. The bottom banner area appears when ads are not removed.
5. During development, the banner uses Google test ads.
6. With no RevenueCat key configured, `Remove ads` and restore show the "Purchases not configured" alert.
7. After RevenueCat is configured, `Remove ads` opens the purchase flow, restore works, and the ad banner disappears when the entitlement is active.
8. Closing and reopening the app keeps the ad-free state when the entitlement is active.

Useful log checks:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" logcat -d -t 300 AndroidRuntime:E ReactNative:W ReactNativeJS:W Expo:E '*:S'
```

No recent `AndroidRuntime`, `ReactNativeJS`, or `Expo` errors should appear after launch.

## 5. Troubleshooting

### `adb` is not recognized

Use the full SDK path:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices
```

Or add platform tools to your user `Path`:

```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";$env:LOCALAPPDATA\Android\Sdk\platform-tools", "User")
```

Close and reopen PowerShell.

### Android SDK location not found

If Gradle cannot find the Android SDK, create `android/local.properties`:

```properties
sdk.dir=C\:\\Users\\YOUR_USER\\AppData\\Local\\Android\\Sdk
```

This file is local machine configuration and should not be committed.

### `JAVA_HOME` is not set

Android Studio includes a JDK. Set it for your user:

```powershell
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Android\Android Studio\jbr", "User")
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\Android\Android Studio\jbr\bin", "User")
```

Close and reopen PowerShell, then check:

```powershell
java -version
npm run android
```

For the current PowerShell window only:

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
npm run android
```

### Gradle toolchain or `IBM_SEMERU` errors

If Gradle fails with a `JvmVendorSpec IBM_SEMERU` or Foojay toolchain resolver error, use a Gradle wrapper version compatible with the current React Native and Android Gradle Plugin stack. This template has been smoke tested with Gradle `8.14.3`.

Check:

```powershell
Get-Content android\gradle\wrapper\gradle-wrapper.properties
```

Expected:

```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.14.3-bin.zip
```

Then rebuild:

```powershell
cd android
.\gradlew.bat assembleDebug
cd ..
```

### Expo dev server exits or DevTools shows `spawn EPERM`

Start Metro in the foreground so the error is visible:

```powershell
npx expo start --dev-client --port 8081
```

If the Android launch step fails because Expo CLI cannot run `adb`, use the manual `adb` commands in the smoke test section while Metro is running.

### Screenshot is black during testing

The device is usually locked, dozing, or on the secure lock screen. Unlock the phone, launch the app again, and capture after the app is visible.

## 6. Create an EAS production build

Expo production Android builds for Google Play are Android App Bundles (`.aab`).

1. Install and log in to EAS CLI if needed:

   ```powershell
   npm install -g eas-cli
   eas login
   ```

2. Confirm `eas.json` has a production profile. This template includes:

   ```json
   {
     "build": {
       "production": {
         "autoIncrement": true
       }
     }
   }
   ```

3. Configure the EAS project and credentials:

   ```powershell
   eas build:configure
   ```

   If EAS creates the project but says it cannot write the project ID to dynamic config, copy the generated ID into `.env`:

   ```properties
   EAS_PROJECT_ID="your-eas-project-id"
   ```

   This template's `app.config.ts` reads that value into `extra.eas.projectId`.

4. Build for Google Play:

   ```powershell
   eas build --platform android --profile production --clear-cache
   ```

   Use `--clear-cache` after changing package name, native Android identity, icons, splash assets, or other generated native metadata.

5. Download the `.aab` from the EAS build page when the build completes.

For an internal installable APK instead of a Play Store bundle:

```powershell
eas build --platform android --profile preview
```

## 7. Publish to Google Play Console

First release:

1. Create a paid Google Play Developer account if you do not already have one.
2. In Google Play Console, create a new app.
3. Use the same Android package name as `EXPO_PUBLIC_ANDROID_PACKAGE`.
   - Google Play package names cannot be changed after the app is created.
   - If Play says the APK or App Bundle needs a different package name, fix `EXPO_PUBLIC_ANDROID_PACKAGE`, `app.config.ts`, and the native Android files listed in section 1, then rebuild with `--clear-cache`.
4. Complete the required Play Console setup items:
   - App access
   - Ads declaration
   - Content rating
   - Target audience
   - Data safety
   - Privacy policy
   - Store listing
5. Go to `Test and release > Testing > Internal testing`.
6. Create a tester list.
7. Create a new internal testing release.
8. Choose Google-generated app signing if this is the first upload for the app.
9. Upload the `.aab` from EAS Build.
10. Add release notes.
11. Save and publish the internal testing release.
12. Open the tester opt-in link on a test device and install from Google Play.
13. Test ads, purchases, restore purchases, app launch, and the converted app flow from the Play-installed version.

If closed testing is complete and you are ready for production access:

- Update the app version before the next release in `app.config.ts`.
- If you maintain a committed native `android/` folder, update the Android `versionCode` in `android/app/build.gradle` or `app.config.ts` under `android.versionCode`.
- Build a new production AAB with EAS: `npx eas build --platform android --profile production --clear-cache`.
- Upload the new AAB to the closed testing or production release track.
- Add release notes, save, and publish the release.
- Once the production release is published to the appropriate track, request production access or promote the release as needed.

After internal testing passes, promote the release to closed testing or production from the Play Console release page.

## 8. Submit with EAS Submit

After the first Play Console setup is complete, EAS Submit can upload builds for you.

1. Create a Google service account for Play Console API access.
2. Upload the service account key in the EAS dashboard under the Android app credentials.
3. Add a submit profile to `eas.json`:

   ```json
   {
     "submit": {
       "production": {
         "android": {
           "track": "internal"
         }
       }
     }
   }
   ```

4. Submit the latest Android build:

   ```powershell
   eas submit --platform android --profile production
   ```

5. For production release, change the track to `production`:

   ```json
   {
     "submit": {
       "production": {
         "android": {
           "track": "production"
         }
       }
     }
   }
   ```

6. Submit again:

   ```powershell
   eas submit --platform android --profile production
   ```

For future automated releases:

```powershell
eas build --platform android --profile production --auto-submit
```

## References

- Expo Android production build guide: https://docs.expo.dev/tutorial/eas/android-production-build/
- Expo EAS Submit guide: https://docs.expo.dev/submit/introduction/
- Google Play Console: https://play.google.com/console/
