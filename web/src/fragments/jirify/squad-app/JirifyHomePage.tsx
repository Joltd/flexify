'use client'

import { ApplicationBar } from "@/components/ApplicationBar";
import { useApi } from "@/lib/common/api";
import { API_URL } from "@/lib/urls";
import {
  Alert,
  Button, CircularProgress,
  Grid2, IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader, Menu, MenuItem, Paper,
  Skeleton,
  Stack, Tooltip,
  Typography
} from "@mui/material";
import { ActiveSprintResponse, SprintTaskRecord, TaskRecord } from "@/lib/jirify/squad-app/types";
import { Fragment, SyntheticEvent, useEffect, useState } from "react";
import { Box } from "@mui/system";
import { PastDate } from "@/components/PastDate";
import SyncIcon from '@mui/icons-material/Sync';
import { SquadAppJiraIssueStatusBadge } from "@/components/jirify/squad-app/SquadAppJiraIssueStatusBadge";
import { TaskStatusBadge } from "@/components/jirify/common/TaskStatusBadge";
import { PriorityBadge } from "@/components/jirify/common/PriorityBadge";
import { ContentCopy, MoreVert, OpenInNew } from "@mui/icons-material";
import { EstimationBadge } from "@/components/jirify/common/EstimationBadge";
import { useBeginWorkDialog, BeginWorkDialog } from "@/components/jirify/squad-app/BeginWorkDialog";
import { useMenu } from "@/lib/common/menu";

export function JirifyHomePage() {
  const sprint = useApi<ActiveSprintResponse>(API_URL.jirify.squadApp.home.activeSprint)
  const sync = useApi(API_URL.jirify.squadApp.sync)

  const [task, setTask] = useState<SprintTaskRecord | null>(null)
  const menu = useMenu()
  const workBeginDialog = useBeginWorkDialog()

  useEffect(() => {
    sprint.get()
  }, []);

  const handleSync = () => {
    sync.post()
      .then(() => sprint.get())
  }

  const handleOpenMenu = (event: SyntheticEvent, task: SprintTaskRecord) => {
    setTask(task)
    menu.open(event)
  }

  const openBeginWorkDialog = () => {
    menu.close()
    workBeginDialog.open()
  }

  const handleBeginWorkComplete = () => {
    sprint.get()
  }

  return <>
    <ApplicationBar title="Jirify" />
    <Grid2 container margin={4} spacing={2}>
      <Grid2 size={6}>
        <Typography variant="h6">{sprint.data.key}</Typography>
      </Grid2>
      <Grid2 size={6} container direction="row" sx={{ alignItems: "center", justifyContent: "end" }}>
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
          <Stack>
            <Skeleton height={48} />
            <Skeleton height={48} />
            <Skeleton height={48} />
            <Skeleton height={48} />
          </Stack>
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
                    <IconButton size="small">
                      <OpenInNew fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <ContentCopy fontSize="small" />
                    </IconButton>
                    <PriorityBadge priority={task.priority} />
                    <Button color="inherit" sx={{ flexShrink: 0 }}>{task.key}</Button>
                    <Tooltip title={task.summary} sx={{ flexGrow: 1 }}>
                      <Typography noWrap>{task.summary}</Typography>
                    </Tooltip>
                    <Box width={100} flexShrink={0}>
                      <EstimationBadge value={task.estimation} />
                    </Box>
                    <Box width={150} flexShrink={0}>
                      <SquadAppJiraIssueStatusBadge status={task.externalStatus}/>
                    </Box>
                    <IconButton onClick={(event) => handleOpenMenu(event, task)}>
                      <MoreVert />
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
      {...workBeginDialog.props}
    />
    <Menu
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      {...menu.props}
    >
      <MenuItem onClick={openBeginWorkDialog}>Begin work</MenuItem>
    </Menu>
  </>
}