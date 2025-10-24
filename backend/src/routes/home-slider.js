import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Настройка multer для загрузки изображений слайдера
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Недопустимый тип файла. Разрешены только изображения.'), false);
    }
  }
});

// GET /api/home-slider - Получить все активные слайды для главной страницы
router.get('/', async (req, res) => {
  try {
    const slides = await prisma.homeSlider.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(slides);
  } catch (error) {
    console.error('Ошибка при получении слайдов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// GET /api/home-slider/all - Получить все слайды (для админа)
router.get('/all', async (req, res) => {
  try {
    const slides = await prisma.homeSlider.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(slides);
  } catch (error) {
    console.error('Ошибка при получении всех слайдов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/home-slider - Создать новый слайд с загрузкой изображения
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, link, order, isActive } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Изображение не загружено' });
    }

    const slide = await prisma.homeSlider.create({
      data: {
        title,
        subtitle: subtitle || null,
        imageUrl: `/uploads/images/${req.file.filename}`,
        link: link || null,
        order: parseInt(order) || 0,
        isActive: isActive !== undefined ? isActive === 'true' : true
      }
    });

    res.json(slide);
  } catch (error) {
    console.error('Ошибка при создании слайда:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /api/home-slider/:id - Обновить слайд
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, link, order, isActive } = req.body;

  try {
    const slide = await prisma.homeSlider.update({
      where: { id },
      data: {
        title: title || undefined,
        subtitle: subtitle || undefined,
        link: link || undefined,
        order: order !== undefined ? parseInt(order) : undefined,
        isActive: isActive === 'true' || isActive === true
      }
    });
    res.json(slide);
  } catch (error) {
    console.error('Ошибка при обновлении слайда:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Слайд не найден' });
    } else {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
});

// DELETE /api/home-slider/:id - Удалить слайд
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Получить слайд перед удалением
    const slide = await prisma.homeSlider.findUnique({
      where: { id }
    });

    if (!slide) {
      return res.status(404).json({ message: 'Слайд не найден' });
    }

    // Удалить изображение с диска
    const imagePath = path.join(process.cwd(), slide.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Удалить запись из БД
    await prisma.homeSlider.delete({
      where: { id }
    });

    res.json({ message: 'Слайд удален' });
  } catch (error) {
    console.error('Ошибка при удалении слайда:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;