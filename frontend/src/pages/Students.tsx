import { useNavigate } from 'react-router-dom';
import {
  FaCalendar,
  FaFileAlt,
  FaAward,
  FaBell,
  FaClock,
  FaHome,
  FaUtensils,
  FaHeart,
  FaGraduationCap,
  FaExternalLinkAlt,
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

  const announcements = [
    {
      title: "Изменения в расписании",
      date: "15 марта 2024",
      content: "В связи с производственной практикой занятия группы ИС-21 переносятся на 16:00",
      urgent: true
    },
    {
      title: "Студенческая конференция",
      date: "20 марта 2024",
      content: "Приглашаем студентов к участию в научно-практической конференции 'Молодежь и инновации'",
      urgent: false
    },
    {
      title: "Медицинский осмотр",
      date: "25 марта 2024",
      content: "Студентам 1-2 курсов необходимо пройти плановый медицинский осмотр",
      urgent: false
    }
  ];

  const upcomingEvents = [
    {
      date: "18",
      month: "МАР",
      title: "Спортивные соревнования",
      time: "14:00",
      location: "Спортивный зал"
    },
    {
      date: "22",
      month: "МАР",
      title: "Концерт ко Дню смеха",
      time: "18:00",
      location: "Актовый зал"
    },
    {
      date: "25",
      month: "МАР",
      title: "Ярмарка вакансий",
      time: "10:00",
      location: "Главный корпус"
    }
  ];

  // Сервисы для студентов Политехнического техникума
  const services = [
    {
      title: "Общежитие",
      icon: <FaHome className="w-8 h-8 text-blue-600" />,
      description: "Информация о размещении, правилах проживания и услугах",
      links: ["Подать заявление", "Правила проживания", "Контакты"]
    },
    {
      title: "Питание",
      icon: <FaUtensils className="w-8 h-8 text-green-600" />,
      description: "Столовая, буфет, льготное питание для отдельных категорий",
      links: ["Меню столовой", "Льготное питание", "График работы"]
    },
    {
      title: "Социальная поддержка",
      icon: <FaHeart className="w-8 h-8 text-red-600" />,
      description: "Стипендии, материальная помощь, социальные программы",
      links: ["Подать заявление", "Виды поддержки", "Документы"]
    },
    {
      title: "Карьерный центр",
      icon: <FaGraduationCap className="w-8 h-8 text-purple-600" />,
      description: "Помощь в трудоустройстве, стажировки, карьерное консультирование",
      links: ["Вакансии", "Резюме", "Консультации"]
    }
  ];

  const documents = [
    { name: "Справка об обучении", format: "PDF", description: "Для предоставления по месту требования" },
    { name: "Академическая справка", format: "PDF", description: "С указанием изученных дисциплин и оценок" },
    { name: "Заявление на академический отпуск", format: "DOC", description: "Форма заявления для оформления отпуска" },
    { name: "Заявление на перевод", format: "DOC", description: "Для перевода на другую специальность/форму обучения" }
  ];

  return (
    <div>
      {/* Героическая секция с заголовком */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="text-center">
            <FaGraduationCap className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Студенческий портал</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
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
              {announcements.map((announcement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    announcement.urgent
                      ? 'border-red-500 bg-red-50'
                      : 'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                    {announcement.urgent && (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                        СРОЧНО
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                  <div className="text-xs text-gray-500">{announcement.date}</div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
              Все объявления →
            </button>
          </div>

          {/* Ближайшие события в Политехническом техникуме */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <FaCalendar className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Ближайшие события</h2>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-center mr-4">
                    <div className="text-2xl font-bold text-green-600">{event.date}</div>
                    <div className="text-xs text-gray-500">{event.month}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <FaClock className="w-4 h-4 mr-1" />
                      <span className="mr-3">{event.time}</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-green-600 hover:text-green-700 font-medium text-sm">
              Календарь событий →
            </button>
          </div>
        </div>

        {/* Студенческие сервисы */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Студенческие сервисы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="mr-4">{service.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {service.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href="#"
                      className="block text-blue-600 hover:text-blue-700 text-sm flex items-center"
                    >
                      <FaExternalLinkAlt className="w-4 h-4 mr-2" />
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
                alt="Студенческие мероприятия"
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.png';
                }}
              />
              <h3 className="font-semibold text-lg mb-2">Творческие мероприятия</h3>
              <p className="text-gray-600 text-sm">
                Участвуйте в концертах, фестивалях и творческих конкурсах
              </p>
            </div>
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
                alt="Спортивные мероприятия"
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.png';
                }}
              />
              <h3 className="font-semibold text-lg mb-2">Спорт и здоровье</h3>
              <p className="text-gray-600 text-sm">
                Спортивные секции, соревнования и турниры для всех желающих
              </p>
            </div>
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop"
                alt="Волонтерство"
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.png';
                }}
              />
              <h3 className="font-semibold text-lg mb-2">Волонтерство</h3>
              <p className="text-gray-600 text-sm">
                Социальные проекты и волонтерские программы для активных студентов
              </p>
            </div>
          </div>
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