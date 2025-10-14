import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createAdmin() {
  const username = 'admin';
  const password = 'admin123'; // Измените на безопасный пароль

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    console.log('Админ создан:', admin);
  } catch (error) {
    console.error('Ошибка при создании админа:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();