import express from 'express';
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();

// Функция для удаления файла
const deleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(path.join('uploads', filePath))) {
      fs.unlinkSync(path.join('uploads', filePath));
    }
  } catch (error) {
    console.error('Ошибка удаления файла:', filePath, error);
  }
};

// Функция для удаления всех файлов новости
const deleteNewsFiles = (news) => {
  // Удалить превью
  if (news.previewImage) {
    deleteFile(news.previewImage);
  }

  // Удалить изображения
  if (news.images && Array.isArray(news.images)) {
    news.images.forEach(image => deleteFile(image));
  }

  // Удалить вложения
  if (news.attachments && Array.isArray(news.attachments)) {
    news.attachments.forEach(attachment => deleteFile(attachment));
  }
};


// GET /api/news - Получить все новости
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const news = await prisma.news.findMany({
      orderBy: { publishedAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit),
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        previewImage: true,
        publishedAt: true,
      },
    });

    const total = await prisma.news.count();

    res.json({
      news,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка получения новостей' });
  }
});

// GET /api/news/:slug - Получить новость по slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const news = await prisma.news.findUnique({
      where: { slug },
    });

    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }

    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка получения новости' });
  }
});

// POST /api/news - Создать новость
router.post('/', async (req, res) => {
  try {
    const { title, shortDescription, fullText, previewImage, attachments, images } = req.body;

    // Валидация обязательных полей
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Заголовок новости обязателен' });
    }

    if (!previewImage || !previewImage.trim()) {
      return res.status(400).json({ message: 'Превью изображение обязательно для новости' });
    }

    if (!fullText || !fullText.trim()) {
      return res.status(400).json({ message: 'Полный текст новости обязателен' });
    }

    const slug = slugify(title, {
      lower: true,
      strict: true,
      locale: 'ru'
    });

    // Проверяем уникальность slug
    const existingNews = await prisma.news.findUnique({
      where: { slug },
    });

    if (existingNews) {
      return res.status(400).json({ message: 'Новость с таким названием уже существует' });
    }

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        shortDescription,
        fullText,
        previewImage,
        attachments: attachments || [],
        images: images || [],
      },
    });

    res.status(201).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка создания новости' });
  }
});

// PUT /api/news/:id - Обновить новость
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, shortDescription, fullText, previewImage, attachments, images } = req.body;

    let slug = undefined;
    if (title) {
      slug = slugify(title, {
        lower: true,
        strict: true,
        locale: 'ru'
      });
      // Проверяем уникальность slug (исключая текущую новость)
      const existingNews = await prisma.news.findFirst({
        where: {
          slug,
          id: { not: parseInt(id) },
        },
      });

      if (existingNews) {
        return res.status(400).json({ message: 'Новость с таким названием уже существует' });
      }
    }

    const news = await prisma.news.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title, slug }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(fullText && { fullText }),
        ...(previewImage !== undefined && { previewImage }),
        ...(attachments && { attachments }),
        ...(images && { images }),
      },
    });

    res.json(news);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Новость не найдена' });
    }
    res.status(500).json({ message: 'Ошибка обновления новости' });
  }
});

// DELETE /api/news/:id - Удалить новость
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Получить новость перед удалением для очистки файлов
    const news = await prisma.news.findUnique({
      where: { id: parseInt(id) },
    });

    if (!news) {
      return res.status(404).json({ message: 'Новость не найдена' });
    }

    // Удалить связанные файлы
    deleteNewsFiles(news);

    // Удалить новость из базы данных
    await prisma.news.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Новость и связанные файлы удалены' });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Новость не найдена' });
    }
    res.status(500).json({ message: 'Ошибка удаления новости' });
  }
});

export default router;