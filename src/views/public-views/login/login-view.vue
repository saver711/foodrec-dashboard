<script setup lang="ts">
import { useCustomMutation } from '@/lib/foodrec/hooks/use-custom-mutation'
import { useAuthStore } from '@/stores/auth.store'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useForm } from 'vee-validate'
import { loginSchema } from './consts/login-schema.schema'
import type { LoginFormData } from './models/login-form-data.model'
import type { LoginResponse } from './models/login-response.model'

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: loginSchema,
})
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const authStore = useAuthStore()

const { isPending, mutate } = useCustomMutation<LoginResponse, LoginFormData>({
  mutationKey: ['login'],
  mutationFn: authStore.login,
})

const onSubmit = handleSubmit(values => {
  mutate(values)
})
</script>

<template>
  <p v-if="authStore.user">{{ authStore.user.email }}</p>
  <form @submit="onSubmit">
    <InputText
      v-model="email"
      v-bind="emailAttrs"
      type="email"
      placeholder="Email"
    />
    <div>{{ errors.email }}</div>

    <InputText
      v-model="password"
      v-bind="passwordAttrs"
      type="password"
      placeholder="Password"
    />
    <div>{{ errors.password }}</div>

    <Button type="submit" :disabled="isPending">Login</Button>
  </form>
</template>
