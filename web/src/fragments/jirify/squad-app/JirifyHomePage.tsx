'use client'

import { useApi } from "@/lib/common/api";
import { API_URL } from "@/lib/urls";
import {
  Alert, Avatar,
  Button, Chip, CircularProgress, FormControlLabel,
  Grid2, IconButton, Menu, MenuItem, Snackbar,
  Stack, Switch, ToggleButton, ToggleButtonGroup, Tooltip,
  Typography
} from "@mui/material";
import { ActiveSprintResponse, SprintTaskRecord } from "@/lib/jirify/squad-app/types";
import { Fragment, SyntheticEvent, useEffect, useState } from "react";
import { Box } from "@mui/system";
import { PastDate } from "@/components/common/PastDate";
import SyncIcon from '@mui/icons-material/Sync';
import { SquadAppJiraIssueStatusBadge } from "@/components/jirify/squad-app/SquadAppJiraIssueStatusBadge";
import { TaskStatusBadge } from "@/components/jirify/common/TaskStatusBadge";
import { PriorityBadge } from "@/components/jirify/common/PriorityBadge";
import { ContentCopy, Done, MoreVert, OpenInNew } from "@mui/icons-material";
import { EstimationBadge } from "@/components/jirify/common/EstimationBadge";
import { BeginWorkDialog } from "@/components/jirify/squad-app/BeginWorkDialog";
import { useMenu } from "@/lib/common/menu";
import { ListSkeleton } from "@/components/common/skeleton/ListSkeleton";
import { useDialog } from "@/lib/common/dialog";
import { EmployeeMultiField } from "@/components/jirify/common/EmployeeMultiField";
import { useSnackbar } from "@/lib/common/snackbar";
import { DevelopmentArea } from "@/lib/jirify/types";

export function JirifyHomePage() {
  const sprint = useApi<ActiveSprintResponse>(API_URL.jirify.squadApp.home.activeSprint)
  const sync = useApi(API_URL.jirify.squadApp.sync)

  const [employees, setEmployees] = useState<string[]>([])
  const [areas, setAreas] = useState<DevelopmentArea[]>([])
  const [performed, setPerformed] = useState(false)

  const [task, setTask] = useState<SprintTaskRecord | null>(null)
  const menu = useMenu()
  const beginWorkDialog = useDialog()
  const snackbar = useSnackbar()

  const getSprint = () => sprint.get({
    queryParams: { employees, areas, performed }
  })

  useEffect(() => {
    getSprint()
  }, [employees, areas, performed]);

  const handleSync = () => {
    sync.post()
      .then(() => getSprint())
  }

  const handleCopyTaskKey = (task: SprintTaskRecord) => {
    navigator.clipboard
      .writeText(task.key)
      .then(() => snackbar.show('Task key copied'))
  }

  const handleCopyTaskKeyAndSummary = (task: SprintTaskRecord) => {
    navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([`<a href="${task.url}">${task.key}</a> ${task.summary}`], { type: 'text/html' }),
        'text/plain': new Blob([`${task.key} ${task.summary}`], { type: 'text/plain' })
      })
    ]).then(() => snackbar.show('Task link copied'))
  }

  const handleOpenMenu = (event: SyntheticEvent, task: SprintTaskRecord) => {
    setTask(task)
    menu.open(event)
  }

  const handleOpenBeginWork = () => {
    menu.close()
    beginWorkDialog.open()
  }

  const handleBeginWorkComplete = () => {
    getSprint()
  }

  const totalEstimation = sprint.data
    .groups
    ?.reduce((total, group) => total + group.tasks
      .reduce((total, task) => total + (task.estimation || 0), 0), 0)

  return <>
    <Grid2 container margin={4} spacing={2}>
      <Grid2 size={12} display="flex" alignItems="center" gap={2}>
        <Typography variant="h6">{sprint.data.key}</Typography>
        <EmployeeMultiField workspace={sprint.data.workspace} onChange={(employees) => setEmployees(employees)} />
        <ToggleButtonGroup value={areas} onChange={(event, areas) => setAreas(areas)}>
          <ToggleButton value={DevelopmentArea.BACKEND}>Backend</ToggleButton>
          <ToggleButton value={DevelopmentArea.FRONTEND}>FrontEnd</ToggleButton>
        </ToggleButtonGroup>
        <FormControlLabel
          control={<Switch
            value={performed}
            onChange={(event, value) => setPerformed(value)}
          />}
          label="Performed"
        />
        <Box flexGrow={1} />
        <EstimationBadge value={totalEstimation} />
        <PastDate date={sprint.data.updatedAt} />
        <Button
          variant="contained"
          color="primary"
          startIcon={sync.loading ? (
            <CircularProgress color="inherit" size={20}/>
          ) : (
            <SyncIcon/>
          )}
          disabled={sync.loading}
          onClick={handleSync}
        >
          Sync
        </Button>
      </Grid2>
      <Grid2 size={12} display="flex" flexDirection="column">
        {sprint.loading ? (
          <ListSkeleton />
        ) : sprint.error ? (
          <Alert severity="error">{sprint.error}</Alert>
        ) : (
          <>
            {sprint.data.groups?.map((group, index) => (
              <Fragment key={index}>
                <Box
                  display="flex"
                  top="64px"
                  position="sticky"
                  bgcolor="white"
                  padding="16px 0"
                  zIndex={10}
                >
                  <TaskStatusBadge status={group.status} />
                </Box>
                {group.tasks.map((task, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    alignItems="center"
                    gap={1}
                  >
                    <IconButton size="small" href={task.url} target="_blank">
                      <OpenInNew fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleCopyTaskKeyAndSummary(task)}>
                      <ContentCopy fontSize="small" />
                    </IconButton>
                    <Button color="inherit" sx={{ flexShrink: 0 }} onClick={() => handleCopyTaskKey(task)}>{task.key}</Button>
                    <Tooltip title={task.summary} sx={{ flexGrow: 1 }}>
                      <Typography noWrap>{task.summary}</Typography>
                    </Tooltip>
                    {task.backend && <Chip label="Backend" />}
                    {task.frontend && <Chip label="Frontend" />}
                    <Tooltip title={task.performed ? 'Performed' : ''}>
                      {task.performed ? <Done color="success" /> : <Box width={24} flexShrink={0} />}
                    </Tooltip>
                    <Box width={60} flexShrink={0} display="flex" justifyContent="center">
                      <EstimationBadge value={task.estimation} />
                    </Box>
                    <PriorityBadge priority={task.priority} />
                    <Tooltip title={task.assignee?.name || 'Unassigned'} placement="left">
                      <Avatar sx={{ width: 24, height: 24 }}>{task.assignee?.name?.[0].toUpperCase()}</Avatar>
                    </Tooltip>
                    <Box width={150} flexShrink={0}>
                      <SquadAppJiraIssueStatusBadge status={task.externalStatus}/>
                    </Box>
                    <IconButton size="small" onClick={(event) => handleOpenMenu(event, task)}>
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Stack>
                ))}
              </Fragment>
            ))}
          </>
        )}
      </Grid2>
    </Grid2>
    <BeginWorkDialog
      task={task}
      onComplete={handleBeginWorkComplete}
      {...beginWorkDialog.props}
    />
    <Menu
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      {...menu.props}
    >
      <MenuItem onClick={handleOpenBeginWork}>Begin work</MenuItem>
    </Menu>
    <Snackbar {...snackbar.props} />
  </>
}