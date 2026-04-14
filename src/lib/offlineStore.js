import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useOfflineStore = create(
  persist(
    (set, get) => ({
      isOnline: navigator.onLine,
      pendingBatches: [],
      lastSyncTime: null,
      setOnline: (status) => set({ isOnline: status }),
      addPendingBatch: (batch) => set((state) => ({ 
        pendingBatches: [...state.pendingBatches, { ...batch, id: `DRAFT-${Date.now()}` }] 
      })),
      removeBatch: (id) => set((state) => ({
        pendingBatches: state.pendingBatches.filter(b => b.id !== id)
      })),
      clearPending: () => set({ pendingBatches: [], lastSyncTime: new Date() }),
    }),
    {
      name: 'botaniledger-offline-storage',
      storage: createJSONStorage(() => localStorage),
      // Don't persist online status as it's checked on load
      partialize: (state) => ({ pendingBatches: state.pendingBatches, lastSyncTime: state.lastSyncTime }),
    }
  )
)

// Listen for online/offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => useOfflineStore.getState().setOnline(true))
  window.addEventListener('offline', () => useOfflineStore.getState().setOnline(false))
}
