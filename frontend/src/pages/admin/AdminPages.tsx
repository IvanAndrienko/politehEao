
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaSyncAlt,
  FaSave,
  FaChevronUp,
  FaChevronDown,
  FaUpload,
  FaCopy
} from 'react-icons/fa'

type BlockType = 'hero' | 'text' | 'image' | 'gallery' | 'documents' | 'table'

interface BlockState {
  localId: string
  type: BlockType
  order: number
  data: any
}

interface PageSummary {
  id: string
  title: string
  slug: string
  isPublished: boolean
  updatedAt: string
}

interface PageFormState {
  id?: string
  title: string
  slug: string
  description: string
  seoTitle: string
  seoDescription: string
  isPublished: boolean
  blocks: BlockState[]
}
const blockTemplates: Record<BlockType, any> = {
  hero: {
    title: '',
    subtitle: '',
    backgroundImage: '',
    backgroundColor: '#1d4ed8',
    align: 'center',
    buttons: []
  },
  text: {
    html: '<p>Новый текстовый блок</p>'
  },
  image: {
    url: '',
    caption: '',
    fullWidth: false
  },
  gallery: {
    layout: 'grid',
    images: []
  },
  documents: {
    title: '',
    items: []
  },
  table: {
    columns: ['Колонка 1', 'Колонка 2'],
    rows: [
      ['Значение 1', 'Значение 2']
    ]
  }
}

const emptyPage: PageFormState = {
  title: '',
  slug: '',
  description: '',
  seoTitle: '',
  seoDescription: '',
  isPublished: false,
  blocks: []
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

const createLocalId = () => Math.random().toString(36).substring(2, 11)
export default function AdminPages() {
  const navigate = useNavigate()
  const [pages, setPages] = useState<PageSummary[]>([])
  const [form, setForm] = useState<PageFormState>(emptyPage)
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/pages')
      const data = await response.json()
      setPages(data)
    } catch (err) {
      console.error(err)
      setError('Не удалось загрузить список страниц')
    } finally {
      setLoading(false)
    }
  }

  const loadPage = async (id: string) => {
    try {
      setError(null)
      setSelectedPageId(id)
      const response = await fetch('/api/pages/')
      if (!response.ok) {
        throw new Error('Не удалось загрузить страницу')
      }
      const data = await response.json()
      setForm({
        id: data.id,
        title: data.title,
        slug: data.slug,
        description: data.description || '',
        seoTitle: data.seoTitle || '',
        seoDescription: data.seoDescription || '',
        isPublished: Boolean(data.isPublished),
        blocks: (data.blocks || [])
          .sort((a: any, b: any) => a.order - b.order)
          .map((block: any) => ({
            localId: block.id || createLocalId(),
            type: block.type as BlockType,
            order: block.order,
            data: block.data || {}
          }))
      })
    } catch (err) {
      console.error(err)
      setError((err as Error)?.message || 'Ошибка загрузки страницы')
    }
  }

  const resetForm = () => {
    setSelectedPageId(null)
    setForm(emptyPage)
  }

  const handleInputChange = (field: keyof PageFormState, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const updateBlockData = (localId: string, changer: (prev: any) => any) => {
    setForm((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) =>
        block.localId === localId ? { ...block, data: changer(block.data) } : block
      )
    }))
  }

  const addBlock = (type: BlockType) => {
    setForm((prev) => ({
      ...prev,
      blocks: [
        ...prev.blocks,
        {
          localId: createLocalId(),
          type,
          order: prev.blocks.length,
          data: JSON.parse(JSON.stringify(blockTemplates[type]))
        }
      ]
    }))
  }
  const duplicateBlock = (localId: string) => {
    const block = form.blocks.find((b) => b.localId === localId)
    if (!block) return
    setForm((prev) => ({
      ...prev,
      blocks: [
        ...prev.blocks,
        {
          ...block,
          localId: createLocalId(),
          data: JSON.parse(JSON.stringify(block.data)),
          order: prev.blocks.length
        }
      ]
    }))
  }

  const removeBlock = (localId: string) => {
    setForm((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.localId !== localId)
    }))
  }

  const moveBlock = (localId: string, direction: 'up' | 'down') => {
    setForm((prev) => {
      const index = prev.blocks.findIndex((block) => block.localId === localId)
      if (index === -1) return prev
      const newBlocks = [...prev.blocks]
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= newBlocks.length) return prev
      const [current] = newBlocks.splice(index, 1)
      newBlocks.splice(targetIndex, 0, current)
      return { ...prev, blocks: newBlocks }
    })
  }

  const uploadFiles = async (files: FileList | File[], type: 'images' | 'documents') => {
    if (!files || files.length === 0) return []
    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append('files', file))
    try {
      setUploading(true)
      const response = await fetch('/api/upload/pages/', {
        method: 'POST',
        body: formData
      })
      if (!response.ok) {
        throw new Error('Ошибка загрузки файлов')
      }
      const data = await response.json()
      return data.files || []
    } finally {
      setUploading(false)
    }
  }

  const savePage = async () => {
    if (!form.title.trim()) {
      return setError('Введите название страницы')
    }

    const payload = {
      title: form.title.trim(),
      slug: (form.slug || slugify(form.title)).trim(),
      description: form.description || null,
      seoTitle: form.seoTitle || null,
      seoDescription: form.seoDescription || null,
      isPublished: form.isPublished,
      blocks: form.blocks.map((block, index) => ({
        type: block.type,
        order: index,
        data: block.data
      }))
    }

    try {
      setSaving(true)
      setError(null)
      const method = form.id ? 'PUT' : 'POST'
      const url = form.id ? '/api/pages/' + form.id : '/api/pages'
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Не удалось сохранить страницу')
      }
      await loadPages()
      if (form.id) {
        await loadPage(form.id)
      } else {
        resetForm()
      }
    } catch (err) {
      console.error(err)
      setError((err as Error)?.message || 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const deletePage = async () => {
    if (!form.id) return
    if (!window.confirm('Удалить страницу?')) return
    try {
      const response = await fetch('/api/pages/' + form.id, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('Не удалось удалить страницу')
      }
      await loadPages()
      resetForm()
    } catch (err) {
      console.error(err)
      setError('Ошибка удаления страницы')
    }
  }

  const blockOptions: { type: BlockType; label: string; description: string }[] = [
    { type: 'hero', label: 'Обложка', description: 'Большой заголовок с фоном и кнопками' },
    { type: 'text', label: 'Текст', description: 'Произвольный HTML/текстовый блок' },
    { type: 'image', label: 'Изображение', description: 'Одиночное изображение с подписью' },
    { type: 'gallery', label: 'Галерея/Слайдер', description: 'Набор изображений в сетке или слайдере' },
    { type: 'documents', label: 'Документы', description: 'Список файлов со ссылками на скачивание' },
    { type: 'table', label: 'Таблица', description: 'Структурированные данные' }
  ]

  const blocksPreview = useMemo(() => form.blocks, [form.blocks])
  const renderGalleryForm = (block: BlockState) => (
    <div className="space-y-3">
      <div className="flex gap-2">
        {['grid', 'slider'].map((layout) => (
          <button
            key={layout}
            type="button"
            onClick={() => updateBlockData(block.localId, (data) => ({ ...data, layout }))}
            className="px-3 py-1 rounded border"
          >
            {layout === 'grid' ? 'Сетка' : 'Слайдер'}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {(block.data.images || []).map((image: any, index: number) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Изображение #{index + 1}</span>
              <button
                type="button"
                className="text-red-500"
                onClick={() =>
                  updateBlockData(block.localId, (data) => ({
                    ...data,
                    images: data.images.filter((_: any, i: number) => i !== index)
                  }))
                }
              >
                Удалить
              </button>
            </div>
            <input
              className="input"
              placeholder="URL"
              value={image.url || ''}
              onChange={(e) =>
                updateBlockData(block.localId, (data) => {
                  const images = [...(data.images || [])]
                  images[index] = { ...images[index], url: e.target.value }
                  return { ...data, images }
                })
              }
            />
            <input
              className="input"
              placeholder="Заголовок"
              value={image.title || ''}
              onChange={(e) =>
                updateBlockData(block.localId, (data) => {
                  const images = [...(data.images || [])]
                  images[index] = { ...images[index], title: e.target.value }
                  return { ...data, images }
                })
              }
            />
            <textarea
              className="input"
              placeholder="Описание"
              value={image.description || ''}
              onChange={(e) =>
                updateBlockData(block.localId, (data) => {
                  const images = [...(data.images || [])]
                  images[index] = { ...images[index], description: e.target.value }
                  return { ...data, images }
                })
              }
            />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="btn-secondary"
          onClick={() =>
            updateBlockData(block.localId, (data) => ({
              ...data,
              images: [...(data.images || []), { url: '', title: '', description: '' }]
            }))
          }
        >
          <FaPlus className="mr-2" />
          Добавить вручную
        </button>
        <label className="btn-secondary cursor-pointer">
          <FaUpload className="mr-2" />
          Загрузить файлы
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={async (e) => {
              const files = e.target.files
              if (!files?.length) return
              const uploaded = await uploadFiles(files, 'images')
              updateBlockData(block.localId, (data) => ({
                ...data,
                images: [
                  ...(data.images || []),
                  ...uploaded.map((file: any) => ({ url: file.url, title: file.name, description: '' }))
                ]
              }))
            }}
          />
        </label>
      </div>
    </div>
  )
  const renderDocumentsForm = (block: BlockState) => (
    <div className="space-y-3">
      <input
        className="input"
        placeholder="Заголовок списка (опционально)"
        value={block.data.title || ''}
        onChange={(e) => updateBlockData(block.localId, (data) => ({ ...data, title: e.target.value }))}
      />
      <div className="space-y-3">
        {(block.data.items || []).map((item: any, index: number) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Документ #{index + 1}</span>
              <button
                type="button"
                className="text-red-500"
                onClick={() =>
                  updateBlockData(block.localId, (data) => ({
                    ...data,
                    items: data.items.filter((_: any, i: number) => i !== index)
                  }))
                }
              >
                Удалить
              </button>
            </div>
            <input
              className="input"
              placeholder="Название"
              value={item.label || ''}
              onChange={(e) =>
                updateBlockData(block.localId, (data) => {
                  const items = [...(data.items || [])]
                  items[index] = { ...items[index], label: e.target.value }
                  return { ...data, items }
                })
              }
            />
            <input
              className="input"
              placeholder="Описание"
              value={item.description || ''}
              onChange={(e) =>
                updateBlockData(block.localId, (data) => {
                  const items = [...(data.items || [])]
                  items[index] = { ...items[index], description: e.target.value }
                  return { ...data, items }
                })
              }
            />
            <div className="flex gap-3">
              <input
                className="input flex-1"
                placeholder="URL"
                value={item.url || ''}
                onChange={(e) =>
                  updateBlockData(block.localId, (data) => {
                    const items = [...(data.items || [])]
                    items[index] = { ...items[index], url: e.target.value }
                    return { ...data, items }
                  })
                }
              />
              <label className="btn-secondary cursor-pointer">
                <FaUpload className="mr-2" />
                Загрузить
                <input
                  type="file"
                  className="hidden"
                  onChange={async (e) => {
                    const files = e.target.files
                    if (!files?.length) return
                    const uploaded = await uploadFiles(files, 'documents')
                    if (uploaded[0]) {
                      updateBlockData(block.localId, (data) => {
                        const items = [...(data.items || [])]
                        items[index] = { ...items[index], url: uploaded[0].url, label: uploaded[0].name }
                        return { ...data, items }
                      })
                    }
                  }}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn-secondary"
        onClick={() =>
          updateBlockData(block.localId, (data) => ({
            ...data,
            items: [...(data.items || []), { label: '', description: '', url: '' }]
          }))
        }
      >
        <FaPlus className="mr-2" />
        Добавить документ
      </button>
    </div>
  )
  const renderTableForm = (block: BlockState) => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(block.data.columns || []).map((column: string, index: number) => (
          <input
            key={index}
            className="input w-40"
            value={column}
            onChange={(e) =>
              updateBlockData(block.localId, (data) => {
                const columns = [...(data.columns || [])]
                columns[index] = e.target.value
                return { ...data, columns }
              })
            }
          />
        ))}
        <button
          type="button"
          className="btn-secondary"
          onClick={() =>
            updateBlockData(block.localId, (data) => ({
              ...data,
              columns: [...(data.columns || []), 'Колонка'],
              rows: (data.rows || []).map((row: string[]) => [...row, ''])
            }))
          }
        >
          <FaPlus className="mr-2" />
          Колонка
        </button>
      </div>
      <div className="space-y-3">
        {(block.data.rows || []).map((row: string[], rowIndex: number) => (
          <div key={rowIndex} className="grid md:grid-cols-2 gap-2">
            {row.map((value: string, cellIndex: number) => (
              <input
                key={cellIndex}
                className="input"
                value={value}
                onChange={(e) =>
                  updateBlockData(block.localId, (data) => {
                    const rows = [...(data.rows || [])]
                    rows[rowIndex][cellIndex] = e.target.value
                    return { ...data, rows }
                  })
                }
              />
            ))}
            <button
              type="button"
              className="btn-danger"
              onClick={() =>
                updateBlockData(block.localId, (data) => ({
                  ...data,
                  rows: data.rows.filter((_: any, index: number) => index !== rowIndex)
                }))
              }
            >
              <FaTrash className="mr-2" />
              Удалить строку
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn-secondary"
        onClick={() =>
          updateBlockData(block.localId, (data) => ({
            ...data,
            rows: [...(data.rows || []), new Array((data.columns || []).length).fill('')]
          }))
        }
      >
        <FaPlus className="mr-2" />
        Добавить строку
      </button>
    </div>
  )
  const renderBlockForm = (block: BlockState) => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="space-y-3">
            <input
              className="input"
              placeholder="Заголовок"
              value={block.data.title || ''}
              onChange={(e) => updateBlockData(block.localId, (data) => ({ ...data, title: e.target.value }))}
            />
            <textarea
              className="input"
              placeholder="Подзаголовок"
              value={block.data.subtitle || ''}
              onChange={(e) => updateBlockData(block.localId, (data) => ({ ...data, subtitle: e.target.value }))}
            />
            <div className="flex gap-3 flex-wrap">
              <input
                className="input flex-1"
                placeholder="URL фонового изображения"
                value={block.data.backgroundImage || ''}
                onChange={(e) =>
                  updateBlockData(block.localId, (data) => ({ ...data, backgroundImage: e.target.value }))
                }
              />
              <label className="flex items-center gap-2 text-sm text-gray-600">
                Цвет:
                <input
                  type="color"
                  value={block.data.backgroundColor || '#1d4ed8'}
                  onChange={(e) =>
                    updateBlockData(block.localId, (data) => ({ ...data, backgroundColor: e.target.value }))
                  }
                />
              </label>
            </div>
            <div className="flex gap-2">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  type="button"
                  className="px-3 py-1 rounded border"
                  onClick={() => updateBlockData(block.localId, (data) => ({ ...data, align }))}
                >
                  {align === 'left' ? 'Слева' : align === 'center' ? 'По центру' : 'Справа'}
                </button>
              ))}
            </div>
          </div>
        )
      case 'text':
        return (
          <textarea
            className="input min-h-[180px] font-mono text-sm"
            placeholder="HTML содержимое"
            value={block.data.html || ''}
            onChange={(e) => updateBlockData(block.localId, (data) => ({ ...data, html: e.target.value }))}
          />
        )
      case 'image':
        return (
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                className="input flex-1"
                placeholder="URL изображения"
                value={block.data.url || ''}
                onChange={(e) => updateBlockData(block.localId, (data) => ({ ...data, url: e.target.value }))}
              />
              <label className="btn-secondary cursor-pointer">
                <FaUpload className="mr-2" />
                Загрузить
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={async (e) => {
                    const files = e.target.files
                    if (!files?.length) return
                    const uploaded = await uploadFiles(files, 'images')
                    if (uploaded[0]) {
                      updateBlockData(block.localId, (data) => ({ ...data, url: uploaded[0].url }))
                    }
                  }}
                />
              </label>
            </div>
            <input
              className="input"
              placeholder="Подпись"
              value={block.data.caption || ''}
              onChange={(e) => updateBlockData(block.localId, (data) => ({ ...data, caption: e.target.value }))}
            />
            <label className="inline-flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={Boolean(block.data.fullWidth)}
                onChange={(e) => updateBlockData(block.localId, (data) => ({ ...data, fullWidth: e.target.checked }))}
              />
              Растянуть на всю ширину
            </label>
          </div>
        )
      case 'gallery':
        return renderGalleryForm(block)
      case 'documents':
        return renderDocumentsForm(block)
      case 'table':
        return renderTableForm(block)
      default:
        return null
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" />
            Назад
          </button>
          <button onClick={loadPages} className="btn-primary">
            <FaSyncAlt className="mr-2" />
            Обновить список
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Конструктор страниц</h1>
          <p className="text-gray-600">Создавайте и редактируйте произвольные страницы сайта</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Список страниц</h2>
              <button className="btn-secondary" onClick={resetForm}>
                <FaPlus className="mr-2" />
                Новая
              </button>
            </div>
            {loading ? (
              <p className="text-sm text-gray-500">Загрузка...</p>
            ) : pages.length === 0 ? (
              <p className="text-sm text-gray-500">Страницы ещё не созданы.</p>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    className="w-full text-left border rounded-lg px-4 py-3 hover:border-blue-500 transition"
                    onClick={() => loadPage(page.id)}
                  >
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(page.updatedAt).toLocaleDateString()}</span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs"
                      >
                        {page.isPublished ? 'Опубликовано' : 'Черновик'}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 mt-1">{page.title}</p>
                    <p className="text-xs text-gray-500">/{page.slug}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6 space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{form.id ? 'Редактирование' : 'Новая страница'}</h2>
              {form.id && (
                <button className="btn-danger" onClick={deletePage}>
                  <FaTrash className="mr-2" />
                  Удалить
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                className="input"
                placeholder="Название страницы"
                value={form.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
              <input
                type="text"
                className="input"
                placeholder="Slug (например, about-college)"
                value={form.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
              />
              <input
                type="text"
                className="input"
                placeholder="SEO Title"
                value={form.seoTitle}
                onChange={(e) => handleInputChange('seoTitle', e.target.value)}
              />
              <input
                type="text"
                className="input"
                placeholder="SEO Description"
                value={form.seoDescription}
                onChange={(e) => handleInputChange('seoDescription', e.target.value)}
              />
            </div>
            <textarea
              className="input"
              placeholder="Описание страницы"
              value={form.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
            <label className="inline-flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => handleInputChange('isPublished', e.target.checked)}
              />
              Опубликовано
            </label>
            <div className="border-t pt-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {blockOptions.map((option) => (
                  <button key={option.type} className="btn-secondary" onClick={() => addBlock(option.type)}>
                    <FaPlus className="mr-2" />
                    {option.label}
                  </button>
                ))}
              </div>

              {blocksPreview.length === 0 ? (
                <div className="border rounded-lg p-6 text-center text-gray-500">
                  Добавьте блок, чтобы начать собирать страницу.
                </div>
              ) : (
                <div className="space-y-6">
                  {blocksPreview.map((block, index) => (
                    <div key={block.localId} className="border rounded-xl p-4 bg-gray-50 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            #{index + 1} — {blockOptions.find((option) => option.type === block.type)?.label || block.type}
                          </p>
                          <p className="text-sm text-gray-500">
                            {blockOptions.find((option) => option.type === block.type)?.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="btn-secondary" onClick={() => moveBlock(block.localId, 'up')}>
                            <FaChevronUp />
                          </button>
                          <button className="btn-secondary" onClick={() => moveBlock(block.localId, 'down')}>
                            <FaChevronDown />
                          </button>
                          <button className="btn-secondary" onClick={() => duplicateBlock(block.localId)}>
                            <FaCopy />
                          </button>
                          <button className="btn-danger" onClick={() => removeBlock(block.localId)}>
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 space-y-3">{renderBlockForm(block)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 justify-end">
              <button className="btn-secondary" onClick={resetForm} disabled={saving}>
                Очистить
              </button>
              <button className="btn-primary" onClick={savePage} disabled={saving || uploading}>
                {saving ? (
                  <>
                    <FaSyncAlt className="mr-2 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Сохранить
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
