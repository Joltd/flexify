import { JiraIssueStatusColor } from "@/lib/jirify/common/types";

export enum SquadAppJiraIssueStatusEnum {
  UNKNOWN = 'Unknown',
  TODO = 'К выполнению',
  IN_PROGRESS = 'В работе',
  READY_FOR_QA = 'Ready for QA',
  TESTING = 'Тестирование',
  READY_FOR_DEPLOY = 'Ready for deploy',
  DONE = 'Готово',
}

export const SquadAppJiraIssueStatusColor = {
  [SquadAppJiraIssueStatusEnum.UNKNOWN]: JiraIssueStatusColor.GRAY,
  [SquadAppJiraIssueStatusEnum.TODO]: JiraIssueStatusColor.GRAY,
  [SquadAppJiraIssueStatusEnum.IN_PROGRESS]: JiraIssueStatusColor.BLUE,
  [SquadAppJiraIssueStatusEnum.READY_FOR_QA]: JiraIssueStatusColor.BLUE,
  [SquadAppJiraIssueStatusEnum.TESTING]: JiraIssueStatusColor.BLUE,
  [SquadAppJiraIssueStatusEnum.READY_FOR_DEPLOY]: JiraIssueStatusColor.GREEN,
  [SquadAppJiraIssueStatusEnum.DONE]: JiraIssueStatusColor.GREEN,
}
