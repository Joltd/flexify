import React, { SyntheticEvent, useState } from "react";

export function useMenu() {
  const [anchor, setAnchor] = useState<Element | null>(null)

  const open = (event: SyntheticEvent) => {
    if (event.target instanceof Element) {
      setAnchor(event.target)
    }
  };

  const close = () => {
    setAnchor(null)
  }

  return {
    open,
    close,
    props: {
      open: anchor !== null,
      anchorEl: anchor,
      onClose: close,
      disableScrollLock: true,
    }
  }
}