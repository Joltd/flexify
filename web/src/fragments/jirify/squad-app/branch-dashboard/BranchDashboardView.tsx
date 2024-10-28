import { useSquadAppStore } from "@/lib/jirify/squad-app/store/squad-app-store";
import { BranchDashboardModeEnum, useBranchDashboardStore } from "@/lib/jirify/squad-app/store/branch-dashboard-store";
import { squadAppUrls } from "@/lib/jirify/squad-app/urls";
import { useFetchStore } from "@/lib/common/store/fetch-store";
import {
  BranchDashboardBranchUpdateData,
  BranchDashboardMergeRequestEntry
} from "@/lib/jirify/squad-app/store/type";
import { SyntheticEvent, useEffect } from "react";
import { FormContainer, SwitchElement, TextFieldElement, useForm } from "react-hook-form-mui";
import { Alert, Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { ListSkeleton } from "@/components/common/skeleton/ListSkeleton";
import { Box } from "@mui/system";
import { BranchFieldElement } from "@/components/jirify/common/BranchFieldElement";
import { SquadAppJiraIssueStatusBadge } from "@/components/jirify/squad-app/SquadAppJiraIssueStatusBadge";
import { getMergeRequestStatus } from "@/lib/jirify/common/integration/gitlab/types";
import { MergeRequestBadge } from "@/components/jirify/common/MergeRequestBadge";
import { ContentCopy, OpenInNew } from "@mui/icons-material";
import { useClipboard } from "@/lib/common/clipboard";
import { TaskStatusEnum } from "@/lib/jirify/common/types";

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
  const mark = useFetchStore<void>('POST', squadAppUrls.branchDashboard.mark)
  const form = useForm<BranchDashboardBranchUpdateData>({ defaultValues })
  const { copy } = useClipboard()

  useEffect(() => {
    if (branchId) {
      branchUpdate.updatePathParams({ id: branchId })
      mark.updatePathParams({ id: branchId })
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

  const handleMark = (event: SyntheticEvent, status: TaskStatusEnum) => {
    event.stopPropagation()
    mark.fetch({ body: status })
  }

  const handleCopyTaskList = (event: SyntheticEvent) => {
    event.stopPropagation()
    const richText = branch.data
      ?.tasks
      ?.map((task) => `<a href="${task.url}">${task.key}</a> ${task.externalStatus}`)
      .join('</br>') || ''
    copy("Not supported", richText)
  }

  const handleCopyMergeRequest = (event: SyntheticEvent, mergeRequest: BranchDashboardMergeRequestEntry) => {
    event.stopPropagation()
    const tasks = branch.data
      ?.tasks
      ?.map((task) => `<a href="${task.url}">${task.key}</a> ${task.summary}`)
      || []

    if (tasks.length > 1) {
      copy("Not supported", `<a href="${mergeRequest.url}">ПР</a> по задачам</br>${tasks.join('</br>')}`)
    } else if (tasks.length > 0) {
      copy("Not supported", `<a href="${mergeRequest.url}">ПР</a> по задаче ${tasks.join('')}`)
    }

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
            {mark.error && (
              <Alert severity="error">{mark.error}</Alert>
            )}
            <Stack direction="row" alignItems="center">
              <Typography>Branch</Typography>
              <Box flexGrow={1} />
              <Button
                type="submit"
                color="primary"
                variant="contained"
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

            {branch.data && (
              <Stack marginTop={2} gap={1}>
                <Typography>Actions</Typography>
                <Stack direction="row" gap={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(event) => handleMark(event, TaskStatusEnum.DEPLOY)}
                    disabled={mark.loading}
                  >
                    Deploy
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(event) => handleMark(event, TaskStatusEnum.REVIEW)}
                    disabled={mark.loading}
                  >
                    Review
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(event) => handleMark(event, TaskStatusEnum.DONE)}
                    disabled={mark.loading}
                  >
                    Done
                  </Button>
                </Stack>
              </Stack>
            )}

            {branch.data.tasks.length > 0 && (
              <>
                <Stack direction="row" marginTop={2} gap={1} alignItems="center">
                  <Typography>Tasks</Typography>
                  <IconButton size="small" onClick={handleCopyTaskList}>
                    <ContentCopy fontSize="small" />
                  </IconButton>
                  <Box flexGrow={1} />
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={() => setMode(BranchDashboardModeEnum.RELATION)}
                  >
                    View all
                  </Button>
                </Stack>
                {branch.data.tasks.map((task) => (
                  <Stack key={task.id} direction="row" gap={1} alignItems="center">

                    <IconButton size="small" href={task.url} target="_blank" onClick={(event) => event.stopPropagation()}>
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
              </>
            )}

            <Stack direction="row" marginTop={2} alignItems="center">
              <Typography>Merge requests</Typography>
              <Box flexGrow={1} />
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={() => setMode(BranchDashboardModeEnum.MERGE_REQUEST)}
              >
                View all
              </Button>
            </Stack>

            {branch.data.mergeRequests.map((mergeRequest) => (
              <Stack key={mergeRequest.externalId} direction="row" gap={1} alignItems="center">

                <MergeRequestBadge
                  externalId={mergeRequest.externalId}
                  url={mergeRequest.url}
                  status={getMergeRequestStatus(mergeRequest.externalStatus)}
                  error={mergeRequest.externalStatus}
                  sourceBranch={branch.data?.name}
                  targetBranch={mergeRequest.targetBranch}
                />

                <IconButton size="small" onClick={(event) => handleCopyMergeRequest(event, mergeRequest)}>
                  <ContentCopy fontSize="small" />
                </IconButton>

              </Stack>
            ))}

          </Stack>
        </FormContainer>
      ) : null}
    </Stack>
  )
}