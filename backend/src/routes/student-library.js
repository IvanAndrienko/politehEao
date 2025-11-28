import express from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { uploadDocuments } from '../file-upload-middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

const buildSearchFilter = (query) => {
  if (!query) return undefined;
  const value = query.trim();
  if (!value) return undefined;

  return {
    OR: [
      { title: { contains: value, mode: 'insensitive' } },
      { description: { contains: value, mode: 'insensitive' } },
      {
        materials: {
          some: {
            title: { contains: value, mode: 'insensitive' }
          }
        }
      }
    ]
  };
};

const deletePhysicalFile = (fileUrl) => {
  if (!fileUrl) return;
  const filePath = path.join(process.cwd(), 'uploads', fileUrl);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

router.get('/disciplines', async (req, res) => {
  try {
    const filter = buildSearchFilter(req.query.q);
    const disciplines = await prisma.studentDiscipline.findMany({
      where: {
        isActive: true,
        ...(filter || {})
      },
      orderBy: [{ order: 'asc' }, { title: 'asc' }],
      include: {
        materials: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    res.json(disciplines);
  } catch (error) {
    console.error('Ошибка получения дисциплин:', error);
    res.status(500).json({ message: 'Не удалось получить дисциплины' });
  }
});

router.get('/disciplines/all', async (req, res) => {
  try {
    const filter = buildSearchFilter(req.query.q);
    const disciplines = await prisma.studentDiscipline.findMany({
      where: filter || undefined,
      orderBy: [{ order: 'asc' }, { title: 'asc' }],
      include: {
        materials: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    res.json(disciplines);
  } catch (error) {
    console.error('Ошибка получения дисциплин (админ):', error);
    res.status(500).json({ message: 'Не удалось получить дисциплины' });
  }
});

router.post('/disciplines', async (req, res) => {
  try {
    const { title, description, order = 0, isActive = true } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: 'Название дисциплины обязательно' });
    }

    const discipline = await prisma.studentDiscipline.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        order: Number(order) || 0,
        isActive: Boolean(isActive)
      }
    });

    res.json(discipline);
  } catch (error) {
    console.error('Ошибка создания дисциплины:', error);
    res.status(500).json({ message: 'Не удалось создать дисциплину' });
  }
});

router.put('/disciplines/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, order, isActive } = req.body;

  try {
    const discipline = await prisma.studentDiscipline.update({
      where: { id },
      data: {
        title: title?.trim(),
        description: description?.trim() || null,
        order: order !== undefined ? Number(order) : undefined,
        isActive: typeof isActive === 'boolean' ? isActive : isActive === 'true'
      }
    });

    res.json(discipline);
  } catch (error) {
    console.error('Ошибка обновления дисциплины:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Дисциплина не найдена' });
    } else {
      res.status(500).json({ message: 'Не удалось обновить дисциплину' });
    }
  }
});

router.delete('/disciplines/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const discipline = await prisma.studentDiscipline.findUnique({
      where: { id },
      include: { materials: true }
    });

    if (!discipline) {
      return res.status(404).json({ message: 'Дисциплина не найдена' });
    }

    discipline.materials.forEach((material) => deletePhysicalFile(material.fileUrl));

    await prisma.studentDiscipline.delete({
      where: { id }
    });

    res.json({ message: 'Дисциплина удалена' });
  } catch (error) {
    console.error('Ошибка удаления дисциплины:', error);
    res.status(500).json({ message: 'Не удалось удалить дисциплину' });
  }
});

router.post(
  '/disciplines/:disciplineId/materials',
  uploadDocuments.single('file'),
  async (req, res) => {
    const { disciplineId } = req.params;

    try {
      const discipline = await prisma.studentDiscipline.findUnique({
        where: { id: disciplineId }
      });

      if (!discipline) {
        return res.status(404).json({ message: 'Дисциплина не найдена' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'Файл обязателен' });
      }

      const title = req.body.title?.trim() || req.file.originalname;

      const material = await prisma.disciplineMaterial.create({
        data: {
          disciplineId,
          title,
          fileUrl: path.join('documents', req.file.filename).replace(/\\/g, '/'),
          fileName: req.file.originalname,
          fileSize: req.file.size,
          fileType: req.file.mimetype
        }
      });

      res.json(material);
    } catch (error) {
      console.error('Ошибка загрузки методички:', error);
      res.status(500).json({ message: 'Не удалось загрузить файл' });
    }
  }
);

router.put('/materials/:id', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const material = await prisma.disciplineMaterial.update({
      where: { id },
      data: {
        title: title?.trim() || undefined
      }
    });

    res.json(material);
  } catch (error) {
    console.error('Ошибка обновления методички:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Методичка не найдена' });
    } else {
      res.status(500).json({ message: 'Не удалось обновить методичку' });
    }
  }
});

router.delete('/materials/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const material = await prisma.disciplineMaterial.findUnique({
      where: { id }
    });

    if (!material) {
      return res.status(404).json({ message: 'Методичка не найдена' });
    }

    deletePhysicalFile(material.fileUrl);

    await prisma.disciplineMaterial.delete({
      where: { id }
    });

    res.json({ message: 'Методичка удалена' });
  } catch (error) {
    console.error('Ошибка удаления методички:', error);
    res.status(500).json({ message: 'Не удалось удалить методичку' });
  }
});

export default router;
