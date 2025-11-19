import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const includeBlocks = {
  blocks: {
    orderBy: {
      order: 'asc'
    }
  }
};

const normalizeBlocks = (blocks = []) => {
  if (!Array.isArray(blocks)) {
    return [];
  }

  return blocks
    .map((block, index) => ({
      type: block?.type || 'text',
      order: Number.isInteger(block?.order) ? block.order : index,
      data: block?.data ?? {}
    }))
    .filter((block) => typeof block.type === 'string' && block.type.trim().length > 0);
};

router.get('/', async (req, res) => {
  try {
    const pages = await prisma.customPage.findMany({
      orderBy: {
        updatedAt: 'desc'
      }
    });

    res.json(pages);
  } catch (error) {
    console.error('Ошибка получения страниц:', error);
    res.status(500).json({ message: 'Не удалось загрузить страницы' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const page = await prisma.customPage.findUnique({
      where: { id: req.params.id },
      include: includeBlocks
    });

    if (!page) {
      return res.status(404).json({ message: 'Страница не найдена' });
    }

    res.json(page);
  } catch (error) {
    console.error('Ошибка получения страницы:', error);
    res.status(500).json({ message: 'Не удалось загрузить страницу' });
  }
});

router.get('/slug/:slug', async (req, res) => {
  try {
    const page = await prisma.customPage.findFirst({
      where: {
        slug: req.params.slug,
        isPublished: true
      },
      include: includeBlocks
    });

    if (!page) {
      return res.status(404).json({ message: 'Страница не найдена' });
    }

    res.json(page);
  } catch (error) {
    console.error('Ошибка получения страницы по slug:', error);
    res.status(500).json({ message: 'Не удалось загрузить страницу' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      seoTitle,
      seoDescription,
      isPublished,
      blocks
    } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ message: 'Название и slug обязательны' });
    }

    const normalizedBlocks = normalizeBlocks(blocks);

    const created = await prisma.customPage.create({
      data: {
        title,
        slug,
        description: description || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        isPublished: Boolean(isPublished),
        blocks: {
          create: normalizedBlocks.map((block) => ({
            type: block.type,
            order: block.order,
            data: block.data
          }))
        }
      },
      include: includeBlocks
    });

    res.status(201).json(created);
  } catch (error) {
    console.error('Ошибка создания страницы:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Slug должен быть уникальным' });
    }
    res.status(500).json({ message: 'Не удалось создать страницу' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    title,
    slug,
    description,
    seoTitle,
    seoDescription,
    isPublished,
    blocks
  } = req.body;

  try {
    const page = await prisma.customPage.findUnique({
      where: { id }
    });

    if (!page) {
      return res.status(404).json({ message: 'Страница не найдена' });
    }

    const normalizedBlocks = normalizeBlocks(blocks);

    const updated = await prisma.$transaction(async (tx) => {
      await tx.customPageBlock.deleteMany({
        where: { pageId: id }
      });

      const base = await tx.customPage.update({
        where: { id },
        data: {
          title,
          slug,
          description: description || null,
          seoTitle: seoTitle || null,
          seoDescription: seoDescription || null,
          isPublished: Boolean(isPublished)
        }
      });

      if (normalizedBlocks.length) {
        await tx.customPageBlock.createMany({
          data: normalizedBlocks.map((block) => ({
            pageId: id,
            type: block.type,
            order: block.order,
            data: block.data
          }))
        });
      }

      return base;
    });

    const withBlocks = await prisma.customPage.findUnique({
      where: { id: updated.id },
      include: includeBlocks
    });

    res.json(withBlocks);
  } catch (error) {
    console.error('Ошибка обновления страницы:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Slug должен быть уникальным' });
    }
    res.status(500).json({ message: 'Не удалось обновить страницу' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.customPageBlock.deleteMany({
      where: { pageId: req.params.id }
    });

    await prisma.customPage.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Страница удалена' });
  } catch (error) {
    console.error('Ошибка удаления страницы:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Страница не найдена' });
    }
    res.status(500).json({ message: 'Не удалось удалить страницу' });
  }
});

export default router;
