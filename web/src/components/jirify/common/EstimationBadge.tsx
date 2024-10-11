import { Chip } from "@mui/material";

export interface EstimationBadgeProps {
  value?: number;
}

const HOURS = 8;
const MINUTES = 60;
const SECONDS = 60;

export function EstimationBadge({ value = 0 }: EstimationBadgeProps) {
  let seconds = value
  const days = Math.floor(seconds / (HOURS * MINUTES * SECONDS));
  seconds %= HOURS * MINUTES * SECONDS;
  const hours = Math.floor(seconds / (MINUTES * SECONDS));
  seconds %= MINUTES * SECONDS;
  const minutes = Math.floor(seconds / SECONDS);
  seconds %= SECONDS;

  const parts = [];
  if (days > 0) {
    parts.push(`${days}d`);
  }
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (seconds > 0) {
    parts.push(`${seconds}s`);
  }

  return <Chip label={parts.join(' ')} />
}