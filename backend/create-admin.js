import bcrypt from 'bcrypt';
import prisma from './src/prisma.js';
import dotenv from 'dotenv';

dotenv.config();


async function createAdmin() {
  const username = 'admin';
  const password = 'admin123'; // Измените на безопасный пароль

  const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);

  try {
    const admin = await prisma.admin.upsert({
      where: { username },
      update: { password: hashedPassword },
      create: {
        username,
        password: hashedPassword,
      },
    });
    console.log('Админ создан/обновлен:', admin);
  } catch (error) {
    console.error('Ошибка при создании админа:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
