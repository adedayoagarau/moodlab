import { useEffect, useState } from 'react';

import {
  checkApiHealth,
  fetchLuts,
  fetchManifest,
  fetchPacks,
} from '@/lib/api';
import { API_BASE_URL } from '@/lib/config';

import type { PlatformStatus } from '@/components/PlatformStatusCard';

const initial: PlatformStatus = {
  loading: true,
  apiOnline: false,
  packCount: 0,
  lutCount: 0,
  templateCount: 0,
  apiUrl: API_BASE_URL,
};

export function usePlatformStatus(): PlatformStatus {
  const [status, setStatus] = useState<PlatformStatus>(initial);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const online = await checkApiHealth();
      if (cancelled) return;

      if (!online) {
        setStatus({
          loading: false,
          apiOnline: false,
          packCount: 0,
          lutCount: 0,
          templateCount: 0,
          apiUrl: API_BASE_URL,
        });
        return;
      }

      try {
        const [packs, luts, manifest] = await Promise.all([
          fetchPacks(),
          fetchLuts(),
          fetchManifest(),
        ]);
        if (cancelled) return;
        setStatus({
          loading: false,
          apiOnline: true,
          packCount: packs.length,
          lutCount: luts.length,
          templateCount:
            manifest.textTemplates.length + manifest.beautyPresets.length,
          apiUrl: API_BASE_URL,
        });
      } catch {
        if (!cancelled) {
          setStatus({
            loading: false,
            apiOnline: false,
            packCount: 0,
            lutCount: 0,
            templateCount: 0,
            apiUrl: API_BASE_URL,
          });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}

/** Portrait sample for web/demo when gallery pick is awkward. */
export const DEMO_IMAGE_URI =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&w=1200&q=80';
