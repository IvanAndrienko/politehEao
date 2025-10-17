import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  FaCalendar,
  FaFileAlt,
  FaAward,
  FaBell,
  FaHome,
  FaUtensils,
  FaHeart,
  FaGraduationCap,
  FaDownload
} from 'react-icons/fa';

export default function Students() {
  const navigate = useNavigate();

  // Быстрые ссылки для студентов Политехнического техникума
  const quickLinks = [
    {
      title: "Расписание занятий",
      icon: <FaCalendar className="w-6 h-6" />,
      description: "Актуальное расписание по группам и преподавателям",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Библиотека",
      icon: <FaFileAlt className="w-6 h-6" />,
      description: "Электронный каталог и учебные материалы",
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Стипендии",
      icon: <FaAward className="w-6 h-6" />,
      description: "Информация о стипендиальном обеспечении",
      color: "bg-yellow-600 hover:bg-yellow-700"
    }
  ];

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  useEffect(() => {
    loadAnnouncements();
    loadServices();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const response = await fetch('/api/schedule/announcements');
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const loadServices = async () => {
    try {
      const response = await fetch('/api/students/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoadingServices(false);
    }
  };

  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [documents, setDocuments] = useState([
    { name: "Справка об обучении", format: "PDF", description: "Для предоставления по месту требования" },
    { name: "Академическая справка", format: "PDF", description: "С указанием изученных дисциплин и оценок" },
    { name: "Заявление на академический отпуск", format: "DOC", description: "Форма заявления для оформления отпуска" },
    { name: "Заявление на перевод", format: "DOC", description: "Для перевода на другую специальность/форму обучения" }
  ]);

  const [studentLife, setStudentLife] = useState([
    {
      title: 'Творческие мероприятия',
      description: 'Участвуйте в концертах, фестивалях и творческих конкурсах',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'
    },
    {
      title: 'Спорт и здоровье',
      description: 'Спортивные секции, соревнования и турниры для всех желающих',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    },
    {
      title: 'Волонтерство',
      description: 'Социальные проекты и волонтерские программы для активных студентов',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop'
    }
  ]);

  const [loadingStudentData, setLoadingStudentData] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      // Здесь будет API вызов для загрузки данных студенческого портала
      // Пока используем заглушки
      await new Promise(resolve => setTimeout(resolve, 500)); // Имитация загрузки
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoadingStudentData(false);
    }
  };

  return (
    <div>
      {/* Героическая секция с заголовком */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="text-center">
            <FaGraduationCap className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Студенческий портал</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Все необходимые сервисы и информация для студентов техникума в одном месте
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        {/* Быстрый доступ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Быстрый доступ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => (
            <div
              key={index}
              onClick={() => {
                if (link.title === "Расписание занятий") {
                  navigate('/students/raspisanie');
                }
              }}
              className={`${link.color} text-white p-6 rounded-lg transition-colors block cursor-pointer hover:shadow-lg`}
            >
              <div className="flex items-center mb-3">
                {link.icon}
                <h3 className="font-semibold ml-3">{link.title}</h3>
              </div>
              <p className="text-sm opacity-90">{link.description}</p>
            </div>
          ))}
        </div>
        </section>

        {/* Объявления и события */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Объявления для студентов Политехнического техникума */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <FaBell className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Объявления</h2>
            </div>
            <div className="space-y-4">
              {loadingAnnouncements ? (
                <p className="text-gray-600">Загрузка объявлений...</p>
              ) : (
                announcements.slice(0, 3).map((announcement: any, index: number) => (
                  <div
                    key={announcement.id || index}
                    className={`p-4 rounded-lg border-l-4 ${
                      announcement.urgent
                        ? 'border-red-500 bg-red-50'
                        : 'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate pr-2" title={announcement.title}>
                        {announcement.title}
                      </h3>
                      {announcement.urgent && (
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full flex-shrink-0">
                          СРОЧНО
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2" title={announcement.content}>
                      {announcement.content}
                    </p>
                    <div className="text-xs text-gray-500">{announcement.date}</div>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => navigate('/students/anons')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Все объявления →
            </button>
          </div>

          {/* Студенческие сервисы */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <FaGraduationCap className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Студенческие сервисы</h2>
            </div>
            <div className="space-y-4">
              {loadingServices ? (
                <p className="text-gray-600">Загрузка сервисов...</p>
              ) : services.length > 0 ? (
                services.map((service: any, index: number) => (
                  <div
                    key={service.id || index}
                    className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      if (service.url) {
                        window.open(service.url, '_blank');
                      }
                    }}
                  >
                    <div className="mr-4">
                      {service.icon === 'FaHome' && <FaHome className="w-8 h-8 text-blue-600" />}
                      {service.icon === 'FaUtensils' && <FaUtensils className="w-8 h-8 text-green-600" />}
                      {service.icon === 'FaHeart' && <FaHeart className="w-8 h-8 text-red-600" />}
                      {service.icon === 'FaGraduationCap' && <FaGraduationCap className="w-8 h-8 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{service.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">Сервисы не настроены администратором</p>
              )}
            </div>
          </div>
        </div>


        {/* Документы и справки */}
        <section className="mb-12 bg-gray-50 py-12 -mx-4 px-4">
          <div className="max-w-screen-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Документы и справки</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documents.map((doc, index) => (
                <div key={index} className="bg-white border rounded-lg p-6 flex items-center">
                  <FaFileAlt className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{doc.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {doc.format}
                      </span>
                      <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center">
                        <FaDownload className="w-4 h-4 mr-1" />
                        Скачать
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Студенческая жизнь */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Студенческая жизнь</h2>
          {loadingStudentData ? (
            <p className="text-gray-600">Загрузка данных...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {studentLife.map((item, index) => (
                <div key={index} className="text-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.png';
                    }}
                  />
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Контакты поддержки */}
        <section className="bg-blue-900 text-white py-12 -mx-4 px-4 rounded-lg">
          <div className="max-w-screen-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Нужна помощь?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Наши специалисты готовы помочь вам решить любые вопросы, связанные с обучением и студенческой жизнью
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Деканат</h3>
                <p className="text-blue-100 text-sm">
                  Вопросы по учебному процессу<br />
                  Кабинет 201, тел. +7 (XXX) XXX-XX-XX
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Студенческий отдел</h3>
                <p className="text-blue-100 text-sm">
                  Стипендии, социальная поддержка<br />
                  Кабинет 105, тел. +7 (XXX) XXX-XX-XX
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Психологическая служба</h3>
                <p className="text-blue-100 text-sm">
                  Консультации и поддержка<br />
                  Кабинет 301, тел. +7 (XXX) XXX-XX-XX
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}