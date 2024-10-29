import { Button, Stack, Tooltip, Typography } from "@mui/material";
import { ArrowRightAlt, Cancel, CheckCircle, Error, Pending } from "@mui/icons-material";
import { MergeRequestStatusEnum, MergeRequestStatusLabel } from "@/lib/jirify/common/types";
import { ReactNode, SyntheticEvent } from "react";

export interface MergeRequestBadgeProps {
  externalId: string
  url: string
  status: MergeRequestStatusEnum
  error?: string
  sourceBranch?: string
  targetBranch?: string
}

const Variants: Record<MergeRequestStatusEnum, {
  color: "error" | "success" | "info" | "warning" | "primary" | "secondary",
  startIcon?: ReactNode,
}> = {
  [MergeRequestStatusEnum.WAITING]: { color: "warning", startIcon: <Pending />},
  [MergeRequestStatusEnum.READY]: { color: "success", startIcon: <CheckCircle /> },
  [MergeRequestStatusEnum.ERROR]: { color: "error", startIcon: <Error /> },
  [MergeRequestStatusEnum.MERGED]: { color: "secondary", startIcon: <CheckCircle /> },
  [MergeRequestStatusEnum.CLOSED]: { color: "primary", startIcon: <Cancel /> },
}

export function MergeRequestBadge({
  externalId,
  url,
  status,
  error,
  sourceBranch,
  targetBranch,
}: MergeRequestBadgeProps) {

  const handleClick = (event: SyntheticEvent) => {
    event.stopPropagation()
  }

  const tooltip = error
    ? `${MergeRequestStatusLabel[status]}: ${error}`
    : `${MergeRequestStatusLabel[status]}`

  return (
    <Stack direction="row" gap={1} alignItems="center">
      <Tooltip title={tooltip} placement="left">
        <Button href={url} target="_blank" variant="outlined" onClick={handleClick} {...Variants[status]} >
          {externalId}
        </Button>
      </Tooltip>
      {sourceBranch && <Typography>{sourceBranch}</Typography>}
      {sourceBranch && targetBranch && <ArrowRightAlt />}
      {targetBranch && <Typography>{targetBranch}</Typography>}
    </Stack>
  )
}