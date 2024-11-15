import { toTypedSchema } from '@vee-validate/zod'
import type { TypedSchema } from 'vee-validate'
import * as zod from 'zod'

export const loginSchema: TypedSchema<{
  email: string
  password: string
}> = toTypedSchema(
  zod.object({
    email: zod
      .string()
      .min(1, { message: 'This is required' })
      .email({ message: 'Must be a valid email' }),
    password: zod.string().min(1, { message: 'This is required' }),
  }),
)
