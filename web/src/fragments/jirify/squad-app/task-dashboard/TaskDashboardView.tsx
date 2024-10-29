import { Alert, Button, IconButton, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { ListSkeleton } from "@/components/common/skeleton/ListSkeleton";
import { useFetchStore } from "@/lib/common/store/fetch-store";
import { TaskDashboardTaskData, TaskDashboardTaskUpdateData } from "@/lib/jirify/squad-app/store/type";
import { SquadAppJiraIssueStatusBadge } from "@/components/jirify/squad-app/SquadAppJiraIssueStatusBadge";
import { squadAppUrls } from "@/lib/jirify/squad-app/urls";
import { FormContainer, SwitchElement, useForm } from "react-hook-form-mui";
import { TaskStatusFieldElement } from "@/components/jirify/common/TaskStatusFieldElement";
import { BranchFieldElement } from "@/components/jirify/common/BranchFieldElement";
import { useSquadAppStore } from "@/lib/jirify/squad-app/store/squad-app-store";
import { Box } from "@mui/system";
import { useTaskDashboardStore } from "@/lib/jirify/squad-app/store/task-dashboard-store";
import { Visibility } from "@mui/icons-material";
import { BranchDashboardModeEnum, useBranchDashboardStore } from "@/lib/jirify/squad-app/store/branch-dashboard-store";
import { MergeRequestBadge } from "@/components/jirify/common/MergeRequestBadge";

export interface TaskDashboardViewProps {}

const defaultValues = {
  performed: false,
  status: null,
  backendBranch: null,
  frontendBranch: null,
}

export function TaskDashboardView({}: TaskDashboardViewProps) {
  const squadAppStore = useSquadAppStore()
  const { dashboard, task: id, setTask } = useTaskDashboardStore()
  const { setBranchId, setMode } = useBranchDashboardStore()
  const task = useFetchStore<TaskDashboardTaskData>('GET', squadAppUrls.taskDashboard.taskId)
  const taskUpdate = useFetchStore<TaskDashboardTaskData>('PUT', squadAppUrls.taskDashboard.taskId)
  const form = useForm<TaskDashboardTaskUpdateData>({ defaultValues })

  useEffect(() => {
    if (id) {
      task.fetch({ pathParams: { id } })
      taskUpdate.updatePathParams({ id })
    }
  }, [id]);

  useEffect(() => {
    if (task.data) {
      form.reset(task.data)
    }
  }, [task.data]);

  const handleSave = () => {
    const body = form.getValues()
    taskUpdate.fetch({
      body: {
        status: body.status,
        performed: body.performed,
        backendBranch: typeof body.backendBranch === 'string' ? body.backendBranch : null,
        backendBranchCreate: typeof body.backendBranch === 'object' ? body.backendBranch : null,
        frontendBranch: typeof body.frontendBranch === 'string' ? body.frontendBranch : null,
        frontendBranchCreate: typeof body.frontendBranch === 'object' ? body.frontendBranch : null,
      }
    }).then(() => {
      setTask(null)
      dashboard.fetch()
    })
  }

  const handleViewBranch = (branch?: string) => {
    if (!branch) {
      return
    }

    setBranchId(branch)
    setMode(BranchDashboardModeEnum.VIEW)
  }

  return (
    <Stack width={600} padding={2}>
      {task.loading ? (
        <ListSkeleton />
      ) : task.error ? (
        <Alert severity="error">{task.error}</Alert>
      ) : taskUpdate.error ? (
        <Alert severity="error">{task.error}</Alert>
      ) : task.data ? (
        <FormContainer formContext={form} onSuccess={handleSave}>
          <Stack gap={2}>
            <Stack direction="row" alignItems="center">
              <Typography>{task.data.key}</Typography>
              <Box flexGrow={1} />
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={taskUpdate.loading}
              >
                Save
              </Button>
            </Stack>

            <Typography>{task.data.summary}</Typography>

            <SquadAppJiraIssueStatusBadge status={task.data.externalStatus} />

            <SwitchElement name="performed" label="Performed" />

            <TaskStatusFieldElement name="status" />

            {squadAppStore.data && (
              <>
                <Typography marginTop={2}>Branches</Typography>
                <Stack direction="row" gap={1}>
                  <BranchFieldElement
                    workspace={squadAppStore.data?.id}
                    repository={squadAppStore.data?.backendRepository}
                    name="backendBranch"
                    label="Backend"
                    nameSuggestion={task.data.key}
                    common
                    withAdd
                  />
                  {task.data.backendMergeRequest && (
                    <MergeRequestBadge
                      externalId={task.data.backendMergeRequest.externalId}
                      url={task.data.backendMergeRequest.url}
                      status={task.data.backendMergeRequest.status}
                    />
                  )}
                  <IconButton onClick={() => handleViewBranch(task.data?.backendBranch)} disabled={!task.data.backendBranch}>
                    <Visibility />
                  </IconButton>
                </Stack>
                <Stack direction="row" gap={1}>
                  <BranchFieldElement
                    workspace={squadAppStore.data?.id}
                    repository={squadAppStore.data?.frontendRepository}
                    name="frontendBranch"
                    label="Frontend"
                    nameSuggestion={task.data.key}
                    common
                    withAdd
                  />
                  {task.data.frontendMergeRequest && (
                    <MergeRequestBadge
                      externalId={task.data.frontendMergeRequest.externalId}
                      url={task.data.frontendMergeRequest.url}
                      status={task.data.frontendMergeRequest.status}
                    />
                  )}
                  <IconButton onClick={() => handleViewBranch(task.data?.frontendBranch)} disabled={!task.data.frontendBranch}>
                    <Visibility />
                  </IconButton>
                </Stack>
              </>
            )}
          </Stack>

        </FormContainer>
      ) : null}
    </Stack>
  )
}