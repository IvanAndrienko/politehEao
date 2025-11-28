import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// === ВАКАНТНЫЕ МЕСТА ===

// Получить все вакантные места
router.get('/', async (req, res) => {
  try {
    const vacantPlaces = await prisma.vacantPlace.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(vacantPlaces);
  } catch (error) {
    console.error('Error fetching vacant places:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать вакантное место
router.post('/', async (req, res) => {
  try {
    const {
      eduCode,
      eduName,
      eduLevel,
      eduProf,
      eduCourse,
      eduForm,
      numberBFVacant,
      numberBRVacant,
      numberBMVacant,
      numberPVacant,
      order
    } = req.body;

    const vacantPlace = await prisma.vacantPlace.create({
      data: {
        eduCode,
        eduName,
        eduLevel,
        eduProf,
        eduCourse: parseInt(eduCourse),
        eduForm,
        numberBFVacant: parseInt(numberBFVacant) || 0,
        numberBRVacant: parseInt(numberBRVacant) || 0,
        numberBMVacant: parseInt(numberBMVacant) || 0,
        numberPVacant: parseInt(numberPVacant) || 0,
        order: parseInt(order) || 0
      }
    });
    res.json(vacantPlace);
  } catch (error) {
    console.error('Error creating vacant place:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновить вакантное место
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      eduCode,
      eduName,
      eduLevel,
      eduProf,
      eduCourse,
      eduForm,
      numberBFVacant,
      numberBRVacant,
      numberBMVacant,
      numberPVacant,
      order,
      isActive
    } = req.body;

    const vacantPlace = await prisma.vacantPlace.update({
      where: { id },
      data: {
        eduCode,
        eduName,
        eduLevel,
        eduProf,
        eduCourse: parseInt(eduCourse),
        eduForm,
        numberBFVacant: parseInt(numberBFVacant) || 0,
        numberBRVacant: parseInt(numberBRVacant) || 0,
        numberBMVacant: parseInt(numberBMVacant) || 0,
        numberPVacant: parseInt(numberPVacant) || 0,
        order: parseInt(order) || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });
    res.json(vacantPlace);
  } catch (error) {
    console.error('Error updating vacant place:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удалить вакантное место
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.vacantPlace.delete({
      where: { id }
    });
    res.json({ message: 'Vacant place deleted successfully' });
  } catch (error) {
    console.error('Error deleting vacant place:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;