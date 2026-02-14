// import { z } from 'zod';

// export const registerSchema = z.object({
//   email: z.string().email('Valid email is required'),
//   password: z
//     .string()
//     .min(8, 'Password must be at least 8 characters long')
//     .regex(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//       'Password must contain at least one uppercase letter, one lowercase letter, and one number'
//     ),
//   name: z.string().trim().min(1, 'Name is required'),
// });

// export const loginSchema = z.object({
//   email: z.string().email('Valid email is required'),
//   password: z.string().min(1, 'Password is required'),
// });


import { z } from 'zod';

// Plain objects, NOT z.object()
export const registerSchema = {
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        name: z.string().min(2, 'Name must be at least 2 characters'),
    }),
};

export const loginSchema = {
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(1, 'Password is required'),
    }),
};