'use client';

import React, { useEffect, useState } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider, persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const QueryProvider = ({ children }) => {
  const [persister, setPersister] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const syncStoragePersister = createSyncStoragePersister({
        key: 'OFFLINE_CACHE',
        storage: window.localStorage,
        serialize: (data) => JSON.stringify(data),
        deserialize: (data) => JSON.parse(data),
      });

      persistQueryClient({
        queryClient: queryClient,
        persister: syncStoragePersister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      });

      setPersister(syncStoragePersister);
    }
  }, []);

  if (!persister) {
    return null;
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() => {
        // resume mutations after initial restore from localStorage was successful
        queryClient.resumePausedMutations();
      }}
    >
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
};

export default QueryProvider;
