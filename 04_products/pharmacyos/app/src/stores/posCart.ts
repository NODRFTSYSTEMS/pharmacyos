import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  din: string
  quantity: number
  unitPrice: number
  requiresRx: boolean
  isSchedule: boolean
}

interface POSCartState {
  items: CartItem[]
  patientId: string | null
  rxId: string | null
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  setPatient: (patientId: string | null) => void
  setRx: (rxId: string | null) => void
  clearCart: () => void
  subtotal: () => number
  itemCount: () => number
}

export const usePOSCart = create<POSCartState>((set, get) => ({
  items: [],
  patientId: null,
  rxId: null,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        }
      }
      return { items: [...state.items, item] }
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: quantity <= 0
        ? state.items.filter((i) => i.id !== id)
        : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),

  setPatient: (patientId) => set({ patientId }),
  setRx: (rxId) => set({ rxId }),
  clearCart: () => set({ items: [], patientId: null, rxId: null }),

  subtotal: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}))
