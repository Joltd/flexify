'use client'
import {
  Alert, Fab, FormControlLabel,
  Grid2,
  IconButton,
  Menu, MenuItem,
  Skeleton,
  Stack, Switch,
  ToggleButton,
  ToggleButtonGroup, Tooltip,
  Typography
} from "@mui/material";
import { useApi } from "@/lib/common/api";
import { API_URL } from "@/lib/urls";
import { SyntheticEvent, useEffect, useState } from "react";
import { BranchRecord, RepositoryRecord, WorkspaceResponse } from "@/lib/jirify/squad-app/types";
import { ListSkeleton } from "@/components/common/skeleton/ListSkeleton";
import { Add, CheckCircle, Error, MoreVert } from "@mui/icons-material";
import { useMenu } from "@/lib/common/menu";
import { useDialog } from "@/lib/common/dialog";
import { MergeRequestDialog } from "@/fragments/jirify/squad-app/MergeRequestDialog";
import { BranchRelationAnalysis, useBranchRelationAnalysis } from "@/fragments/jirify/squad-app/BranchRelationAnalysis";
import { EditBranchDialog } from "@/fragments/jirify/EditBranchDialog";

export default function Page() {
  const workspaceApi = useApi<WorkspaceResponse>(API_URL.jirify.squadApp.workspace)
  const branchesApi = useApi<BranchRecord[]>(API_URL.jirify.squadApp.branch.list, [])
  const [repository, setRepository] = useState<RepositoryRecord | null>(null)
  const [readyToProd, setReadyToProd] = useState(false)
  const [branch, setBranch] = useState<BranchRecord | null>(null)
  const menu = useMenu()
  const branchAnalysis = useBranchRelationAnalysis()
  const sendToReviewDialog = useDialog()
  const editBranchDialog = useDialog()

  const getBranches = () => {
    if (repository) {
      branchesApi.get({
        queryParams: { repository: repository.id, readyToProd }
      })
    }
  }

  useEffect(() => {
    workspaceApi.get()
  }, []);

  useEffect(() => {
    if (workspaceApi.data.backendRepository) {
      setRepository(workspaceApi.data.backendRepository)
    }
  }, [workspaceApi.data]);

  useEffect(() => {
    getBranches()
  }, [repository, readyToProd]);

  const handleChangeRepository = (event: any, value: RepositoryRecord) => {
    setRepository(value)
  }

  const handleOpenMenu = (event: SyntheticEvent, branch: BranchRecord) => {
    setBranch(branch)
    menu.open(event)
  }

  const handleOpenBranchAdd = () => {
    setBranch(null)
    editBranchDialog.open()
  }

  const handleOpenBranchEdit = () => {
    menu.close()
    editBranchDialog.open()
  }

  const handleOpenBranchAnalysis = () => {
    menu.close()
    branchAnalysis.open(branch)
  }

  const handleOpenMergeRequest = () => {
    menu.close()
    sendToReviewDialog.open()
  }

  return <Grid2 container margin={4} spacing={2}>
    <Grid2 size={12} display="flex" gap={1}>
      <ToggleButtonGroup value={repository} onChange={handleChangeRepository} exclusive>
        <ToggleButton value={workspaceApi.data.backendRepository}>Backend</ToggleButton>
        <ToggleButton value={workspaceApi.data.frontendRepository}>Frontend</ToggleButton>
      </ToggleButtonGroup>
      <FormControlLabel
        control={<Switch
          onChange={(event, value) => setReadyToProd(value)}
        />}
        label="Ready to prod" />
    </Grid2>
    <Grid2 size={branchAnalysis.branch ? 4 : 12} display="flex" flexDirection="column" position="relative">
      {workspaceApi.loading || branchesApi.loading ? (
        <ListSkeleton />
      ) : workspaceApi.error ? (
        <Alert severity="error">{workspaceApi.error}</Alert>
      ) : branchesApi.error ? (
        <Alert severity="error">{branchesApi.error}</Alert>
      ) : (
        <>
          {branchesApi.data.map((branch, index) => (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              gap={1}
            >
              <Typography noWrap flexGrow={1}>{branch.name}</Typography>
              {branch.readyToProd ? (
                <Tooltip title="Ready to prod">
                  <CheckCircle color="success" />
                </Tooltip>
              ) : (
                <Tooltip title="Not all tasks tested">
                  <Error color="error" />
                </Tooltip>
              )}
              <IconButton size="small" onClick={(event) => handleOpenMenu(event, branch)}>
                <MoreVert fontSize="small" />
              </IconButton>
            </Stack>
          ))}
        </>
      )}
      <Fab color="primary" onClick={handleOpenBranchAdd} sx={{ position: 'sticky', bottom: 24, right: 24 }}>
        <Add />
      </Fab>
    </Grid2>
    {branch && branchAnalysis.branch && (
      <Grid2 size={8}>
        <BranchRelationAnalysis {...branchAnalysis} />
      </Grid2>
    )}
    {repository && branch && (
      <MergeRequestDialog
        repository={repository}
        sourceBranch={branch}
        onComplete={getBranches}
        {...sendToReviewDialog.props}
      />
    )}
    <EditBranchDialog
      id={branch?.id || null}
      workspace={workspaceApi.data.id}
      onComplete={getBranches}
      {...editBranchDialog.props}
    />
    <Menu
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      {...menu.props}
    >
      <MenuItem onClick={handleOpenBranchEdit}>Edit</MenuItem>
      <MenuItem onClick={handleOpenBranchAnalysis}>View</MenuItem>
      <MenuItem onClick={handleOpenMergeRequest}>Merge request</MenuItem>
    </Menu>
  </Grid2>
}
