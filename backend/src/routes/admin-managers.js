import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Получить всех руководителей
router.get('/', async (req, res) => {
  try {
    const managers = await prisma.manager.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(managers);
  } catch (error) {
    console.error('Error fetching managers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Создать нового руководителя
router.post('/', async (req, res) => {
  try {
    const { fio, post, telephone, email, type, filialName } = req.body;

    const manager = await prisma.manager.create({
      data: {
        fio,
        post,
        telephone,
        email,
        type,
        filialName: type === 'filial' ? filialName : null
      }
    });

    res.json(manager);
  } catch (error) {
    console.error('Error creating manager:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновить руководителя
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fio, post, telephone, email, type, filialName } = req.body;

    const manager = await prisma.manager.update({
      where: { id },
      data: {
        fio,
        post,
        telephone,
        email,
        type,
        filialName: type === 'filial' ? filialName : null
      }
    });

    res.json(manager);
  } catch (error) {
    console.error('Error updating manager:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Manager not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Удалить руководителя
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.manager.delete({
      where: { id }
    });

    res.json({ message: 'Manager deleted successfully' });
  } catch (error) {
    console.error('Error deleting manager:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Manager not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;