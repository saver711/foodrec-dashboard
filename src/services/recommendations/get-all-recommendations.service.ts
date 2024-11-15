import type { SortOrder } from '@/components/ui/table/models/sort-order.enum'
import { request } from '@/lib/foodrec/utils/axios-request.util'

export const getAllRecommendations = async (
  page?: number,
  perPage?: number,
  mealName?: string,
  sortBy?: string,
  sortOrder?: SortOrder,
) => {
  // Build the params object, filtering out only undefined values
  const params = Object.fromEntries(
    Object.entries({
      page,
      perPage,
      mealName,
      sortBy,
      sortOrder,
    }).filter(([, value]) => !!value && value !== '' && !!value && value !== 0),
  )

  const res = await request({
    method: 'GET',
    url: '/api/recommendations',
    withCredentials: true,
    params,
  })

  return res.data
}
