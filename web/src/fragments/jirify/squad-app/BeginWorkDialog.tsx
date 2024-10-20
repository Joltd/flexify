import { Alert, Button, Dialog, DialogActions, DialogContent, Stack, Typography } from "@mui/material";
import { FormContainer, SwitchElement, useForm } from "react-hook-form-mui";
import { BranchFieldElement } from "@/components/jirify/common/BranchFieldElement";
import { SprintTaskRecord, SquadAppJiraIssueStatusEnum, WorkspaceResponse } from "@/lib/jirify/squad-app/types";
import { useEffect } from "react";
import { useApi } from "@/lib/common/api";
import { API_URL } from "@/lib/urls";
import { TaskStatusBadge } from "@/components/jirify/common/TaskStatusBadge";
import { TaskStatusEnum } from "@/lib/jirify/types";
import { SquadAppJiraIssueStatusBadge } from "@/components/jirify/squad-app/SquadAppJiraIssueStatusBadge";
import { ArrowRightAlt } from "@mui/icons-material";
import { Box } from "@mui/system";
import { CreateBranch } from "@/components/jirify/common/BranchField";

export interface BeginWorkDialogProps {
  task: SprintTaskRecord | null;
  open: boolean;
  onComplete: () => void;
  onClose: () => void;
}

interface FieldValues {
  sendToJira: boolean
  backend: CreateBranch | string | null
  frontend: CreateBranch | string | null
}

export function BeginWorkDialog({
  task,
  open,
  onComplete,
  onClose,
}: BeginWorkDialogProps) {
  const workspaceApi = useApi<WorkspaceResponse>(API_URL.jirify.squadApp.workspace)
  const beginWorkApi = useApi(API_URL.jirify.squadApp.home.beginWork)
  const form = useForm<FieldValues>({ mode: "onBlur", defaultValues: {} })

  useEffect(() => {
    if (open) {
      form.reset({})
      workspaceApi.get()
      beginWorkApi.reset()
    }
  }, [open]);

  const handleBegin = () => {
    const body = form.getValues()
    beginWorkApi.post({
      body: {
        taskId: task?.id,
        sendToJira: body.sendToJira,
        backend: typeof body.backend === 'string' ? body.backend : null,
        createBackend: typeof body.backend === 'object' ? body.backend : null,
        frontend: typeof body.frontend === 'string' ? body.frontend : null,
        createFrontend: typeof body.frontend === 'object' ? body.frontend : null
      }
    }).then(() => {
      onComplete()
      onClose()
    })
  }

  return <Dialog open={open} onClose={onClose}>
    <FormContainer formContext={form} onSuccess={handleBegin}>
      <DialogContent>
        <Stack>
          {beginWorkApi.error && (
            <Alert severity="error">{beginWorkApi.error}</Alert>
          )}
          <Typography variant="h5">{task?.key}</Typography>
          <Typography variant="h6">{task?.summary}</Typography>
          <Stack gap={2} marginTop={4}>
            {task && (
              <>
                <Stack direction="row" gap={1} alignItems="center">
                  <TaskStatusBadge status={task.status} />
                  <ArrowRightAlt />
                  <TaskStatusBadge status={TaskStatusEnum.IN_PROGRESS} />
                  <Box flexGrow={1} />
                </Stack>
                <Stack direction="row" gap={1} alignItems="center">
                  <SquadAppJiraIssueStatusBadge status={task.externalStatus} />
                  <ArrowRightAlt />
                  <SquadAppJiraIssueStatusBadge status={SquadAppJiraIssueStatusEnum.IN_PROGRESS} />
                  <Box width={100} flexGrow={1} />
                  <SwitchElement label="Send to Jira" name="sendToJira" />
                </Stack>
              </>
            )}
          </Stack>
          <Stack gap={2} marginTop={4}>
            {workspaceApi.data.backendRepository && (
              <BranchFieldElement
                workspace={workspaceApi.data.id}
                repository={workspaceApi.data.backendRepository.id}
                name="backend"
                label="Backend"
                nameSuggestion={task?.key}
              />
            )}
            {workspaceApi.data.frontendRepository && (
              <BranchFieldElement
                workspace={workspaceApi.data.id}
                repository={workspaceApi.data.frontendRepository.id}
                name="frontend"
                label="Frontend"
                nameSuggestion={task?.key}
              />
            )}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" color="primary" disabled={beginWorkApi.loading}>Begin</Button>
      </DialogActions>
    </FormContainer>
  </Dialog>
}
