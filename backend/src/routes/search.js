import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Поиск по всему контенту
router.get('/search', async (req, res) => {
  try {
    const { q: query, limit = 20 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.json({
        news: [],
        documents: [],
        announcements: [],
        total: 0
      });
    }

    const searchTerm = query.trim().toLowerCase();
    const limitNum = parseInt(limit);

    // Поиск по новостям
    const news = await prisma.news.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { fullText: { contains: searchTerm, mode: 'insensitive' } },
          { shortDescription: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        publishedAt: true,
        previewImage: true
      },
      orderBy: { publishedAt: 'desc' },
      take: limitNum
    });

    // Поиск по документам (используем field как уникальный идентификатор)
    const documents = await prisma.document.findMany({
      where: {
        OR: [
          { field: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        field: true,
        fileUrl: true,
        fileName: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: limitNum
    });

    // Поиск по сотрудникам (Department)
    const employees = await prisma.department.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { fio: { contains: searchTerm, mode: 'insensitive' } },
          { post: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        fio: true,
        post: true,
        phone: true,
        address: true,
        email: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: limitNum
    });

    // Поиск по документам структуры
    const structureDocuments = await prisma.structureDocument.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        title: true,
        description: true,
        fileUrl: true,
        fileName: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: limitNum
    });

    // Поиск по объявлениям
    const announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { content: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        title: true,
        content: true,
        isUrgent: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: limitNum
    });

    // Поиск по образовательным программам
    const educationPrograms = await prisma.educationProgram.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { program: { contains: searchTerm, mode: 'insensitive' } },
          { subjects: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        program: true,
        code: true
      },
      take: limitNum
    });

    res.json({
      news: news.map(item => ({ ...item, title: item.title, type: 'news' })),
      documents: documents.map(item => ({ ...item, title: item.field, description: item.fileName, fileUrl: item.fileUrl, uploadedAt: item.createdAt, type: 'document' })),
      announcements: announcements.map(item => ({ ...item, urgent: item.isUrgent, type: 'announcement' })),
      educationPrograms: educationPrograms.map(item => ({ ...item, title: item.name, description: item.program, code: item.code, type: 'education' })),
      employees: employees.map(item => ({ ...item, title: item.fio, description: `${item.post} - ${item.name}`, type: 'employee' })),
      structureDocuments: structureDocuments.map(item => ({ ...item, title: item.title, description: item.description, fileUrl: item.fileUrl, uploadedAt: item.createdAt, type: 'structure_document' })),
      total: news.length + documents.length + announcements.length + educationPrograms.length + employees.length + structureDocuments.length
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Ошибка поиска' });
  }
});

export default router;