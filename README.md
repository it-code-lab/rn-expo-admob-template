# Expo Native App Template with Ads

This is an Android Expo template for turning standalone HTML/CSS/JavaScript apps into native React Native apps. The template keeps monetization in the shell: a low-interruption bottom banner ad plus a purchase option to remove ads.

## How it works

- Converted app code starts at `src/apps/NativeAppScreen.tsx`.
- Shared ads live in `src/components/AdBanner.tsx`.
- The `Remove ads` and restore buttons live in `src/components/AppHeader.tsx`.
- Purchase state is managed by RevenueCat in `src/purchases/PurchaseProvider.tsx`.
- Conversion guidance is in `docs/CONVERTING_HTML_APPS.md`.
- Testing, troubleshooting, EAS build, and Google Play release steps are in `docs/TESTING_AND_RELEASE.md`.

Native ads and purchases require an Expo development build or production build. They will not fully work in plain Expo Go.

## First setup

```sh
npm install
copy .env.example .env
npm run android
```

For EAS builds:

```sh
npx eas build --profile development --platform android
npx eas build --profile production --platform android
```

For the full reusable test and release checklist, including Play Console publishing, see `docs/TESTING_AND_RELEASE.md`.

## Per-app checklist

1. Copy this template for a new app.
2. Copy `.env.example` to `.env`.
3. Change `EXPO_PUBLIC_APP_NAME`, `EXPO_PUBLIC_APP_SLUG`, and `EXPO_PUBLIC_ANDROID_PACKAGE`.
4. Convert the original HTML/CSS/JavaScript UI into React Native components under `src/apps/`.
5. Replace the placeholder `NativeAppScreen` with the converted app entry screen.
6. Replace the AdMob app ID and banner unit ID before release.
7. Create a RevenueCat project connected to Google Play Billing.
8. Create a non-consumable remove-ads product in Google Play Console.
9. Attach that product to a RevenueCat offering and entitlement.
10. Set `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY` and `EXPO_PUBLIC_REMOVE_ADS_ENTITLEMENT_ID`.
11. Build and test on Android with `docs/TESTING_AND_RELEASE.md`.
12. Publish through EAS Build and Google Play Console with `docs/TESTING_AND_RELEASE.md`.

## Notes

- Keep Google test ad IDs during development. Use real IDs only for release builds.
- The banner requests non-personalized ads by default to keep the initial template conservative.
- Google Play requires you to disclose that the app contains ads.
- Keep ads outside individual app screens so every converted app gets the same purchase behavior.

## Windows Android Build Troubleshooting

If `npm run android` fails with `JAVA_HOME is not set and no 'java' command could be found`, point `JAVA_HOME` at a JDK. Android Studio includes one:

```powershell
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Android\Android Studio\jbr", "User")
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\Android\Android Studio\jbr\bin", "User")
```

Close and reopen PowerShell, then check:

```powershell
java -version
npm run android
```

For the current PowerShell window only, you can use:

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
npm run android
```
