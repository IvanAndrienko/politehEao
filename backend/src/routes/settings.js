import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/settings - получить настройки сайта
router.get('/', async (req, res) => {
  try {
    // Получаем первую запись настроек (предполагаем, что всегда одна)
    let settings = await prisma.siteSettings.findFirst();

    // Если настроек нет, создаем дефолтные
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          phone: '+7 (999) 123-45-67',
          email: 'info@college.ru',
          address: '679000, Еврейская автономная область, г. Биробиджан, ул. Образцовая, д. XX',
          vkLink: '#',
          telegram: '#'
        }
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Ошибка при получении настроек:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /api/settings - обновить настройки сайта
router.put('/', async (req, res) => {
  try {
    const { phone, email, address, vkLink, telegram } = req.body;

    // Обновляем или создаем настройки
    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 }, // Предполагаем, что всегда id=1
      update: {
        phone,
        email,
        address,
        vkLink,
        telegram
      },
      create: {
        phone,
        email,
        address,
        vkLink,
        telegram
      }
    });

    res.json(settings);
  } catch (error) {
    console.error('Ошибка при обновлении настроек:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;