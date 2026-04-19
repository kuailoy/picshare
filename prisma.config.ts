import dotenv from 'dotenv'
import { defineConfig, env } from 'prisma/config'

dotenv.config({ path: '.env.local' })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  // @ts-ignore - Prisma 7 supports datasource config without the Prisma 6 `engine` flag.
  datasource: {
    url: env('DATABASE_URL'),
  },
})
