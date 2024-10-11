import { JiraIssueStatusColor, SelectRepository, TaskStatusEnum } from "@/lib/jirify/types";
import { SquadAppJiraIssueStatusBadge } from "@/components/jirify/squad-app/SquadAppJiraIssueStatusBadge";

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

export interface WorkspaceResponse {
  id: string,
  name: string,
  backendRepository: SelectRepository,
  frontendRepository: SelectRepository,
}

export interface TaskRecord {
  id: string,
  key: string
  summary: string,
  url: string,
  status?: TaskStatusEnum,
  externalStatus?: string,
  priority?: number
}

export interface ActiveSprintResponse {
  id: string,
  key: string,
  updatedAt: string,
  groups: SprintGroupRecord[],
}

export interface SprintGroupRecord {
  status: TaskStatusEnum,
  tasks: SprintTaskRecord[],
}

export interface SprintTaskRecord {
  id: string,
  key: string,
  summary: string,
  url: string,
  status: TaskStatusEnum,
  externalStatus?: SquadAppJiraIssueStatusEnum,
  estimation?: number,
  priority?: number,
  backend: boolean,
  frontend: boolean,
}
