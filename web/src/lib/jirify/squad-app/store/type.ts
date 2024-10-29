import { EmployeeRecord, MergeRequestStatusEnum, TaskStatusEnum } from "@/lib/jirify/common/types";
import { SquadAppJiraIssueStatusEnum } from "@/lib/jirify/squad-app/types";

export interface SquadAppWorkspaceData {
  id: string
  backendRepository: string
  frontendRepository: string
}

export interface TaskDashboardData {
  id: string
  key: string
  updatedAt: string
  groups: TaskDashboardGroup[]
}

export interface TaskDashboardGroup {
  status: TaskStatusEnum
  entries: TaskDashboardEntry[]
}

export interface TaskDashboardEntry {
  id: string
  key: string
  summary: string
  url: string
  status: TaskStatusEnum
  externalStatus?: SquadAppJiraIssueStatusEnum
  assignee?: EmployeeRecord
  performed: boolean
  estimation?: number
  priority?: number
  backend?: TaskDashboardEntryBranch
  frontend?: TaskDashboardEntryBranch
}

export interface TaskDashboardEntryBranch {
  id: string
  name: string
  mergeRequest?: TaskDashboardEntryBranchMergeRequest
}

export interface TaskDashboardEntryBranchMergeRequest {
  id: string
  externalId: string
  url: string
  status: MergeRequestStatusEnum
}

export interface TaskDashboardTaskData {
  id: string
  key: string
  summary: string
  url: string
  status: TaskStatusEnum
  externalStatus?: SquadAppJiraIssueStatusEnum
  assignee?: EmployeeRecord
  performed: boolean
  backendBranch?: string
  backendMergeRequest?: TaskDashboardEntryBranchMergeRequest
  frontendBranch?: string
  frontendMergeRequest?: TaskDashboardEntryBranchMergeRequest
}

export interface TaskDashboardTaskUpdateData {
  status: TaskStatusEnum | null
  performed: boolean
  backendBranch: string | null
  frontendBranch: string | null
}

export interface BranchDashboardEntry {
  id: string
  name: string
  description: string
  readyToProd: boolean
  hidden: boolean
  mergeRequest: BranchDashboardMergeRequestEntry | null
}

export interface BranchDashboardBranchData {
  id: string
  name: string
  repository: string
  parent?: string
  tasks: BranchDashboardRelationTaskEntry[]
  mergeRequests: BranchDashboardMergeRequestEntry[]
}

export interface BranchDashboardBranchCreateData {
  name: string
  repository: string | null
  parent: string | null
}

export interface BranchDashboardBranchUpdateData {
  name: string
  parent: string | null
  hidden: boolean
}

export interface BranchDashboardRelationEntry {
  id: string
  name: string
  tasks: BranchDashboardRelationTaskEntry[]
  readyToProd: boolean
}

export interface BranchDashboardRelationTaskEntry {
  id: string
  key: string
  summary: string
  url: string
  externalStatus: SquadAppJiraIssueStatusEnum
}

export interface BranchDashboardMergeRequestEntry {
  externalId: string
  externalStatus: string
  url: string
  targetBranch: string
}

export interface BranchDashboardCreateMergeRequest {
  sourceBranchSuffix: string
  targetBranch: string | null
}
