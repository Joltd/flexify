import { useSquadAppStore } from "@/lib/jirify/squad-app/store/squad-app-store";
import { useBranchDashboardStore } from "@/lib/jirify/squad-app/store/branch-dashboard-store";
import { FormControlLabel, Grid2, Switch, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { DevelopmentArea } from "@/lib/jirify/common/types";

export interface BranchDashboardToolbarProps {}

export function BranchDashboardToolbar({}: BranchDashboardToolbarProps) {
  const squadAppStore = useSquadAppStore()
  const { area, setArea, readyToProd, setReadyToProd, hidden, setHidden, search, setSearch, dashboard } = useBranchDashboardStore()

  return (
    <Grid2 size={12} display="flex" alignItems="center" gap={2}>
      {dashboard.data && (
        <>
          {squadAppStore.data && (
            <ToggleButtonGroup exclusive value={area} onChange={(event, value) => setArea(value)}>
              <ToggleButton size="small" value={DevelopmentArea.BACKEND}>Backend</ToggleButton>
              <ToggleButton size="small" value={DevelopmentArea.FRONTEND}>Frontend</ToggleButton>
            </ToggleButtonGroup>
          )}

          <FormControlLabel
            control={<Switch
              checked={readyToProd}
              onChange={(event, value) => setReadyToProd(value)}
            />}
            label="Ready to prod"
          />

          <FormControlLabel
            control={<Switch
              checked={hidden}
              onChange={(event, value) => setHidden(value)}
            />}
            label="Hidden"
          />

          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </>
      )}
    </Grid2>
  )
}