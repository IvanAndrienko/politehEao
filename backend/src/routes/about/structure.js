import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/structure - получить данные структуры
router.get('/', async (req, res) => {
  try {
    // Получаем структуру с отделами
    const structureWithDepartments = await prisma.structure.findFirst({
      include: {
        departments: true
      }
    });

    // Если данных нет, создаем дефолтные
    if (!structureWithDepartments) {
      const structure = await prisma.structure.create({
        data: {
          managementInfo: 'Учреждение возглавляет директор, назначаемый и освобождаемый от должности Учредителем',
          managementInfo2: 'общее собрание работников и обучающихся Учреждения, педагогический совет',
          managementLocation: 'ЕАО г. Биробиджан, ул. Косникова 1в',
          managementContacts: 'politeh79@post.eao.ru / http://politeheao.ru',
          departments: {
            create: [
              {
                name: 'Администрация техникума',
                fio: 'Калманов Михаил Борисович',
                post: 'Директор',
                phone: '48-0-08',
                address: '679006, ЕАО, г. Биробиджан, ул. Косникова, 1в',
                site: 'http://politeheao.ru',
                email: 'politeh79@post.eao.ru'
              },
              {
                name: 'Учебная часть',
                fio: 'Добровольская Евгения Александровна',
                post: 'Зам. директора по учебно-производственной работе',
                phone: '48-0-46',
                address: '679006, ЕАО, г. Биробиджан, ул. Косникова, 1в',
                site: 'http://politeheao.ru',
                email: 'politeh79@post.eao.ru'
              },
              {
                name: 'Отдел технического обучения',
                fio: 'Громова Анастасия Павловна',
                post: 'Зам. директора по техническому обучению',
                phone: '',
                address: '679006, ЕАО, г. Биробиджан, ул. Косникова, 1в',
                site: 'http://politeheao.ru',
                email: 'politeh79@post.eao.ru'
              },
              {
                name: 'Отдел воспитательной работы',
                fio: 'Белобородова Наталья Борисовна',
                post: 'Зам. директора по учебно-воспитательной работе',
                phone: '48-3-96',
                address: '679006, ЕАО, г. Биробиджан, ул. Косникова, 1в',
                site: 'http://politeheao.ru',
                email: 'politeh79@post.eao.ru'
              },
              {
                name: 'Отдел кадров',
                fio: 'Саханова Елена Михайловна',
                post: 'Специалист по кадрам',
                phone: '48-0-67',
                address: '679006, ЕАО, г. Биробиджан, ул. Косникова, 1в',
                site: 'http://politeheao.ru',
                email: 'politeh79@post.eao.ru'
              },
              {
                name: 'Бухгалтерия',
                fio: 'Зеленская Ольга Ерьесовна',
                post: 'Главный бухгалтер',
                phone: '48-3-28',
                address: '679006, ЕАО, г. Биробиджан, ул. Косникова, 1в',
                site: 'http://politeheao.ru',
                email: 'politeh79@post.eao.ru'
              },
              {
                name: 'Библиотека',
                fio: 'Лысакова Галина Николаевна',
                post: 'Заведующая библиотекой',
                phone: '',
                address: '679006, ЕАО, г. Биробиджан, ул. Косникова, 1в',
                site: 'http://politeheao.ru',
                email: 'politeh79@post.eao.ru'
              },
              {
                name: 'Столовая',
                fio: 'Осадчук Галина Васильевна',
                post: 'Заведующая столовой',
                phone: '',
                address: '679006, ЕАО, г. Биробиджан, ул. Косникова, 1в',
                site: 'http://politeheao.ru',
                email: 'politeh79@post.eao.ru'
              },
              {
                name: 'Общежитие',
                fio: 'Смалюх Оксана Петровна',
                post: 'Заведующая общежитием',
                phone: '48-2-79',
                address: '679006, ЕАО, г. Биробиджан, ул. Косникова, 1в',
                site: 'http://politeheao.ru',
                email: 'politeh79@post.eao.ru'
              },
              {
                name: 'Служба охраны труда',
                fio: 'Белобородова Наталья Борисовна',
                post: 'Специалист по охране труда',
                phone: '48-3-96',
                address: '679006, ЕАО, г. Биробиджан, ул. Косникова, 1в',
                site: 'http://politeheao.ru',
                email: 'politeh79@post.eao.ru'
              }
            ]
          }
        },
        include: {
          departments: true
        }
      });
      res.json(structure);
    } else {
      res.json(structureWithDepartments);
    }
  } catch (error) {
    console.error('Ошибка при получении данных структуры:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PUT /api/structure - обновить данные структуры
router.put('/', async (req, res) => {
  try {
    const {
      managementInfo,
      managementInfo2,
      managementLocation,
      managementContacts,
      departments,
      hasFilials,
      filials,
      hasRepresentatives,
      representatives
    } = req.body;

    // Обновляем или создаем структуру
    const structure = await prisma.structure.upsert({
      where: { id: 1 }, // Предполагаем, что всегда id=1
      update: {
        managementInfo,
        managementInfo2,
        managementLocation,
        managementContacts,
        hasFilials,
        filials,
        hasRepresentatives,
        representatives
      },
      create: {
        managementInfo,
        managementInfo2,
        managementLocation,
        managementContacts,
        hasFilials,
        filials,
        hasRepresentatives,
        representatives
      }
    });

    // Обновляем отделы
    if (departments && Array.isArray(departments)) {
      // Удаляем существующие отделы
      await prisma.department.deleteMany({
        where: { structureId: structure.id }
      });

      // Создаем новые отделы
      for (const dept of departments) {
        await prisma.department.create({
          data: {
            structureId: structure.id,
            name: dept.name,
            fio: dept.fio,
            post: dept.post,
            phone: dept.phone,
            address: dept.address,
            site: dept.site,
            email: dept.email,
            document: dept.document
          }
        });
      }
    }

    // Получаем обновленную структуру с отделами
    const updatedStructure = await prisma.structure.findFirst({
      include: {
        departments: true
      }
    });

    res.json(updatedStructure);
  } catch (error) {
    console.error('Ошибка при обновлении данных структуры:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;