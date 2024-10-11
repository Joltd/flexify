import { format, formatDistanceToNow } from "date-fns";
import { Tooltip, Typography } from "@mui/material";

export interface PastDateProps {
  date?: string;
}

export function PastDate({ date }: PastDateProps) {
  if (!date) {
    return null
  }
  return <Tooltip title={format(date, 'yyyy-MM-dd HH:mm:ss')}>
    <Typography variant="caption">{formatDistanceToNow(date)}</Typography>
  </Tooltip>
}