import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.');
    process.exit(1);
  }

  const normalizedEmail = email.trim().toLowerCase();
  
  console.log(`🔍 Checking for existing user with email: ${normalizedEmail}`);
  
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });

  if (existingUser) {
    console.log(`⚠️ User found. Upgrading role to 'admin' (Password remains unchanged unless explicitly updated via other means).`);
    
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { role: 'admin' }
    });
    
    console.log('✅ Success: User upgraded to admin.');
  } else {
    console.log(`Creating new admin user...`);
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: {
        email: normalizedEmail,
        password_hash: passwordHash,
        full_name: 'Super Admin',
        role: 'admin',
        is_verified: true
      }
    });
    
    console.log('✅ Success: Admin user created successfully.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
