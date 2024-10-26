import { useTaskDashboardStore } from "@/lib/jirify/squad-app/store/task-dashboard-store";
import { Alert, Button, Chip, Grid2, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { ListSkeleton } from "@/components/common/skeleton/ListSkeleton";
import { Fragment, SyntheticEvent } from "react";
import { TaskStatusBadge } from "@/components/jirify/common/TaskStatusBadge";
import { Box } from "@mui/system";
import { ContentCopy, Done, OpenInNew } from "@mui/icons-material";
import { EstimationBadge } from "@/components/jirify/common/EstimationBadge";
import { PriorityBadge } from "@/components/jirify/common/PriorityBadge";
import { SquadAppJiraIssueStatusBadge } from "@/components/jirify/squad-app/SquadAppJiraIssueStatusBadge";
import { EmployeeAvatar } from "@/components/jirify/common/EmployeeAvatar";
import { SprintTaskRecord } from "@/lib/jirify/squad-app/types";
import { useClipboard } from "@/lib/common/clipboard";

export interface TaskDashboardListProps {}

export function TaskDashboardList({}: TaskDashboardListProps) {
  const { dashboard, search, setTask } = useTaskDashboardStore()
  const { copy } = useClipboard()

  const handleCopyTask = (event: SyntheticEvent, task: SprintTaskRecord) => {
    event.stopPropagation()
    copy(task.key)
  }

  const handleCopyTaskWithLink = (event: SyntheticEvent, task: SprintTaskRecord) => {
    event.stopPropagation()
    copy(`${task.key} ${task.summary}`, `<a href="${task.url}">${task.key}</a> ${task.summary}`)
  }

  return (
    <Grid2 size={12} display="flex" flexDirection="column">
      {dashboard.loading ? (
        <ListSkeleton />
      ) : dashboard.error ? (
        <Alert severity="error">{dashboard.error}</Alert>
      ) : (
        dashboard.data?.groups?.map((group) => (
          <Fragment key={group.status}>
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

            {group.entries
              .filter((entry) => !search || entry.key.indexOf(search) >= 0)
              .map((entry) => (
                <Stack
                  key={entry.id}
                  direction="row"
                  alignItems="center"
                  gap={1}
                  onClick={() => setTask(entry.id)}
                  sx={{ cursor: 'pointer' }}
                >

                  <IconButton size="small" href={entry.url} target="_blank" onClick={(event) => event.stopPropagation()}>
                    <OpenInNew fontSize="small" />
                  </IconButton>

                  <IconButton size="small" onClick={(event) => handleCopyTaskWithLink(event, entry)}>
                    <ContentCopy fontSize="small" />
                  </IconButton>

                  <Button color="inherit" sx={{ flexShrink: 0 }} onClick={(event) => handleCopyTask(event, entry)}>{entry.key}</Button>

                  <Tooltip title={entry.summary} sx={{ flexGrow: 1 }}>
                    <Typography noWrap>{entry.summary}</Typography>
                  </Tooltip>

                  {entry.backend && <Chip label="Backend" />}

                  {entry.frontend && <Chip label="Frontend" />}

                  <Tooltip title={entry.performed ? 'Performed' : ''}>
                    {entry.performed ? <Done color="success" /> : <Box width={24} flexShrink={0} />}
                  </Tooltip>

                  <Box width={60} flexShrink={0} display="flex" justifyContent="center">
                    <EstimationBadge value={entry.estimation} />
                  </Box>

                  <PriorityBadge priority={entry.priority} />

                  <EmployeeAvatar name={entry.assignee?.name} />

                  <Box width={150} flexShrink={0}>
                    <SquadAppJiraIssueStatusBadge status={entry.externalStatus}/>
                  </Box>

                </Stack>
              ))}
          </Fragment>
        ))
      )}
    </Grid2>
  )
}