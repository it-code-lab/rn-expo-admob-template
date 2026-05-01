import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { usePurchases } from "../purchases/PurchaseProvider";

export function AppHeader() {
  const { adsRemoved, busy, purchaseRemoveAds, restorePurchases } = usePurchases();

  return (
    <View style={styles.header}>
      <Text style={styles.title} numberOfLines={1}>
        App
      </Text>
      {adsRemoved ? (
        <View style={styles.badge}>
          <MaterialCommunityIcons name="check-circle" size={16} color="#1f7a4d" />
          <Text style={styles.badgeText}>Ad-free</Text>
        </View>
      ) : (
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Restore purchases"
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            onPress={restorePurchases}
            disabled={busy}
          >
            <MaterialCommunityIcons name="restore" size={21} color="#36322d" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Remove ads"
            style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}
            onPress={purchaseRemoveAds}
            disabled={busy}
          >
            <MaterialCommunityIcons name="eye-off-outline" size={18} color="#ffffff" />
            <Text style={styles.removeText}>{busy ? "Working" : "Remove ads"}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ded8cf",
    backgroundColor: "#fffaf4"
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#221f1a"
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d2cbc0",
    backgroundColor: "#ffffff"
  },
  removeButton: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#2e5f7f"
  },
  removeText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700"
  },
  pressed: {
    opacity: 0.72
  },
  badge: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#e4f4eb"
  },
  badgeText: {
    color: "#1f7a4d",
    fontSize: 14,
    fontWeight: "700"
  }
});

