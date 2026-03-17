import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  MONGODB_URI: z.string().optional().default(''),
  JWT_SECRET: z.string().min(12).default('greenvolt-dev-secret-key'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  STRIPE_PUBLIC_KEY: z.string().default('pk_test_mock_key'),
  STRIPE_SECRET_KEY: z.string().default('sk_test_mock_key')
});

export const env = envSchema.parse(process.env);
