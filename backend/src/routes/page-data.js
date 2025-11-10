import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/page-data - Объединенный эндпоинт для данных страницы
router.get('/', async (req, res) => {
  try {
    const { page = 'home' } = req.query;

    const data = {};

    // Общие данные для всех страниц
    const [settings, homeSlider] = await Promise.all([
      prisma.siteSettings.findFirst(),
      prisma.homeSlider.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      })
    ]);

    data.settings = settings;
    if (page === 'header') {
      return res.json({
        success: true,
        data
      });
    }

    data.homeSlider = homeSlider;

    // Данные в зависимости от страницы
    if (page === 'home') {
      const [news, announcements] = await Promise.all([
        prisma.news.findMany({
          take: 6,
          orderBy: { publishedAt: 'desc' },
          select: {
            id: true,
            title: true,
            slug: true,
            shortDescription: true,
            previewImage: true,
            publishedAt: true,
          },
        }),
        prisma.announcement.findMany({
          take: 4,
          orderBy: { date: 'desc' }
        })
      ]);

      data.news = news;
      data.announcements = announcements;
    } else if (page === 'admission') {
      // Данные для страницы поступления
      const [specialties, documents, dates, contacts, dormitory] = await Promise.all([
        prisma.specialty.findMany(),
        prisma.requiredDocument.findMany({ orderBy: { order: 'asc' } }),
        prisma.importantDate.findMany({ orderBy: { order: 'asc' } }),
        prisma.admissionContact.findMany(),
        prisma.dormitory.findFirst()
      ]);

      data.specialties = specialties;
      data.documents = documents;
      data.dates = dates;
      data.contacts = contacts;
      data.dormitory = dormitory;
    } else if (page === 'students') {
      // Данные для страницы студентов
      const [announcements, services, documents, studentLife] = await Promise.all([
        prisma.announcement.findMany({
          take: 4,
          orderBy: { date: 'desc' }
        }),
        prisma.studentService.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }),
        prisma.studentDocument.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }),
        prisma.studentLifeItem.findMany()
      ]);

      data.announcements = announcements;
      data.services = services;
      data.documents = documents;
      data.studentLife = studentLife;
    } else if (page === 'budget') {
      // Данные для страницы бюджета
      const [volumes, flows, plans] = await Promise.all([
        prisma.budgetVolume.findMany({
          where: { isActive: true },
          orderBy: { year: 'desc' }
        }),
        prisma.budgetFlow.findMany({
          where: { isActive: true },
          orderBy: { year: 'desc' }
        }),
        prisma.budgetPlan.findMany({
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        })
      ]);

      data.budgetVolumes = volumes;
      data.budgetFlows = flows;
      data.budgetPlans = plans;
    } else if (page === 'catering') {
      // Данные для страницы питания
      const catering = await prisma.catering.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      });
      data.catering = catering;
    } else if (page === 'common') {
      // Данные для страницы общих сведений
      const organizationInfo = await prisma.organizationInfo.findFirst();
      data.organizationInfo = organizationInfo;
    } else if (page === 'documents') {
      // Данные для страницы документов
      const documents = await prisma.document.findMany({
        orderBy: { createdAt: 'desc' }
      });
      data.documents = documents;
    } else if (page === 'education') {
      // Данные для страницы образования
      const [programs, details, adapted] = await Promise.all([
        prisma.educationProgram.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }),
        prisma.educationalProgramDetail.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }),
        prisma.adaptedProgram.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' }
        })
      ]);

      data.educationPrograms = programs;
      data.educationalProgramDetails = details;
      data.adaptedPrograms = adapted;
    } else if (page === 'edu-standards') {
      // Данные для страницы образовательных стандартов
      const standards = await prisma.educationalStandard.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      });
      data.educationalStandards = standards;
    } else if (page === 'employees') {
      // Данные для страницы педагогического состава
      const employees = await prisma.employee.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      });
      data.employees = employees;
    } else if (page === 'grants') {
      // Данные для страницы стипендий
      const [documents, info, measures, hostelInfo, hostelPaymentDocs] = await Promise.all([
        prisma.grantsDocument.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }),
        prisma.grantsInfo.findMany({
          where: { isActive: true }
        }),
        prisma.supportMeasure.findMany({
          where: { isActive: true }
        }),
        prisma.grantsHostelInfo.findMany(),
        prisma.grantsHostelPaymentDocument.findMany({
          where: { isActive: true }
        })
      ]);

      data.grantsDocuments = documents;
      data.grantsInfo = info;
      data.supportMeasures = measures;
      data.grantsHostelInfo = hostelInfo;
      data.grantsHostelPaymentDocuments = hostelPaymentDocs;
    } else if (page === 'international') {
      // Данные для страницы международного сотрудничества
      const cooperation = await prisma.internationalCooperation.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      });
      data.internationalCooperation = cooperation;
    } else if (page === 'managers') {
      // Данные для страницы руководства
      const managers = await prisma.manager.findMany({
        orderBy: { createdAt: 'desc' }
      });
      data.managers = managers;
    } else if (page === 'objects') {
      // Данные для страницы материально-технического обеспечения
      const [cabinets, practiceObjects, libraries, sportObjects, textBlocks, hostelInfo, documents] = await Promise.all([
        prisma.cabinet.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }),
        prisma.practiceObject.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }),
        prisma.library.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }),
        prisma.sportObject.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }),
        prisma.objectsTextBlock.findMany({
          where: { isActive: true }
        }),
        prisma.hostelInfo.findMany(),
        prisma.objectsDocument.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' }
        })
      ]);

      data.cabinets = cabinets;
      data.practiceObjects = practiceObjects;
      data.libraries = libraries;
      data.sportObjects = sportObjects;
      data.objectsTextBlocks = textBlocks;
      data.hostelInfo = hostelInfo;
      data.objectsDocuments = documents;
    } else if (page === 'paid-edu') {
      // Данные для страницы платных услуг
      const documents = await prisma.paidEduDocument.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      });
      data.paidEduDocuments = documents;
    } else if (page === 'structure') {
      // Данные для страницы структуры
      const [structure, departments, documents] = await Promise.all([
        prisma.structure.findFirst(),
        prisma.department.findMany(),
        prisma.structureDocument.findMany({
          where: { isActive: true },
          orderBy: { order: 'asc' }
        })
      ]);

      data.structure = structure;
      data.departments = departments;
      data.structureDocuments = documents;
    } else if (page === 'vacant-places') {
      // Данные для страницы вакантных мест
      const places = await prisma.vacantPlace.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      });
      data.vacantPlaces = places;
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Ошибка получения данных страницы:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения данных страницы'
    });
  }
});

export default router;
