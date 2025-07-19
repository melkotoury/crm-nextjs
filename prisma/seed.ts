import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a default role if it doesn't exist
  const defaultRole = await prisma.role.upsert({
    where: { role_name: 'user' },
    update: {},
    create: {
      role_name: 'user',
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { role_name: 'admin' },
    update: {},
    create: {
      role_name: 'admin',
    },
  });

  // Create a default user if it doesn't exist
  const hashedPassword = await hash('password', 10);
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      username: 'testuser',
      email: 'user@example.com',
      password_hash: hashedPassword,
      full_name: 'Test User',
      role_id: defaultRole.role_id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password_hash: hashedPassword,
      full_name: 'Admin User',
      role_id: adminRole.role_id,
    },
  });

  // Seed some sample contacts
  await prisma.contact.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone_number: '123-456-7890',
      company: 'ABC Corp',
      job_title: 'Software Engineer',
    },
  });

  await prisma.contact.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      phone_number: '098-765-4321',
      company: 'XYZ Inc',
      job_title: 'Project Manager',
    },
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });