import { Button, Stack, Tooltip, Typography } from "@mui/material";
import { ArrowRightAlt, Cancel, CheckCircle, Error, Pending } from "@mui/icons-material";
import { MergeRequestStatusEnum, MergeRequestStatusLabel } from "@/lib/jirify/common/types";
import { ReactNode } from "react";

export interface MergeRequestBadgeProps {
  externalId: string
  url: string
  status: MergeRequestStatusEnum
  error?: string
  sourceBranch?: string
  targetBranch: string
}

export function MergeRequestBadge({
  externalId,
  url,
  status,
  error,
  sourceBranch,
  targetBranch,
}: MergeRequestBadgeProps) {

  const propsByStatus = (): {
    color: "error" | "success" | "info" | "warning" | "primary" | "secondary",
    startIcon?: ReactNode,
  } => {
    switch (status) {
      case MergeRequestStatusEnum.WAITING:
        return { color: "warning", startIcon: <Pending />}
      case MergeRequestStatusEnum.READY:
        return { color: "success", startIcon: <CheckCircle /> }
      case MergeRequestStatusEnum.ERROR:
        return { color: "error", startIcon: <Error /> }
      case MergeRequestStatusEnum.MERGED:
        return { color: "secondary", startIcon: <CheckCircle /> }
      case MergeRequestStatusEnum.CLOSED:
        return { color: "primary", startIcon: <Cancel /> }
    }
  }

  const tooltip = error
    ? `${MergeRequestStatusLabel[status]}: ${error}`
    : `${MergeRequestStatusLabel[status]}`

  return (
    <Stack direction="row" gap={1} alignItems="center">
      <Tooltip title={tooltip} placement="left">
        <Button href={url} target="_blank" variant="outlined" {...propsByStatus()} >
          {externalId}
        </Button>
      </Tooltip>
      <Typography>{sourceBranch || '...'}</Typography>
      <ArrowRightAlt />
      <Typography>{targetBranch}</Typography>
    </Stack>
  )
}