import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash} from 'react-icons/fa';

interface News {
  id: number;
  title: string;
  slug: string;
  shortDescription: string | null;
  previewImage: string | null;
  publishedAt: string;
}

export default function AdminNews() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullText: '',
    previewImage: '',
    attachments: [] as string[],
    images: [] as string[]
  });

  // Загрузка новостей
  const loadNews = async () => {
    try {
      const response = await fetch('/api/news');
      if (response.ok) {
        const data = await response.json();
        setNews(data.news || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Сброс формы
  const resetForm = () => {
    setFormData({
      title: '',
      shortDescription: '',
      fullText: '',
      previewImage: '',
      attachments: [],
      images: []
    });
    setEditingNews(null);
    setShowForm(false);
  };

  // Создание/обновление новости
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingNews
        ? `/api/news/${editingNews.id}`
        : '/api/news';

      const method = editingNews ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        resetForm();
        loadNews();
      } else {
        const error = await response.json();
        alert(error.message || 'Ошибка сохранения новости');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка сохранения новости');
    }
  };

  // Удаление новости
  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту новость?')) return;

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadNews();
      } else {
        alert('Ошибка удаления новости');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка удаления новости');
    }
  };

  // Загрузка превью изображения
  const uploadPreview = async (file: File) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await fetch('/api/upload/news/preview', {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, previewImage: data.url });
      } else {
        alert('Ошибка загрузки превью');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка загрузки превью');
    }
  };

  // Загрузка изображений
  const uploadImages = async (files: FileList) => {
    const formDataUpload = new FormData();
    Array.from(files).forEach(file => {
      formDataUpload.append('files', file);
    });

    try {
      const response = await fetch('/api/upload/news/images', {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, images: [...formData.images, ...data.urls] });
      } else {
        alert('Ошибка загрузки изображений');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка загрузки изображений');
    }
  };

  // Загрузка документов
  const uploadDocuments = async (files: FileList) => {
    const formDataUpload = new FormData();
    Array.from(files).forEach(file => {
      formDataUpload.append('files', file);
    });

    try {
      const response = await fetch('/api/upload/news/documents', {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, attachments: [...formData.attachments, ...data.urls] });
      } else {
        alert('Ошибка загрузки документов');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка загрузки документов');
    }
  };

  // Удаление файла из списка
  const removeFile = (type: 'images' | 'attachments', index: number) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((_, i) => i !== index)
    });
  };

  // Редактирование новости
  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      shortDescription: newsItem.shortDescription || '',
      fullText: '', // Нужно загрузить полную новость
      previewImage: newsItem.previewImage || '',
      attachments: [],
      images: []
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
              onClick={loadNews}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление новостями</h1>
            <p className="text-lg text-gray-600">Создание и редактирование новостей техникума</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
          <h1 className="text-2xl font-bold">Управление новостями</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            Добавить новость
          </button>
        </div>

        <div className="p-6">
          {showForm ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Заголовок новости *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите заголовок новости"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Краткое описание
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Краткое описание новости"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Полный текст новости *
                </label>
                <textarea
                  required
                  value={formData.fullText}
                  onChange={(e) => setFormData({ ...formData, fullText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={8}
                  placeholder="Полный текст новости"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Превью изображение *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && uploadPreview(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.previewImage && (
                  <div className="mt-2">
                    <img src={`$formData.previewImage}`} alt="Preview" className="w-32 h-32 object-cover rounded" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Изображения для новости
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && uploadImages(e.target.files)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.images.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={`${image}`} alt={`Image ${index + 1}`} className="w-full h-20 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeFile('images', index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Документы и вложения
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.txt,.csv,.rtf"
                  multiple
                  onChange={(e) => e.target.files && uploadDocuments(e.target.files)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {formData.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <a href={`$attachment}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {attachment.split('/').pop()}
                        </a>
                        <button
                          type="button"
                          onClick={() => removeFile('attachments', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Удалить
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingNews ? 'Обновить' : 'Создать'} новость
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {news.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Новостей пока нет</p>
              ) : (
                news.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        {item.shortDescription && (
                          <p className="text-gray-600 mt-1">{item.shortDescription}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                          Опубликовано: {new Date(item.publishedAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800 p-2"
                          title="Редактировать"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="Удалить"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}
