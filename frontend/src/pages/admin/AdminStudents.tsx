import { useState, useEffect } from 'react';
import { FaGraduationCap, FaFileAlt, FaUsers, FaDownload } from 'react-icons/fa';

interface StudentService {
  id: string;
  title: string;
  description: string;
  url?: string;
  icon: string;
  order: number;
  isActive: boolean;
}

interface StudentDocument {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  category?: string;
  isActive: boolean;
  order: number;
}

interface StudentLifeItem {
  id: string;
  title: string;
  description: string;
  images: string[];
}

export default function AdminStudents() {
  const [services, setServices] = useState<StudentService[]>([]);
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    file: null as File | null
  });

  const [studentLife, setStudentLife] = useState<StudentLifeItem[]>([]);
  const [loadingStudentLife, setLoadingStudentLife] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    loadServices();
    loadDocuments();
    loadStudentLife();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch('/api/students/services/all');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/student-documents/all');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const loadStudentLife = async () => {
    try {
      const response = await fetch('/api/student-life/all');
      const data = await response.json();
      setStudentLife(data);
    } catch (error) {
      console.error('Error loading student life:', error);
    } finally {
      setLoadingStudentLife(false);
    }
  };


  const updateService = (id: string, field: string, value: unknown) => {
    setServices(services.map(service =>
      service.id === id ? { ...service, [field]: value } : service
    ));
  };

  const addService = () => {
    const newService = {
      id: `temp-${Date.now()}`,
      title: 'Новый сервис',
      description: 'Описание сервиса',
      url: '',
      icon: 'FaHome',
      order: services.length,
      isActive: true
    };
    setServices([...services, newService]);
  };

  const removeService = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот сервис?')) {
      try {
        await fetch(`/api/students/services/${id}`, {
          method: 'DELETE',
        });
        setServices(services.filter(service => service.id !== id));
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Ошибка при удалении сервиса');
      }
    }
  };

  const updateDocument = (id: string, field: string, value: unknown) => {
    setDocuments(documents.map(doc =>
      doc.id === id ? { ...doc, [field]: value } : doc
    ));
  };


  const uploadDocument = async () => {
    if (!uploadForm.file || !uploadForm.title.trim()) {
      alert('Пожалуйста, выберите файл и введите название документа');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description || '');

    try {
      const response = await fetch('/api/student-documents', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Документ загружен успешно!');
        loadDocuments();
        setShowUploadForm(false);
        setUploadForm({ title: '', description: '', file: null });
      } else {
        alert('Ошибка при загрузке документа');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Ошибка при загрузке документа');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const removeDocument = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот документ?')) {
      try {
        await fetch(`/api/student-documents/${id}`, {
          method: 'DELETE',
        });
        setDocuments(documents.filter(doc => doc.id !== id));
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Ошибка при удалении документа');
      }
    }
  };

  const updateStudentLife = (id: string, field: string, value: unknown) => {
    setStudentLife(studentLife.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const saveStudentLifeChanges = async () => {
    setSaving(true);
    try {
      for (const item of studentLife) {
        if (item.id && !item.id.startsWith('temp-')) {
          // Обновляем существующий
          await fetch(`/api/student-life/${item.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
          });
        } else {
          // Создаем новый
          const { id: _unused, ...itemData } = item;
          const response = await fetch('/api/student-life', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData),
          });
          const newItem = await response.json();
          item.id = newItem.id;
        }
      }
      alert('Изменения сохранены успешно!');
      loadStudentLife();
    } catch (error) {
      console.error('Error saving student life:', error);
      alert('Ошибка при сохранении изменений');
    } finally {
      setSaving(false);
    }
  };

  const uploadStudentLifeImages = async (files: FileList) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch('/api/upload/student-life/images', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.filenames; // Возвращаем массив имен файлов
      } else {
        throw new Error('Ошибка загрузки изображений');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
       
      throw error;
    }
  };

  const addStudentLife = () => {
    const newItem = {
      id: `temp-${Date.now()}`,
      title: 'Новое мероприятие',
      description: 'Описание мероприятия',
      images: []
    };
    setStudentLife([...studentLife, newItem]);
  };

  const removeStudentLife = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот элемент?')) {
      try {
        await fetch(`/api/student-life/${id}`, {
          method: 'DELETE',
        });
        setStudentLife(studentLife.filter((item: StudentLifeItem) => item.id !== id));
      } catch (error) {
        console.error('Error deleting student life item:', error);
        alert('Ошибка при удалении элемента');
      }
    }
  };

  const removeImageFromItem = (itemId: string, imageIndex: number) => {
    setStudentLife(studentLife.map((item: StudentLifeItem) =>
      item.id === itemId
        ? { ...item, images: item.images.filter((_: string, index: number) => index !== imageIndex) }
        : item
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Кнопка назад */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Назад
            </button>
            <button
              onClick={() => {
                loadServices();
                loadDocuments();
                loadStudentLife();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Обновить
            </button>
          </div>

          {/* Заголовок */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Студенческий портал - Администрирование</h1>
            <p className="text-lg text-gray-600">Управление сервисаами, документами и студенческой жизнью</p>
          </div>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Студенческие сервисы */}
              <div className="bg-white shadow rounded-lg mb-8">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <FaUsers className="w-5 h-5 mr-2 text-blue-600" />
                    Студенческие сервисы
                  </h2>
                  <button
                    onClick={addService}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Добавить сервис
                  </button>
                </div>
                <div className="p-6">
                  {loading ? (
                    <p className="text-gray-600">Загрузка сервисов...</p>
                  ) : (
                    <div className="space-y-6">
                      {services.map((service) => (
                        <div key={service.id} className="border rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Название сервиса
                              </label>
                              <input
                                type="text"
                                value={service.title}
                                onChange={(e) => updateService(service.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Иконка
                              </label>
                              <select
                                value={service.icon}
                                onChange={(e) => updateService(service.id, 'icon', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="FaHome">FaHome</option>
                                <option value="FaUtensils">FaUtensils</option>
                                <option value="FaHeart">FaHeart</option>
                                <option value="FaGraduationCap">FaGraduationCap</option>
                              </select>
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Описание
                            </label>
                            <input
                              type="text"
                              value={service.description}
                              onChange={(e) => updateService(service.id, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              URL ссылки
                            </label>
                            <input
                              type="text"
                              value={service.url || ''}
                              onChange={(e) => updateService(service.id, 'url', e.target.value)}
                              placeholder="https://example.com"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={service.isActive}
                                onChange={(e) => updateService(service.id, 'isActive', e.target.checked)}
                                className="mr-2"
                              />
                              <label className="text-sm font-medium text-gray-700">Активен</label>
                            </div>
                            <button
                              onClick={() => removeService(service.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Документы и справки */}
              <div className="bg-white shadow rounded-lg mb-8">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <FaFileAlt className="w-5 h-5 mr-2 text-green-600" />
                    Документы и справки
                  </h2>
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Новый документ
                  </button>
                </div>
                <div className="p-6">
                  {loadingDocuments ? (
                    <p className="text-gray-600">Загрузка документов...</p>
                  ) : (
                    <div className="space-y-4">
                      {/* Форма загрузки нового документа */}
                      {showUploadForm && (
                        <div className="border rounded-lg p-6 bg-blue-50">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Загрузка нового документа</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Название документа *
                              </label>
                              <input
                                type="text"
                                value={uploadForm.title}
                                onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Введите название документа"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Файл *
                              </label>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
                                onChange={handleFileSelect}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {uploadForm.file && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Выбран файл: {uploadForm.file.name}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Описание
                            </label>
                            <textarea
                              value={uploadForm.description}
                              onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Введите описание документа"
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="mt-4 flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setShowUploadForm(false);
                                setUploadForm({ title: '', description: '', file: null });
                              }}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
                            >
                              Отмена
                            </button>
                            <button
                              onClick={uploadDocument}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                            >
                              Загрузить
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Список документов */}
                      {documents.map((doc) => (
                        <div key={doc.id} className="border rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Название
                              </label>
                              <input
                                type="text"
                                value={doc.title}
                                onChange={(e) => updateDocument(doc.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Размер файла
                              </label>
                              <p className="text-sm text-gray-600 mt-2">
                                {(doc.fileSize / 1024).toFixed(1)} KB
                              </p>
                            </div>
                            <div className="flex items-end space-x-2">
                              <button
                                onClick={() => window.open(`/uploads/${doc.fileUrl}`, '_blank')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm flex items-center"
                              >
                                <FaDownload className="w-4 h-4 mr-1" />
                                Скачать
                              </button>
                            </div>
                            <div className="flex items-end">
                              <button
                                onClick={() => removeDocument(doc.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm"
                              >
                                Удалить
                              </button>
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Описание
                            </label>
                            <input
                              type="text"
                              value={doc.description || ''}
                              onChange={(e) => updateDocument(doc.id, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="mt-4 flex items-center">
                            <input
                              type="checkbox"
                              checked={doc.isActive}
                              onChange={(e) => updateDocument(doc.id, 'isActive', e.target.checked)}
                              className="mr-2"
                            />
                            <label className="text-sm font-medium text-gray-700">Активен</label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Студенческая жизнь */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <FaGraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                    Студенческая жизнь
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={saveStudentLifeChanges}
                      disabled={saving}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-1 rounded-md text-sm"
                    >
                      {saving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                    <button
                      onClick={addStudentLife}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Добавить
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {loadingStudentLife ? (
                    <p className="text-gray-600">Загрузка...</p>
                  ) : (
                    <div className="space-y-6">
                      {studentLife.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Название мероприятия
                              </label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateStudentLife(item.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Изображения ({item.images.length})
                              </label>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={async (e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    try {
                                      const filenames = await uploadStudentLifeImages(e.target.files);
                                      updateStudentLife(item.id, 'images', [...item.images, ...filenames]);
                                      e.target.value = ''; // Сбросить input
                                    } catch (error) {
                                      console.error('Error uploading images:', error);
                                      alert('Ошибка при загрузке изображений');
                                    }
                                  }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Описание
                            </label>
                            <textarea
                              value={item.description}
                              onChange={(e) => updateStudentLife(item.id, 'description', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          {item.images.length > 0 && (
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Загруженные изображения
                              </label>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {item.images.map((imageName: string, index: number) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={`/uploads/images/${imageName}`}
                                      alt={`Изображение ${index + 1}`}
                                      className="w-full h-20 object-cover rounded-md"
                                      onError={(e) => {
                                        e.currentTarget.src = '/placeholder-image.png';
                                      }}
                                    />
                                    <button
                                      onClick={() => removeImageFromItem(item.id, index)}
                                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => removeStudentLife(item.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm"
                            >
                              Удалить мероприятие
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}