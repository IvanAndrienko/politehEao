import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Получить всех сотрудников
router.get('/', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать сотрудника
router.post('/', async (req, res) => {
  try {
    const {
      fio,
      post,
      disciplines,
      educationLevel,
      degree,
      academicTitle,
      qualification,
      professionalDevelopment,
      experience,
      programs,
      order
    } = req.body;

    const employee = await prisma.employee.create({
      data: {
        fio,
        post,
        disciplines,
        educationLevel,
        degree,
        academicTitle,
        qualification,
        professionalDevelopment,
        experience,
        programs,
        order: parseInt(order) || 0
      }
    });
    res.json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновить сотрудника
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fio,
      post,
      disciplines,
      educationLevel,
      degree,
      academicTitle,
      qualification,
      professionalDevelopment,
      experience,
      programs,
      order,
      isActive
    } = req.body;

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        fio,
        post,
        disciplines,
        educationLevel,
        degree,
        academicTitle,
        qualification,
        professionalDevelopment,
        experience,
        programs,
        order: parseInt(order) || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });
    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удалить сотрудника
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.employee.delete({
      where: { id }
    });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;