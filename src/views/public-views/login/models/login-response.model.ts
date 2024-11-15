import type { DashboardUser } from '@/models/user/dashboard-user'

export type LoginResponse = {
  accessToken: string
  refreshToken: string
  user: DashboardUser
}
