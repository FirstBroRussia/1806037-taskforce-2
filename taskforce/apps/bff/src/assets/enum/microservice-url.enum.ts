export const MicroserviceUrlEnum = {
  Auth: 'http://localhost:1001/api/auth',
  User: 'http://localhost:1001/api/users',
  Task: 'http://localhost:1002/api/tasks',
  Categories: 'http://localhost:1002/api/categories',
  Comment: 'http://localhost:1003/api/comments',
  Review: 'http://localhost:1004/api/reviews',
  Notify: 'http://localhost:1005/api/notify',
} as const;
