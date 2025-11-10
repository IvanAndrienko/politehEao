import express from 'express';
import { uploadImages, uploadDocuments } from '../file-upload-middleware.js';

const router = express.Router();

// Загрузка превью изображений для новостей
router.post('/news/preview', uploadImages.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    res.json({
      url: `/uploads/images/${req.file.filename}`,
      filename: req.file.filename,
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
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

    res.json({
      files: req.files.map(file => ({
        url: `/uploads/images/${file.filename}`,
        filename: file.filename,
        name: file.originalname,
        size: file.size,
        type: file.mimetype
      }))
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

    res.json({
      files: req.files.map(file => ({
        url: `/uploads/documents/${file.filename}`,
        filename: file.filename,
        name: file.originalname,
        size: file.size,
        type: file.mimetype
      }))
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

    res.json({
      files: req.files.map(file => ({
        url: `/uploads/images/${file.filename}`,
        filename: file.filename,
        name: file.originalname,
        size: file.size,
        type: file.mimetype
      }))
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

    res.json({
      files: req.files.map(file => ({
        url: `/uploads/images/${file.filename}`,
        filename: file.filename,
        name: file.originalname,
        size: file.size,
        type: file.mimetype
      }))
    });
  } catch (error) {
    console.error('Ошибка загрузки изображений студенческой жизни:', error);
    res.status(500).json({ message: 'Ошибка загрузки файлов' });
  }
});

// Загрузка документов для образования
router.post('/education/documents', uploadDocuments.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    // Используем декодированное имя из middleware
    res.json({
      url: `/uploads/documents/${req.file.filename}`,
      filename: req.file.filename,
      name: req.file.originalname, // Это уже декодированное имя из middleware
      size: req.file.size,
      type: req.file.mimetype
    });
  } catch (error) {
    console.error('Ошибка загрузки документа образования:', error);
    res.status(500).json({ message: 'Ошибка загрузки файла' });
  }
});

// Загрузка файлов для образовательных программ
router.post('/education/programs', uploadDocuments.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    // Используем декодированное имя из middleware
    res.json({
      url: `/uploads/documents/${req.file.filename}`,
      filename: req.file.filename,
      name: req.file.originalname, // Это уже декодированное имя из middleware
      size: req.file.size,
      type: req.file.mimetype
    });
  } catch (error) {
    console.error('Ошибка загрузки файла программы:', error);
    res.status(500).json({ message: 'Ошибка загрузки файла' });
  }
});

export default router;