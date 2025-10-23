import express from 'express';
import { uploadImages, uploadDocuments } from '../file-upload-middleware.js';

const router = express.Router();

// Загрузка превью изображений для новостей
router.post('/news/preview', uploadImages.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    const url = `/uploads/images/${req.file.filename}`;
    res.json({
      url,
      filename: req.file.filename,
      originalName: req.file.originalname
    });
  } catch (error) {
    console.error('Ошибка загрузки превью:', error);
    res.status(500).json({ message: 'Ошибка загрузки файла' });
  }
});

// Загрузка изображений для новости (несколько файлов)
router.post('/news/images', uploadImages.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Файлы не загружены' });
    }

    const urls = req.files.map(file => `/uploads/images/${file.filename}`);
    const files = req.files.map(file => ({
      url: `/uploads/images/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname
    }));

    res.json({
      urls,
      files
    });
  } catch (error) {
    console.error('Ошибка загрузки изображений:', error);
    res.status(500).json({ message: 'Ошибка загрузки файлов' });
  }
});

// Загрузка документов/вложений для новости
router.post('/news/documents', uploadDocuments.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Файлы не загружены' });
    }

    const urls = req.files.map(file => `/uploads/documents/${file.filename}`);
    const files = req.files.map(file => ({
      url: `/uploads/documents/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname
    }));

    res.json({
      urls,
      files
    });
  } catch (error) {
    console.error('Ошибка загрузки документов:', error);
    res.status(500).json({ message: 'Ошибка загрузки файлов' });
  }
});

// Загрузка изображений для общежития
router.post('/dormitory/images', uploadImages.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Файлы не загружены' });
    }

    const urls = req.files.map(file => `/uploads/images/${file.filename}`);
    const files = req.files.map(file => ({
      url: `/uploads/images/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname
    }));

    res.json({
      urls,
      files
    });
  } catch (error) {
    console.error('Ошибка загрузки изображений общежития:', error);
    res.status(500).json({ message: 'Ошибка загрузки файлов' });
  }
});

// Загрузка изображений для студенческой жизни
router.post('/student-life/images', uploadImages.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Файлы не загружены' });
    }

    const filenames = req.files.map(file => file.filename);

    res.json({
      filenames
    });
  } catch (error) {
    console.error('Ошибка загрузки изображений студенческой жизни:', error);
    res.status(500).json({ message: 'Ошибка загрузки файлов' });
  }
});

export default router;