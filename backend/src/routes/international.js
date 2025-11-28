import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Получить все записи о международном сотрудничестве
router.get('/', async (req, res) => {
  try {
    const cooperations = await prisma.internationalCooperation.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(cooperations);
  } catch (error) {
    console.error('Error fetching international cooperations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать запись о международном сотрудничестве
router.post('/', async (req, res) => {
  try {
    const { stateName, orgName, dogReg, order } = req.body;
    const cooperation = await prisma.internationalCooperation.create({
      data: {
        stateName,
        orgName,
        dogReg,
        order: parseInt(order) || 0
      }
    });
    res.json(cooperation);
  } catch (error) {
    console.error('Error creating international cooperation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновить запись о международном сотрудничестве
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { stateName, orgName, dogReg, order, isActive } = req.body;
    const cooperation = await prisma.internationalCooperation.update({
      where: { id },
      data: {
        stateName,
        orgName,
        dogReg,
        order: parseInt(order) || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });
    res.json(cooperation);
  } catch (error) {
    console.error('Error updating international cooperation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удалить запись о международном сотрудничестве
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.internationalCooperation.delete({
      where: { id }
    });
    res.json({ message: 'International cooperation deleted successfully' });
  } catch (error) {
    console.error('Error deleting international cooperation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;