import { useSquadAppStore } from "@/lib/jirify/squad-app/store/squad-app-store";
import { BranchDashboardModeEnum, useBranchDashboardStore } from "@/lib/jirify/squad-app/store/branch-dashboard-store";
import { squadAppUrls } from "@/lib/jirify/squad-app/urls";
import { useFetchStore } from "@/lib/common/store/fetch-store";
import { BranchDashboardBranchUpdateData } from "@/lib/jirify/squad-app/store/type";
import { useEffect } from "react";
import { FormContainer, SwitchElement, TextFieldElement, useForm } from "react-hook-form-mui";
import { Alert, Button, Stack, Tooltip, Typography } from "@mui/material";
import { ListSkeleton } from "@/components/common/skeleton/ListSkeleton";
import { Box } from "@mui/system";
import { BranchFieldElement } from "@/components/jirify/common/BranchFieldElement";
import { SquadAppJiraIssueStatusBadge } from "@/components/jirify/squad-app/SquadAppJiraIssueStatusBadge";
import { getMergeRequestStatus } from "@/lib/jirify/common/integration/gitlab/types";
import { MergeRequestBadge } from "@/components/jirify/common/MergeRequestBadge";

export interface BranchDashboardViewProps {}

const defaultValues = {
  name: '',
  parent: null,
  hidden: false,
}

export function BranchDashboardView({}: BranchDashboardViewProps) {
  const squadAppStore = useSquadAppStore()
  const { dashboard, branchId, setBranchId, branch, setMode } = useBranchDashboardStore()
  const branchUpdate = useFetchStore<void>('PUT', squadAppUrls.branchDashboard.branchId)
  const form = useForm<BranchDashboardBranchUpdateData>({ defaultValues })

  useEffect(() => {
    if (branchId) {
      branchUpdate.updatePathParams({ id: branchId })
    }
  }, [branchId]);

  useEffect(() => {
    if (branch.data) {
      form.reset(branch.data)
    }
  }, [branch.data]);

  const handleSave = () => {
    const body = form.getValues()
    branchUpdate.fetch({ body })
      .then(() => {
        setBranchId(null)
        setMode(null)
        dashboard.fetch()
      })
  }

  return (
    <Stack width={400} padding={2}>
      {branch.loading ? (
        <ListSkeleton />
      ) : branch.error ? (
        <Alert severity="error">{branch.error}</Alert>
      ) : branch.data ? (
        <FormContainer formContext={form} onSuccess={handleSave}>
          <Stack gap={2}>
            {branchUpdate.error && (
              <Alert severity="error">{branchUpdate.error}</Alert>
            )}
            <Stack direction="row">
              <Typography>Branch</Typography>
              <Box flexGrow={1} />
              <Button
                type="submit"
                color="primary"
                disabled={branchUpdate.loading}
              >
                Save
              </Button>
            </Stack>

            <TextFieldElement name="name" />

            {squadAppStore.data && (
              <BranchFieldElement
                workspace={squadAppStore.data.id}
                repository={branch.data.repository}
                name="parent"
                label="Parent"
                common
              />
            )}

            <SwitchElement label="Hidden" name="hidden" />

            {branch.data.tasks.length > 0 && (
              <>
                <Stack direction="row" marginTop={2} alignItems="center">
                  <Typography>Tasks</Typography>
                  <Box flexGrow={1} />
                  <Button onClick={() => setMode(BranchDashboardModeEnum.RELATION)}>
                    View all
                  </Button>
                </Stack>
                {branch.data.tasks.map((task) => (
                  <Stack key={task.id} direction="row" gap={1}>

                    <Typography flexShrink={0}>{task.key}</Typography>

                    <Tooltip title={task.summary} sx={{ flexGrow: 1 }}>
                      <Typography noWrap>{task.summary}</Typography>
                    </Tooltip>

                    <Box width={150} flexShrink={0}>
                      <SquadAppJiraIssueStatusBadge status={task.externalStatus}/>
                    </Box>

                  </Stack>
                ))}
              </>
            )}

            <Stack direction="row" marginTop={2} alignItems="center">
              <Typography>Merge requests</Typography>
              <Box flexGrow={1} />
              <Button onClick={() => setMode(BranchDashboardModeEnum.MERGE_REQUEST)}>
                View all
              </Button>
            </Stack>

            {branch.data.mergeRequests.map((mergeRequest) => (
              <Stack key={mergeRequest.externalId} direction="row" gap={1}>

                <MergeRequestBadge
                  externalId={mergeRequest.externalId}
                  url={mergeRequest.url}
                  status={getMergeRequestStatus(mergeRequest.externalStatus)}
                  error={mergeRequest.externalStatus}
                  sourceBranch={branch.data?.name}
                  targetBranch={mergeRequest.targetBranch}
                />

              </Stack>
            ))}

          </Stack>
        </FormContainer>
      ) : null}
    </Stack>
  )
}