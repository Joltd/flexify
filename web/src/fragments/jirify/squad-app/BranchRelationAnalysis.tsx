import { Stack, Step, StepContent, StepIcon, StepLabel, Stepper, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { BranchAnalysisRecord, BranchRecord } from "@/lib/jirify/squad-app/types";
import { useApi } from "@/lib/common/api";
import { API_URL } from "@/lib/urls";
import { SquadAppJiraIssueStatusBadge } from "@/components/jirify/squad-app/SquadAppJiraIssueStatusBadge";
import { Box } from "@mui/system";
import { Error, CheckCircle } from "@mui/icons-material";

export interface BranchRelationAnalysisProps {
  branch: BranchRecord | null
}

export function useBranchRelationAnalysis() {
  const [branch, setBranch] = useState<BranchRecord | null>(null)

  const open = (branch: BranchRecord | null) => {
    setBranch(branch)
  }

  return {
    open,
    branch,
  };
}

export function BranchRelationAnalysis({
  branch
}: BranchRelationAnalysisProps) {
  const { data, get, loading, error } = useApi<BranchAnalysisRecord[]>(API_URL.jirify.squadApp.branch.analysis, [])

  useEffect(() => {
    if (!branch) {
      return
    }

    get({ pathParams: { id: branch.id } })
  }, [branch]);

  return (
    <Stepper orientation="vertical" nonLinear>
      {data.map((entry) => (
        <Step key={entry.id} active>
          <StepLabel icon={entry.readyToProd ? <CheckCircle color="success" /> : <Error color="error" />}>
            {entry.name}
          </StepLabel>
          <StepContent>
            {entry.tasks.map((task) => (
              <Stack key={task.id} direction="row" gap={1}>
                <Typography flexShrink={0}>{task.key}</Typography>
                <Tooltip title={task.summary} sx={{ flexGrow: 1 }}>
                  <Typography noWrap>{task.summary}</Typography>
                </Tooltip>
                <Box width={150} flexShrink={0}>
                  <SquadAppJiraIssueStatusBadge status={task.externalStatus}/>
                </Box>
              </Stack>
            ))}
          </StepContent>
        </Step>
      ))}
    </Stepper>
  );
}