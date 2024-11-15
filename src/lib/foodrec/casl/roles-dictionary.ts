import { DashboardUserRole } from '@/models/user/user-role.enum'

/* 
C
R
U
D
*/
export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum Resource {
  RECOMMENDATIONS = 'recommendations',
  DASHBOARD_USERS = 'dashboard_users',
}

export type Permission = {
  action: Action
  resource: Resource
}

export const ROLES_DICTIONARY: Record<DashboardUserRole, Permission[]> = {
  [DashboardUserRole.SUPER_ADMIN]: [
    { action: Action.CREATE, resource: Resource.DASHBOARD_USERS },
    { action: Action.DELETE, resource: Resource.DASHBOARD_USERS },
    { action: Action.READ, resource: Resource.DASHBOARD_USERS },
    { action: Action.UPDATE, resource: Resource.DASHBOARD_USERS },
    // -----------------------------------------------
    { action: Action.CREATE, resource: Resource.RECOMMENDATIONS },
    { action: Action.DELETE, resource: Resource.RECOMMENDATIONS },
    { action: Action.READ, resource: Resource.RECOMMENDATIONS },
    { action: Action.UPDATE, resource: Resource.RECOMMENDATIONS },
  ],
  [DashboardUserRole.AUDITOR]: [
    { action: Action.CREATE, resource: Resource.RECOMMENDATIONS },
    { action: Action.DELETE, resource: Resource.RECOMMENDATIONS },
    { action: Action.READ, resource: Resource.RECOMMENDATIONS },
    { action: Action.UPDATE, resource: Resource.RECOMMENDATIONS },
  ],
}
