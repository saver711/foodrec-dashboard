import { request } from '@/lib/foodrec/utils/axios-request.util'

export const logoutService = async () => {
  const res = await request({
    method: 'POST',
    url: '/api/dashboard-users/logout',
    withCredentials: true, // Important to send and receive cookies
  })
  return res.data
}
