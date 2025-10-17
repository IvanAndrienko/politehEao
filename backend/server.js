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

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен: http://localhost:${PORT}`));
