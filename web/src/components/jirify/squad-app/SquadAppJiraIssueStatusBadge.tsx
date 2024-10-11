import { JiraIssueStatusBadge } from "@/components/jirify/common/integration/jira/JiraIssueStatusBadge";
import { SquadAppJiraIssueStatusColor, SquadAppJiraIssueStatusEnum } from "@/lib/jirify/squad-app/types";

export interface SquadAppJiraIssueStatusProps {
  status?: SquadAppJiraIssueStatusEnum;
}

export function SquadAppJiraIssueStatusBadge({ status = SquadAppJiraIssueStatusEnum.UNKNOWN }: SquadAppJiraIssueStatusProps) {
  const statusColor = SquadAppJiraIssueStatusColor[status]
  return <JiraIssueStatusBadge status={status} statusColor={statusColor} />
}