import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Keep generate usable in environments that only need type generation.
    url: process.env.DATABASE_URL ?? '',
  },
})
