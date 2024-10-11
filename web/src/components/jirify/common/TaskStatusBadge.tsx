import { Chip } from "@mui/material";
import { TaskStatusColor, TaskStatusEnum, TaskStatusLabel } from "@/lib/jirify/types";

export interface TaskStatusBadgeProps {
  status?: TaskStatusEnum;
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const label = TaskStatusLabel[status || TaskStatusEnum.UNKNOWN]
  const color = TaskStatusColor[status || TaskStatusEnum.UNKNOWN]
  return <Chip label={label} sx={{ backgroundColor: color }} />
}