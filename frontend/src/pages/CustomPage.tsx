import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type BlockData = Record<string, any>

interface CustomPageBlock {
  id: string
  type: string
  order: number
  data: BlockData
}

interface CustomPageResponse {
  id: string
  title: string
  slug: string
  description?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  blocks: CustomPageBlock[]
}

const renderText = (html?: string) => ({
  dangerouslySetInnerHTML: { __html: html || '' }
})

const HeroBlock = ({ data }: { data: BlockData }) => {
  const align = data.align || 'center'
  const styles = {
    backgroundImage: data.backgroundImage ? `url(${data.backgroundImage})` : undefined
  }

  return (
    <section
      className="rounded-2xl text-white py-16 px-6 mb-10 relative overflow-hidden"
      style={{
        backgroundColor: data.backgroundColor || '#1d4ed8',
        ...styles,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div
        className={`max-w-4xl mx-auto text-${align} space-y-4`}
        style={{ textAlign: align as 'left' | 'center' | 'right' }}
      >
        {data.title && <h1 className="text-3xl md:text-5xl font-bold">{data.title}</h1>}
        {data.subtitle && <p className="text-lg md:text-2xl opacity-90">{data.subtitle}</p>}
        {Array.isArray(data.buttons) && (
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {data.buttons.map(
              (button: any, index: number) =>
                button?.label &&
                button?.url && (
                  <a
                    key={index}
                    href={button.url}
                    className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:-translate-y-0.5 transition"
                  >
                    {button.label}
                  </a>
                )
            )}
          </div>
        )}
      </div>
    </section>
  )
}

const TextBlock = ({ data }: { data: BlockData }) => (
  <section className="prose max-w-none mb-10" {...renderText(data.html)} />
)

const ImageBlock = ({ data }: { data: BlockData }) => {
  if (!data.url) return null

  return (
    <figure className="mb-10">
      <img
        src={data.url}
        alt={data.caption || 'Изображение'}
        className={`rounded-xl shadow max-h-[600px] w-full object-cover ${data.fullWidth ? '' : 'md:w-4/5 mx-auto'}`}
      />
      {data.caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{data.caption}</figcaption>}
    </figure>
  )
}

const GalleryBlock = ({ data }: { data: BlockData }) => {
  if (!Array.isArray(data.images) || data.images.length === 0) return null

  if (data.layout === 'slider') {
    return (
      <div className="mb-12">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          className="rounded-xl overflow-hidden"
        >
          {data.images.map((image: any, index: number) => (
            <SwiperSlide key={index}>
              <div className="relative">
                <img
                  src={image.url}
                  alt={image.title || `Изображение ${index + 1}`}
                  className="w-full h-[400px] object-cover"
                />
                {image.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-sm">
                    <p className="font-semibold">{image.title}</p>
                    {image.description && <p className="opacity-80">{image.description}</p>}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {data.images.map((image: any, index: number) => (
        <figure key={index} className="rounded-xl overflow-hidden shadow bg-white">
          <img src={image.url} alt={image.title || ''} className="w-full h-64 object-cover" />
          {(image.title || image.description) && (
            <figcaption className="p-4">
              {image.title && <p className="font-semibold mb-1">{image.title}</p>}
              {image.description && <p className="text-sm text-gray-500">{image.description}</p>}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}

const DocumentsBlock = ({ data }: { data: BlockData }) => {
  if (!Array.isArray(data.items) || data.items.length === 0) return null

  return (
    <section className="bg-white rounded-xl shadow p-6 mb-12">
      {data.title && <h3 className="text-xl font-semibold mb-4">{data.title}</h3>}
      <div className="space-y-4">
        {data.items.map((item: any, index: number) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between border rounded-lg px-4 py-3 hover:border-blue-500 transition"
          >
            <div>
              <p className="font-medium text-gray-900">{item.label}</p>
              {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
            </div>
            <span className="text-blue-600 text-sm font-semibold">Скачать</span>
          </a>
        ))}
      </div>
    </section>
  )
}

const TableBlock = ({ data }: { data: BlockData }) => {
  if (!Array.isArray(data.columns) || !Array.isArray(data.rows)) return null

  return (
    <div className="overflow-x-auto mb-12">
      <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            {data.columns.map((column: string, index: number) => (
              <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.rows.map((row: string[], rowIndex: number) => (
            <tr key={rowIndex}>
              {row.map((value, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-sm text-gray-900">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const BlockRenderer = ({ block }: { block: CustomPageBlock }) => {
  const data = block.data || {}
  switch (block.type) {
    case 'hero':
      return <HeroBlock data={data} />
    case 'text':
      return <TextBlock data={data} />
    case 'image':
      return <ImageBlock data={data} />
    case 'gallery':
      return <GalleryBlock data={data} />
    case 'documents':
      return <DocumentsBlock data={data} />
    case 'table':
      return <TableBlock data={data} />
    default:
      return (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 mb-8">
          Неизвестный блок: <strong>{block.type}</strong>
        </div>
      )
  }
}

export default function CustomPage() {
  const { slug } = useParams<{ slug: string }>()
  const [page, setPage] = useState<CustomPageResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      if (!slug) return
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/pages/slug/${slug}`, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Страница не найдена' : 'Ошибка загрузки страницы')
        }
        const data = await response.json()
        setPage(data)
        document.title = data.seoTitle || data.title
      } catch (err: any) {
        if (err.name === 'AbortError') return
        console.error(err)
        setError(err.message || 'Не удалось загрузить страницу')
      } finally {
        setLoading(false)
      }
    }

    load()

    return () => controller.abort()
  }, [slug])

  const sortedBlocks = useMemo(() => {
    if (!page?.blocks) return []
    return [...page.blocks].sort((a, b) => a.order - b.order)
  }, [page])

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-600">
        <p>Загрузка страницы...</p>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="py-16 text-center text-gray-600">
        <p>{error || 'Страница недоступна'}</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
          {page.description && <p className="text-gray-600 text-lg max-w-3xl mx-auto">{page.description}</p>}
        </div>

        {sortedBlocks.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
            Контент страницы пока не добавлен.
          </div>
        ) : (
          sortedBlocks.map((block) => <BlockRenderer key={block.id} block={block} />)
        )}
      </div>
    </div>
  )
}
