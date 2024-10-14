import { useState } from "react";

export function useDialog() {
  const [open, setOpen] = useState(false)

  return {
    open: () => setOpen(true),
    props: {
      open,
      onClose: () => setOpen(false)
    }
  }
}
