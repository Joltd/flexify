export const squadAppUrls = {
  root: '/api/app/jirify/squad-app',
  sync: '/api/app/jirify/squad-app/sync',
  taskDashboard: {
    root: '/api/app/jirify/squad-app/task-dashboard',
    taskId: '/api/app/jirify/squad-app/task-dashboard/task/:id',
  },
  branchDashboard: {
    root: '/api/app/jirify/squad-app/branch-dashboard',
    branch: '/api/app/jirify/squad-app/branch-dashboard/branch',
    branchId: '/api/app/jirify/squad-app/branch-dashboard/branch/:id',
    relation: '/api/app/jirify/squad-app/branch-dashboard/branch/:id/relation',
    mergeRequest: '/api/app/jirify/squad-app/branch-dashboard/branch/:id/merge-request',
    mergeRequestId: '/api/app/jirify/squad-app/branch-dashboard/branch/:id/merge-request/:mergeRequestId',
  },
}

export const squadAppRouts = {
  taskDashboard: '/jirify/squad-app',
  branchDashboard: '/jirify/squad-app/branches',
}