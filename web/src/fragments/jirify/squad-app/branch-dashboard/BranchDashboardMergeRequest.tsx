import { Alert, Button, IconButton, Stack, Typography } from "@mui/material";
import { useSquadAppStore } from "@/lib/jirify/squad-app/store/squad-app-store";
import { BranchDashboardModeEnum, useBranchDashboardStore } from "@/lib/jirify/squad-app/store/branch-dashboard-store";
import { BranchFieldElement } from "@/components/jirify/common/BranchFieldElement";
import { useFetchStore } from "@/lib/common/store/fetch-store";
import { BranchDashboardCreateMergeRequest, BranchDashboardMergeRequestEntry } from "@/lib/jirify/squad-app/store/type";
import { squadAppUrls } from "@/lib/jirify/squad-app/urls";
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui";
import { ArrowBack, ArrowRightAlt } from "@mui/icons-material";
import { MergeRequestBadge } from "@/components/jirify/common/MergeRequestBadge";
import { useEffect } from "react";
import { getMergeRequestStatus } from "@/lib/jirify/common/integration/gitlab/types";
import { MergeRequestStatusEnum } from "@/lib/jirify/common/types";

export interface BranchDashboardMergeRequestProps {}

const defaultValues = {
  sourceBranchSuffix: '',
  targetBranch: null,
}

export function BranchDashboardMergeRequest({}: BranchDashboardMergeRequestProps) {
  const squadAppStore = useSquadAppStore()
  const { branchId, branch, setMode } = useBranchDashboardStore()
  const mergeRequest = useFetchStore<BranchDashboardMergeRequestEntry>('GET', squadAppUrls.branchDashboard.mergeRequestId)
  const createMergeRequest = useFetchStore<string>('POST', squadAppUrls.branchDashboard.mergeRequest)
  const saveMergeRequest = useFetchStore('PUT', squadAppUrls.branchDashboard.mergeRequestId)
  const closeMergeRequest = useFetchStore('DELETE', squadAppUrls.branchDashboard.mergeRequestId)
  const form = useForm<BranchDashboardCreateMergeRequest>({ defaultValues })

  useEffect(() => {
    if (!createMergeRequest.data) {
      return
    }

    const id = setInterval(() => {
      mergeRequest.fetch({
        pathParams: {
          id: branchId,
          mergeRequestId: createMergeRequest.data
        }
      }).then((result) => {
        const status = getMergeRequestStatus(result?.externalStatus)
        if (status !== MergeRequestStatusEnum.WAITING) {
          clearInterval(id)
        }
      })
    }, 1000)

    return () => clearInterval(id)
  }, [createMergeRequest.data]);

  const handleCreate = () => {
    const body = form.getValues()
    createMergeRequest.fetch({
      pathParams: {
        id: branchId
      },
      body
    })
  }

  const handleSave = () => {
    const body = form.getValues()
    saveMergeRequest.fetch({
      pathParams: {
        id: branchId,
        mergeRequestId: createMergeRequest.data,
      },
      body
    }).then(() => {
      branch.fetch()
      createMergeRequest.reset()
    })
  }

  const handleClose = () => {
    closeMergeRequest.fetch({
      pathParams: {
        id: branchId,
        mergeRequestId: createMergeRequest.data,
      }
    }).then(() => {
      createMergeRequest.reset()
    })
  }

  return (
    <Stack width={600} padding={2} gap={2}>
      <Stack direction="row" gap={2} alignItems="center">
        <IconButton onClick={() => setMode(BranchDashboardModeEnum.VIEW)}>
          <ArrowBack />
        </IconButton>
        <Typography>Merge Request</Typography>
      </Stack>

      <FormContainer formContext={form} onSuccess={handleCreate} disabled={createMergeRequest.loading}>
        {squadAppStore.data && branch.data && (
          <Stack gap={2}>
            {mergeRequest.error && (
              <Alert severity="error">{mergeRequest.error}</Alert>
            )}
            {createMergeRequest.error && (
              <Alert severity="error">{createMergeRequest.error}</Alert>
            )}
            {saveMergeRequest.error && (
              <Alert severity="error">{saveMergeRequest.error}</Alert>
            )}
            {closeMergeRequest.error && (
              <Alert severity="error">{closeMergeRequest.error}</Alert>
            )}

            {createMergeRequest.data && mergeRequest.data ? (
              <>
                <MergeRequestBadge
                  externalId={mergeRequest.data.externalId}
                  url={mergeRequest.data.url}
                  status={getMergeRequestStatus(mergeRequest.data.externalStatus)}
                  error={mergeRequest.data.externalStatus}
                  sourceBranch={branch.data?.name}
                  targetBranch={mergeRequest.data.targetBranch}
                />

                <Stack direction="row" gap={1}>
                  <Button
                    onClick={handleClose}
                    disabled={closeMergeRequest.loading}
                  >
                    Close
                  </Button>

                  <Button
                    onClick={handleSave}
                    disabled={saveMergeRequest.loading}
                  >
                    Save
                  </Button>
                </Stack>
              </>
            ) : (
              <>
                <Stack direction="row" gap={1} alignItems="center">
                  <Typography noWrap>{branch.data.name}</Typography>
                  <TextFieldElement name="sourceBranchSuffix" sx={{ width: 100 }} />
                  <ArrowRightAlt />
                  <BranchFieldElement workspace={squadAppStore.data.id} repository={branch.data.repository} name="targetBranch" base />
                </Stack>

                <Stack direction="row">
                  <Button
                    type="submit"
                    disabled={createMergeRequest.loading}
                  >
                    Create
                  </Button>
                </Stack>
              </>
            )}

          </Stack>
        )}
      </FormContainer>

      {!!branch.data?.mergeRequests?.length && (
        branch.data?.mergeRequests?.map((mergeRequest) => (
          <MergeRequestBadge
            key={mergeRequest.externalId}
            externalId={mergeRequest.externalId}
            url={mergeRequest.url}
            status={getMergeRequestStatus(mergeRequest.externalStatus)}
            targetBranch={mergeRequest.targetBranch}
          />
        ))
      )}

    </Stack>
  )
}