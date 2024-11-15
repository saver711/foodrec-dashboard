import {
  ROLES_DICTIONARY,
  type Permission,
} from '@/lib/foodrec/casl/roles-dictionary'
import type { SuccessResponse } from '@/models/api/success-response.model'
import type { DashboardUser } from '@/models/user/dashboard-user'
import router from '@/router'
import { loginService } from '@/services/auth/login.service'
import { logoutService } from '@/services/auth/logout.service'
import type { LoginFormData } from '@/views/public-views/login/models/login-form-data.model'
import type { LoginResponse } from '@/views/public-views/login/models/login-response.model'
import { defineAbility, PureAbility } from '@casl/ability'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { RouteMeta } from 'vue-router'
import { toast } from 'vue-sonner'

// export type AppAbility = MongoAbility<[Action, Resource]>

export const useAuthStore = defineStore(
  'auth-store',
  () => {
    const user = ref<DashboardUser | null>(null)
    const ability = ref<PureAbility>()
    const isAuthenticated = computed(() => !!user.value)

    const setUser = (newUserValue: DashboardUser) => {
      user.value = newUserValue
      updatePermissions()
    }

    const initializePermissions = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ability.value = defineAbility(_ => {})
      updatePermissions()
    }

    const updatePermissions = () => {
      const userRole = user.value?.role
      if (userRole) {
        ability.value?.update(
          ROLES_DICTIONARY[userRole].map(({ action, resource }) => {
            return { action, subject: resource }
          }),
        )
      }
    }

    const isRouteAuthorized = (routeMeta: RouteMeta) => {
      return (
        !routeMeta.permission ||
        ability.value?.can(
          (routeMeta.permission as Permission).action,
          (routeMeta.permission as Permission).resource,
        )
      )
    }

    // Centralized login logic
    const login = async (
      formData: LoginFormData,
    ): Promise<SuccessResponse<LoginResponse>> => {
      try {
        const response = await loginService(formData)
        setUser(response.data.user)

        router.replace('/') // Redirect to homepage after login

        return response
      } catch (error) {
        throw error
      }
    }

    // Centralized logout logic
    const logout = async () => {
      try {
        const response = await logoutService()
        resetTheStore()
        router.replace('/login')

        return response
      } catch (error) {
        throw error
      }
    }
    const localLogout = (showToast = false) => {
      resetTheStore()
      router.replace('/login')

      if (showToast) toast.info('Your session ended, Please login again.')
    }

    //

    const resetTheStore = () => {
      user.value = null
      ability.value?.update([]) // Clear CASL abilities on logout
    }
    //

    return {
      user,
      setUser,
      login,
      logout,
      localLogout,
      resetTheStore,
      ability,
      initializePermissions,
      isRouteAuthorized,
      isAuthenticated,
    }
  },
  {
    persist: {
      storage: localStorage, // The default
      pick: ['user'],
    },
  },
)
