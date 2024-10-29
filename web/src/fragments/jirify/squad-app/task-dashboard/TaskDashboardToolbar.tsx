import {
  Button,
  CircularProgress,
  FormControlLabel, Grid2, IconButton,
  Switch, TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import { DevelopmentArea } from "@/lib/jirify/common/types";
import { Box } from "@mui/system";
import { PastDate } from "@/components/common/PastDate";
import { useTaskDashboardStore } from "@/lib/jirify/squad-app/store/task-dashboard-store";
import { EmployeeFilter } from "@/components/jirify/common/EmployeeFilter";
import { useSquadAppStore } from "@/lib/jirify/squad-app/store/squad-app-store";
import SyncIcon from "@mui/icons-material/Sync";
import { useFetchStore } from "@/lib/common/store/fetch-store";
import { squadAppUrls } from "@/lib/jirify/squad-app/urls";
import { EstimationBadge } from "@/components/jirify/common/EstimationBadge";

export interface TaskDashboardToolbarProps {}

export function TaskDashboardToolbar({}: TaskDashboardToolbarProps) {
  const squadAppStore = useSquadAppStore()
  const { employees, setEmployees, areas, setAreas, performed, setPerformed, search, setSearch, dashboard } = useTaskDashboardStore()
  const syncStore = useFetchStore<void>('POST', squadAppUrls.sync)

  const totalEstimation = dashboard.data
    ?.groups
    ?.flatMap(group => group.entries)
    ?.map((task) => task.estimation || 0)
    ?.reduce((acc, estimation) => acc + estimation, 0)
    || 0

  return (
    <Grid2 size={12} display="flex" alignItems="center" gap={2}>
      {dashboard.data && (
        <>
          <Typography variant="h6">{dashboard.data.key}</Typography>

          {squadAppStore.data && (
            <EmployeeFilter
              workspace={squadAppStore.data?.id}
              selected={employees}
              onChange={(employees) => setEmployees(employees)}
            />
          )}

          <ToggleButtonGroup value={areas} onChange={(event, areas) => setAreas(areas)}>
            <ToggleButton size="small" value={DevelopmentArea.BACKEND}>Backend</ToggleButton>
            <ToggleButton size="small" value={DevelopmentArea.FRONTEND}>FrontEnd</ToggleButton>
          </ToggleButtonGroup>

          <FormControlLabel
            control={<Switch
              checked={performed}
              onChange={(event, value) => setPerformed(value)}
            />}
            label="Performed"
          />

          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <Box flexGrow={1} />

          <EstimationBadge value={totalEstimation} />

          <PastDate date={dashboard.data.updatedAt} />

          <Button
            variant="contained"
            color="primary"
            startIcon={syncStore.loading ? (
              <CircularProgress color="inherit" size={20}/>
            ) : (
              <SyncIcon/>
            )}
            disabled={syncStore.loading}
            onClick={() => syncStore.fetch().then(() => dashboard.fetch())}
          >
            Sync
          </Button>
        </>
      )}
    </Grid2>
  )
  // )
}