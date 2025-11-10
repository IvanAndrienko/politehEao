import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/organization - Получить информацию об организации
router.get('/', async (req, res) => {
  try {
    const organization = await prisma.organizationInfo.findFirst();
    if (!organization) {
      // Если данных нет, возвращаем пустой объект
      return res.json({});
    }
    res.json(organization);
  } catch (error) {
    console.error('Ошибка при получении информации об организации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// POST /api/organization - Создать информацию об организации
router.post('/', async (req, res) => {
  try {
    const organizationData = req.body;
    const organization = await prisma.organizationInfo.create({
      data: organizationData
    });
    res.json(organization);
  } catch (error) {
    console.error('Ошибка при создании информации об организации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /api/organization - Обновить информацию об организации
router.put('/', async (req, res) => {
  try {
    const organizationData = req.body;
    const { id, ...updateData } = organizationData;

    let organization;
    if (id) {
      // Обновляем существующую запись
      organization = await prisma.organizationInfo.update({
        where: { id },
        data: updateData
      });
    } else {
      // Ищем существующую запись и обновляем
      const existing = await prisma.organizationInfo.findFirst();
      if (existing) {
        organization = await prisma.organizationInfo.update({
          where: { id: existing.id },
          data: updateData
        });
      } else {
        // Создаем новую запись
        organization = await prisma.organizationInfo.create({
          data: updateData
        });
      }
    }

    res.json(organization);
  } catch (error) {
    console.error('Ошибка при обновлении информации об организации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// DELETE /api/organization - Удалить информацию об организации
router.delete('/', async (req, res) => {
  try {
    const organization = await prisma.organizationInfo.findFirst();
    if (organization) {
      await prisma.organizationInfo.delete({
        where: { id: organization.id }
      });
    }
    res.json({ message: 'Информация об организации удалена' });
  } catch (error) {
    console.error('Ошибка при удалении информации об организации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;