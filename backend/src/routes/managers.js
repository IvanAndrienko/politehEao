import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Получить всех руководителей для фронта
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

export default router;