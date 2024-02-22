import { TypeOf, object, string } from 'zod'


export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
    password: string({
      required_error: 'Password is required',
    })
  })
})

export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: 'First name is required',
    }),
    lastName: string({
      required_error: 'Last name is required',
    }),
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
    phone: string({
      required_error: 'Phone is required',
    }),
    image: string({
      required_error: 'Image is required',
      invalid_type_error: 'Image must be a string'
    }),
    password: string({
      required_error: 'Password is required',
    }).min(6, 'Password too short'),
    passwordConfirmation: string({
      required_error: 'Password confirmation is required',
    })
  }).refine(data => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation']
  })
})

export const updateUserSchema = object({
  body: object({
    firstName: string().optional(),
    lastName: string().optional(),
    phone: string().optional(),
    image: string().optional(),
  })
})

export type CreateUserInput = TypeOf<typeof createUserSchema>['body']
export type LoginInput = TypeOf<typeof loginUserSchema>['body']

export type UpdateUserInput = TypeOf<typeof updateUserSchema>['body']