import { Alert, Button, Dialog, DialogActions, DialogContent, Stack } from "@mui/material";
import { DialogProps } from "@/lib/common/dialog";
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui";
import { useApi } from "@/lib/common/api";
import { API_URL } from "@/lib/urls";
import { useEffect } from "react";
import { EditBranch } from "@/lib/jirify/types";
import { RepositoryFieldElement } from "@/components/jirify/common/RepositoryFieldElement";
import { BranchFieldElement } from "@/components/jirify/common/BranchFieldElement";

export interface EditBranchDialogProps extends DialogProps {
  id: string | null
  workspace: string
}

export function EditBranchDialog({
  id,
  workspace,
  open,
  onComplete,
  onClose,
}: EditBranchDialogProps) {
  const getApi = useApi<EditBranch>(API_URL.jirify.common.branch.id)
  const postApi = useApi(API_URL.jirify.common.branch.root)
  const putApi = useApi(API_URL.jirify.common.branch.id)
  const form = useForm<EditBranch>({ mode: "onBlur" })
  const repository = form.watch('repository')

  useEffect(() => {
    getApi.reset()
    if (!id) {
      return
    }
    getApi.get({ pathParams: { id } })
  }, [id]);

  useEffect(() => {
    form.reset(getApi.data)
  }, [getApi.data]);

  const handleSave = () => {
    if (id) {
      putApi.put({ pathParams: { id }, body: form.getValues() })
        .then(onComplete)
        .then(onClose)
    } else {
      postApi.post({ body: form.getValues() })
        .then(onComplete)
        .then(onClose)
    }
  }

  return <Dialog open={open} onClose={onClose}>
    <FormContainer formContext={form} onSuccess={handleSave}>
      <DialogContent>
        <Stack gap={1}>
          {getApi.error && <Alert severity="error">{getApi.error}</Alert>}
          {postApi.error && <Alert severity="error">{postApi.error}</Alert>}
          {putApi.error && <Alert severity="error">{putApi.error}</Alert>}
          <RepositoryFieldElement
            workspace={workspace}
            name="repository"
          />
          <TextFieldElement
            name="name"
          />
          <BranchFieldElement
            workspace={workspace}
            repository={repository}
            name="parent"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" color="primary" disabled={postApi.loading || putApi.loading}>Save</Button>
      </DialogActions>

    </FormContainer>
  </Dialog>;
}