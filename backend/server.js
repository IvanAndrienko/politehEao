import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import apicache from "apicache";
import authMiddleware from "./src/middleware/auth.js";
import authRouter from "./src/routes/auth.js";
import settingsRouter from "./src/routes/settings.js";
import newsRouter from "./src/routes/news.js";
import uploadRouter from "./src/routes/file-upload-routes.js";
import filesRouter from "./src/routes/files.js";
import admissionRouter from "./src/routes/admission.js";
import scheduleRouter from "./src/routes/schedule.js";
import studentsRouter from "./src/routes/students.js";
import studentDocumentsRouter from "./src/routes/student-documents.js";
import studentLibraryRouter from "./src/routes/student-library.js";
import pagesRouter from "./src/routes/pages.js";
import organizationRouter from "./src/routes/about/organization.js";
import homeSliderRouter from "./src/routes/home-slider.js";
import pageDataRouter from "./src/routes/page-data.js";
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

// РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ РєСЌС€РёСЂРѕРІР°РЅРёСЏ
const cache = apicache.middleware;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Р Р°Р·РЅС‹Рµ Р»РёРјРёС‚С‹ РґР»СЏ СЂР°Р·РЅС‹С… С‚РёРїРѕРІ Р·Р°РїСЂРѕСЃРѕРІ
const contentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 РјРёРЅСѓС‚
  max: 1000, // 1000 Р·Р°РїСЂРѕСЃРѕРІ РґР»СЏ РєРѕРЅС‚РµРЅС‚Р°
  message: "РЎР»РёС€РєРѕРј РјРЅРѕРіРѕ Р·Р°РїСЂРѕСЃРѕРІ РЅР° РєРѕРЅС‚РµРЅС‚, РїРѕРїСЂРѕР±СѓР№С‚Рµ РїРѕР·Р¶Рµ.",
  skip: (req) => {
    // РќРµ РїСЂРёРјРµРЅСЏРµРј Рє СЃС‚Р°С‚РёС‡РµСЃРєРёРј С„Р°Р№Р»Р°Рј
    return req.path.startsWith('/uploads/') ||
           req.path.startsWith('/static/');
  }
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 РјРёРЅСѓС‚
  max: 120, // РўРѕР»СЊРєРѕ 10 РїРѕРїС‹С‚РѕРє РґР»СЏ С„РѕСЂРј/Р°РІС‚РѕСЂРёР·Р°С†РёРё
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  handler: (req, res) => {
    res.status(429).json({
      message: "РЎР»РёС€РєРѕРј РјРЅРѕРіРѕ РїРѕРїС‹С‚РѕРє, РїРѕРґРѕР¶РґРёС‚Рµ 15 РјРёРЅСѓС‚."
    });
  }
});

// РџСЂРёРјРµРЅСЏРµРј СЂР°Р·РЅС‹Рµ Р»РёРјРёС‚С‹ Рє СЂР°Р·РЅС‹Рј СЂРѕСѓС‚Р°Рј
app.use('/api/auth', strictLimiter);
app.use('/api/upload', strictLimiter);
app.use('/api/admin', strictLimiter);
app.use(contentLimiter);

// CORS configuration - РІСЂРµРјРµРЅРЅРѕ СЂР°Р·СЂРµС€Р°РµРј РІСЃРµ РґР»СЏ РѕС‚Р»Р°РґРєРё
const corsOptions = {
  origin: true, // Р Р°Р·СЂРµС€Р°РµРј РІСЃРµ origins РґР»СЏ РѕС‚Р»Р°РґРєРё
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const AUTH_FREE_PATHS = new Set(['/api/auth/login']);

app.use((req, res, next) => {
  if (!MUTATING_METHODS.has(req.method) || !req.path.startsWith('/api')) {
    return next();
  }

  if (AUTH_FREE_PATHS.has(req.path)) {
    return next();
  }

  return authMiddleware(req, res, next);
});

// РЎС‚Р°С‚РёС‡РµСЃРєРёРµ С„Р°Р№Р»С‹ РґР»СЏ Р·Р°РіСЂСѓР·РѕРє СЃ РѕР±СЂР°Р±РѕС‚РєРѕР№ РѕС€РёР±РѕРє
app.use('/uploads', (req, res, next) => {
  // Р”РµРєРѕРґРёСЂСѓРµРј URL, С‚Р°Рє РєР°Рє Р±СЂР°СѓР·РµСЂ РєРѕРґРёСЂСѓРµС‚ РєРёСЂРёР»Р»РёС‡РµСЃРєРёРµ СЃРёРјРІРѕР»С‹
  const decodedPath = decodeURIComponent(req.path);
  const filePath = path.join(process.cwd(), 'uploads', decodedPath);

  // РЈСЃС‚Р°РЅР°РІР»РёРІР°РµРј РїСЂР°РІРёР»СЊРЅС‹Рµ Р·Р°РіРѕР»РѕРІРєРё РґР»СЏ РєРёСЂРёР»Р»РёС‡РµСЃРєРёС… РёРјРµРЅ С„Р°Р№Р»РѕРІ
  if (fs.existsSync(filePath)) {
    const fileName = path.basename(filePath);
    const encodedFileName = encodeURIComponent(fileName);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedFileName}`);
    // Р”РѕР±Р°РІР»СЏРµРј CORS Р·Р°РіРѕР»РѕРІРєРё РґР»СЏ РёР·РѕР±СЂР°Р¶РµРЅРёР№
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }

  // РџСЂРѕРІРµСЂСЏРµРј СЃСѓС‰РµСЃС‚РІРѕРІР°РЅРёРµ С„Р°Р№Р»Р°
  if (!fs.existsSync(filePath)) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Р¤Р°Р№Р» РЅРµ РЅР°Р№РґРµРЅ</title>
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
          <div class="icon">рџ“Ѓ</div>
          <h1>Р¤Р°Р№Р» РЅРµ РЅР°Р№РґРµРЅ</h1>
          <p>Рљ СЃРѕР¶Р°Р»РµРЅРёСЋ, Р·Р°РїСЂР°С€РёРІР°РµРјС‹Р№ С„Р°Р№Р» Р±РѕР»СЊС€Рµ РЅРµ СЃСѓС‰РµСЃС‚РІСѓРµС‚ РёР»Рё Р±С‹Р» СѓРґР°Р»РµРЅ.</p>
          <a href="/" class="btn">Р’РµСЂРЅСѓС‚СЊСЃСЏ РЅР° РіР»Р°РІРЅСѓСЋ</a>
        </div>
      </body>
      </html>
    `);
  }

  next();
}, express.static('uploads'));

// Р РѕСѓС‚С‹ Р°СѓС‚РµРЅС‚РёС„РёРєР°С†РёРё
app.use('/api/auth', authRouter);

// Р РѕСѓС‚С‹ РЅР°СЃС‚СЂРѕРµРє СЃР°Р№С‚Р° СЃ РєСЌС€РёСЂРѕРІР°РЅРёРµРј
app.use('/api/settings', cache('30 minutes'), settingsRouter);

// Р РѕСѓС‚С‹ РЅРѕРІРѕСЃС‚РµР№ СЃ СѓРјРЅС‹Рј РєСЌС€РёСЂРѕРІР°РЅРёРµРј
app.use('/api/news', (req, res, next) => {
  const authHeader = req.headers.authorization;
  const hasAuth = authHeader && authHeader.startsWith('Bearer ');

  if (hasAuth) {
    // Р”Р»СЏ Р°РґРјРёРЅРѕРІ - РќР• РєСЌС€РёСЂСѓРµРј РІРѕРѕР±С‰Рµ
    next();
  } else {
    // Р”Р»СЏ РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№ - РєСЌС€ 1 РјРёРЅСѓС‚Сѓ
    cache('1 minute')(req, res, next);
  }
}, newsRouter);

// Р РѕСѓС‚С‹ Р·Р°РіСЂСѓР·РєРё С„Р°Р№Р»РѕРІ
app.use('/api/upload', uploadRouter);

// Р РѕСѓС‚С‹ СѓРїСЂР°РІР»РµРЅРёСЏ С„Р°Р№Р»Р°РјРё
app.use('/api/files', filesRouter);

// Р РѕСѓС‚С‹ РїСЂРёРµРјРЅРѕР№ РєРѕРјРёСЃСЃРёРё
app.use('/api/admission', admissionRouter);

// Р РѕСѓС‚С‹ СЂР°СЃРїРёСЃР°РЅРёСЏ
app.use('/api/schedule', scheduleRouter);

// Р РѕСѓС‚С‹ СЃС‚СѓРґРµРЅС‡РµСЃРєРёС… СЃРµСЂРІРёСЃРѕРІ
app.use('/api/students', studentsRouter);
app.use('/api/students/library', studentLibraryRouter);
app.use('/api/pages', pagesRouter);

// Р РѕСѓС‚С‹ РґРѕРєСѓРјРµРЅС‚РѕРІ РґР»СЏ СЃС‚СѓРґРµРЅС‚РѕРІ
app.use('/api/student-documents', studentDocumentsRouter);

// Р РѕСѓС‚С‹ СЃС‚СѓРґРµРЅС‡РµСЃРєРѕР№ Р¶РёР·РЅРё
app.use('/api/student-life', studentLifeRouter);

// Р РѕСѓС‚С‹ СЃР»Р°Р№РґРµСЂР° РіР»Р°РІРЅРѕР№ СЃС‚СЂР°РЅРёС†С‹ СЃ РєСЌС€РёСЂРѕРІР°РЅРёРµРј
app.use('/api/home-slider', cache('10 minutes'), homeSliderRouter);

// Р РѕСѓС‚С‹ РѕР±СЉРµРґРёРЅРµРЅРЅС‹С… РґР°РЅРЅС‹С… СЃС‚СЂР°РЅРёС†С‹ СЃ СѓРјРЅС‹Рј РєСЌС€РёСЂРѕРІР°РЅРёРµРј
app.use('/api/page-data', (req, res, next) => {
  // РџСЂРѕРІРµСЂСЏРµРј, Р°РІС‚РѕСЂРёР·РѕРІР°РЅ Р»Рё РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ (РµСЃС‚СЊ Р»Рё С‚РѕРєРµРЅ РІ Р·Р°РіРѕР»РѕРІРєР°С…)
  const authHeader = req.headers.authorization;
  const hasAuth = authHeader && authHeader.startsWith('Bearer ');

  if (hasAuth) {
    // Р”Р»СЏ Р°РІС‚РѕСЂРёР·РѕРІР°РЅРЅС‹С… РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№ (Р°РґРјРёРЅРѕРІ) - РќР• РєСЌС€РёСЂСѓРµРј РІРѕРѕР±С‰Рµ
    next();
  } else {
    // Р”Р»СЏ РѕР±С‹С‡РЅС‹С… РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№ - РєСЌС€ 1 РјРёРЅСѓС‚Сѓ
    cache('1 minute')(req, res, next);
  }
}, pageDataRouter);

// Р РѕСѓС‚С‹ РёРЅС„РѕСЂРјР°С†РёРё РѕР± РѕСЂРіР°РЅРёР·Р°С†РёРё
app.use('/api/organization', organizationRouter);

// Р РѕСѓС‚С‹ СЃС‚СЂСѓРєС‚СѓСЂС‹ Рё РѕСЂРіР°РЅРѕРІ СѓРїСЂР°РІР»РµРЅРёСЏ
app.use('/api/structure', structureRouter);

// Р РѕСѓС‚С‹ РґРѕРєСѓРјРµРЅС‚РѕРІ СЃС‚СЂСѓРєС‚СѓСЂС‹
app.use('/api/structure-documents', structureDocumentsRouter);

// Р РѕСѓС‚С‹ РґРѕРєСѓРјРµРЅС‚РѕРІ
app.use('/api/documents', documentsRouter);

// Р РѕСѓС‚С‹ РѕР±СЂР°Р·РѕРІР°РЅРёСЏ
app.use('/api/education', educationRouter);

// Р РѕСѓС‚С‹ Р°РґРјРёРЅРєРё РѕР±СЂР°Р·РѕРІР°РЅРёСЏ
app.use('/api/admin/education', adminEducationRouter);

// Р РѕСѓС‚С‹ Р°РґРјРёРЅРєРё СЂСѓРєРѕРІРѕРґСЃС‚РІР°
app.use('/api/admin/managers', adminManagersRouter);

// Р РѕСѓС‚С‹ СЂСѓРєРѕРІРѕРґСЃС‚РІР° РґР»СЏ С„СЂРѕРЅС‚Р°
app.use('/api/managers', managersRouter);

// Р РѕСѓС‚С‹ РїРѕРёСЃРєР°
app.use('/api', searchRouter);

// Р РѕСѓС‚С‹ РјР°С‚РµСЂРёР°Р»СЊРЅРѕ-С‚РµС…РЅРёС‡РµСЃРєРѕРіРѕ РѕР±РµСЃРїРµС‡РµРЅРёСЏ
app.use('/api/objects', objectsRouter);

// Р РѕСѓС‚С‹ РїРµРґР°РіРѕРіРёС‡РµСЃРєРѕРіРѕ СЃРѕСЃС‚Р°РІР°
app.use('/api/employees', employeesRouter);

// Р РѕСѓС‚С‹ РјРµР¶РґСѓРЅР°СЂРѕРґРЅРѕРіРѕ СЃРѕС‚СЂСѓРґРЅРёС‡РµСЃС‚РІР°
app.use('/api/international', internationalRouter);

// Р РѕСѓС‚С‹ СЃС‚РёРїРµРЅРґРёР№ Рё РјРµСЂ РїРѕРґРґРµСЂР¶РєРё
app.use('/api/grants', grantsRouter);

// Р РѕСѓС‚С‹ РїР»Р°С‚РЅС‹С… РѕР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅС‹С… СѓСЃР»СѓРі
app.use('/api/paid-edu', paidEduRouter);

// Р РѕСѓС‚С‹ С„РёРЅР°РЅСЃРѕРІРѕ-С…РѕР·СЏР№СЃС‚РІРµРЅРЅРѕР№ РґРµСЏС‚РµР»СЊРЅРѕСЃС‚Рё
app.use('/api/budget', budgetRouter);

// Р РѕСѓС‚С‹ РІР°РєР°РЅС‚РЅС‹С… РјРµСЃС‚
app.use('/api/vacant-places', vacantPlacesRouter);

// Р РѕСѓС‚С‹ РѕСЂРіР°РЅРёР·Р°С†РёРё РїРёС‚Р°РЅРёСЏ
app.use('/api/catering', cateringRouter);

// РћР±СЂР°Р±РѕС‚РєР° РѕС€РёР±РѕРє multer
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    const limitMb = err.limit
      ? Math.round((err.limit / (1024 * 1024)) * 10) / 10
      : null;
    const message = limitMb
      ? `пїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ (пїЅпїЅпїЅпїЅ. ${limitMb} пїЅпїЅ)`
      : 'пїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ пїЅпїЅпїЅпїЅпїЅпїЅпїЅ';
    return res.status(400).json({ error: message });
  }
  next(err);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`рџљЂ РЎРµСЂРІРµСЂ Р·Р°РїСѓС‰РµРЅ: http://localhost:${PORT}`));


