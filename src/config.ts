import Constants from "expo-constants";
import { TestIds } from "react-native-google-mobile-ads";

type ExtraConfig = {
  admobBannerUnitId?: string;
  revenueCatAndroidApiKey?: string;
  removeAdsEntitlementId?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as ExtraConfig;

export const config = {
  admobBannerUnitId: __DEV__ ? TestIds.ADAPTIVE_BANNER : extra.admobBannerUnitId ?? "",
  revenueCatAndroidApiKey: extra.revenueCatAndroidApiKey ?? "",
  removeAdsEntitlementId: extra.removeAdsEntitlementId ?? "remove_ads"
};

