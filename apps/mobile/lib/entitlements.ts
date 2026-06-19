import AsyncStorage from '@react-native-async-storage/async-storage';

const PRO_KEY = 'moodlab:entitlement:pro';

export async function hasProEntitlement(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(PRO_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

/** Demo unlock until RevenueCat ships — persists locally. */
export async function unlockProDemo(): Promise<void> {
  await AsyncStorage.setItem(PRO_KEY, 'true');
}

export async function clearProEntitlement(): Promise<void> {
  await AsyncStorage.removeItem(PRO_KEY);
}

export function isProLutBlocked(plan: string, isPro: boolean): boolean {
  return plan === 'pro' && !isPro;
}
