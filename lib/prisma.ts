import { PrismaClient } from '@/src/generated/prisma';
import { PrismaD1 } from '@prisma/adapter-d1';

// D1 데이터베이스 어Adaptor를 사용하는 Prisma Client 팩토리
export function createPrismaClient(d1Database: any) {
  const adapter = new PrismaD1(d1Database);
  return new PrismaClient({ adapter });
} 