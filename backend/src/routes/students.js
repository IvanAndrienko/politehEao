import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/students/services - Получить все активные студенческие сервисы
router.get('/services', async (req, res) => {
  try {
    const services = await prisma.studentService.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(services);
  } catch (error) {
    console.error('Ошибка при получении сервисов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// GET /api/students/services/all - Получить все сервисы (для админа)
router.get('/services/all', async (req, res) => {
  try {
    const services = await prisma.studentService.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(services);
  } catch (error) {
    console.error('Ошибка при получении всех сервисов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/students/services - Создать новый сервис
router.post('/services', async (req, res) => {
  const { title, description, url, icon, order, isActive } = req.body;

  try {
    const service = await prisma.studentService.create({
      data: {
        title,
        description,
        url,
        icon,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });
    res.json(service);
  } catch (error) {
    console.error('Ошибка при создании сервиса:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /api/students/services/:id - Обновить сервис
router.put('/services/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, url, icon, order, isActive } = req.body;

  try {
    const service = await prisma.studentService.update({
      where: { id },
      data: {
        title,
        description,
        url,
        icon,
        order,
        isActive
      }
    });
    res.json(service);
  } catch (error) {
    console.error('Ошибка при обновлении сервиса:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Сервис не найден' });
    } else {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
});

// DELETE /api/students/services/:id - Удалить сервис
router.delete('/services/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.studentService.delete({
      where: { id }
    });
    res.json({ message: 'Сервис удален' });
  } catch (error) {
    console.error('Ошибка при удалении сервиса:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Сервис не найден' });
    } else {
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
});

export default router;