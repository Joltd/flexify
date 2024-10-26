'use client'
import { ApplicationBar } from "@/components/common/ApplicationBar";
import { useFetchStore } from "@/lib/common/store/fetch-store";
import { squadAppUrls } from "@/lib/jirify/squad-app/urls";
import { CircularProgress, IconButton } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";

export function SquadAppLayout() {
  const syncStore = useFetchStore<void>('POST', squadAppUrls.sync)

  const navigationItems = [
    {
      title: "Issues",
      url: "/jirify/squad-app",
    },
    {
      title: "Branches",
      url: "/jirify/squad-app/branches",
    }
  ]

  const renderSync = () => (
    <IconButton
      color="inherit"
      disabled={syncStore.loading}
      onClick={() => syncStore.fetch()}
    >
      {syncStore.loading ? (
        <CircularProgress color="inherit" size={20} />
      ) : (
        <SyncIcon />
      )}
    </IconButton>
  )

  return (
    <ApplicationBar navigationItems={navigationItems} actions={renderSync} />
  )
}