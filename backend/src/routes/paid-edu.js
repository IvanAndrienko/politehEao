import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const prisma = new PrismaClient();

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/paid-edu');
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
  storage,
  fileFilter: (req, file, cb) => {
    // Проверяем кодировку имени файла
    if (file.originalname) {
      // Преобразуем из latin-1 в utf-8 если нужно
      try {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
      } catch (e) {
        // Если не получилось, оставляем как есть
      }
    }
    cb(null, true);
  }
});

// === ДОКУМЕНТЫ ПЛАТНЫХ ОБРАЗОВАТЕЛЬНЫХ УСЛУГ ===

// Получить все документы по типам
router.get('/documents', async (req, res) => {
  try {
    const documents = await prisma.paidEduDocument.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    // Группируем документы по типам
    const grouped = {
      paidEdu: documents.filter(doc => doc.docType === 'paidEdu'),
      paidDog: documents.filter(doc => doc.docType === 'paidDog'),
      paidSt: documents.filter(doc => doc.docType === 'paidSt'),
      paidParents: documents.filter(doc => doc.docType === 'paidParents')
    };

    res.json(grouped);
  } catch (error) {
    console.error('Error fetching paid edu documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Получить документы по типу
router.get('/documents/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const documents = await prisma.paidEduDocument.findMany({
      where: {
        docType: type,
        isActive: true
      },
      orderBy: { order: 'asc' }
    });
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents by type:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать документ
router.post('/documents', upload.single('file'), async (req, res) => {
  try {
    const { title, description, docType, programName, educationLevel } = req.body;
    const file = req.file;

    const documentData = {
      title: title || null,
      description: description || null,
      docType,
      programName: programName || null,
      educationLevel: educationLevel || null
    };

    if (file) {
      // Сохраняем оригинальное имя файла в UTF-8
      const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
      documentData.fileUrl = `/uploads/paid-edu/${file.filename}`;
      documentData.fileName = originalName;
      documentData.fileSize = file.size;
      documentData.fileType = file.mimetype;
    }

    const document = await prisma.paidEduDocument.create({
      data: documentData
    });

    res.json(document);
  } catch (error) {
    console.error('Error creating paid edu document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновить документ
router.put('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, order, isActive, programName, educationLevel } = req.body;

    const document = await prisma.paidEduDocument.update({
      where: { id },
      data: {
        title,
        description,
        order: parseInt(order) || 0,
        isActive: isActive !== undefined ? isActive : true,
        programName: programName || null,
        educationLevel: educationLevel || null
      }
    });

    res.json(document);
  } catch (error) {
    console.error('Error updating paid edu document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удалить документ
router.delete('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Получаем информацию о документе перед удалением
    const document = await prisma.paidEduDocument.findUnique({
      where: { id }
    });

    if (document) {
      // Удаляем файл с диска
      const filePath = path.join(__dirname, '../../uploads/paid-edu', path.basename(document.fileUrl));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Удаляем запись из БД
      await prisma.paidEduDocument.delete({
        where: { id }
      });
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting paid edu document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;