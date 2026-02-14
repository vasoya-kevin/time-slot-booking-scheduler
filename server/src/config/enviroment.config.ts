import { z } from "zod";

const environmentSchema = z.object({
    NODE_ENV: z.enum(['development', 'staging', 'production']),
    PORT: z.string().transform(Number).pipe(z.number().positive()),
    SECRET_KEY: z.string(),
})

const env = environmentSchema.parse(process.env)

export default env;