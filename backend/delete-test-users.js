import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const prisma = new PrismaClient();

async function main() {
  const emailsToDelete = ['sba20067@gmail.com', 'admin@example.com'];
  
  const result = await prisma.user.deleteMany({
    where: {
      email: { in: emailsToDelete }
    }
  });
  
  console.log(`Deleted ${result.count} users.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
