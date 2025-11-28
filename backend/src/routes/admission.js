import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/admission/specialties - Получить все специальности
router.get('/specialties', async (req, res) => {
  try {
    const specialties = await prisma.specialty.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(specialties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/admission/specialties - Создать специальность
router.post('/specialties', async (req, res) => {
  const { code, name, duration, form, qualification, budgetPlaces, paidPlaces } = req.body;

  try {
    const specialty = await prisma.specialty.create({
      data: {
        code,
        name,
        duration,
        form,
        qualification,
        budgetPlaces: budgetPlaces ? parseInt(budgetPlaces) : null,
        paidPlaces: paidPlaces ? parseInt(paidPlaces) : null
      }
    });
    res.json(specialty);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Специальность с таким кодом уже существует' });
    } else {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
});

// PUT /api/admission/specialties/:id - Обновить специальность
router.put('/specialties/:id', async (req, res) => {
  const { id } = req.params;
  const { code, name, duration, form, qualification, budgetPlaces, paidPlaces } = req.body;

  try {
    const specialty = await prisma.specialty.update({
      where: { id },
      data: {
        code,
        name,
        duration,
        form,
        qualification,
        budgetPlaces: budgetPlaces ? parseInt(budgetPlaces) : null,
        paidPlaces: paidPlaces ? parseInt(paidPlaces) : null
      }
    });
    res.json(specialty);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Специальность с таким кодом уже существует' });
    } else {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
});

// DELETE /api/admission/specialties/:id - Удалить специальность
router.delete('/specialties/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.specialty.delete({
      where: { id }
    });
    res.json({ message: 'Специальность удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// GET /api/admission/documents - Получить документы
router.get('/documents', async (req, res) => {
  try {
    const documents = await prisma.requiredDocument.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/admission/documents - Создать документ
router.post('/documents', async (req, res) => {
  const { title, description } = req.body;

  try {
    const document = await prisma.requiredDocument.create({
      data: {
        title,
        description
      }
    });
    res.json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /api/admission/documents/:id - Обновить документ
router.put('/documents/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const document = await prisma.requiredDocument.update({
      where: { id },
      data: {
        title,
        description
      }
    });
    res.json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// DELETE /api/admission/documents/:id - Удалить документ
router.delete('/documents/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.requiredDocument.delete({
      where: { id }
    });
    res.json({ message: 'Документ удален' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// GET /api/admission/dates - Получить важные даты
router.get('/dates', async (req, res) => {
  try {
    const dates = await prisma.importantDate.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(dates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/admission/dates - Создать дату
router.post('/dates', async (req, res) => {
  const { date, event } = req.body;

  try {
    const importantDate = await prisma.importantDate.create({
      data: {
        date,
        event
      }
    });
    res.json(importantDate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /api/admission/dates/:id - Обновить дату
router.put('/dates/:id', async (req, res) => {
  const { id } = req.params;
  const { date, event } = req.body;

  try {
    const importantDate = await prisma.importantDate.update({
      where: { id },
      data: {
        date,
        event
      }
    });
    res.json(importantDate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// DELETE /api/admission/dates/:id - Удалить дату
router.delete('/dates/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.importantDate.delete({
      where: { id }
    });
    res.json({ message: 'Дата удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// GET /api/admission/contacts - Получить контакты приемной комиссии
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await prisma.admissionContact.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/admission/contacts - Создать контакт
router.post('/contacts', async (req, res) => {
  const { type, title, value } = req.body;

  try {
    // Проверяем, существует ли уже контакт такого типа
    const existingContact = await prisma.admissionContact.findFirst({
      where: { type }
    });

    if (existingContact) {
      // Обновляем существующий
      const contact = await prisma.admissionContact.update({
        where: { id: existingContact.id },
        data: {
          title,
          value
        }
      });
      res.json(contact);
    } else {
      // Создаем новый
      const contact = await prisma.admissionContact.create({
        data: {
          type,
          title,
          value
        }
      });
      res.json(contact);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /api/admission/contacts/:id - Обновить контакт
router.put('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { type, title, value } = req.body;

  try {
    // Найти контакт по id или создать новый по типу
    let contact = await prisma.admissionContact.findUnique({
      where: { id }
    });

    if (!contact) {
      // Если контакт не найден по id, попробовать найти по типу
      contact = await prisma.admissionContact.findFirst({
        where: { type }
      });
    }

    if (contact) {
      // Обновить существующий
      const updatedContact = await prisma.admissionContact.update({
        where: { id: contact.id },
        data: {
          title,
          value
        }
      });
      res.json(updatedContact);
    } else {
      // Создать новый
      const newContact = await prisma.admissionContact.create({
        data: {
          type,
          title,
          value
        }
      });
      res.json(newContact);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// DELETE /api/admission/contacts/:id - Удалить контакт
router.delete('/contacts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.admissionContact.delete({
      where: { id }
    });
    res.json({ message: 'Контакт удален' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// GET /api/admission/dormitory - Получить информацию об общежитии
router.get('/dormitory', async (req, res) => {
  try {
    const dormitory = await prisma.dormitory.findFirst();
    res.json(dormitory || { description: null, address: null, images: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /api/admission/dormitory - Обновить информацию об общежитии
router.put('/dormitory', async (req, res) => {
  const { description, address, images } = req.body;

  try {
    const dormitory = await prisma.dormitory.upsert({
      where: { id: 1 },
      update: {
        description,
        address,
        images: images || []
      },
      create: {
        id: 1,
        description,
        address,
        images: images || []
      }
    });
    res.json(dormitory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;