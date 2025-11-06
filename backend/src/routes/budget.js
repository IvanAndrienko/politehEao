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
    const uploadDir = path.join(__dirname, '../../uploads/budget');
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

// === ОБЪЕМ ОБРАЗОВАТЕЛЬНОЙ ДЕЯТЕЛЬНОСТИ ===

// Получить все записи об объеме образовательной деятельности
router.get('/volume', async (req, res) => {
  try {
    const volumes = await prisma.budgetVolume.findMany({
      where: { isActive: true },
      orderBy: { year: 'desc' }
    });
    res.json(volumes);
  } catch (error) {
    console.error('Error fetching budget volumes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать запись об объеме образовательной деятельности
router.post('/volume', async (req, res) => {
  try {
    const { year, federalBudget, regionalBudget, localBudget, paidServices } = req.body;
    const volume = await prisma.budgetVolume.create({
      data: {
        year: parseInt(year),
        federalBudget: federalBudget ? parseFloat(federalBudget) : null,
        regionalBudget: regionalBudget ? parseFloat(regionalBudget) : null,
        localBudget: localBudget ? parseFloat(localBudget) : null,
        paidServices: paidServices ? parseFloat(paidServices) : null
      }
    });
    res.json(volume);
  } catch (error) {
    console.error('Error creating budget volume:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновить запись об объеме образовательной деятельности
router.put('/volume/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { year, federalBudget, regionalBudget, localBudget, paidServices, isActive } = req.body;
    const volume = await prisma.budgetVolume.update({
      where: { id },
      data: {
        year: parseInt(year),
        federalBudget: federalBudget ? parseFloat(federalBudget) : null,
        regionalBudget: regionalBudget ? parseFloat(regionalBudget) : null,
        localBudget: localBudget ? parseFloat(localBudget) : null,
        paidServices: paidServices ? parseFloat(paidServices) : null,
        isActive: isActive !== undefined ? isActive : true
      }
    });
    res.json(volume);
  } catch (error) {
    console.error('Error updating budget volume:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удалить запись об объеме образовательной деятельности
router.delete('/volume/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.budgetVolume.delete({
      where: { id }
    });
    res.json({ message: 'Budget volume deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget volume:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === ПОСТУПЛЕНИЕ И РАСХОДОВАНИЕ ФИНАНСОВЫХ СРЕДСТВ ===

// Получить все записи о поступлении и расходовании средств
router.get('/flow', async (req, res) => {
  try {
    const flows = await prisma.budgetFlow.findMany({
      where: { isActive: true },
      orderBy: { year: 'desc' }
    });
    res.json(flows);
  } catch (error) {
    console.error('Error fetching budget flows:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать запись о поступлении и расходовании средств
router.post('/flow', async (req, res) => {
  try {
    const { year, income, expenses } = req.body;
    const flow = await prisma.budgetFlow.create({
      data: {
        year: parseInt(year),
        income,
        expenses
      }
    });
    res.json(flow);
  } catch (error) {
    console.error('Error creating budget flow:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновить запись о поступлении и расходовании средств
router.put('/flow/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { year, income, expenses, isActive } = req.body;
    const flow = await prisma.budgetFlow.update({
      where: { id },
      data: {
        year: parseInt(year),
        income,
        expenses,
        isActive: isActive !== undefined ? isActive : true
      }
    });
    res.json(flow);
  } catch (error) {
    console.error('Error updating budget flow:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удалить запись о поступлении и расходовании средств
router.delete('/flow/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.budgetFlow.delete({
      where: { id }
    });
    res.json({ message: 'Budget flow deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget flow:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === ПЛАН ФИНАНСОВО-ХОЗЯЙСТВЕННОЙ ДЕЯТЕЛЬНОСТИ ===

// Получить все документы плана финансово-хозяйственной деятельности
router.get('/plan', async (req, res) => {
  try {
    const plans = await prisma.budgetPlan.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(plans);
  } catch (error) {
    console.error('Error fetching budget plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать документ плана финансово-хозяйственной деятельности
router.post('/plan', upload.single('file'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'File is required' });
    }

    // Сохраняем оригинальное имя файла в UTF-8
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');

    const plan = await prisma.budgetPlan.create({
      data: {
        title,
        description,
        fileUrl: `/uploads/budget/${file.filename}`,
        fileName: originalName,
        fileSize: file.size,
        fileType: file.mimetype
      }
    });

    res.json(plan);
  } catch (error) {
    console.error('Error creating budget plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновить документ плана финансово-хозяйственной деятельности
router.put('/plan/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isActive } = req.body;

    const plan = await prisma.budgetPlan.update({
      where: { id },
      data: {
        title,
        description,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.json(plan);
  } catch (error) {
    console.error('Error updating budget plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удалить документ плана финансово-хозяйственной деятельности
router.delete('/plan/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Получаем информацию о документе перед удалением
    const plan = await prisma.budgetPlan.findUnique({
      where: { id }
    });

    if (plan) {
      // Удаляем файл с диска
      const filePath = path.join(__dirname, '../../uploads/budget', path.basename(plan.fileUrl));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Удаляем запись из БД
      await prisma.budgetPlan.delete({
        where: { id }
      });
    }

    res.json({ message: 'Budget plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;