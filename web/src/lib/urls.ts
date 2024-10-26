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
}