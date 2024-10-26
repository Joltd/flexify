import { Alert, Button, IconButton, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { ListSkeleton } from "@/components/common/skeleton/ListSkeleton";
import { useFetchStore } from "@/lib/common/store/fetch-store";
import { TaskDashboardTaskData, TaskDashboardTaskUpdateData } from "@/lib/jirify/squad-app/store/type";
import { SquadAppJiraIssueStatusBadge } from "@/components/jirify/squad-app/SquadAppJiraIssueStatusBadge";
import { squadAppRouts, squadAppUrls } from "@/lib/jirify/squad-app/urls";
import { FormContainer, SwitchElement, useForm } from "react-hook-form-mui";
import { TaskStatusFieldElement } from "@/components/jirify/common/TaskStatusFieldElement";
import { BranchFieldElement } from "@/components/jirify/common/BranchFieldElement";
import { useSquadAppStore } from "@/lib/jirify/squad-app/store/squad-app-store";
import { Box } from "@mui/system";
import { useTaskDashboardStore } from "@/lib/jirify/squad-app/store/task-dashboard-store";
import { Visibility } from "@mui/icons-material";

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
  const task = useFetchStore<TaskDashboardTaskData>('GET', squadAppUrls.taskDashboard.taskId)
  const taskUpdate = useFetchStore<TaskDashboardTaskData>('PUT', squadAppUrls.taskDashboard.taskId)
  const form = useForm<TaskDashboardTaskUpdateData>({ defaultValues })
  const backendBranch = form.watch('backendBranch')
  const frontendBranch = form.watch('frontendBranch')

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
  //
  // const handleViewBranchRelation = (branch: string | null) => {
  //   if (branch) {
  //     router.push({
  //       pathname: squadAppRouts.branchDashboard,
  //       query: { branch, mode: 'RELATION' }
  //     })
  //   }
  // }

  return (
    <Stack width={400} padding={2}>
      {task.loading ? (
        <ListSkeleton />
      ) : task.error ? (
        <Alert severity="error">{task.error}</Alert>
      ) : taskUpdate.error ? (
        <Alert severity="error">{task.error}</Alert>
      ) : task.data ? (
        <FormContainer formContext={form} onSuccess={handleSave}>
          <Stack gap={2}>
            <Stack direction="row">
              <Typography>{task.data.key}</Typography>
              <Box flexGrow={1} />
              <Button
                type="submit"
                color="primary"
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
                <Typography marginTop={1}>Branches</Typography>
                <Box display="grid" gridTemplateColumns="1fr min-content" gap={1}>
                  <BranchFieldElement
                    workspace={squadAppStore.data?.id}
                    repository={squadAppStore.data?.backendRepository}
                    name="backendBranch"
                    label="Backend"
                    nameSuggestion={task.data.key}
                    common
                  />
                  <IconButton href={`${squadAppRouts.branchDashboard}?id=${backendBranch}`} disabled={!backendBranch}>
                    <Visibility />
                  </IconButton>
                  <BranchFieldElement
                    workspace={squadAppStore.data?.id}
                    repository={squadAppStore.data?.frontendRepository}
                    name="frontendBranch"
                    label="Frontend"
                    nameSuggestion={task.data.key}
                    common
                  />
                  <IconButton href={`${squadAppRouts.branchDashboard}?id=${frontendBranch}`} disabled={!frontendBranch}>
                    <Visibility />
                  </IconButton>
                </Box>
              </>
            )}
          </Stack>

        </FormContainer>
      ) : null}
    </Stack>
  )
}