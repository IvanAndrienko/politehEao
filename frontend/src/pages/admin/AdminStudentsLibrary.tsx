import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  FaArrowLeft,
  FaSyncAlt,
  FaPlus,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaTrash,
  FaSave,
  FaUpload,
  FaBookOpen
} from 'react-icons/fa'

interface DisciplineMaterial {
  id: string
  disciplineId: string
  title: string
  fileUrl: string
  fileName: string
  fileSize?: number
  fileType?: string
}

interface StudentDiscipline {
  id: string
  title: string
  description?: string
  order: number
  isActive: boolean
  materials: DisciplineMaterial[]
}

interface MaterialFormState {
  title: string
  file: File | null
}

const defaultMaterialForm: MaterialFormState = {
  title: '',
  file: null
}

const defaultDisciplineForm = {
  title: '',
  description: '',
  order: 0,
  isActive: true
}

export default function AdminStudentsLibrary() {
  const [disciplines, setDisciplines] = useState<StudentDiscipline[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newDiscipline, setNewDiscipline] = useState(defaultDisciplineForm)
  const [creating, setCreating] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [materialForms, setMaterialForms] = useState<Record<string, MaterialFormState>>({})
  const [materialUploads, setMaterialUploads] = useState<string | null>(null)
  const [materialSavingId, setMaterialSavingId] = useState<string | null>(null)
  const [materialDeletingId, setMaterialDeletingId] = useState<string | null>(null)
  const [materialTitles, setMaterialTitles] = useState<Record<string, string>>({})

  useEffect(() => {
    loadDisciplines()
  }, [])

  const mappedMaterialTitles = useMemo(() => materialTitles, [materialTitles])

  const loadDisciplines = async (query = '') => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      if (query.trim()) {
        params.set('q', query.trim())
      }
      const url = `/api/students/library/disciplines/all${params.toString() ? `?${params}` : ''}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Не удалось загрузить дисциплины')
      }
      const data = await response.json()
      setDisciplines(data)
      const initialTitles: Record<string, string> = {}
      data.forEach((discipline: StudentDiscipline) => {
        discipline.materials?.forEach((material) => {
          initialTitles[material.id] = material.title
        })
      })
      setMaterialTitles(initialTitles)
      setExpandedId((current) => {
        if (!data.length) {
          return null
        }
        if (current && data.some((item: StudentDiscipline) => item.id === current)) {
          return current
        }
        return data[0].id
      })
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке')
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

  const handleCreateDiscipline = async (event: FormEvent) => {
    event.preventDefault()
    if (!newDiscipline.title.trim()) {
      setError('Введите название дисциплины')
      return
    }
    try {
      setCreating(true)
      setError(null)
      const response = await fetch('/api/students/library/disciplines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDiscipline,
          order: Number(newDiscipline.order) || 0
        })
      })
      if (!response.ok) {
        throw new Error('Не удалось создать дисциплину')
      }
      setNewDiscipline(defaultDisciplineForm)
      await loadDisciplines(search)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Ошибка при создании дисциплины')
    } finally {
      setCreating(false)
    }
  }

  const updateDisciplineField = (id: string, field: keyof StudentDiscipline, value: string | number | boolean) => {
    setDisciplines((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const saveDiscipline = async (id: string) => {
    const target = disciplines.find((discipline) => discipline.id === id)
    if (!target) return
    try {
      setSavingId(id)
      setError(null)
      const response = await fetch(`/api/students/library/disciplines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: target.title,
          description: target.description,
          order: target.order,
          isActive: target.isActive
        })
      })
      if (!response.ok) {
        throw new Error('Не удалось сохранить изменения')
      }
      await loadDisciplines(search)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Ошибка при сохранении дисциплины')
    } finally {
      setSavingId(null)
    }
  }

  const deleteDiscipline = async (id: string) => {
    if (!window.confirm('Удалить дисциплину и все связанные материалы?')) {
      return
    }
    try {
      setDeletingId(id)
      setError(null)
      const response = await fetch(`/api/students/library/disciplines/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('Не удалось удалить дисциплину')
      }
      await loadDisciplines(search)
      setExpandedId((current) => (current === id ? null : current))
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Ошибка при удалении дисциплины')
    } finally {
      setDeletingId(null)
    }
  }

  const toggleDiscipline = (id: string) => {
    setExpandedId((current) => (current === id ? null : id))
  }

  const updateMaterialForm = (disciplineId: string, updater: Partial<MaterialFormState>) => {
    setMaterialForms((prev) => ({
      ...prev,
      [disciplineId]: {
        ...(prev[disciplineId] || defaultMaterialForm),
        ...updater
      }
    }))
  }

  const handleMaterialUpload = async (disciplineId: string) => {
    const form = materialForms[disciplineId] || defaultMaterialForm
    if (!form.file) {
      setError('Выберите файл методички')
      return
    }
    try {
      setMaterialUploads(disciplineId)
      setError(null)
      const formData = new FormData()
      if (form.title.trim()) {
        formData.append('title', form.title.trim())
      }
      formData.append('file', form.file)
      const response = await fetch(`/api/students/library/disciplines/${disciplineId}/materials`, {
        method: 'POST',
        body: formData
      })
      if (!response.ok) {
        throw new Error('Не удалось загрузить файл')
      }
      updateMaterialForm(disciplineId, defaultMaterialForm)
      await loadDisciplines(search)
      setExpandedId(disciplineId)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке файла')
    } finally {
      setMaterialUploads(null)
    }
  }

  const updateMaterialTitle = (materialId: string, value: string) => {
    setMaterialTitles((prev) => ({
      ...prev,
      [materialId]: value
    }))
  }

  const saveMaterialTitle = async (materialId: string) => {
    const title = mappedMaterialTitles[materialId]
    if (!title?.trim()) {
      setError('Название методички не может быть пустым')
      return
    }
    try {
      setMaterialSavingId(materialId)
      setError(null)
      const response = await fetch(`/api/students/library/materials/${materialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() })
      })
      if (!response.ok) {
        throw new Error('Не удалось сохранить название')
      }
      await loadDisciplines(search)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении методички')
    } finally {
      setMaterialSavingId(null)
    }
  }

  const deleteMaterial = async (materialId: string) => {
    if (!window.confirm('Удалить методичку?')) return
    try {
      setMaterialDeletingId(materialId)
      setError(null)
      const response = await fetch(`/api/students/library/materials/${materialId}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('Не удалось удалить файл')
      }
      await loadDisciplines(search)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Ошибка при удалении методички')
    } finally {
      setMaterialDeletingId(null)
    }
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Назад
          </button>
          <button
            onClick={() => loadDisciplines(search)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaSyncAlt className="mr-2" />
            Обновить
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Библиотека для студентов</h1>
          <p className="text-lg text-gray-600">Управление дисциплинами и методическими материалами</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
              <div className="flex items-center border rounded-md px-3 py-2">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Введите название дисциплины или методички"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                  className="flex-1 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FaSearch className="mr-2" />
                Найти
              </button>
              <button
                onClick={resetSearch}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Сбросить
              </button>
            </div>
          </div>

          <form onSubmit={handleCreateDiscipline} className="border-t pt-4 mt-4">
            <div className="flex items-center mb-4">
              <FaBookOpen className="text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Новая дисциплина</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
                <input
                  type="text"
                  value={newDiscipline.title}
                  onChange={(event) =>
                    setNewDiscipline((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Например, Математика"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Порядок</label>
                <input
                  type="number"
                  value={newDiscipline.order}
                  onChange={(event) =>
                    setNewDiscipline((prev) => ({ ...prev, order: Number(event.target.value) }))
                  }
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  value={newDiscipline.description}
                  onChange={(event) =>
                    setNewDiscipline((prev) => ({ ...prev, description: event.target.value }))
                  }
                  rows={2}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Кратко опишите содержимое дисциплины"
                />
              </div>
              <label className="inline-flex items-center mt-2">
                <input
                  type="checkbox"
                  checked={newDiscipline.isActive}
                  onChange={(event) =>
                    setNewDiscipline((prev) => ({ ...prev, isActive: event.target.checked }))
                  }
                  className="mr-2"
                />
                Доступно студентам
              </label>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-70"
            >
              <FaPlus className="mr-2" />
              {creating ? 'Сохранение...' : 'Добавить дисциплину'}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="bg-white shadow rounded-lg p-6 text-center text-gray-600">
              Загрузка дисциплин...
            </div>
          ) : disciplines.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center text-gray-600">
              Пока нет дисциплин. Создайте первую в форме выше.
            </div>
          ) : (
            disciplines.map((discipline) => (
              <div key={discipline.id} className="bg-white shadow rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleDiscipline(discipline.id)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-gray-900">{discipline.title}</h3>
                      {!discipline.isActive && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          скрыто
                        </span>
                      )}
                    </div>
                    {discipline.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {discipline.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Материалов: {discipline.materials?.length || 0}
                    </p>
                  </div>
                  {expandedId === discipline.id ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </button>

                {expandedId === discipline.id && (
                  <div className="border-t px-6 py-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Название
                        </label>
                        <input
                          type="text"
                          value={discipline.title}
                          onChange={(event) =>
                            updateDisciplineField(discipline.id, 'title', event.target.value)
                          }
                          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Порядок
                        </label>
                        <input
                          type="number"
                          value={discipline.order}
                          onChange={(event) =>
                            updateDisciplineField(
                              discipline.id,
                              'order',
                              Number(event.target.value)
                            )
                          }
                          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Описание
                        </label>
                        <textarea
                          value={discipline.description || ''}
                          onChange={(event) =>
                            updateDisciplineField(discipline.id, 'description', event.target.value)
                          }
                          rows={2}
                          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <label className="inline-flex items-center mt-2">
                        <input
                          type="checkbox"
                          checked={discipline.isActive}
                          onChange={(event) =>
                            updateDisciplineField(discipline.id, 'isActive', event.target.checked)
                          }
                          className="mr-2"
                        />
                        Показать студентам
                      </label>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => saveDiscipline(discipline.id)}
                        disabled={savingId === discipline.id}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
                      >
                        <FaSave className="mr-2" />
                        {savingId === discipline.id ? 'Сохранение...' : 'Сохранить'}
                      </button>
                      <button
                        onClick={() => deleteDiscipline(discipline.id)}
                        disabled={deletingId === discipline.id}
                        className="inline-flex items-center px-4 py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-60"
                      >
                        <FaTrash className="mr-2" />
                        {deletingId === discipline.id ? 'Удаление...' : 'Удалить'}
                      </button>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Методические материалы
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="md:col-span-2 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Название файла
                            </label>
                            <input
                              type="text"
                              value={(materialForms[discipline.id]?.title) || ''}
                              onChange={(event) =>
                                updateMaterialForm(discipline.id, { title: event.target.value })
                              }
                              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Например, Практикум по теме №1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Файл
                            </label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.txt,.rtf"
                              onChange={(event) =>
                                updateMaterialForm(discipline.id, {
                                  file: event.target.files?.[0] || null
                                })
                              }
                              className="w-full text-sm text-gray-700"
                            />
                          </div>
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => handleMaterialUpload(discipline.id)}
                            disabled={materialUploads === discipline.id}
                            className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-60"
                          >
                            <FaUpload className="mr-2" />
                            {materialUploads === discipline.id ? 'Загрузка...' : 'Загрузить'}
                          </button>
                        </div>
                      </div>

                      <div className="divide-y rounded-lg border">
                        {discipline.materials.length === 0 ? (
                          <div className="p-4 text-sm text-gray-500 text-center">
                            Пока нет загруженных материалов
                          </div>
                        ) : (
                          discipline.materials.map((material) => (
                            <div
                              key={material.id}
                              className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                            >
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={mappedMaterialTitles[material.id] || ''}
                                  onChange={(event) =>
                                    updateMaterialTitle(material.id, event.target.value)
                                  }
                                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  {material.fileName}
                                  {material.fileSize && ` • ${formatSize(material.fileSize)}`}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => saveMaterialTitle(material.id)}
                                  disabled={materialSavingId === material.id}
                                  className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-60"
                                >
                                  <FaSave className="mr-2" />
                                  {materialSavingId === material.id ? 'Сохранение...' : 'Сохранить'}
                                </button>
                                <a
                                  href={`/uploads/${material.fileUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                  Скачать
                                </a>
                                <button
                                  onClick={() => deleteMaterial(material.id)}
                                  disabled={materialDeletingId === material.id}
                                  className="inline-flex items-center px-3 py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-60"
                                >
                                  <FaTrash className="mr-2" />
                                  {materialDeletingId === material.id ? 'Удаление...' : 'Удалить'}
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
