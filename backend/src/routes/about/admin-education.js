import express from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const router = express.Router();

// Путь к файлу настроек
const settingsFilePath = path.join(process.cwd(), 'data', 'education-settings.json');

// Middleware для проверки аутентификации
const requireAuth = (req, res, next) => {
  // TODO: Добавить проверку JWT токена
  next();
};

// Получить настройки отображения
router.get('/settings', requireAuth, async (req, res) => {
  try {
    // Проверяем, существует ли файл настроек
    if (fs.existsSync(settingsFilePath)) {
      const settingsData = fs.readFileSync(settingsFilePath, 'utf8');
      const settings = JSON.parse(settingsData);
      res.json(settings);
    } else {
      // Возвращаем дефолтные настройки
      const defaultSettings = {
        showPrograms: true,
        showProgramsDetail: true,
        showEmployment: true,
        showDocuments: true
      };
      res.json(defaultSettings);
    }
  } catch (error) {
    console.error('Ошибка получения настроек:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить настройки отображения
router.put('/settings', requireAuth, async (req, res) => {
  try {
    const settings = req.body;

    // Сохраняем настройки в файл
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));

    console.log('Настройки сохранены:', settings);
    res.json(settings);
  } catch (error) {
    console.error('Ошибка обновления настроек:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// === ОСНОВНЫЕ ПРОГРАММЫ (Таблица 3.5.2) ===

// Получить все основные программы
router.get('/programs', requireAuth, async (req, res) => {
  try {
    const programs = await prisma.educationProgram.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(programs);
  } catch (error) {
    console.error('Ошибка получения программ:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создать основную программу
router.post('/programs', requireAuth, async (req, res) => {
  try {
    const { code, name, program, level, form, term, subjects, practices } = req.body;

    const newProgram = await prisma.educationProgram.create({
      data: {
        code,
        name,
        program,
        level,
        form,
        term,
        subjects,
        practices
      }
    });

    res.json(newProgram);
  } catch (error) {
    console.error('Ошибка создания программы:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить основную программу
router.put('/programs/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, program, level, form, term, subjects, practices } = req.body;

    const updatedProgram = await prisma.educationProgram.update({
      where: { id },
      data: {
        code,
        name,
        program,
        level,
        form,
        term,
        subjects,
        practices
      }
    });

    res.json(updatedProgram);
  } catch (error) {
    console.error('Ошибка обновления программы:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить основную программу
router.delete('/programs/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.educationProgram.delete({
      where: { id }
    });

    res.json({ message: 'Программа удалена' });
  } catch (error) {
    console.error('Ошибка удаления программы:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// === ДЕТАЛЬНЫЕ ПРОГРАММЫ (Таблица 3.5.6) ===

// Получить все детальные программы
router.get('/programs-detail', requireAuth, async (req, res) => {
  try {
    const programs = await prisma.educationalProgramDetail.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(programs);
  } catch (error) {
    console.error('Ошибка получения детальных программ:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создать детальную программу
router.post('/programs-detail', requireAuth, async (req, res) => {
  try {
    const { code, name, level, program, form, descriptionFile, curriculumFile, workProgramsFile, scheduleFile, practicesFile, documentsFile } = req.body;

    const newProgram = await prisma.educationalProgramDetail.create({
      data: {
        code,
        name,
        level,
        program,
        form,
        descriptionFile,
        curriculumFile,
        workProgramsFile,
        scheduleFile,
        practicesFile,
        documentsFile
      }
    });

    res.json(newProgram);
  } catch (error) {
    console.error('Ошибка создания детальной программы:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить детальную программу
router.put('/programs-detail/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, level, program, form, descriptionFile, curriculumFile, workProgramsFile, scheduleFile, practicesFile, documentsFile } = req.body;

    const updatedProgram = await prisma.educationalProgramDetail.update({
      where: { id },
      data: {
        code,
        name,
        level,
        program,
        form,
        descriptionFile,
        curriculumFile,
        workProgramsFile,
        scheduleFile,
        practicesFile,
        documentsFile
      }
    });

    res.json(updatedProgram);
  } catch (error) {
    console.error('Ошибка обновления детальной программы:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить детальную программу
router.delete('/programs-detail/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.educationalProgramDetail.delete({
      where: { id }
    });

    res.json({ message: 'Программа удалена' });
  } catch (error) {
    console.error('Ошибка удаления детальной программы:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// === ТРУДОУСТРОЙСТВО (Таблица 3.5.9) ===

// Получить все записи о трудоустройстве
router.get('/employment', requireAuth, async (req, res) => {
  try {
    const employments = await prisma.graduateEmployment.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(employments);
  } catch (error) {
    console.error('Ошибка получения трудоустройства:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создать запись о трудоустройстве
router.post('/employment', requireAuth, async (req, res) => {
  try {
    const { code, name, program, graduates, employed, year } = req.body;

    const newEmployment = await prisma.graduateEmployment.create({
      data: {
        code,
        name,
        program,
        graduates: parseInt(graduates),
        employed: parseInt(employed),
        year: year || '2023/2024'
      }
    });

    res.json(newEmployment);
  } catch (error) {
    console.error('Ошибка создания записи о трудоустройстве:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить запись о трудоустройстве
router.put('/employment/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, program, graduates, employed, year } = req.body;

    const updatedEmployment = await prisma.graduateEmployment.update({
      where: { id },
      data: {
        code,
        name,
        program,
        graduates: parseInt(graduates),
        employed: parseInt(employed),
        year
      }
    });

    res.json(updatedEmployment);
  } catch (error) {
    console.error('Ошибка обновления трудоустройства:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить запись о трудоустройстве
router.delete('/employment/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.graduateEmployment.delete({
      where: { id }
    });

    res.json({ message: 'Запись удалена' });
  } catch (error) {
    console.error('Ошибка удаления трудоустройства:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// === ДОКУМЕНТЫ ===

// Получить все документы
router.get('/documents', requireAuth, async (req, res) => {
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

// Создать документ
router.post('/documents', requireAuth, async (req, res) => {
  try {
    const { title, description, fileUrl, fileName, fileSize, fileType } = req.body;

    const document = await prisma.educationDocument.create({
      data: {
        title,
        description,
        fileUrl,
        fileName,
        fileSize: parseInt(fileSize),
        fileType
      }
    });

    res.json(document);
  } catch (error) {
    console.error('Ошибка создания документа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить документ
router.put('/documents/:id', requireAuth, async (req, res) => {
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

// Удалить документ
router.delete('/documents/:id', requireAuth, async (req, res) => {
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

// === ОБРАЗОВАТЕЛЬНЫЕ СТАНДАРТЫ И ТРЕБОВАНИЯ ===

// Получить все образовательные стандарты
router.get('/standards', requireAuth, async (req, res) => {
  try {
    const standards = await prisma.educationalStandard.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(standards);
  } catch (error) {
    console.error('Ошибка получения стандартов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создать образовательный стандарт
router.post('/standards', requireAuth, async (req, res) => {
  try {
    const { code, name, level, program, form, fedDocUrl, fedDocName, standartDocUrl, standartDocName, fedTrebUrl, fedTrebName, standartTrebUrl, standartTrebName } = req.body;

    const newStandard = await prisma.educationalStandard.create({
      data: {
        code,
        name,
        level,
        program,
        form,
        fedDocUrl,
        fedDocName,
        standartDocUrl,
        standartDocName,
        fedTrebUrl,
        fedTrebName,
        standartTrebUrl,
        standartTrebName
      }
    });

    res.json(newStandard);
  } catch (error) {
    console.error('Ошибка создания стандарта:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить образовательный стандарт
router.put('/standards/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, level, program, form, fedDocUrl, fedDocName, standartDocUrl, standartDocName, fedTrebUrl, fedTrebName, standartTrebUrl, standartTrebName } = req.body;

    const updatedStandard = await prisma.educationalStandard.update({
      where: { id },
      data: {
        code,
        name,
        level,
        program,
        form,
        fedDocUrl,
        fedDocName,
        standartDocUrl,
        standartDocName,
        fedTrebUrl,
        fedTrebName,
        standartTrebUrl,
        standartTrebName
      }
    });

    res.json(updatedStandard);
  } catch (error) {
    console.error('Ошибка обновления стандарта:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить образовательный стандарт
router.delete('/standards/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.educationalStandard.delete({
      where: { id }
    });

    res.json({ message: 'Стандарт удален' });
  } catch (error) {
    console.error('Ошибка удаления стандарта:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;