import { useState } from "react";

export function useSnackbar() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState<string>('')

  const show = (message: string) => {
    setMessage(message)
    setOpen(true)
  }

  return {
    show,
    props: {
      open,
      onClose: () => setOpen(false),
      autoHideDuration: 2000,
      message,
    }
  }
}