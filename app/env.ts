import z from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().nonempty(),
  UPLOADS_DIR: z.string().nonempty(),
});

const env = envSchema.parse(process.env);

export default env;
