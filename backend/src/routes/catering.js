import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// === ОБЪЕКТЫ ПИТАНИЯ И ОХРАНЫ ЗДОРОВЬЯ ===

// Получить все объекты питания и охраны здоровья
router.get('/', async (req, res) => {
  try {
    const catering = await prisma.catering.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(catering);
  } catch (error) {
    console.error('Error fetching catering:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать объект питания/охраны здоровья
router.post('/', async (req, res) => {
  try {
    const { type, name, address, area, seats, accessibility, order } = req.body;
    const catering = await prisma.catering.create({
      data: {
        type,
        name,
        address,
        area: parseInt(area),
        seats: parseInt(seats),
        accessibility,
        order: parseInt(order) || 0
      }
    });
    res.json(catering);
  } catch (error) {
    console.error('Error creating catering:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновить объект питания/охраны здоровья
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, name, address, area, seats, accessibility, order, isActive } = req.body;
    const catering = await prisma.catering.update({
      where: { id },
      data: {
        type,
        name,
        address,
        area: parseInt(area),
        seats: parseInt(seats),
        accessibility,
        order: parseInt(order) || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });
    res.json(catering);
  } catch (error) {
    console.error('Error updating catering:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удалить объект питания/охраны здоровья
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.catering.delete({
      where: { id }
    });
    res.json({ message: 'Catering object deleted successfully' });
  } catch (error) {
    console.error('Error deleting catering:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;