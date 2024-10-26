import { Typography } from "@mui/material";
import { JiraIssueStatusColor } from "@/lib/jirify/common/types";
import { Box } from "@mui/system";

export interface JiraIssueStatusProps {
  status: string;
  statusColor: JiraIssueStatusColor;
}

const foregroundColors = {
  [JiraIssueStatusColor.GRAY]: "#172b4d",
  [JiraIssueStatusColor.BLUE]: "#0052cc",
  [JiraIssueStatusColor.GREEN]: "#216e4e",
}

const backgroundColors = {
  [JiraIssueStatusColor.GRAY]: "#f1f2f4",
  [JiraIssueStatusColor.BLUE]: "#e9f2ff",
  [JiraIssueStatusColor.GREEN]: "#dcfff1",
}

export function JiraIssueStatusBadge({ status, statusColor }: JiraIssueStatusProps) {
  return <Box>
    <Typography
      sx={{
        textWrap: "nowrap"
      }}
      bgcolor={backgroundColors[statusColor]}
      color={foregroundColors[statusColor]}
      padding="4px 8px"
      borderRadius="4px"
      fontSize="0.7em"
      fontWeight="600"
      variant="button"
      height="100%"
    >
      {status}
    </Typography>
  </Box>
}