import { useEffect, useState } from 'react';

import type { IntegrationStatus } from '@/lib/integrations-status';
import { loadIntegrationStatus } from '@/lib/integrations-status';
import { initPurchases } from '@/lib/purchases';

export function useIntegrationsBootstrap() {
  const [status, setStatus] = useState<IntegrationStatus | null>(null);

  useEffect(() => {
    initPurchases().catch(() => undefined);
    loadIntegrationStatus().then(setStatus);
  }, []);

  return status;
}
