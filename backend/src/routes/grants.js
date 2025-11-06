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
    const uploadDir = path.join(__dirname, '../../uploads/grants');
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

// === ДОКУМЕНТЫ О СТИПЕНДИЯХ ===

// Получить все документы о стипендиях
router.get('/documents', async (req, res) => {
  try {
    const documents = await prisma.grantsDocument.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(documents);
  } catch (error) {
    console.error('Error fetching grants documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать документ о стипендиях
router.post('/documents', upload.single('file'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const document = await prisma.grantsDocument.create({
      data: {
        title,
        description,
        fileUrl: `/uploads/grants/${file.filename}`,
        fileName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype
      }
    });

    res.json(document);
  } catch (error) {
    console.error('Error creating grants document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновить документ о стипендиях
router.put('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isActive } = req.body;

    const document = await prisma.grantsDocument.update({
      where: { id },
      data: {
        title,
        description,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.json(document);
  } catch (error) {
    console.error('Error updating grants document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удалить документ о стипендиях
router.delete('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Получаем информацию о документе перед удалением
    const document = await prisma.grantsDocument.findUnique({
      where: { id }
    });

    if (document) {
      // Удаляем файл с диска
      const filePath = path.join(__dirname, '../../uploads/grants', path.basename(document.fileUrl));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Удаляем запись из БД
      await prisma.grantsDocument.delete({
        where: { id }
      });
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting grants document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === ИНФОРМАЦИЯ О СТИПЕНДИЯХ ===

// Получить информацию о стипендиях
router.get('/info', async (req, res) => {
  try {
    const info = await prisma.grantsInfo.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(info);
  } catch (error) {
    console.error('Error fetching grants info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать/обновить информацию о стипендиях
router.post('/info', async (req, res) => {
  try {
    const { content } = req.body;

    // Сначала деактивируем все существующие записи
    await prisma.grantsInfo.updateMany({
      data: { isActive: false }
    });

    // Создаем новую запись
    const info = await prisma.grantsInfo.create({
      data: {
        content
      }
    });

    res.json(info);
  } catch (error) {
    console.error('Error creating grants info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === МЕРЫ СОЦИАЛЬНОЙ ПОДДЕРЖКИ ===

// Получить меры социальной поддержки
router.get('/support', async (req, res) => {
  try {
    const support = await prisma.supportMeasure.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(support);
  } catch (error) {
    console.error('Error fetching support measures:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать/обновить меры социальной поддержки
router.post('/support', async (req, res) => {
  try {
    const { content } = req.body;

    // Сначала деактивируем все существующие записи
    await prisma.supportMeasure.updateMany({
      data: { isActive: false }
    });

    // Создаем новую запись
    const support = await prisma.supportMeasure.create({
      data: {
        content
      }
    });

    res.json(support);
  } catch (error) {
    console.error('Error creating support measure:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === ИНФОРМАЦИЯ ОБ ОБЩЕЖИТИЯХ ===

// Получить информацию об общежитиях
router.get('/hostel-info', async (req, res) => {
  try {
    const hostelInfo = await prisma.grantsHostelInfo.findFirst();
    res.json(hostelInfo);
  } catch (error) {
    console.error('Error fetching hostel info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать/обновить информацию об общежитиях
router.post('/hostel-info', async (req, res) => {
  try {
    const { hostels, places, adapted, internats, interPlaces, interAdapted } = req.body;

    // Удаляем существующую запись
    await prisma.grantsHostelInfo.deleteMany();

    // Создаем новую запись
    const hostelInfo = await prisma.grantsHostelInfo.create({
      data: {
        hostels: parseInt(hostels) || 0,
        places: parseInt(places) || 0,
        adapted: parseInt(adapted) || 0,
        internats: parseInt(internats) || 0,
        interPlaces: parseInt(interPlaces) || 0,
        interAdapted: parseInt(interAdapted) || 0
      }
    });

    res.json(hostelInfo);
  } catch (error) {
    console.error('Error creating hostel info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === ДОКУМЕНТ О ПЛАТЕ ЗА ПРОЖИВАНИЕ ===

// Получить документ о плате за проживание
router.get('/hostel-payment-document', async (req, res) => {
  try {
    const document = await prisma.grantsHostelPaymentDocument.findFirst({
      where: { isActive: true }
    });
    res.json(document);
  } catch (error) {
    console.error('Error fetching hostel payment document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать документ о плате за проживание
router.post('/hostel-payment-document', upload.single('file'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'File is required' });
    }

    // Деактивируем существующие документы
    await prisma.grantsHostelPaymentDocument.updateMany({
      data: { isActive: false }
    });

    const document = await prisma.grantsHostelPaymentDocument.create({
      data: {
        title,
        description,
        fileUrl: `/uploads/grants/${file.filename}`,
        fileName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype
      }
    });

    res.json(document);
  } catch (error) {
    console.error('Error creating hostel payment document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновить документ о плате за проживание
router.put('/hostel-payment-document/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isActive } = req.body;

    const document = await prisma.grantsHostelPaymentDocument.update({
      where: { id },
      data: {
        title,
        description,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.json(document);
  } catch (error) {
    console.error('Error updating hostel payment document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удалить документ о плате за проживание
router.delete('/hostel-payment-document/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Получаем информацию о документе перед удалением
    const document = await prisma.grantsHostelPaymentDocument.findUnique({
      where: { id }
    });

    if (document) {
      // Удаляем файл с диска
      const filePath = path.join(__dirname, '../../uploads/grants', path.basename(document.fileUrl));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Удаляем запись из БД
      await prisma.grantsHostelPaymentDocument.delete({
        where: { id }
      });
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting hostel payment document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;