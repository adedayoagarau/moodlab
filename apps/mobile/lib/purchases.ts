import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

import Constants from 'expo-constants';

const iosKey =
  process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS ??
  (Constants.expoConfig?.extra?.revenueCatIosKey as string | undefined);

let initialized = false;

export function isRevenueCatConfigured(): boolean {
  return Platform.OS === 'ios' && Boolean(iosKey);
}

export async function initPurchases(): Promise<void> {
  if (initialized || !isRevenueCatConfigured()) return;
  Purchases.setLogLevel(LOG_LEVEL.INFO);
  await Purchases.configure({ apiKey: iosKey! });
  initialized = true;
}

export async function hasProEntitlement(): Promise<boolean> {
  if (!initialized) return false;
  try {
    const info = await Purchases.getCustomerInfo();
    return Boolean(info.entitlements.active['pro'] ?? info.entitlements.active['moodlab_pro']);
  } catch {
    return false;
  }
}

export async function getOfferings(): Promise<string[]> {
  if (!initialized) return [];
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages.map((p) => p.identifier) ?? [];
  } catch {
    return [];
  }
}
