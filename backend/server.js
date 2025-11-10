import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import authRouter from "./src/routes/auth.js";
import settingsRouter from "./src/routes/settings.js";
import newsRouter from "./src/routes/news.js";
import uploadRouter from "./src/routes/file-upload-routes.js";
import filesRouter from "./src/routes/files.js";
import admissionRouter from "./src/routes/admission.js";
import scheduleRouter from "./src/routes/schedule.js";
import studentsRouter from "./src/routes/students.js";
import studentDocumentsRouter from "./src/routes/student-documents.js";
import organizationRouter from "./src/routes/about/organization.js";
import homeSliderRouter from "./src/routes/home-slider.js";
import studentLifeRouter from "./src/routes/student-life.js";
import structureRouter from "./src/routes/about/structure.js";
import structureDocumentsRouter from "./src/routes/about/structure-documents.js";
import documentsRouter from "./src/routes/about/documents.js";
import educationRouter from "./src/routes/about/education.js";
import adminEducationRouter from "./src/routes/about/admin-education.js";
import adminManagersRouter from "./src/routes/admin-managers.js";
import managersRouter from "./src/routes/managers.js";
import searchRouter from "./src/routes/search.js";
import objectsRouter from "./src/routes/objects.js";
import employeesRouter from "./src/routes/employees.js";
import internationalRouter from "./src/routes/international.js";
import grantsRouter from "./src/routes/grants.js";
import paidEduRouter from "./src/routes/paid-edu.js";
import budgetRouter from "./src/routes/budget.js";
import vacantPlacesRouter from "./src/routes/vacant-places.js";
import cateringRouter from "./src/routes/catering.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Статические файлы для загрузок с обработкой ошибок
app.use('/uploads', (req, res, next) => {
  // Декодируем URL, так как браузер кодирует кириллические символы
  const decodedPath = decodeURIComponent(req.path);
  const filePath = path.join(process.cwd(), 'uploads', decodedPath);

  // Устанавливаем правильные заголовки для кириллических имен файлов
  if (fs.existsSync(filePath)) {
    const fileName = path.basename(filePath);
    const encodedFileName = encodeURIComponent(fileName);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedFileName}`);
  }

  // Проверяем существование файла
  if (!fs.existsSync(filePath)) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Файл не найден</title>
        <style>
          body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            color: #374151;
          }
          .container {
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            max-width: 400px;
          }
          .icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          h1 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #ef4444;
          }
          p {
            color: #6b7280;
            margin-bottom: 1.5rem;
          }
          .btn {
            background-color: #3b82f6;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            text-decoration: none;
            display: inline-block;
            transition: background-color 0.2s;
          }
          .btn:hover {
            background-color: #2563eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">📁</div>
          <h1>Файл не найден</h1>
          <p>К сожалению, запрашиваемый файл больше не существует или был удален.</p>
          <a href="/" class="btn">Вернуться на главную</a>
        </div>
      </body>
      </html>
    `);
  }

  next();
}, express.static('uploads'));

// Роуты аутентификации
app.use('/api/auth', authRouter);

// Роуты настроек сайта
app.use('/api/settings', settingsRouter);

// Роуты новостей
app.use('/api/news', newsRouter);

// Роуты загрузки файлов
app.use('/api/upload', uploadRouter);

// Роуты управления файлами
app.use('/api/files', filesRouter);

// Роуты приемной комиссии
app.use('/api/admission', admissionRouter);

// Роуты расписания
app.use('/api/schedule', scheduleRouter);

// Роуты студенческих сервисов
app.use('/api/students', studentsRouter);

// Роуты документов для студентов
app.use('/api/student-documents', studentDocumentsRouter);

// Роуты студенческой жизни
app.use('/api/student-life', studentLifeRouter);

// Роуты слайдера главной страницы
app.use('/api/home-slider', homeSliderRouter);

// Роуты информации об организации
app.use('/api/organization', organizationRouter);

// Роуты структуры и органов управления
app.use('/api/structure', structureRouter);

// Роуты документов структуры
app.use('/api/structure-documents', structureDocumentsRouter);

// Роуты документов
app.use('/api/documents', documentsRouter);

// Роуты образования
app.use('/api/education', educationRouter);

// Роуты админки образования
app.use('/api/admin/education', adminEducationRouter);

// Роуты админки руководства
app.use('/api/admin/managers', adminManagersRouter);

// Роуты руководства для фронта
app.use('/api/managers', managersRouter);

// Роуты поиска
app.use('/api', searchRouter);

// Роуты материально-технического обеспечения
app.use('/api/objects', objectsRouter);

// Роуты педагогического состава
app.use('/api/employees', employeesRouter);

// Роуты международного сотрудничества
app.use('/api/international', internationalRouter);

// Роуты стипендий и мер поддержки
app.use('/api/grants', grantsRouter);

// Роуты платных образовательных услуг
app.use('/api/paid-edu', paidEduRouter);

// Роуты финансово-хозяйственной деятельности
app.use('/api/budget', budgetRouter);

// Роуты вакантных мест
app.use('/api/vacant-places', vacantPlacesRouter);

// Роуты организации питания
app.use('/api/catering', cateringRouter);

// Обработка ошибок multer
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Файл слишком большой (макс. 10МБ)' });
  }
  next(err);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен: http://localhost:${PORT}`));
