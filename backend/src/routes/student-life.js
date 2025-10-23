import express from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/student-life - Получить все элементы студенческой жизни
router.get('/', async (req, res) => {
  try {
    const items = await prisma.studentLifeItem.findMany({
      orderBy: { createdAt: 'asc' }
    });

    // Преобразовать имена файлов в полные URL
    const itemsWithUrls = items.map(item => ({
      ...item,
      images: item.images.map(filename => `/uploads/images/${filename}`)
    }));

    res.json(itemsWithUrls);
  } catch (error) {
    console.error('Ошибка при получении элементов студенческой жизни:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// GET /api/student-life/all - Получить все элементы (для админа)
router.get('/all', async (req, res) => {
  try {
    const items = await prisma.studentLifeItem.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(items);
  } catch (error) {
    console.error('Ошибка при получении всех элементов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/student-life - Создать новый элемент
router.post('/', async (req, res) => {
  const { title, description, images } = req.body;

  try {
    const item = await prisma.studentLifeItem.create({
      data: {
        title,
        description,
        images: images || []
      }
    });
    res.json(item);
  } catch (error) {
    console.error('Ошибка при создании элемента:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /api/student-life/:id - Обновить элемент
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, images } = req.body;

  try {
    const item = await prisma.studentLifeItem.update({
      where: { id },
      data: {
        title,
        description,
        images: images || []
      }
    });
    res.json(item);
  } catch (error) {
    console.error('Ошибка при обновлении элемента:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Элемент не найден' });
    } else {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
});

// DELETE /api/student-life/:id - Удалить элемент
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Получить элемент перед удалением
    const item = await prisma.studentLifeItem.findUnique({
      where: { id }
    });

    if (!item) {
      return res.status(404).json({ message: 'Элемент не найден' });
    }

    // Удалить связанные файлы изображений
    for (const filename of item.images) {
      const filePath = path.join(process.cwd(), 'uploads', 'images', filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (fileError) {
          console.error(`Ошибка при удалении файла ${filename}:`, fileError);
        }
      }
    }

    // Удалить запись из БД
    await prisma.studentLifeItem.delete({
      where: { id }
    });

    res.json({ message: 'Элемент удален' });
  } catch (error) {
    console.error('Ошибка при удалении элемента:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;