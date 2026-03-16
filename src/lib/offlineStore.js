import { create } from 'zustand'

export const useOfflineStore = create((set, get) => ({
  isOnline: navigator.onLine,
  pendingBatches: [],
  lastSyncTime: null,
  setOnline: (status) => set({ isOnline: status }),
  addPendingBatch: (batch) => set((state) => ({ 
    pendingBatches: [...state.pendingBatches, { ...batch, id: `DRAFT-${Date.now()}` }] 
  })),
  clearPending: () => set({ pendingBatches: [], lastSyncTime: new Date() }),
}))

// Listen for online/offline events
window.addEventListener('online', () => useOfflineStore.getState().setOnline(true))
window.addEventListener('offline', () => useOfflineStore.getState().setOnline(false))
