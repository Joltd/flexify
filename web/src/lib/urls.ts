export const URL = {
  home: '/',
  user: '/user',
  admin: '/admin',
  jirify: '/jirify',
}

export const API_URL = {
  user: {
    me: '/api/user',
    login: '/api/user/login',
  },
  admin: {
    application: '/api/app/admin/application',
    user: '/api/app/admin/user',
    userId: '/api/app/admin/user/:id',
  },
  jirify: {
    common: {
      repository: {
        select: '/api/app/jirify/repository/select',
      },
      branch: {
        select: '/api/app/jirify/branch/select',
      },
      employee: {
        select: '/api/app/jirify/employee/select',
      },
    },
    squadApp: {
      home: {
        activeSprint: '/api/app/jirify/squad-app/home/active-sprint',
        beginWork: '/api/app/jirify/squad-app/home/begin-work',
      },
      workspace: '/api/app/jirify/squad-app/workspace',
      sync: '/api/app/jirify/squad-app/sync',
      task: '/api/app/jirify/squad-app/task',
    },
  }
}