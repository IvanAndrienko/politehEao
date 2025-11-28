import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Настройка multer для загрузки документов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'documents');
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
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Разрешаем различные типы документов
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Недопустимый тип файла'), false);
    }
  }
});

// GET /api/student-documents - Получить все активные документы для студентов
router.get('/', async (req, res) => {
  try {
    const documents = await prisma.studentDocument.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(documents);
  } catch (error) {
    console.error('Ошибка при получении документов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// GET /api/student-documents/all - Получить все документы (для админа)
router.get('/all', async (req, res) => {
  try {
    const documents = await prisma.studentDocument.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(documents);
  } catch (error) {
    console.error('Ошибка при получении всех документов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/student-documents - Создать новый документ с загрузкой файла
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, description, category, order, isActive } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    const document = await prisma.studentDocument.create({
      data: {
        title,
        description,
        fileUrl: `documents/${req.file.filename}`,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        category: category || null,
        order: parseInt(order) || 0,
        isActive: isActive !== undefined ? isActive === 'true' : true
      }
    });

    res.json(document);
  } catch (error) {
    console.error('Ошибка при создании документа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /api/student-documents/:id - Обновить документ
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, category, order, isActive } = req.body;

  try {
    const document = await prisma.studentDocument.update({
      where: { id },
      data: {
        title,
        description,
        category,
        order: parseInt(order),
        isActive: isActive === 'true' || isActive === true
      }
    });
    res.json(document);
  } catch (error) {
    console.error('Ошибка при обновлении документа:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Документ не найден' });
    } else {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
});

// DELETE /api/student-documents/:id - Удалить документ
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Получить документ перед удалением
    const document = await prisma.studentDocument.findUnique({
      where: { id }
    });

    if (!document) {
      return res.status(404).json({ message: 'Документ не найден' });
    }

    // Удалить файл с диска
    const filePath = path.join(process.cwd(), 'uploads', document.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Удалить запись из БД
    await prisma.studentDocument.delete({
      where: { id }
    });

    res.json({ message: 'Документ удален' });
  } catch (error) {
    console.error('Ошибка при удалении документа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;