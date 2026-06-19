import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'moodlab:onboarding:v1:complete';

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(ONBOARDING_KEY)) === 'true';
  } catch {
    return false;
  }
}

export async function completeOnboarding(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}

export async function resetOnboarding(): Promise<void> {
  await AsyncStorage.removeItem(ONBOARDING_KEY);
}
