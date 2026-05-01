import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export function NativeAppScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.panel}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="cellphone-cog" size={32} color="#2e5f7f" />
        </View>
        <Text style={styles.title}>Native app goes here</Text>
        <Text style={styles.body}>
          Convert each standalone HTML/CSS/JavaScript app into React Native components and
          place the first screen in this file or import it here.
        </Text>
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="gesture-tap-button" size={18} color="#ffffff" />
          <Text style={styles.buttonText}>Template action</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f7f4ef"
  },
  panel: {
    width: "100%",
    maxWidth: 560,
    alignItems: "flex-start",
    gap: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ded8cf",
    borderRadius: 8,
    backgroundColor: "#ffffff"
  },
  iconWrap: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#e7f1f6"
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#221f1a"
  },
  body: {
    fontSize: 16,
    lineHeight: 23,
    color: "#4f4840"
  },
  button: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#2e5f7f"
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700"
  },
  pressed: {
    opacity: 0.72
  }
});

