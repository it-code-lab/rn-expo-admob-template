import { useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  useForeground
} from "react-native-google-mobile-ads";

import { config } from "../config";

export function AdBanner() {
  const bannerRef = useRef<BannerAd>(null);

  useForeground(() => {
    if (Platform.OS === "ios") {
      bannerRef.current?.load();
    }
  });

  if (!config.admobBannerUnitId) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BannerAd
        ref={bannerRef}
        unitId={config.admobBannerUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ded8cf",
    backgroundColor: "#fffaf4"
  }
});

