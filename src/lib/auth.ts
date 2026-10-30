import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'
import { nextCookies } from 'better-auth/next-js'
import { db } from '@/src/lib/db'

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true },
  plugins: [
    admin(),
    nextCookies(),
  ],
})