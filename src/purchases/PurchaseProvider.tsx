import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { Alert, Platform } from "react-native";
import Purchases, {
  LOG_LEVEL,
  PurchasesPackage,
  PurchasesStoreProduct
} from "react-native-purchases";

import { config } from "../config";

type PurchaseContextValue = {
  initialized: boolean;
  busy: boolean;
  adsRemoved: boolean;
  purchaseRemoveAds: () => Promise<void>;
  restorePurchases: () => Promise<void>;
};

const PurchaseContext = createContext<PurchaseContextValue | undefined>(undefined);
const ADS_REMOVED_CACHE_KEY = "adsRemoved";

function isEntitled(customerInfo: Awaited<ReturnType<typeof Purchases.getCustomerInfo>>) {
  return Boolean(customerInfo.entitlements.active[config.removeAdsEntitlementId]);
}

function packageLabel(product?: PurchasesStoreProduct) {
  return product?.title ?? "Remove ads";
}

export function PurchaseProvider({ children }: PropsWithChildren) {
  const [initialized, setInitialized] = useState(false);
  const [busy, setBusy] = useState(false);
  const [adsRemoved, setAdsRemoved] = useState(false);
  const [removeAdsPackage, setRemoveAdsPackage] = useState<PurchasesPackage | null>(null);

  const refreshCustomerInfo = useCallback(async () => {
    const customerInfo = await Purchases.getCustomerInfo();
    const active = isEntitled(customerInfo);
    setAdsRemoved(active);
    await AsyncStorage.setItem(ADS_REMOVED_CACHE_KEY, active ? "true" : "false");
    return active;
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      const cached = await AsyncStorage.getItem(ADS_REMOVED_CACHE_KEY);
      if (mounted && cached === "true") {
        setAdsRemoved(true);
      }

      if (Platform.OS !== "android" || !config.revenueCatAndroidApiKey) {
        if (mounted) {
          setInitialized(true);
        }
        return;
      }

      Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN);
      Purchases.configure({ apiKey: config.revenueCatAndroidApiKey });

      try {
        const offerings = await Purchases.getOfferings();
        const availablePackage =
          offerings.current?.availablePackages.find((item) =>
            item.product.identifier.toLowerCase().includes("remove")
          ) ?? offerings.current?.availablePackages[0] ?? null;

        if (mounted) {
          setRemoveAdsPackage(availablePackage);
        }

        await refreshCustomerInfo();
      } catch (error) {
        console.warn("Purchase initialization failed", error);
      } finally {
        if (mounted) {
          setInitialized(true);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [refreshCustomerInfo]);

  const purchaseRemoveAds = useCallback(async () => {
    if (!config.revenueCatAndroidApiKey) {
      Alert.alert(
        "Purchases not configured",
        "Add your RevenueCat Android API key and remove-ads entitlement to .env."
      );
      return;
    }

    if (!removeAdsPackage) {
      Alert.alert("Unavailable", "The remove-ads product is not available yet.");
      return;
    }

    setBusy(true);
    try {
      const result = await Purchases.purchasePackage(removeAdsPackage);
      const active = isEntitled(result.customerInfo);
      setAdsRemoved(active);
      await AsyncStorage.setItem(ADS_REMOVED_CACHE_KEY, active ? "true" : "false");

      if (active) {
        Alert.alert("Thanks", `${packageLabel(removeAdsPackage.product)} is active.`);
      }
    } catch (error: unknown) {
      if (!(typeof error === "object" && error && "userCancelled" in error)) {
        Alert.alert("Purchase failed", "Please try again in a moment.");
        console.warn("Remove ads purchase failed", error);
      }
    } finally {
      setBusy(false);
    }
  }, [removeAdsPackage]);

  const restorePurchases = useCallback(async () => {
    if (!config.revenueCatAndroidApiKey) {
      Alert.alert(
        "Purchases not configured",
        "Add your RevenueCat Android API key and remove-ads entitlement to .env."
      );
      return;
    }

    setBusy(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      const active = isEntitled(customerInfo);
      setAdsRemoved(active);
      await AsyncStorage.setItem(ADS_REMOVED_CACHE_KEY, active ? "true" : "false");
      Alert.alert(active ? "Restored" : "No purchase found");
    } catch (error) {
      Alert.alert("Restore failed", "Please try again in a moment.");
      console.warn("Restore purchases failed", error);
    } finally {
      setBusy(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      initialized,
      busy,
      adsRemoved,
      purchaseRemoveAds,
      restorePurchases
    }),
    [adsRemoved, busy, initialized, purchaseRemoveAds, restorePurchases]
  );

  return <PurchaseContext.Provider value={value}>{children}</PurchaseContext.Provider>;
}

export function usePurchases() {
  const context = useContext(PurchaseContext);

  if (!context) {
    throw new Error("usePurchases must be used inside PurchaseProvider");
  }

  return context;
}

