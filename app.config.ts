import "dotenv/config";
import type { ExpoConfig } from "expo/config";

const androidPackage = process.env.EXPO_PUBLIC_ANDROID_PACKAGE ?? "com.example.htmladtemplate";

const config: ExpoConfig = {
  name: process.env.EXPO_PUBLIC_APP_NAME ?? "HTML Ad Template",
  slug: process.env.EXPO_PUBLIC_APP_SLUG ?? "html-ad-template",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  platforms: ["android"],
  android: {
    package: androidPackage,
    permissions: [
      "com.android.vending.BILLING",
      "com.google.android.gms.permission.AD_ID",
    ],
  },
  plugins: [
    [
      "react-native-google-mobile-ads",
      {
        androidAppId:
          process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID ?? "ca-app-pub-3940256099942544~3347511713",
        iosAppId:
          process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID ?? "ca-app-pub-3940256099942544~1458002511"
      }
    ]
  ],
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID
    },
    admobBannerUnitId:
      process.env.EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID ?? "ca-app-pub-3940256099942544/6300978111",
    revenueCatAndroidApiKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? "",
    removeAdsEntitlementId: process.env.EXPO_PUBLIC_REMOVE_ADS_ENTITLEMENT_ID ?? "remove_ads"
  }
};

export default config;
