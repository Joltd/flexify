import {
  Alert,
  Chip,
  IconButton,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Tooltip,
  Typography
} from "@mui/material";
import { useFetchStore } from "@/lib/common/store/fetch-store";
import { squadAppUrls } from "@/lib/jirify/squad-app/urls";
import { useEffect } from "react";
import { ArrowBack, CheckCircle, Error, OpenInNew } from "@mui/icons-material";
import { ListSkeleton } from "@/components/common/skeleton/ListSkeleton";
import { BranchDashboardRelationEntry } from "@/lib/jirify/squad-app/store/type";
import { Box } from "@mui/system";
import { SquadAppJiraIssueStatusBadge } from "@/components/jirify/squad-app/SquadAppJiraIssueStatusBadge";
import { BranchDashboardModeEnum, useBranchDashboardStore } from "@/lib/jirify/squad-app/store/branch-dashboard-store";

export interface BranchDashboardRelationProps {}

export function BranchDashboardRelation({}: BranchDashboardRelationProps) {
  const { branchId, setMode } = useBranchDashboardStore()
  const branchRelation = useFetchStore<BranchDashboardRelationEntry[]>('GET', squadAppUrls.branchDashboard.relation)

  useEffect(() => {
    if (branchId) {
      branchRelation.updatePathParams({ id: branchId })
      branchRelation.fetch()
    }
  }, [branchId]);

  return (
    <Stack width={600} padding={2} gap={2}>
      <Stack direction="row" gap={2} alignItems="center">
        <IconButton onClick={() => setMode(BranchDashboardModeEnum.VIEW)}>
          <ArrowBack />
        </IconButton>
        <Typography>Branch relations</Typography>
      </Stack>

      {branchRelation.loading ? (
        <ListSkeleton />
      ) : branchRelation.error ? (
        <Alert severity="error">{branchRelation.error}</Alert>
      ) : branchRelation.data ? (
        <Stepper orientation="vertical" nonLinear>
          {branchRelation.data.map((entry) => (
            <Step key={entry.id} active>
              <StepLabel icon={entry.readyToProd ? <CheckCircle color="success" /> : <Error color="error" />}>
                {entry.id === branchId
                  ? (<Chip label={entry.name} />)
                  : (<>{entry.name}</>)}
              </StepLabel>
              <StepContent>
                {entry.tasks.map((task) => (
                  <Stack key={task.id} direction="row" gap={1}>

                    <IconButton size="small" href={task.url} target="_blank">
                      <OpenInNew fontSize="small" />
                    </IconButton>

                    <Typography flexShrink={0}>{task.key}</Typography>

                    <Tooltip title={task.summary} sx={{ flexGrow: 1 }}>
                      <Typography noWrap>{task.summary}</Typography>
                    </Tooltip>

                    <Box width={150} flexShrink={0}>
                      <SquadAppJiraIssueStatusBadge status={task.externalStatus}/>
                    </Box>

                  </Stack>
                ))}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      ) : null}
    </Stack>
  )
}