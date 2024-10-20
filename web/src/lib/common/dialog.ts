import { useState } from "react";

export interface DialogProps {
  open: boolean,
  onComplete: () => void,
  onClose: () => void,
}

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
