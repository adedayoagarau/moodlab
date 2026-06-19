import Constants from 'expo-constants';

const fallback = 'http://localhost:8787';

/** Base URL for MoodLab API (set EXPO_PUBLIC_API_URL in .env) */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  Constants.expoConfig?.extra?.apiUrl ??
  fallback;
