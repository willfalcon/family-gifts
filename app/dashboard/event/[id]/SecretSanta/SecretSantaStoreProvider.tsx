'use client';

import { createContext, ReactNode, useContext, useRef } from 'react';
import { createSecretSantaStore, SecretSantaStore } from './secretSantaStore';
import { useStore } from 'zustand';
import { EventWithAssignments } from '@/prisma/types';

export type SecretSantaStoreApi = ReturnType<typeof createSecretSantaStore>;

export const SecretSantaStoreContext = createContext<SecretSantaStoreApi | undefined>(undefined);

export interface SecretSantaStoreProviderProps {
  children: ReactNode;
  event: EventWithAssignments;
}

export default function SecretSantaStoreProvider({ children, event }: SecretSantaStoreProviderProps) {
  const storeRef = useRef<SecretSantaStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createSecretSantaStore(event);
  }
  return <SecretSantaStoreContext.Provider value={storeRef.current}>{children}</SecretSantaStoreContext.Provider>;
}

export const useSecretSantaStore = <T,>(selector: (store: SecretSantaStore) => T) => {
  const secretSantaStoreContext = useContext(SecretSantaStoreContext);
  if (!secretSantaStoreContext) {
    throw new Error('useSecretSantaStore must be used within a SecretSantaProvider');
  }
  return useStore(secretSantaStoreContext, selector);
};
