import { StoreApi } from "zustand";

export interface FieldRecord {
  id: string
  label: string
}

export const observable = <T, R>(
  store: StoreApi<T>,
  set: (state: any) => void,
  field: keyof R
): T => {
  store.subscribe((state: T) => {
    set({ [field]: state })
  })
  return store.getState()
}
