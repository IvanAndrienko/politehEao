import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Buffer } from 'buffer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const prisma = new PrismaClient();

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/objects');
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

const upload = multer({ storage });

// === КАБИНЕТЫ ===

// Получить все кабинеты
router.get('/cabinets', async (req, res) => {
  try {
    const cabinets = await prisma.cabinet.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(cabinets);
  } catch (error) {
    console.error('Error fetching cabinets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать кабинет
router.post('/cabinets', async (req, res) => {
  try {
    const { address, name, equipment, accessibility, order } = req.body;
    const cabinet = await prisma.cabinet.create({
      data: {
        address,
        name,
        equipment,
        accessibility,
        order: parseInt(order) || 0
      }
    });
    res.json(cabinet);
  } catch (error) {
    console.error('Error creating cabinet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновить кабинет
router.put('/cabinets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { address, name, equipment, accessibility, order, isActive } = req.body;
    const cabinet = await prisma.cabinet.update({
      where: { id },
      data: {
        address,
        name,
        equipment,
        accessibility,
        order: parseInt(order) || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });
    res.json(cabinet);
  } catch (error) {
    console.error('Error updating cabinet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удалить кабинет
router.delete('/cabinets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cabinet.delete({
      where: { id }
    });
    res.json({ message: 'Cabinet deleted successfully' });
  } catch (error) {
    console.error('Error deleting cabinet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === ОБЪЕКТЫ ДЛЯ ПРАКТИЧЕСКИХ ЗАНЯТИЙ ===

// Получить все объекты для практических занятий
router.get('/practice-objects', async (req, res) => {
  try {
    const objects = await prisma.practiceObject.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(objects);
  } catch (error) {
    console.error('Error fetching practice objects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать объект для практических занятий
router.post('/practice-objects', async (req, res) => {
  try {
    const { address, name, equipment, accessibility, order } = req.body;
    const object = await prisma.practiceObject.create({
      data: {
        address,
        name,
        equipment,
        accessibility,
        order: parseInt(order) || 0
      }
    });
    res.json(object);
  } catch (error) {
    console.error('Error creating practice object:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновить объект для практических занятий
router.put('/practice-objects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { address, name, equipment, accessibility, order, isActive } = req.body;
    const object = await prisma.practiceObject.update({
      where: { id },
      data: {
        address,
        name,
        equipment,
        accessibility,
        order: parseInt(order) || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });
    res.json(object);
  } catch (error) {
    console.error('Error updating practice object:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удалить объект для практических занятий
router.delete('/practice-objects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.practiceObject.delete({
      where: { id }
    });
    res.json({ message: 'Practice object deleted successfully' });
  } catch (error) {
    console.error('Error deleting practice object:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === БИБЛИОТЕКИ ===

// Получить все библиотеки
router.get('/libraries', async (req, res) => {
  try {
    const libraries = await prisma.library.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(libraries);
  } catch (error) {
    console.error('Error fetching libraries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать библиотеку
router.post('/libraries', async (req, res) => {
  try {
    const { name, address, area, seats, accessibility, order } = req.body;
    const library = await prisma.library.create({
      data: {
        name,
        address,
        area: parseInt(area),
        seats: parseInt(seats),
        accessibility,
        order: parseInt(order) || 0
      }
    });
    res.json(library);
  } catch (error) {
    console.error('Error creating library:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновить библиотеку
router.put('/libraries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, area, seats, accessibility, order, isActive } = req.body;
    const library = await prisma.library.update({
      where: { id },
      data: {
        name,
        address,
        area: parseInt(area),
        seats: parseInt(seats),
        accessibility,
        order: parseInt(order) || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });
    res.json(library);
  } catch (error) {
    console.error('Error updating library:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удалить библиотеку
router.delete('/libraries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.library.delete({
      where: { id }
    });
    res.json({ message: 'Library deleted successfully' });
  } catch (error) {
    console.error('Error deleting library:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === ОБЪЕКТЫ СПОРТА ===

// Получить все объекты спорта
router.get('/sport-objects', async (req, res) => {
  try {
    const objects = await prisma.sportObject.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(objects);
  } catch (error) {
    console.error('Error fetching sport objects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать объект спорта
router.post('/sport-objects', async (req, res) => {
  try {
    const { name, address, area, seats, accessibility, order } = req.body;
    const object = await prisma.sportObject.create({
      data: {
        name,
        address,
        area: parseInt(area),
        seats: parseInt(seats),
        accessibility,
        order: parseInt(order) || 0
      }
    });
    res.json(object);
  } catch (error) {
    console.error('Error creating sport object:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновить объект спорта
router.put('/sport-objects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, area, seats, accessibility, order, isActive } = req.body;
    const object = await prisma.sportObject.update({
      where: { id },
      data: {
        name,
        address,
        area: parseInt(area),
        seats: parseInt(seats),
        accessibility,
        order: parseInt(order) || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });
    res.json(object);
  } catch (error) {
    console.error('Error updating sport object:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удалить объект спорта
router.delete('/sport-objects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.sportObject.delete({
      where: { id }
    });
    res.json({ message: 'Sport object deleted successfully' });
  } catch (error) {
    console.error('Error deleting sport object:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === ТЕКСТОВЫЕ БЛОКИ ===

// Получить все текстовые блоки
router.get('/text-blocks', async (req, res) => {
  try {
    const blocks = await prisma.objectsTextBlock.findMany({
      where: { isActive: true }
    });
    res.json(blocks);
  } catch (error) {
    console.error('Error fetching text blocks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Получить текстовый блок по типу
router.get('/text-blocks/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const block = await prisma.objectsTextBlock.findFirst({
      where: { blockType: type, isActive: true }
    });
    res.json(block);
  } catch (error) {
    console.error('Error fetching text block:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать/обновить текстовый блок
router.post('/text-blocks', async (req, res) => {
  try {
    const { blockType, content } = req.body;

    // Проверяем, существует ли уже блок такого типа
    const existingBlock = await prisma.objectsTextBlock.findFirst({
      where: { blockType }
    });

    if (existingBlock) {
      // Обновляем существующий
      const updatedBlock = await prisma.objectsTextBlock.update({
        where: { id: existingBlock.id },
        data: { content }
      });
      res.json(updatedBlock);
    } else {
      // Создаем новый
      const newBlock = await prisma.objectsTextBlock.create({
        data: { blockType, content }
      });
      res.json(newBlock);
    }
  } catch (error) {
    console.error('Error saving text block:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === ИНФОРМАЦИЯ ОБ ОБЩЕЖИТИЯХ ===

// Получить информацию об общежитиях
router.get('/hostel-info', async (req, res) => {
  try {
    const info = await prisma.hostelInfo.findFirst();
    res.json(info);
  } catch (error) {
    console.error('Error fetching hostel info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать/обновить информацию об общежитиях
router.post('/hostel-info', async (req, res) => {
  try {
    const { hostels, places, adapted, internats, interPlaces, interAdapted } = req.body;

    const existingInfo = await prisma.hostelInfo.findFirst();

    if (existingInfo) {
      const updatedInfo = await prisma.hostelInfo.update({
        where: { id: existingInfo.id },
        data: {
          hostels: parseInt(hostels),
          places: parseInt(places),
          adapted: parseInt(adapted),
          internats: parseInt(internats),
          interPlaces: parseInt(interPlaces),
          interAdapted: parseInt(interAdapted)
        }
      });
      res.json(updatedInfo);
    } else {
      const newInfo = await prisma.hostelInfo.create({
        data: {
          hostels: parseInt(hostels),
          places: parseInt(places),
          adapted: parseInt(adapted),
          internats: parseInt(internats),
          interPlaces: parseInt(interPlaces),
          interAdapted: parseInt(interAdapted)
        }
      });
      res.json(newInfo);
    }
  } catch (error) {
    console.error('Error saving hostel info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === ДОКУМЕНТЫ ===

// Получить все документы
router.get('/documents', async (req, res) => {
  try {
    const documents = await prisma.objectsDocument.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Загрузить документ
router.post('/documents', upload.single('file'), async (req, res) => {
  try {
    const { title, description, category, order } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Сохраняем оригинальное имя файла в UTF-8
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');

    const document = await prisma.objectsDocument.create({
      data: {
        title,
        description,
        fileUrl: `/uploads/objects/${file.filename}`,
        fileName: originalName,
        fileSize: file.size,
        fileType: file.mimetype,
        category,
        order: parseInt(order) || 0
      }
    });

    res.json(document);
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновить документ
router.put('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, order, isActive } = req.body;

    const document = await prisma.objectsDocument.update({
      where: { id },
      data: {
        title,
        description,
        category,
        order: parseInt(order) || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удалить документ
router.delete('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Получаем информацию о документе перед удалением
    const document = await prisma.objectsDocument.findUnique({
      where: { id }
    });

    if (document) {
      // Удаляем файл с диска
      const filePath = path.join(__dirname, '../../uploads/objects', path.basename(document.fileUrl));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Удаляем запись из БД
      await prisma.objectsDocument.delete({
        where: { id }
      });
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === ДОКУМЕНТ О ПЛАТЕ ЗА ПРОЖИВАНИЕ В ОБЩЕЖИТИИ ===

// Получить документ о плате за проживание
router.get('/hostel-payment-document', async (req, res) => {
  try {
    const document = await prisma.hostelPaymentDocument.findFirst({
      where: { isActive: true }
    });
    res.json(document);
  } catch (error) {
    console.error('Error fetching hostel payment document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Загрузить/обновить документ о плате за проживание
router.post('/hostel-payment-document', upload.single('file'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Сохраняем оригинальное имя файла в UTF-8
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');

    // Удаляем существующий документ
    const existingDoc = await prisma.hostelPaymentDocument.findFirst();
    if (existingDoc) {
      const filePath = path.join(__dirname, '../../uploads/objects', path.basename(existingDoc.fileUrl));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await prisma.hostelPaymentDocument.delete({
        where: { id: existingDoc.id }
      });
    }

    const document = await prisma.hostelPaymentDocument.create({
      data: {
        title: title || 'Документ о плате за проживание в общежитии',
        description,
        fileUrl: `/uploads/objects/${file.filename}`,
        fileName: originalName,
        fileSize: file.size,
        fileType: file.mimetype
      }
    });

    res.json(document);
  } catch (error) {
    console.error('Error uploading hostel payment document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Скачать документ о плате за проживание
router.get('/hostel-payment-document/download', async (req, res) => {
  try {
    const document = await prisma.hostelPaymentDocument.findFirst({
      where: { isActive: true }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const filePath = path.join(__dirname, '../../uploads/objects', path.basename(document.fileUrl));

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Устанавливаем заголовки для скачивания
    res.setHeader('Content-Type', document.fileType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(document.fileName)}"`);

    // Отправляем файл
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading hostel payment document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удалить документ о плате за проживание
router.delete('/hostel-payment-document', async (req, res) => {
  try {
    const document = await prisma.hostelPaymentDocument.findFirst();

    if (document) {
      // Удаляем файл с диска
      const filePath = path.join(__dirname, '../../uploads/objects', path.basename(document.fileUrl));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Удаляем запись из БД
      await prisma.hostelPaymentDocument.delete({
        where: { id: document.id }
      });
    }

    res.json({ message: 'Hostel payment document deleted successfully' });
  } catch (error) {
    console.error('Error deleting hostel payment document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Скачать документ
router.get('/documents/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    const document = await prisma.objectsDocument.findUnique({
      where: { id }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const filePath = path.join(__dirname, '../../uploads/objects', path.basename(document.fileUrl));

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Устанавливаем заголовки для скачивания
    res.setHeader('Content-Type', document.fileType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(document.fileName)}"`);

    // Отправляем файл
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;