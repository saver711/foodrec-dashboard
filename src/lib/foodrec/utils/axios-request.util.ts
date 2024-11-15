import { ErrorCode } from '@/models/api/error-code.enum'
import type { FoodrecError } from '@/models/api/foodrec-error.model'
import { useAuthStore } from '@/stores/auth.store'
import axios, { AxiosError } from 'axios'

let isRefreshing = false // Flag to check if refresh token request is in progress
let failedQueue: any[] = [] // Queue to store failed requests during token refresh

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (token) {
      prom.resolve(token)
    } else {
      prom.reject(error)
    }
  })
  failedQueue = []
}

const axiosInstance = axios.create({
  withCredentials: true, // Send cookies with each request
})

// Intercept requests
axiosInstance.interceptors.request.use(req => {
  return req // Proceed with the request as normal
})

// Global error handling (e.g., for 401 Unauthorized)
axiosInstance.interceptors.response.use(
  response => response, // Pass successful responses
  async error => {
    const originalRequest = error.config
    const authStore = useAuthStore()

    // If 401 error and it's the first attempt, retry after refreshing the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is already in progress, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            // Once the token is refreshed, retry the original request
            return axiosInstance(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Attempt to refresh the token using the refresh token stored in the HTTP-only cookie
        await axios.post(
          '/api/auth/refresh-token',
          {},
          { withCredentials: true },
        )

        // Process all queued requests after refreshing the token
        processQueue(null)

        // Retry the original request after the token is refreshed
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // If refresh fails, log out and redirect to login
        processQueue(refreshError, null)

        const errorCode = (refreshError as AxiosError<FoodrecError>)?.response
          ?.data.errorCode
        if (
          errorCode === ErrorCode.NO_TOKEN_PROVIDED ||
          errorCode === ErrorCode.REFRESH_TOKEN_NOT_FOUND
        ) {
          authStore.localLogout(true)
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false // Reset the flag
      }
    }

    return Promise.reject(error) // Return other errors directly
  },
)

export const request = axiosInstance
