import type { DashboardUserRole } from './user-role.enum'

export type DashboardUser = {
  id: string
  name: string
  email: string
  role: DashboardUserRole
}
