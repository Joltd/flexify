import { useNotificationsStore } from "@/lib/common/store/notifications-store";

export function useClipboard() {
  const { open } = useNotificationsStore()

  const copy = (text: string, richText?: string) => {
    const textPlain = new Blob([text], { type: 'text/plain' })
    const textHtml = new Blob([richText || ''], { type: 'text/html' })

    const item = richText
      ? new ClipboardItem({ 'text/plain': textPlain, 'text/html': textHtml })
      : new ClipboardItem({ 'text/plain': textPlain })
    navigator.clipboard
      .write([item])
      .then(() => open('Copied to clipboard'))
  }

  return {
    copy
  }

}