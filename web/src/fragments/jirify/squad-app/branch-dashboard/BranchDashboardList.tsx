import { BranchDashboardModeEnum, useBranchDashboardStore } from "@/lib/jirify/squad-app/store/branch-dashboard-store";
import { Alert, Fab, Grid2, Stack, Tooltip, Typography } from "@mui/material";
import { ListSkeleton } from "@/components/common/skeleton/ListSkeleton";
import { Add, CheckCircle, Error } from "@mui/icons-material";
import { Box } from "@mui/system";
import { MergeRequestBadge } from "@/components/jirify/common/MergeRequestBadge";
import { getMergeRequestStatus } from "@/lib/jirify/common/integration/gitlab/types";

export interface BranchDashboardListProps {}

export function BranchDashboardList({}: BranchDashboardListProps) {
  const { dashboard, search, setBranchId, setMode } = useBranchDashboardStore()

  const handleAddBranch = () => {
    setMode(BranchDashboardModeEnum.CREATE)
  }

  return (
    <Grid2 size={12} display="flex" flexDirection="column" gap={1}>
      {dashboard.loading ? (
        <ListSkeleton />
      ) : dashboard.error ? (
        <Alert severity="error">{dashboard.error}</Alert>
      ) : (
        dashboard.data
          ?.filter((branch) => !search || branch.name.indexOf(search) >= 0)
          ?.map((branch) => (
            <Stack
              key={branch.id}
              direction="row"
              alignItems="center"
              gap={1}
              onClick={() => {
                setBranchId(branch.id)
                setMode(BranchDashboardModeEnum.VIEW)
              }}
              sx={{ cursor: 'pointer', opacity: branch.hidden ? 0.5 : 1 }}
            >

              {branch.readyToProd ? (
                <Tooltip title="Ready to prod">
                  <CheckCircle color="success" />
                </Tooltip>
              ) : (
                <Tooltip title="Not all tasks tested">
                  <Error color="error" />
                </Tooltip>
              )}

              <Typography noWrap flexGrow={1}>{branch.name}</Typography>

              <Box display="flex" flexGrow={1} />

              {branch.mergeRequest && (
                <MergeRequestBadge
                  externalId={branch.mergeRequest.externalId}
                  url={branch.mergeRequest.url}
                  status={getMergeRequestStatus(branch.mergeRequest.externalStatus)}
                  targetBranch={branch.mergeRequest.targetBranch}
                />
              )}

            </Stack>
          ))
      )}
      <Fab color="primary" onClick={handleAddBranch} sx={{ position: 'absolute', bottom: 24, right: 24 }}>
        <Add />
      </Fab>
    </Grid2>
  )
}