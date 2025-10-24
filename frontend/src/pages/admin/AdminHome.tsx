import { useState, useEffect } from 'react';
import { FaImage, FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AdminHome() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any>(null);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      const response = await fetch('/api/home-slider/all');
      const data = await response.json();
      setSlides(data);
    } catch (error) {
      console.error('Error loading slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadSlide = async (formData: FormData) => {
    try {
      const response = await fetch('/api/home-slider', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Слайд загружен успешно!');
        loadSlides();
        setShowUploadForm(false);
      } else {
        alert('Ошибка при загрузке слайда');
      }
    } catch (error) {
      console.error('Error uploading slide:', error);
      alert('Ошибка при загрузке слайда');
    }
  };

  const updateSlide = async (id: string, data: any) => {
    try {
      const response = await fetch(`/api/home-slider/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Слайд обновлен успешно!');
        loadSlides();
        setEditingSlide(null);
      } else {
        alert('Ошибка при обновлении слайда');
      }
    } catch (error) {
      console.error('Error updating slide:', error);
      alert('Ошибка при обновлении слайда');
    }
  };

  const deleteSlide = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот слайд?')) {
      try {
        await fetch(`/api/home-slider/${id}`, {
          method: 'DELETE',
        });
        setSlides(slides.filter(slide => slide.id !== id));
      } catch (error) {
        console.error('Error deleting slide:', error);
        alert('Ошибка при удалении слайда');
      }
    }
  };

  const toggleSlideActive = async (id: string, isActive: boolean) => {
    // Получить текущий слайд для сохранения всех полей
    const slide = slides.find(s => s.id === id);
    if (slide) {
      await updateSlide(id, {
        title: slide.title,
        subtitle: slide.subtitle,
        link: slide.link,
        order: slide.order,
        isActive: !isActive
      });
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await uploadSlide(formData);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
      link: formData.get('link'),
      order: formData.get('order'),
      isActive: formData.get('isActive') === 'on'
    };
    await updateSlide(editingSlide.id, data);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                onClick={loadSlides}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Обновить
              </button>
            </div>

            {/* Заголовок */}
            <div className="text-center mt-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление слайдами главной страницы</h1>
              <p className="text-lg text-gray-600">Создание и редактирование слайдов для главной страницы</p>
            </div>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">

              {/* Форма загрузки нового слайда */}
              {showUploadForm && (
                <div className="bg-white shadow rounded-lg mb-8 p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Добавить новый слайд</h2>
                  <form onSubmit={handleUploadSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Заголовок
                        </label>
                        <input
                          type="text"
                          name="title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Введите заголовок слайда (необязательно)"
                        />
                        <p className="text-xs text-gray-500 mt-1">Оставьте пустым, если не нужен заголовок на баннере</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Подзаголовок
                        </label>
                        <input
                          type="text"
                          name="subtitle"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Введите подзаголовок"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ссылка
                      </label>
                      <input
                        type="url"
                        name="link"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Порядок отображения
                        </label>
                        <input
                          type="number"
                          name="order"
                          defaultValue="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="isActive"
                          defaultChecked
                          className="mr-2"
                        />
                        <label className="text-sm font-medium text-gray-700">Активен</label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Изображение *
                      </label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Формат: 23:9 (широкоформатное изображение). Максимальный размер: 5MB.
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Загрузить слайд
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowUploadForm(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Форма редактирования слайда */}
              {editingSlide && (
                <div className="bg-white shadow rounded-lg mb-8 p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Редактировать слайд</h2>
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Заголовок
                        </label>
                        <input
                          type="text"
                          name="title"
                          defaultValue={editingSlide.title}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Оставьте пустым, если не нужен заголовок на баннере</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Подзаголовок
                        </label>
                        <input
                          type="text"
                          name="subtitle"
                          defaultValue={editingSlide.subtitle || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ссылка
                      </label>
                      <input
                        type="url"
                        name="link"
                        defaultValue={editingSlide.link || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Порядок отображения
                        </label>
                        <input
                          type="number"
                          name="order"
                          defaultValue={editingSlide.order}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="isActive"
                          defaultChecked={editingSlide.isActive}
                          className="mr-2"
                        />
                        <label className="text-sm font-medium text-gray-700">Активен</label>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Сохранить изменения
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingSlide(null)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Список слайдов */}
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
                  <button
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    Добавить слайд
                  </button>
                </div>
                <div className="p-6">
                  {loading ? (
                    <p className="text-gray-600">Загрузка слайдов...</p>
                  ) : slides.length > 0 ? (
                    <div className="space-y-6">
                      {slides.map((slide) => (
                        <div key={slide.id} className="border rounded-lg p-4">
                          <div className="flex items-start space-x-4">
                            <img
                              src={slide.imageUrl}
                              alt={slide.title}
                              className="w-32 h-20 object-cover rounded-md flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-image.png';
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-lg text-gray-900">{slide.title}</h3>
                                  {slide.subtitle && (
                                    <p className="text-gray-600 text-sm mt-1">{slide.subtitle}</p>
                                  )}
                                  {slide.link && (
                                    <p className="text-blue-600 text-sm mt-1">{slide.link}</p>
                                  )}
                                  <div className="flex items-center mt-2 space-x-4">
                                    <span className="text-xs text-gray-500">Порядок: {slide.order}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      slide.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {slide.isActive ? 'Активен' : 'Неактивен'}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => toggleSlideActive(slide.id, slide.isActive)}
                                    className={`p-2 rounded-md text-sm ${
                                      slide.isActive
                                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                                    }`}
                                    title={slide.isActive ? 'Скрыть слайд' : 'Показать слайд'}
                                  >
                                    {slide.isActive ? <FaEyeSlash /> : <FaEye />}
                                  </button>
                                  <button
                                    onClick={() => setEditingSlide(slide)}
                                    className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-md text-sm"
                                    title="Редактировать"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => deleteSlide(slide.id)}
                                    className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-md text-sm"
                                    title="Удалить"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      <FaImage className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Слайды не найдены</p>
                      <p className="text-sm">Добавьте первый слайд для главной страницы</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}