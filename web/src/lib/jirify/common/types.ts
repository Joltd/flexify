import { colors } from "@/lib/common/colors";

export enum TaskStatusEnum {
  UNKNOWN = 'UNKNOWN',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  TESTING = 'TESTING',
  READY_TO_PROD = 'READY_TO_PROD',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD',
}

export const TaskStatusLabel = {
  [TaskStatusEnum.UNKNOWN]: 'Unknown',
  [TaskStatusEnum.TODO]: 'Todo',
  [TaskStatusEnum.IN_PROGRESS]: 'In progress',
  [TaskStatusEnum.REVIEW]: 'Review',
  [TaskStatusEnum.TESTING]: 'Testing',
  [TaskStatusEnum.READY_TO_PROD]: 'Ready to prod',
  [TaskStatusEnum.DONE]: 'Done',
  [TaskStatusEnum.CANCELLED]: 'Cancelled',
  [TaskStatusEnum.ON_HOLD]: 'On hold',
}

export const TaskStatusColor = {
  [TaskStatusEnum.UNKNOWN]: colors.gray,
  [TaskStatusEnum.TODO]: colors.gray,
  [TaskStatusEnum.IN_PROGRESS]: colors.orange,
  [TaskStatusEnum.REVIEW]: colors.blue,
  [TaskStatusEnum.TESTING]: colors.blue,
  [TaskStatusEnum.READY_TO_PROD]: colors.teal,
  [TaskStatusEnum.DONE]: colors.green,
  [TaskStatusEnum.CANCELLED]: colors.red,
  [TaskStatusEnum.ON_HOLD]: colors.gray,
}

export enum JiraIssueStatusColor {
  GRAY = "GRAY",
  BLUE = "BLUE",
  GREEN = "GREEN",
}

export enum DevelopmentArea {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
}

export interface EmployeeRecord {
  id: string
  name: string
  me: boolean
}

export interface SelectRepository {
  id: string
  name: string
}

export interface SelectEmployee {
  id: string
  name: string
  me: boolean
}

export interface SelectTask {
  id: string
  key: string
  summary: string
}

export interface EditSprintTask {
  id: string
  status: TaskStatusEnum
  performed: boolean
}

export interface EditBranch {
  repository: string
  name: string
  parent: string
}

export enum MergeRequestStatusEnum {
  WAITING = 'WAITING',
  READY = 'READY',
  ERROR = 'ERROR',
  MERGED = 'MERGED',
  CLOSED = 'CLOSED',
}

export const MergeRequestStatusLabel = {
  [MergeRequestStatusEnum.WAITING]: 'Waiting',
  [MergeRequestStatusEnum.READY]: 'Ready',
  [MergeRequestStatusEnum.ERROR]: 'Error',
  [MergeRequestStatusEnum.MERGED]: 'Merged',
  [MergeRequestStatusEnum.CLOSED]: 'Closed',
}