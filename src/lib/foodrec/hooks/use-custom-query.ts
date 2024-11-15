import {
  useQuery,
  type UseQueryOptions,
  type QueryClient,
} from '@tanstack/vue-query'
import { AxiosError } from 'axios'
import type { SuccessResponse } from '@/models/api/success-response.model'
import type { FoodrecError } from '@/models/api/foodrec-error.model'

// S => The Expected success response
// E => The expected Error (extending AxiosError)
export const useCustomQuery = <S, E = FoodrecError>(
  queryOptions: UseQueryOptions<SuccessResponse<S>, AxiosError<E>>,
  queryClient?: QueryClient,
) => {
  return useQuery<SuccessResponse<S>, AxiosError<E>>(queryOptions, queryClient)
}
