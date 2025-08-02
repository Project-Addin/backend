import {z} from 'zod'

export const signUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
})

export const signInSchema = signUpSchema.pick({
    email: true,
    password: true
})

export const resetPasswordSchema = z.object({
    password: z.string(),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ['confirmPassword']
})

export type SignInValues = z.infer<typeof signInSchema>
export type SignUpValues = z.infer<typeof signUpSchema>
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>