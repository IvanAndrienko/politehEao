import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Получить все объявления
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10 // Ограничим до 10 последних объявлений
    });

    // Форматируем дату для фронтенда
    const formattedAnnouncements = announcements.map(announcement => ({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      date: announcement.date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      urgent: announcement.isUrgent
    }));

    res.json(formattedAnnouncements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// Создать новое объявление
router.post('/announcements', async (req, res) => {
  try {
    const { title, content, isUrgent } = req.body;

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        isUrgent: isUrgent || false
      }
    });

    res.json(announcement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// Обновить объявление
router.put('/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isUrgent } = req.body;

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        content,
        isUrgent: isUrgent || false
      }
    });

    res.json(announcement);
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

// Удалить объявление
router.delete('/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.announcement.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

// Получить все учебные группы
router.get('/groups', async (req, res) => {
  try {
    const groups = await prisma.studyGroup.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        fullName: true,
        specialty: true
      },
      orderBy: { code: 'asc' }
    });
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Получить расписание группы по коду
router.get('/groups/:groupCode', async (req, res) => {
  try {
    const { groupCode } = req.params;

    const group = await prisma.studyGroup.findUnique({
      where: { code: groupCode },
      include: {
        lessons: {
          orderBy: [
            { dayOfWeek: 'asc' },
            { lessonNumber: 'asc' }
          ]
        }
      }
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Преобразовать данные в формат фронтенда
    const scheduleData = {
      name: group.name,
      specialty: group.specialty || '',
      schedule: [
        { day: 'Понедельник', lessons: [] },
        { day: 'Вторник', lessons: [] },
        { day: 'Среда', lessons: [] },
        { day: 'Четверг', lessons: [] },
        { day: 'Пятница', lessons: [] }
      ]
    };

    // Временные интервалы для пар
    const timeSlots = {
      1: '9:00–10:30',
      2: '10:40–12:10',
      3: '12:20–13:50',
      4: '14:30–16:00',
      5: '16:10–17:40'
    };

    // Текстовые описания пар
    const lessonLabels = {
      1: '1-я пара',
      2: '2-я пара',
      3: '3-я пара',
      4: '4-я пара',
      5: '5-я пара'
    };

    group.lessons.forEach(lesson => {
      if (lesson.dayOfWeek >= 1 && lesson.dayOfWeek <= 5) {
        scheduleData.schedule[lesson.dayOfWeek - 1].lessons.push({
          time: `${lessonLabels[lesson.lessonNumber]} (${timeSlots[lesson.lessonNumber]})`,
          subject: lesson.subject,
          teacher: lesson.teacher,
          room: lesson.room
        });
      }
    });

    res.json(scheduleData);
  } catch (error) {
    console.error('Error fetching group schedule:', error);
    res.status(500).json({ error: 'Failed to fetch group schedule' });
  }
});

// Создать новую учебную группу
router.post('/groups', async (req, res) => {
  try {
    const { code, name, fullName, specialty } = req.body;

    const group = await prisma.studyGroup.create({
      data: {
        code,
        name,
        fullName,
        specialty
      }
    });

    res.json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// Обновить учебную группу
router.put('/groups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, fullName, specialty } = req.body;

    const group = await prisma.studyGroup.update({
      where: { id },
      data: {
        code,
        name,
        fullName,
        specialty
      }
    });

    res.json(group);
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ error: 'Failed to update group' });
  }
});

// Удалить учебную группу
router.delete('/groups/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.studyGroup.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

// Создать урок в расписании
router.post('/lessons', async (req, res) => {
  try {
    const { groupId, dayOfWeek, lessonNumber, subject, teacher, room } = req.body;

    const lesson = await prisma.lesson.create({
      data: {
        groupId,
        dayOfWeek: parseInt(dayOfWeek),
        lessonNumber: parseInt(lessonNumber),
        subject,
        teacher,
        room
      }
    });

    res.json(lesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

// Обновить урок
router.put('/lessons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { dayOfWeek, lessonNumber, subject, teacher, room } = req.body;

    const lesson = await prisma.lesson.update({
      where: { id },
      data: {
        dayOfWeek: parseInt(dayOfWeek),
        lessonNumber: parseInt(lessonNumber),
        subject,
        teacher,
        room
      }
    });

    res.json(lesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// Удалить урок
router.delete('/lessons/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.lesson.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

// Получить все уроки группы
router.get('/groups/:groupId/lessons', async (req, res) => {
  try {
    const { groupId } = req.params;

    const lessons = await prisma.lesson.findMany({
      where: { groupId },
      orderBy: [
        { dayOfWeek: 'asc' },
        { lessonNumber: 'asc' }
      ]
    });

    res.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

export default router;