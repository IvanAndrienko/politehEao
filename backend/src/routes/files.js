import express from 'express';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/files - Получить список всех файлов
router.get('/', async (req, res) => {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');

    const getFilesRecursively = (dir, relativePath = '') => {
      const files = [];
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const relPath = path.join(relativePath, item).replace(/\\/g, '/');
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          files.push(...getFilesRecursively(fullPath, relPath));
        } else {
          files.push({
            name: item,
            path: relPath,
            size: stat.size,
            modified: stat.mtime,
            type: path.extname(item).toLowerCase(),
            category: relativePath.split('/')[0] || 'other'
          });
        }
      }

      return files;
    };

    const files = getFilesRecursively(uploadsDir);

    // Получить статистику
    const stats = {
      total: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      byCategory: {
        images: files.filter(f => f.category === 'images').length,
        documents: files.filter(f => f.category === 'documents').length,
        other: files.filter(f => !['images', 'documents'].includes(f.category)).length
      }
    };

    res.json({ files, stats });
  } catch (error) {
    console.error('Ошибка получения файлов:', error);
    res.status(500).json({ message: 'Ошибка получения файлов' });
  }
});

// DELETE /api/files - Удалить файл
router.delete('/', async (req, res) => {
  try {
    const filename = req.query.path;
    const filePath = path.join(process.cwd(), 'uploads', filename);

    // Проверить, используется ли файл в новостях
    const newsWithFile = await prisma.news.findMany({
      where: {
        OR: [
          { previewImage: filename },
          { images: { has: filename } },
          { attachments: { has: filename } }
        ]
      }
    });

    // Проверить использование в других таблицах
    const documentsWithFile = await prisma.document.findMany({
      where: { fileUrl: filename }
    });

    const studentDocumentsWithFile = await prisma.studentDocument.findMany({
      where: { fileUrl: filename }
    });

    const structureDocumentsWithFile = await prisma.structureDocument.findMany({
      where: { fileUrl: filename }
    });

    const totalUsage = newsWithFile.length + documentsWithFile.length +
                      studentDocumentsWithFile.length + structureDocumentsWithFile.length;

    if (totalUsage > 0) {
      return res.status(400).json({
        message: 'Файл используется в системе и не может быть удален',
        usage: {
          news: newsWithFile.length,
          documents: documentsWithFile.length,
          studentDocuments: studentDocumentsWithFile.length,
          structureDocuments: structureDocumentsWithFile.length
        }
      });
    }

    // Проверить существование файла
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Файл не найден' });
    }

    // Удалить файл
    fs.unlinkSync(filePath);

    res.json({ message: 'Файл удален' });
  } catch (error) {
    console.error('Ошибка удаления файла:', error);
    res.status(500).json({ message: 'Ошибка удаления файла' });
  }
});

// GET /api/files/stats - Получить статистику файлов
router.get('/stats', async (req, res) => {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');

    const getDirectoryStats = (dirPath) => {
      let totalSize = 0;
      let fileCount = 0;

      const walkDir = (dir) => {
        if (!fs.existsSync(dir)) return;

        const items = fs.readdirSync(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            walkDir(fullPath);
          } else {
            totalSize += stat.size;
            fileCount++;
          }
        }
      };

      walkDir(dirPath);
      return { totalSize, fileCount };
    };

    const imagesStats = getDirectoryStats(path.join(uploadsDir, 'images'));
    const documentsStats = getDirectoryStats(path.join(uploadsDir, 'documents'));

    res.json({
      images: imagesStats,
      documents: documentsStats,
      total: {
        totalSize: imagesStats.totalSize + documentsStats.totalSize,
        fileCount: imagesStats.fileCount + documentsStats.fileCount
      }
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ message: 'Ошибка получения статистики' });
  }
});

export default router;