import { request } from '@/lib/foodrec/utils/axios-request.util'
import type { SuccessResponse } from '@/models/api/success-response.model'
import type { LoginFormData } from '@/views/public-views/login/models/login-form-data.model'
import type { LoginResponse } from '@/views/public-views/login/models/login-response.model'

export const loginService = async (data: LoginFormData) => {
  const res = await request<SuccessResponse<LoginResponse>>({
    method: 'POST',
    url: '/api/dashboard-users/login',
    data,
    withCredentials: true,
  })

  return res.data
}
