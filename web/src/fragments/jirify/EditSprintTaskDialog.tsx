import { Alert, Button, Dialog, DialogActions, DialogContent, Stack } from "@mui/material";
import { useApi } from "@/lib/common/api";
import { API_URL } from "@/lib/urls";
import { useEffect } from "react";
import { AutocompleteElement, CheckboxElement, FormContainer, useForm } from "react-hook-form-mui";
import { EditSprintTask, TaskStatusEnum, TaskStatusLabel } from "@/lib/jirify/types";

export interface EditSprintTaskDialogProps {
  id: string
  open: boolean
  onComplete: () => void
  onClose: () => void
}

export function EditSprintTaskDialog({
  id,
  open,
  onComplete,
  onClose,
}: EditSprintTaskDialogProps) {
  const getApi = useApi<EditSprintTask>(API_URL.jirify.common.sprintTask.id)
  const putApi = useApi<EditSprintTask>(API_URL.jirify.common.sprintTask.id)
  const form = useForm<EditSprintTask>({ mode: "onBlur" })

  useEffect(() => {
    if (open) {
      getApi.reset()
      putApi.reset()
      getApi.get({ pathParams: { id } })
    }
  }, [open]);

  useEffect(() => {
    form.reset(getApi.data)
  }, [getApi.data]);

  const handleUpdate = () => {
    const body = form.getValues()
    putApi.put({
      pathParams: { id },
      body: {
        ...body,
        status: (body.status as any).id
      }
    }).then(onComplete).then(onClose)
  }

  const options = Object.keys(TaskStatusEnum)
    .map((key) => ({ id: key, label: TaskStatusLabel[key as TaskStatusEnum] }))

  return (
    <Dialog open={open} onClose={onClose}>
      <FormContainer formContext={form} onSuccess={handleUpdate}>
        <DialogContent>
          <Stack gap={1} minWidth={200}>
            {getApi.error && <Alert severity="error">{getApi.error}</Alert>}
            {putApi.error && <Alert severity="error">{putApi.error}</Alert>}
            <AutocompleteElement
              name="status"
              options={options}
            />
            <CheckboxElement
              name="performed"
              label="Performed"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" color="primary" disabled={getApi.loading || putApi.loading}>Save</Button>
        </DialogActions>
      </FormContainer>
    </Dialog>
  )
}