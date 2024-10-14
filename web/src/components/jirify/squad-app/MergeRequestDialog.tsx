import { BranchKind, BranchRecord, MergeRequestRecord, RepositoryRecord } from "@/lib/jirify/squad-app/types";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent, DialogTitle,
  Link,
  TextField, Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useApi } from "@/lib/common/api";
import { API_URL } from "@/lib/urls";
import { DevelopmentArea } from "@/lib/jirify/types";
import { CheckCircle, Error, OpenInNew } from "@mui/icons-material";
import { Box } from "@mui/system";

export interface MergeRequestDialogProps {
  repository: RepositoryRecord;
  sourceBranch: BranchRecord;
  open: boolean;
  onComplete: () => void;
  onClose: () => void;
}

export function MergeRequestDialog({
  repository,
  sourceBranch,
  open,
  onComplete,
  onClose,
}: MergeRequestDialogProps) {
  const branchBaseApi = useApi<BranchRecord[]>(API_URL.jirify.squadApp.branch.base, [])
  const findMergerRequestApi = useApi<MergeRequestRecord>(API_URL.jirify.squadApp.branch.mergeRequest)
  const createMergeRequestApi = useApi<MergeRequestRecord>(API_URL.jirify.squadApp.branch.mergeRequest)
  const saveMergeRequestApi = useApi(API_URL.jirify.squadApp.branch.mergeRequestId)
  const closeMergeRequestApi = useApi(API_URL.jirify.squadApp.branch.mergeRequestId)
  const [targetBranch, setTargetBranch] = useState<BranchRecord | null>(null)
  const [mergeRequest, setMergeRequest] = useState<MergeRequestRecord | null>(null)
  const [created, setCreated] = useState(false)

  const isReadyToMerge = () => mergeRequest?.mergeStatus === 'mergeable'
  const isPreparingToMerge = () => mergeRequest?.mergeStatus === 'preparing' || mergeRequest?.mergeStatus === 'checking'

  const isLoading = () => branchBaseApi.loading
    || createMergeRequestApi.loading
    || saveMergeRequestApi.loading
    || closeMergeRequestApi.loading

  useEffect(() => {
    if (!open) {
      return
    }

    setCreated(false)
    setTargetBranch(null)
    setMergeRequest(null)

    branchBaseApi.get<BranchRecord[]>({
      queryParams: {repository: repository.id}
    }).then((data) => {

      if (repository.type === DevelopmentArea.BACKEND) {
        setTargetBranch(data.find((branch) => branch.kind === BranchKind.RELEASE) || null)
      } else if (repository.type === DevelopmentArea.FRONTEND) {
        setTargetBranch(data.find((branch) => branch.kind === BranchKind.DEV) || null)
      }

    })
  }, [open])

  useEffect(() => {
    setMergeRequest(findMergerRequestApi.data)
  }, [findMergerRequestApi.data]);

  useEffect(() => {
    if (!mergeRequest || !isPreparingToMerge()) {
      return
    }

    console.log(mergeRequest.mergeStatus)

    const id = setInterval(() => {

      findMergerRequestApi.get({
        queryParams: {
          repository: repository.id,
          iid: ''+mergeRequest.iid
        }
      })

    }, 500)

    return () => clearInterval(id)
  }, [mergeRequest?.mergeStatus]);

  const handleSelectTargetBranch = (event: any, value: BranchRecord | null) => {
    setTargetBranch(value)
    if (!value) {
      return
    }
    findMergerRequestApi.get({
      queryParams: {
        repository: repository.id,
        sourceBranch: sourceBranch.id,
        targetBranch: value.id
      }
    })
  }

  const handleCancel = () => {
    if (!mergeRequest || !created) {
      onClose()
      return
    }

    closeMergeRequestApi.del({
      pathParams: {
        id: ''+mergeRequest.iid
      },
      queryParams: {
        repository: repository.id,
      }
    }).then(() => onClose())
  }

  const handleCreate = () => {
    if (!targetBranch) {
      return
    }
    createMergeRequestApi.post<MergeRequestRecord>({
      body: {
        repository: repository.id,
        sourceBranch: sourceBranch.id,
        targetBranch: targetBranch.id,
      }
    }).then((data) => {
      setMergeRequest(data)
      setCreated(true)
    })
  }

  const handleSave = () => {
    if (!mergeRequest || !isReadyToMerge()) {
      return
    }
    saveMergeRequestApi.post({
      pathParams: {
        id: ''+mergeRequest.iid
      },
      body: {
        repository: repository.id,
        sourceBranch: sourceBranch.id,
        targetBranch: targetBranch?.id
      }
    }).then(() => onComplete())
  }

  return <Dialog open={open} onClose={onClose}>
    <DialogTitle>
      Merge request
    </DialogTitle>
    <DialogContent>
      <Autocomplete
        renderInput={(props) => <TextField label="Target branch" {...props} />}
        options={branchBaseApi.data}
        value={targetBranch}
        onChange={handleSelectTargetBranch}
        getOptionLabel={(option) => option.name}
        disabled={isLoading() || created}
        sx={{ marginTop: 2, minWidth: 300 }}
      />

      {targetBranch && (
        mergeRequest ? (
          <Link
            href={mergeRequest.url} target="_blank" underline="none"
            display="flex" alignItems="center" justifyContent="center" gap={1}
            marginTop={4}
          >
            <OpenInNew fontSize="small" />
            .../merge_requests/{mergeRequest.iid}

            <Box flexGrow={1} />
            {isReadyToMerge() ? <CheckCircle fontSize="small" color="success" />
              : isPreparingToMerge() ? <CircularProgress size={17} />
              : <Error fontSize="small" color="warning" />}
          </Link>
        ) : (
          <Typography marginTop={4}>No merge request</Typography>
        )
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCancel} disabled={isLoading()}>Cancel</Button>
      {!mergeRequest && (
        <Button color="primary" onClick={handleCreate} disabled={isLoading()}>Create</Button>
      )}
      {isReadyToMerge() && (
        <Button color="primary" onClick={handleSave} disabled={isLoading()}>Save</Button>
      )}
    </DialogActions>
  </Dialog>
}