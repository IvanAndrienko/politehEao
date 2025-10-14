import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Папки для загрузок
const uploadsDir = path.join(__dirname, '..', 'uploads');
const imagesDir = path.join(uploadsDir, 'images');
const documentsDir = path.join(uploadsDir, 'documents');

// Создаем папки если не существуют
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

// Функция для декодирования русских символов в имени файла
const decodeFileName = (originalName) => {
  return Buffer.from(originalName, 'latin1').toString('utf8');
};

// Настройки хранилища для изображений
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const originalName = decodeFileName(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Настройки хранилища для документов
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsDir);
  },
  filename: (req, file, cb) => {
    const originalName = decodeFileName(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(originalName);
    const name = path.basename(originalName, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Фильтр для изображений
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Только изображения разрешены'), false);
  }
};

// Фильтр для документов
const documentFilter = (req, file, cb) => {
  const allowedTypes = [
    // PDF
    'application/pdf',
    // Microsoft Word
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // Microsoft Excel
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // Microsoft PowerPoint
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // OpenOffice/LibreOffice
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.presentation',
    // Текстовые файлы
    'text/plain',
    'text/csv',
    'text/html',
    'text/rtf',
    // Другие распространенные форматы
    'application/rtf',
    'application/xml',
    'text/xml'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый тип файла. Разрешены: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ODT, ODS, ODP, TXT, CSV, RTF'), false);
  }
};

// Middleware для загрузки изображений
export const uploadImages = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Middleware для загрузки документов
export const uploadDocuments = multer({
  storage: documentStorage,
  fileFilter: documentFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});