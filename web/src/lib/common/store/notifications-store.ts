import { create } from "zustand/index";

interface NotificationsStore {
  opened: boolean
  message: string
  duration: number
  open: (message: string, duration?: number) => void
  close: () => void
}

export const useNotificationsStore = create<NotificationsStore>()((set) => {

  const open = (message: string, duration: number = 3000) => {
    set(() => ({ opened: true, message, duration: duration }))
  }

  const close = () => {
    set(() => ({ opened: false }))
  }

  return {
    opened: false,
    message: "",
    duration: 3000,
    open,
    close
  }
})