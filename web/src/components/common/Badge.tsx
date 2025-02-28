import { Stack, Tooltip, Typography } from "@mui/material";
import { MouseEventHandler, ReactNode } from "react";
export interface BadgeProps {
  label: string
  tooltip?: ReactNode
  onClick?: MouseEventHandler
}

export function Badge({ label, tooltip, onClick }: BadgeProps) {

  const handleClick = (event: any) => {
    if (onClick) {
      event.stopPropagation()
      onClick(event)
    }
  }

  return <Stack
    bgcolor="lightgray"
    width="min-content"
    padding={1}
    borderRadius={2}
    onClick={handleClick}
    sx={{ cursor: onClick ? "pointer" : "default" }}
  >
    <Tooltip title={tooltip}>
      <Typography variant="caption" lineHeight={1} noWrap>{label}</Typography>
    </Tooltip>
  </Stack>
}