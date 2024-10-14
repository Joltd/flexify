import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { FormContainer, SwitchElement, useForm } from "react-hook-form-mui";
import { BranchFieldElement } from "@/components/jirify/common/BranchFieldElement";
import { SprintTaskRecord, SquadAppJiraIssueStatusEnum, WorkspaceResponse } from "@/lib/jirify/squad-app/types";
import { useEffect, useState } from "react";
import { useApi } from "@/lib/common/api";
import { API_URL } from "@/lib/urls";
import { TaskStatusBadge } from "@/components/jirify/common/TaskStatusBadge";
import { TaskStatusEnum } from "@/lib/jirify/types";
import { SquadAppJiraIssueStatusBadge } from "@/components/jirify/squad-app/SquadAppJiraIssueStatusBadge";
import { ArrowRightAlt } from "@mui/icons-material";
import { Box } from "@mui/system";

export interface BeginWorkDialogProps {
  task: SprintTaskRecord | null;
  open: boolean;
  onComplete: () => void;
  onClose: () => void;
}

const defaultValues = {
  sendToJira: false,
  backend: null,
  frontend: null,
}

export function BeginWorkDialog({
  task,
  open,
  onComplete,
  onClose,
}: BeginWorkDialogProps) {
  const workspaceApi = useApi<WorkspaceResponse>(API_URL.jirify.squadApp.workspace)
  const beginWorkApi = useApi(API_URL.jirify.squadApp.home.beginWork)
  const form = useForm({ mode: "onBlur", defaultValues })

  useEffect(() => {
    if (open) {
      form.reset(defaultValues)
      workspaceApi.get()
    }
  }, [open]);

  const handleBegin = () => {
    const body = form.getValues()
    beginWorkApi.post({
      body: {
        taskId: task?.id,
        ...body
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
            <BranchFieldElement workspace={workspaceApi.data.id} name="backend" />
            <BranchFieldElement workspace={workspaceApi.data.id} name="frontend" />
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
