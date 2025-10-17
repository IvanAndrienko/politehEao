import { useState, useEffect } from 'react';
import { FaHome, FaUtensils, FaHeart, FaGraduationCap, FaFileAlt, FaUsers } from 'react-icons/fa';

export default function AdminStudents() {
  const [services, setServices] = useState<any[]>([]);

  const [documents, setDocuments] = useState([
    { id: 1, name: 'Справка об обучении', format: 'PDF', description: 'Для предоставления по месту требования' },
    { id: 2, name: 'Академическая справка', format: 'PDF', description: 'С указанием изученных дисциплин и оценок' },
    { id: 3, name: 'Заявление на академический отпуск', format: 'DOC', description: 'Форма заявления для оформления отпуска' },
    { id: 4, name: 'Заявление на перевод', format: 'DOC', description: 'Для перевода на другую специальность/форму обучения' }
  ]);

  const [studentLife, setStudentLife] = useState([
    {
      id: 1,
      title: 'Творческие мероприятия',
      description: 'Участвуйте в концертах, фестивалях и творческих конкурсах',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Спорт и здоровье',
      description: 'Спортивные секции, соревнования и турниры для всех желающих',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Волонтерство',
      description: 'Социальные проекты и волонтерские программы для активных студентов',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop'
    }
  ]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  useEffect(() => {
    loadServices();
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

  const saveChanges = async () => {
    setSaving(true);
    try {
      // Сохраняем все сервисы через API
      for (const service of services) {
        if (service.id && !service.id.startsWith('temp-')) {
          // Обновляем существующий
          await fetch(`/api/students/services/${service.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(service),
          });
        } else {
          // Создаем новый
          const { id, ...serviceData } = service; // Убираем временный ID
          const response = await fetch('/api/students/services', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(serviceData),
          });
          const newService = await response.json();
          service.id = newService.id;
        }
      }
      alert('Изменения сохранены успешно!');
    } catch (error) {
      console.error('Error saving services:', error);
      alert('Ошибка при сохранении изменений');
    } finally {
      setSaving(false);
    }
  };

  const updateService = (id: string, field: string, value: any) => {
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

  const updateDocument = (id: number, field: string, value: any) => {
    setDocuments(documents.map(doc =>
      doc.id === id ? { ...doc, [field]: value } : doc
    ));
  };

  const updateStudentLife = (id: number, field: string, value: any) => {
    setStudentLife(studentLife.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addDocument = () => {
    const newId = Math.max(...documents.map(d => d.id)) + 1;
    setDocuments([...documents, {
      id: newId,
      name: 'Новый документ',
      format: 'PDF',
      description: 'Описание документа'
    }]);
  };

  const removeDocument = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const addStudentLife = () => {
    const newId = Math.max(...studentLife.map(s => s.id)) + 1;
    setStudentLife([...studentLife, {
      id: newId,
      title: 'Новое мероприятие',
      description: 'Описание мероприятия',
      image: '/placeholder-image.png'
    }]);
  };

  const removeStudentLife = (id: number) => {
    setStudentLife(studentLife.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Студенческий портал - Администрирование
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={saveChanges}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Выйти
              </button>
            </div>
          </div>
        </header>
        <main>
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
                    onClick={addDocument}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Добавить документ
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Название
                            </label>
                            <input
                              type="text"
                              value={doc.name}
                              onChange={(e) => updateDocument(doc.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Формат
                            </label>
                            <select
                              value={doc.format}
                              onChange={(e) => updateDocument(doc.id, 'format', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="PDF">PDF</option>
                              <option value="DOC">DOC</option>
                              <option value="DOCX">DOCX</option>
                              <option value="XLS">XLS</option>
                              <option value="XLSX">XLSX</option>
                            </select>
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
                            value={doc.description}
                            onChange={(e) => updateDocument(doc.id, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Студенческая жизнь */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <FaGraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                    Студенческая жизнь
                  </h2>
                  <button
                    onClick={addStudentLife}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Добавить мероприятие
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {studentLife.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="mb-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-32 object-cover rounded-md"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.png';
                            }}
                          />
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Название
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
                              Описание
                            </label>
                            <textarea
                              value={item.description}
                              onChange={(e) => updateStudentLife(item.id, 'description', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              URL изображения
                            </label>
                            <input
                              type="text"
                              value={item.image}
                              onChange={(e) => updateStudentLife(item.id, 'image', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <button
                            onClick={() => removeStudentLife(item.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm w-full"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}