import { DevelopmentArea, JiraIssueStatusColor, SelectRepository, TaskStatusEnum } from "@/lib/jirify/types";

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
  id: string
  name: string
  backendRepository: RepositoryRecord
  frontendRepository: RepositoryRecord
}

export interface TaskRecord {
  id: string
  key: string
  summary: string
  url: string
  status?: TaskStatusEnum
  externalStatus?: string
  priority?: number
}

export interface ActiveSprintResponse {
  id: string
  key: string
  workspace: string
  updatedAt: string
  groups: SprintGroupRecord[]
}

export interface SprintGroupRecord {
  status: TaskStatusEnum
  tasks: SprintTaskRecord[]
}

export interface SprintTaskRecord {
  id: string
  key: string
  summary: string
  url: string
  status: TaskStatusEnum
  externalStatus?: SquadAppJiraIssueStatusEnum
  assignee?: AssigneeRecord
  performed: boolean
  estimation?: number
  priority?: number
  backend: boolean
  frontend: boolean
}

export interface AssigneeRecord {
  id: string
  name: string
}

export interface RepositoryRecord {
  id: string
  name: string
  type: DevelopmentArea
}

export interface BranchRecord {
  id: string
  name: string
  kind: BranchKind
  readyToProd: boolean
}

export enum BranchKind {
  PROD = 'PROD',
  RELEASE = 'RELEASE',
  DEV = 'DEV',
}

export interface BranchAnalysisRecord {
  id: string
  name: string
  tasks: BranchAnalysisTaskRecord[]
  readyToProd: boolean
}

export interface BranchAnalysisTaskRecord {
  id: string
  key: string
  summary: string
  url: string
  externalStatus?: SquadAppJiraIssueStatusEnum
}

export interface MergeRequestRecord {
  iid: number
  mergeStatus: string
  url: string
}