import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBell, FaExclamationTriangle } from 'react-icons/fa';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  urgent: boolean;
}

export default function AdminAnons() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Форма
  const [form, setForm] = useState({
    title: '',
    content: '',
    urgent: false
  });

  const [errors, setErrors] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const response = await fetch('/api/schedule/announcements');
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: '',
      content: ''
    };

    if (!form.title.trim()) {
      newErrors.title = 'Заголовок обязателен для заполнения';
    }

    if (!form.content.trim()) {
      newErrors.content = 'Содержание объявления обязательно для заполнения';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleCreateAnnouncement = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch('/api/schedule/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        setShowModal(false);
        setForm({ title: '', content: '', urgent: false });
        setErrors({ title: '', content: '' });
        loadAnnouncements();
      } else {
        console.error('Failed to create announcement:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  const handleUpdateAnnouncement = async () => {
    if (!editingAnnouncement || !validateForm()) return;

    try {
      const response = await fetch(`/api/schedule/announcements/${editingAnnouncement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingAnnouncement(null);
        setForm({ title: '', content: '', urgent: false });
        setErrors({ title: '', content: '' });
        loadAnnouncements();
      } else {
        console.error('Failed to update announcement:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить это объявление?')) return;

    try {
      const response = await fetch(`/api/schedule/announcements/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadAnnouncements();
      } else {
        console.error('Failed to delete announcement:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const openModal = (announcement?: Announcement) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setForm({
        title: announcement.title,
        content: announcement.content,
        urgent: announcement.urgent
      });
    } else {
      setEditingAnnouncement(null);
      setForm({ title: '', content: '', urgent: false });
    }
    setErrors({ title: '', content: '' });
    setShowModal(true);
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
              onClick={loadAnnouncements}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление объявлениями</h1>
            <p className="text-lg text-gray-600">Создание и редактирование объявлений для студентов</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <button
                onClick={() => openModal()}
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Добавить объявление
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      announcement.urgent
                        ? 'border-red-500 bg-red-50'
                        : 'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                          {announcement.urgent && (
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full flex items-center">
                              <FaExclamationTriangle className="w-3 h-3 mr-1" />
                              СРОЧНО
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                        <div className="text-xs text-gray-500">{announcement.date}</div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => openModal(announcement)}
                          className="text-blue-600 hover:text-blue-700 p-2"
                          title="Редактировать"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                          title="Удалить"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {announcements.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <FaBell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Нет объявлений</p>
                    <p className="text-sm">Добавьте первое объявление для студентов</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Модальное окно */}
            {showModal && (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white border border-gray-300 rounded-lg p-6 w-full max-w-md shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingAnnouncement ? 'Редактировать объявление' : 'Добавить объявление'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({...form, title: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Изменения в расписании"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Содержание</label>
                    <textarea
                      value={form.content}
                      onChange={(e) => setForm({...form, content: e.target.value})}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="В связи с производственной практикой..."
                    />
                    {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="urgent"
                      checked={form.urgent}
                      onChange={(e) => setForm({...form, urgent: e.target.checked})}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="urgent" className="ml-2 block text-sm text-gray-900">
                      Срочное объявление
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingAnnouncement(null);
                      setForm({ title: '', content: '', urgent: false });
                      setErrors({ title: '', content: '' });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={editingAnnouncement ? handleUpdateAnnouncement : handleCreateAnnouncement}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingAnnouncement ? 'Сохранить' : 'Создать'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}