import { useState, useEffect } from 'react';
import { FaBell, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Anons() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Скролл к верху страницы при загрузке
    window.scrollTo(0, 0);
  }, []);

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

  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка объявлений...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Героическая секция с заголовком */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="text-center">
            <FaBell className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Объявления</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Все актуальные объявления для студентов техникума
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        {/* Кнопка назад */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/students')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Назад к студенческому порталу
          </button>
        </div>

        {/* Список всех объявлений */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center mb-6">
            <FaBell className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Все объявления</h2>
          </div>

          <div className="space-y-4">
            {announcements.length > 0 ? announcements.map((announcement: any, index: number) => (
              <div
                key={announcement.id || index}
                className={`p-6 rounded-lg border-l-4 animate-slide-up ${
                  announcement.urgent
                    ? 'border-red-500 bg-red-50'
                    : 'border-blue-500 bg-blue-50'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                  {announcement.urgent && (
                    <span className="flex items-center text-sm bg-red-500 text-white px-3 py-1 rounded-full">
                      <FaExclamationTriangle className="w-4 h-4 mr-1" />
                      СРОЧНО
                    </span>
                  )}
                </div>
                <p className="text-gray-700 mb-3 leading-relaxed whitespace-pre-line break-words">{announcement.content}</p>
                <div className="text-sm text-gray-500 border-t pt-2">
                  Опубликовано: {announcement.date}
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-400 py-12">
                <FaBell className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Нет объявлений</h3>
                <p className="text-gray-500">Объявления появятся здесь в ближайшее время</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}