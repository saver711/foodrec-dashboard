import { useMutation, type UseMutationOptions } from '@tanstack/vue-query'
import { AxiosError } from 'axios'
import type { SuccessResponse } from '@/models/api/success-response.model'
import type { FoodrecError } from '@/models/api/foodrec-error.model'

// Create a custom useMutation hook with default error types
/*
  D => Data (Maybe Form Data)
  S => The Expected success response
  E = > The expected Error
*/
export const useCustomMutation = <S, D, E = FoodrecError>(
  mutationOptions: UseMutationOptions<
    SuccessResponse<S>,
    AxiosError<E>,
    D,
    unknown
  >,
) => {
  return useMutation<SuccessResponse<S>, AxiosError<E>, D>(mutationOptions)
}
