import { useState, useEffect } from 'react';
import { FaSave, FaSpinner} from 'react-icons/fa';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    phone: '',
    email: '',
    address: '',
    vkLink: '',
    telegram: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Загрузка настроек при монтировании
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
      setMessage('Ошибка загрузки настроек');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage('Настройки успешно сохранены!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Ошибка сохранения настроек');
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      setMessage('Ошибка сохранения настроек');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2 text-gray-600">Загрузка настроек...</span>
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
              onClick={loadSettings}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Настройки сайта</h1>
            <p className="text-lg text-gray-600">Управление контактными данными и ссылками</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-blue-600 text-white">
          <h1 className="text-2xl font-bold">Настройки сайта</h1>
          <p className="text-blue-100 mt-1">Управление контактными данными и ссылками</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Контактная информация */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Контактная информация</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+7 (XXX) XXX-XX-XX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="info@example.com"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Адрес
              </label>
              <textarea
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Полный адрес организации"
              />
            </div>
          </div>

          {/* Социальные сети */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Социальные сети</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ссылка на Telegram
                </label>
                <input
                  type="url"
                  value={settings.telegram}
                  onChange={(e) => handleChange('telegram', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://t.me/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ссылка на VK
                </label>
                <input
                  type="url"
                  value={settings.vkLink}
                  onChange={(e) => handleChange('vkLink', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://vk.com/group"
                />
              </div>
            </div>
          </div>

          {/* Сообщение о статусе */}
          {message && (
            <div className={`p-4 rounded-md ${message.includes('успешно') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message}
            </div>
          )}

          {/* Кнопка сохранения */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Сохранение...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Сохранить изменения
                </>
              )}
            </button>
          </div>
        </form>
      </div>
        </div>
      </div>
    </div>
  );
}