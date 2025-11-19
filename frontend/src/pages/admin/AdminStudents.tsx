import { useEffect, useState } from 'react'
import type { IconType } from 'react-icons'
import {
  FaGraduationCap,
  FaFileAlt,
  FaUsers,
  FaDownload,
  FaHome,
  FaUtensils,
  FaHeart,
  FaLaptop,
  FaHandsHelping,
  FaBook,
  FaInfoCircle,
  FaUniversity,
  FaBriefcase
} from 'react-icons/fa'

interface StudentService {
  id: string
  title: string
  description: string
  url?: string
  icon: string
  order: number
  isActive: boolean
}

interface StudentDocument {
  id: string
  title: string
  description?: string
  fileUrl: string
  fileName: string
  fileSize: number
  fileType: string
  category?: string
  isActive: boolean
  order: number
}

interface StudentLifeItem {
  id: string
  title: string
  description: string
  images: string[]
}

const SERVICE_ICON_OPTIONS: Array<{ value: string; label: string; icon: IconType }> = [
  { value: 'FaHome', label: 'Дом / общежитие', icon: FaHome },
  { value: 'FaUtensils', label: 'Питание / столовая', icon: FaUtensils },
  { value: 'FaHeart', label: 'Здоровье и поддержка', icon: FaHeart },
  { value: 'FaGraduationCap', label: 'Учёба и расписание', icon: FaGraduationCap },
  { value: 'FaLaptop', label: 'Онлайн‑сервисы', icon: FaLaptop },
  { value: 'FaHandsHelping', label: 'Волонтёры и помощь', icon: FaHandsHelping },
  { value: 'FaBook', label: 'Библиотека и материалы', icon: FaBook },
  { value: 'FaInfoCircle', label: 'Справочная информация', icon: FaInfoCircle },
  { value: 'FaUniversity', label: 'Приёмная комиссия', icon: FaUniversity },
  { value: 'FaBriefcase', label: 'Карьерный центр', icon: FaBriefcase }
]

const SERVICE_ICON_MAP: Record<string, IconType> = SERVICE_ICON_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.icon
  return acc
}, {} as Record<string, IconType>)

export default function AdminStudents() {
  const [services, setServices] = useState<StudentService[]>([])
  const [savingServiceId, setSavingServiceId] = useState<string | null>(null)
  const [documents, setDocuments] = useState<StudentDocument[]>([])
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', file: null as File | null })
  const [studentLife, setStudentLife] = useState<StudentLifeItem[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [loadingDocuments, setLoadingDocuments] = useState(true)
  const [loadingStudentLife, setLoadingStudentLife] = useState(true)
  const [savingLife, setSavingLife] = useState(false)

  useEffect(() => {
    loadServices()
    loadDocuments()
    loadStudentLife()
  }, [])

  const loadServices = async () => {
    try {
      const response = await fetch('/api/students/services/all')
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoadingServices(false)
    }
  }

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/student-documents/all')
      const data = await response.json()
      setDocuments(data)
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoadingDocuments(false)
    }
  }

  const loadStudentLife = async () => {
    try {
      const response = await fetch('/api/student-life/all')
      const data = await response.json()
      setStudentLife(data)
    } catch (error) {
      console.error('Error loading student life:', error)
    } finally {
      setLoadingStudentLife(false)
    }
  }

  const updateService = (id: string, field: keyof StudentService, value: unknown) => {
    setServices((prev) => prev.map((service) => (service.id === id ? { ...service, [field]: value } : service)))
  }

  const addService = () => {
    setServices((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        title: 'Новый сервис',
        description: 'Краткое описание сервиса',
        url: '',
        icon: 'FaHome',
        order: prev.length,
        isActive: true
      }
    ])
  }

  const saveService = async (service: StudentService) => {
    if (!service.title.trim()) {
      alert('Заполните название сервиса')
      return
    }

    const isNew = service.id.startsWith('temp-')
    const url = isNew ? '/api/students/services' : `/api/students/services/${service.id}`
    const method = isNew ? 'POST' : 'PUT'

    try {
      setSavingServiceId(service.id)
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: service.title,
          description: service.description,
          url: service.url,
          icon: service.icon,
          order: service.order,
          isActive: service.isActive
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save service')
      }

      const payload = await response.json()
      setServices((prev) => prev.map((item) => (item.id === service.id ? payload : item)))
      alert('Сервис сохранён')
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Ошибка при сохранении сервиса')
    } finally {
      setSavingServiceId(null)
    }
  }

  const removeService = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить сервис?')) return

    if (id.startsWith('temp-')) {
      setServices((prev) => prev.filter((service) => service.id !== id))
      return
    }

    try {
      await fetch(`/api/students/services/${id}`, { method: 'DELETE' })
      setServices((prev) => prev.filter((service) => service.id !== id))
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Ошибка при удалении сервиса')
    }
  }

  const handleServiceIcon = (id: string, value: string) => {
    updateService(id, 'icon', value)
  }

  const addDocument = () => {
    setShowUploadForm(true)
    setUploadForm({ title: '', description: '', file: null })
  }

  const uploadDocument = async () => {
    if (!uploadForm.file || !uploadForm.title.trim()) {
      alert('Укажите название и выберите файл')
      return
    }

    const formData = new FormData()
    formData.append('file', uploadForm.file)
    formData.append('title', uploadForm.title)
    formData.append('description', uploadForm.description || '')

    try {
      const response = await fetch('/api/student-documents', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to upload')

      alert('Документ загружен')
      setShowUploadForm(false)
      loadDocuments()
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Ошибка при загрузке документа')
    }
  }

  const removeDocument = async (id: string) => {
    if (!confirm('Удалить документ?')) return

    try {
      await fetch(`/api/student-documents/${id}`, { method: 'DELETE' })
      setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Ошибка при удалении документа')
    }
  }

  const updateStudentLifeField = (id: string, field: keyof StudentLifeItem, value: unknown) => {
    setStudentLife((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const addStudentLife = () => {
    setStudentLife((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        title: 'Новое мероприятие',
        description: 'Описание мероприятия',
        images: []
      }
    ])
  }

  const saveStudentLifeChanges = async () => {
    setSavingLife(true)
    try {
      for (const item of studentLife) {
        if (item.id.startsWith('temp-')) {
          await fetch('/api/student-life', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: item.title, description: item.description, images: item.images })
          })
        } else {
          await fetch(`/api/student-life/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          })
        }
      }
      alert('Изменения сохранены')
      loadStudentLife()
    } catch (error) {
      console.error('Error saving student life:', error)
      alert('Ошибка при сохранении данных')
    } finally {
      setSavingLife(false)
    }
  }

  const uploadStudentLifeImages = async (files: FileList) => {
    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append('files', file))

    const response = await fetch('/api/upload/student-life/images', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to upload images')
    }

    const payload = await response.json()
    return payload.files?.map((file: { url: string }) => file.url) ?? []
  }

  const removeStudentLifeImage = (itemId: string, index: number) => {
    setStudentLife((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, images: item.images.filter((_, idx) => idx !== index) } : item
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto space-y-8 px-4">
        {/* Services */}
        <section className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center">
              <FaUsers className="w-5 h-5 text-blue-600 mr-2" />
              Студенческие сервисы
            </h2>
            <button onClick={addService} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
              Добавить сервис
            </button>
          </div>
          <div className="p-6">
            {loadingServices ? (
              <p className="text-gray-600">Загрузка...</p>
            ) : (
              <div className="space-y-6">
                {services.map((service) => (
                  <div key={service.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => updateService(service.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Иконка</label>
                        <div className="flex items-center space-x-3">
                          <select
                            value={service.icon}
                            onChange={(e) => handleServiceIcon(service.id, e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                          >
                            {SERVICE_ICON_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <div className="w-12 h-12 border rounded-lg flex items-center justify-center bg-gray-50">
                            {(() => {
                              const IconPreview = SERVICE_ICON_MAP[service.icon]
                              return IconPreview ? <IconPreview className="w-6 h-6 text-blue-600" /> : '—'
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                      <textarea
                        value={service.description}
                        onChange={(e) => updateService(service.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                      <input
                        type="text"
                        value={service.url || ''}
                        onChange={(e) => updateService(service.id, 'url', e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={service.isActive}
                          onChange={(e) => updateService(service.id, 'isActive', e.target.checked)}
                        />
                        Активно
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => saveService(service)}
                          disabled={savingServiceId === service.id}
                          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1 rounded-md text-sm"
                        >
                          {savingServiceId === service.id ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <button
                          onClick={() => removeService(service.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Documents */}
        <section className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center">
              <FaFileAlt className="w-5 h-5 text-green-600 mr-2" />
              Документы
            </h2>
            <button onClick={addDocument} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
              Добавить документ
            </button>
          </div>
          <div className="p-6 space-y-4">
            {showUploadForm && (
              <div className="border rounded-lg p-4 space-y-3">
                <input
                  type="text"
                  placeholder="Название"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm((prev) => ({ ...prev, title: e.target.value }))}
                />
                <textarea
                  placeholder="Описание"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm((prev) => ({ ...prev, description: e.target.value }))}
                />
                <input
                  type="file"
                  onChange={(e) => setUploadForm((prev) => ({ ...prev, file: e.target.files?.[0] || null }))}
                />
                <div className="flex space-x-2">
                  <button onClick={uploadDocument} className="bg-green-600 text-white px-3 py-1 rounded-md text-sm">
                    Загрузить
                  </button>
                  <button onClick={() => setShowUploadForm(false)} className="px-3 py-1 rounded-md text-sm border">
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {loadingDocuments ? (
              <p className="text-gray-600">Загрузка...</p>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{doc.title}</p>
                    <p className="text-sm text-gray-600">{doc.description}</p>
                    <button
                      onClick={() => window.open(`/uploads/${doc.fileUrl}`, '_blank')}
                      className="text-blue-600 hover:text-blue-700 text-sm flex items-center mt-2"
                    >
                      <FaDownload className="w-4 h-4 mr-1" />
                      Скачать
                    </button>
                  </div>
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Удалить
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Student life */}
        <section className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center">
              <FaGraduationCap className="w-5 h-5 text-purple-600 mr-2" />
              Студенческая жизнь
            </h2>
            <div className="space-x-2">
              <button
                onClick={saveStudentLifeChanges}
                disabled={savingLife}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1 rounded-md text-sm"
              >
                {savingLife ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button onClick={addStudentLife} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                Добавить
              </button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {loadingStudentLife ? (
              <p className="text-gray-600">Загрузка...</p>
            ) : (
              studentLife.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-4">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateStudentLifeField(item.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={item.description}
                    onChange={(e) => updateStudentLifeField(item.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Фотографии</label>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {item.images.map((url, index) => (
                        <div key={url} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                          <img src={url} className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeStudentLifeImage(item.id, index)}
                            className="absolute top-1 right-1 text-xs bg-red-600 text-white px-1 rounded"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="file"
                      multiple
                      onChange={async (e) => {
                        if (!e.target.files?.length) return
                        try {
                          const urls = await uploadStudentLifeImages(e.target.files)
                          updateStudentLifeField(item.id, 'images', [...item.images, ...urls])
                        } catch (error) {
                          console.error('Error uploading images:', error)
                          alert('Ошибка при загрузке изображений')
                        }
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
