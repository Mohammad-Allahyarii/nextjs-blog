import { config } from 'dotenv'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '../../generated/prisma/client'

// وقتی این فایل بیرون از Next اجرا می‌شود (مثل CLI بتر اوث)، .env.local خودکار لود نمی‌شود
config({ path: '.env.local' })

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createClient() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

export const db = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db