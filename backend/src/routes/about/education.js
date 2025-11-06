import express from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const router = express.Router();

// Путь к файлу настроек
const settingsFilePath = path.join(process.cwd(), 'data', 'education-settings.json');

// Получить все данные образования для фронта
router.get('/', async (req, res) => {
  try {
    // Загружаем настройки
    let settings = {
      showPrograms: true,
      showProgramsDetail: true,
      showEmployment: true,
      showDocuments: true
    };

    if (fs.existsSync(settingsFilePath)) {
      const settingsData = fs.readFileSync(settingsFilePath, 'utf8');
      settings = JSON.parse(settingsData);
    }

    // Загружаем данные из базы
    const [programs, programsDetail, employments, documents] = await Promise.all([
      prisma.educationProgram.findMany({ where: { isActive: true }, orderBy: { createdAt: 'asc' } }),
      prisma.educationalProgramDetail.findMany({ where: { isActive: true }, orderBy: { createdAt: 'asc' } }),
      prisma.graduateEmployment.findMany({ where: { isActive: true }, orderBy: { createdAt: 'asc' } }),
      prisma.educationDocument.findMany({ where: { isActive: true }, orderBy: { createdAt: 'asc' } })
    ]);

    res.json({
      programs,
      programsDetail,
      graduateEmployment: employments,
      documents,
      settings
    });
  } catch (error) {
    console.error('Ошибка получения данных образования:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить все образовательные стандарты
router.get('/standards', async (req, res) => {
  try {
    const standards = await prisma.educationalStandard.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }
    });
    res.json(standards);
  } catch (error) {
    console.error('Ошибка получения стандартов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить все документы образования
router.get('/documents', async (req, res) => {
  try {
    const documents = await prisma.educationDocument.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(documents);
  } catch (error) {
    console.error('Ошибка получения документов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создать документ образования
router.post('/documents', async (req, res) => {
  try {
    const { field, fileUrl, fileName, fileSize, fileType, title, description } = req.body;

    const document = await prisma.educationDocument.create({
      data: {
        field,
        fileUrl,
        fileName,
        fileSize: parseInt(fileSize),
        fileType,
        title,
        description
      }
    });

    res.json(document);
  } catch (error) {
    console.error('Ошибка создания документа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить документ образования
router.put('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isActive } = req.body;

    const document = await prisma.educationDocument.update({
      where: { id },
      data: {
        title,
        description,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.json(document);
  } catch (error) {
    console.error('Ошибка обновления документа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить документ образования
router.delete('/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.educationDocument.delete({
      where: { id }
    });

    res.json({ message: 'Документ удален' });
  } catch (error) {
    console.error('Ошибка удаления документа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;