'use client';

import { Snackbar } from "@mui/material";
import { useNotificationsStore } from "@/lib/common/store/notifications-store";

export interface NotificationsProps {
}

export function Notifications({}: NotificationsProps) {
  const { message, duration, opened, close } = useNotificationsStore()

  return (
    <Snackbar message={message} autoHideDuration={duration} open={opened} onClose={close} />
  )
}