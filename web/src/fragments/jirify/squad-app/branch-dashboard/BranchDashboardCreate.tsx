import { Alert, Button, Stack, Typography } from "@mui/material";
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui";
import { Box } from "@mui/system";
import { RepositoryFieldElement } from "@/components/jirify/common/RepositoryFieldElement";
import { useSquadAppStore } from "@/lib/jirify/squad-app/store/squad-app-store";
import { BranchFieldElement } from "@/components/jirify/common/BranchFieldElement";
import { BranchDashboardBranchCreateData } from "@/lib/jirify/squad-app/store/type";
import { useEffect } from "react";
import { useFetchStore } from "@/lib/common/store/fetch-store";
import { squadAppUrls } from "@/lib/jirify/squad-app/urls";
import { useBranchDashboardStore } from "@/lib/jirify/squad-app/store/branch-dashboard-store";

export interface BranchDashboardCreateProps {}

const defaultValues = {
  name: '',
  repository: null,
  parent: null,
}

export function BranchDashboardCreate({}: BranchDashboardCreateProps) {
  const { data } = useSquadAppStore()
  const { dashboard, setMode } = useBranchDashboardStore()
  const branchSave = useFetchStore<BranchDashboardBranchCreateData>('POST', squadAppUrls.branchDashboard.branch)
  const form = useForm<BranchDashboardBranchCreateData>({ defaultValues })
  const repository = form.watch('repository')

  useEffect(() => {
    form.reset({})
  }, []);

  const handleSave = () => {
    branchSave.fetch({ body: form.getValues() })
      .then(() => {
        setMode(null)
        dashboard.fetch()
      })
  }

  return (
    <Stack width={600} padding={2}>
      <FormContainer formContext={form} onSuccess={handleSave}>
        <Stack gap={2}>
          {branchSave.error && (
            <Alert severity="error">{branchSave.error}</Alert>
          )}

          <Stack direction="row" alignItems="center">
            <Typography>New branch</Typography>
            <Box flexGrow={1} />
            <Button
              type="submit"
              color="primary"
              disabled={branchSave.loading}
            >
              Create
            </Button>
          </Stack>

          <TextFieldElement name="name" />

          {data && (
            <>
              <RepositoryFieldElement workspace={data.id} name="repository" />

              {repository && (
                <BranchFieldElement workspace={data.id} repository={repository} name="parent" label="Parent" common />
              )}
            </>
          )}
        </Stack>
      </FormContainer>
    </Stack>
  )
}