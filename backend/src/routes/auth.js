import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();
console.log('Auth router initialized');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  console.log('Login attempt:', { username: req.body.username, ip: req.ip });
  const { username, password } = req.body;

  try {
    console.log('Finding admin:', username);
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      console.log('Admin not found:', username);
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    console.log('Comparing password');
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    console.log('Generating token');
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login successful');
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Не удалось выполнить вход' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        createdAt: true
      }
    });

    if (!admin) {
      return res.status(404).json({ message: 'Администратор не найден' });
    }

    res.json({ admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось проверить сессию' });
  }
});

export default router;
