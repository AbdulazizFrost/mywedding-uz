import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: { email: 'sba.200676@gmail.com' },
    data: { role: 'admin' }
  });
  console.log("Updated sba.200676@gmail.com to admin");
}

main().finally(() => prisma.$disconnect());
