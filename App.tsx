import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { NativeAppScreen } from "./src/apps/NativeAppScreen";
import { AdBanner } from "./src/components/AdBanner";
import { AppHeader } from "./src/components/AppHeader";
import { PurchaseProvider, usePurchases } from "./src/purchases/PurchaseProvider";

function Shell() {
  const { initialized, adsRemoved } = usePurchases();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="auto" />
      <AppHeader />
      <View style={styles.content}>
        <NativeAppScreen />
      </View>
      {!initialized ? (
        <View style={styles.footer}>
          <ActivityIndicator />
        </View>
      ) : adsRemoved ? null : (
        <AdBanner />
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PurchaseProvider>
        <Shell />
      </PurchaseProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f4ef"
  },
  content: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  footer: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ded8cf",
    backgroundColor: "#fffaf4"
  }
});
