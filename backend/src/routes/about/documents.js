import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const router = express.Router();

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
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
    const allowedTypes = /pdf|doc|docx|xls|xlsx|txt|jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype || extname) {
      return cb(null, true);
    } else {
      cb(new Error('Недопустимый тип файла'));
    }
  }
});

// Получить все документы
router.get('/', async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Преобразуем в объект с полями как ключами
    const documentObject = {};
    documents.forEach(doc => {
      documentObject[doc.field] = doc.fileUrl;
    });

    res.json({
      documents: documentObject,
      meta: documents.reduce((acc, d) => {
        acc[d.field] = {
          name: d.fileName,
          size: d.fileSize,
          type: d.fileType,
          updatedAt: d.updatedAt
        };
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Ошибка при получении документов' });
  }
});

// Загрузить документ
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    const { field } = req.body;

    // Обновляем или создаем запись документа
    const document = await prisma.document.upsert({
      where: { field },
      update: {
        fileUrl: req.file.filename,
        fileSize: req.file.size,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        updatedAt: new Date()
      },
      create: {
        field,
        fileUrl: req.file.filename,
        fileSize: req.file.size,
        fileName: req.file.originalname,
        fileType: req.file.mimetype
      }
    });

    res.json({
      message: 'Файл загружен успешно',
      fileUrl: req.file.filename,
      document
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Ошибка при загрузке файла' });
  }
});

// Обновить документ
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { field, fileUrl, fileSize } = req.body;

    const document = await prisma.document.update({
      where: { id },
      data: {
        field,
        fileUrl,
        fileSize,
        updatedAt: new Date()
      }
    });

    res.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Ошибка при обновлении документа' });
  }
});

// Удалить документ по полю
router.delete('/:field', async (req, res) => {
  try {
    const { field } = req.params;

    const document = await prisma.document.findUnique({
      where: { field }
    });

    if (document) {
      // Удаляем файл с диска
      const filePath = path.join(process.cwd(), 'uploads', document.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Удаляем запись из базы данных
      await prisma.document.delete({
        where: { field }
      });
    }

    res.json({ message: 'Документ удален' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Ошибка при удалении документа' });
  }
});

// Скачать документ
router.get('/download/:field', async (req, res) => {
  try {
    const { field } = req.params;
    const document = await prisma.document.findUnique({
      where: { field }
    });

    if (!document) {
      return res.status(404).json({ error: 'Файл не найден' });
    }

    const filePath = path.join(process.cwd(), 'uploads', document.fileUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Файл не найден на диске' });
    }

    res.download(filePath, document.fileName);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ error: 'Ошибка при скачивании файла' });
  }
});

// Обновить все документы
router.put('/', async (req, res) => {
  try {
    const updates = req.body;

    // Обновляем каждый документ
    for (const [field, fileUrl] of Object.entries(updates)) {
      if (fileUrl) {
        await prisma.document.upsert({
          where: { field },
          update: {
            fileUrl,
            updatedAt: new Date()
          },
          create: {
            field,
            fileUrl,
            fileSize: 0,
            fileName: '',
            fileType: ''
          }
        });
      }
    }

    res.json({ message: 'Документы обновлены' });
  } catch (error) {
    console.error('Error updating documents:', error);
    res.status(500).json({ error: 'Ошибка при обновлении документов' });
  }
});

export default router;