import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Папки для загрузок - используем uploads в корне проекта
const uploadsDir = path.join(process.cwd(), 'uploads');
const imagesDir = path.join(uploadsDir, 'images');
const documentsDir = path.join(uploadsDir, 'documents');

// Создаем папки если не существуют
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}

// Функция для декодирования русских символов и санитизации имени файла
const sanitizeFileName = (originalName) => {
  // Перекодировка имени файла из latin1 в utf8 (multer передает в latin1)
  let decoded;
  try {
    decoded = Buffer.from(originalName, 'latin1').toString('utf8');
  } catch (e) {
    decoded = originalName;
  }

  // Получаем расширение и нормализуем его
  const ext = path.extname(decoded).toLowerCase();

  // Проверяем наличие расширения
  if (!ext) {
    throw new Error('Файл должен иметь расширение');
  }

  // Получаем имя без расширения и санитизируем
  const name = path.basename(decoded, path.extname(decoded))
    .replace(/[^a-zA-Z0-9а-яА-ЯёЁ\s\-_.]/g, '-') // Заменяем спецсимволы на дефисы
    .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
    .replace(/-+/g, '-') // Убираем множественные дефисы
    .replace(/^-|-$/g, '') // Убираем дефисы в начале и конце
    .substring(0, 100); // Ограничиваем длину имени файла

  // Возвращаем оригинальное имя для отображения и санитизированное для сохранения
  return { name, ext, originalName: decoded };
};

// Настройки хранилища для изображений
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    try {
      const { name, ext } = sanitizeFileName(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${name}-${uniqueSuffix}${ext}`);
    } catch (error) {
      cb(error);
    }
  }
});

// Настройки хранилища для документов
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsDir);
  },
  filename: (req, file, cb) => {
    try {
      const { name, ext, originalName } = sanitizeFileName(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      // Сохраняем оригинальное имя для отображения, но используем санитизированное для файла
      file.originalname = originalName; // Перезаписываем для возврата в API
      cb(null, `${name}-${uniqueSuffix}${ext}`);
    } catch (error) {
      cb(error);
    }
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
    fileSize: 5 * 1024 * 1024, // 5MB на файл
    files: 50, // Максимум 50 файлов
    fieldSize: 50 * 1024 * 1024 // 50MB общий размер поля
  }
});

// Middleware для загрузки документов
export const uploadDocuments = multer({
  storage: documentStorage,
  fileFilter: documentFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB на файл
    files: 50, // Максимум 50 файлов
    fieldSize: 100 * 1024 * 1024 // 100MB общий размер поля
  }
});

// Функция для проверки количества файлов перед загрузкой
export const validateFileCount = (maxFiles) => {
  return (req, res, next) => {
    if (req.files && req.files.length > maxFiles) {
      return res.status(400).json({
        message: `Превышено максимальное количество файлов. Максимум: ${maxFiles} файлов.`
      });
    }
    next();
  };
};