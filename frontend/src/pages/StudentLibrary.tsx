import { useEffect, useState } from 'react'
import { FaBookOpen, FaSearch, FaChevronDown, FaChevronUp, FaDownload } from 'react-icons/fa'

interface LibraryMaterial {
  id: string
  title: string
  fileUrl: string
  fileName: string
  fileSize?: number
}

interface LibraryDiscipline {
  id: string
  title: string
  description?: string
  materials: LibraryMaterial[]
}

const formatSize = (size?: number | null) => {
  if (!size) return ''
  const units = ['Б', 'КБ', 'МБ', 'ГБ']
  let value = size
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unit]}`
}

export default function StudentLibrary() {
  const [disciplines, setDisciplines] = useState<LibraryDiscipline[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    loadDisciplines()
  }, [])

  const loadDisciplines = async (query = '') => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      if (query.trim()) {
        params.set('q', query.trim())
      }
      const url = `/api/students/library/disciplines${params.toString() ? `?${params}` : ''}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Не удалось загрузить библиотеку')
      }
      const data = await response.json()
      setDisciplines(data)
      setExpanded((current) => {
        if (!data.length) {
          return null
        }
        if (current && data.some((discipline: LibraryDiscipline) => discipline.id === current)) {
          return current
        }
        return data[0].id
      })
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadDisciplines(search)
  }

  const resetSearch = () => {
    setSearch('')
    loadDisciplines('')
  }

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <FaBookOpen className="w-14 h-14 text-blue-600 mx-auto" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Библиотека студента</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Методические материалы и полезные документы по дисциплинам. Выберите нужный предмет и
            скачайте актуальные файлы.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex-1 flex items-center border rounded-md px-3 py-2">
              <FaSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Поиск по названию дисциплины или материала"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSearch()
                }}
                className="flex-1 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FaSearch className="mr-2" />
                Искать
              </button>
              <button
                onClick={resetSearch}
                className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                Сбросить
              </button>
            </div>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </div>

        {loading ? (
          <div className="bg-white shadow rounded-lg p-6 text-center text-gray-600">
            Загружаем список дисциплин...
          </div>
        ) : disciplines.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center text-gray-600">
            Материалы пока не добавлены. Попробуйте позже.
          </div>
        ) : (
          <div className="space-y-4">
            {disciplines.map((discipline) => (
              <div key={discipline.id} className="bg-white shadow rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    setExpanded((current) => (current === discipline.id ? null : discipline.id))
                  }
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{discipline.title}</h2>
                    {discipline.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {discipline.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Доступно материалов: {discipline.materials?.length || 0}
                    </p>
                  </div>
                  {expanded === discipline.id ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </button>
                {expanded === discipline.id && (
                  <div className="border-t px-6 py-4">
                    {discipline.materials.length === 0 ? (
                      <p className="text-gray-500 text-sm">Для этой дисциплины пока нет файлов.</p>
                    ) : (
                      <ul className="divide-y">
                        {discipline.materials.map((material) => (
                          <li
                            key={material.id}
                            className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{material.title}</p>
                              <p className="text-sm text-gray-500">
                                {material.fileName}
                                {material.fileSize ? ` • ${formatSize(material.fileSize)}` : ''}
                              </p>
                            </div>
                            <a
                              href={`/uploads/${material.fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              <FaDownload className="mr-2" />
                              Скачать
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
