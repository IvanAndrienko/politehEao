/**
 * Страница "Абитуриенту" - информация о поступлении в Политехнический техникум
 *
 * Содержит:
 * - Процесс поступления (4 шага)
 * - Необходимые документы (загружаются из БД)
 * - Важные даты (загружаются из БД)
 * - Преимущества обучения
 * - Контакты приемной комиссии (загружаются из БД) и интерактивная карта Яндекса (г. Биробиджан)
 * - Таблица специальностей с планом набора (бюджетные/платные места, загружаются из БД)
 * - Контактная информация
 */

import { useState, useEffect } from 'react';
import { FaFileAlt, FaCheckCircle, FaCalendar, FaGraduationCap, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendarAlt, FaHome } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Декларация типов для Яндекс.Карт
declare global {
  interface Window {
    ymaps: any;
  }
}

interface Specialty {
  id: string;
  code: string;
  name: string;
  duration: string | null;
  form: string | null;
  qualification: string | null;
  budgetPlaces: number | null;
  paidPlaces: number | null;
}

interface RequiredDocument {
  id: string;
  title: string;
  description: string | null;
}

interface ImportantDate {
  id: string;
  date: string;
  event: string;
}

interface AdmissionContact {
  id: string;
  type: string;
  title: string;
  value: string;
}

interface DormitoryData {
  description: string | null;
  address: string | null;
  images: string[];
}

// Шаги процесса поступления
const admissionSteps = [
  {
    step: 1,
    title: "Подготовка документов",
    description: "Соберите необходимые документы согласно списку"
  },
  {
    step: 2,
    title: "Подача заявления",
    description: "Подайте заявление и документы в приемную комиссию"
  },
  {
    step: 3,
    title: "Участие в конкурсе",
    description: "Дождитесь результатов конкурсного отбора"
  },
  {
    step: 4,
    title: "Зачисление",
    description: "Получите приказ о зачислении и приступите к обучению"
  }
];

// Данные теперь загружаются динамически из API

// Компонент страницы "Абитуриенту" с информацией о поступлении
export default function Admission() {
  // Состояния для данных
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [documents, setDocuments] = useState<RequiredDocument[]>([]);
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [contacts, setContacts] = useState<AdmissionContact[]>([]);
  const [dormitory, setDormitory] = useState<DormitoryData>({ description: null, address: null, images: [] });
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadAdmissionData();
  }, []);

  const loadAdmissionData = async () => {
    try {
      setLoading(true);
      const [specialtiesRes, documentsRes, datesRes, contactsRes, dormitoryRes] = await Promise.all([
        fetch('/api/admission/specialties'),
        fetch('/api/admission/documents'),
        fetch('/api/admission/dates'),
        fetch('/api/admission/contacts'),
        fetch('/api/admission/dormitory')
      ]);

      const [specialtiesData, documentsData, datesData, contactsData, dormitoryData] = await Promise.all([
        specialtiesRes.json(),
        documentsRes.json(),
        datesRes.json(),
        contactsRes.json(),
        dormitoryRes.json()
      ]);

      setSpecialties(specialtiesData);
      setDocuments(documentsData);
      setDates(datesData);
      setContacts(contactsData);
      setDormitory(dormitoryData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  // Инициализация Яндекс.Карты при загрузке компонента
  useEffect(() => {
    const initMap = () => {
      if (window.ymaps && !mapLoaded) {
        // Проверяем, что элемент карты существует и видим
        const mapElement = document.getElementById('map');
        if (!mapElement || mapElement.offsetWidth === 0) {
          // Если элемент не готов, ждем еще немного
          setTimeout(initMap, 500);
          return;
        }

        window.ymaps.ready(() => {
          try {
            // Координаты Биробиджана
            const birobidzhanCoords = [48.758344, 132.887870];

            // Создаем карту
            const map = new window.ymaps.Map('map', {
              center: birobidzhanCoords,
              zoom: 15,
              controls: ['zoomControl', 'fullscreenControl']
            });

            // Добавляем метку техникума
            const placemark = new window.ymaps.Placemark(birobidzhanCoords, {
              hintContent: 'Политехнический техникум',
              balloonContent: 'г. Биробиджан, ул. Техникумовская, д. 15'
            });

            map.geoObjects.add(placemark);
            setMapLoaded(true);
          } catch (error) {
            console.error('Ошибка инициализации карты:', error);
            setMapError(true);
          }
        });
      }
    };

    // Небольшая задержка для обеспечения готовности DOM
    const timer = setTimeout(() => {
      // Проверяем, загружен ли API Яндекс.Карт
      if (window.ymaps) {
        initMap();
      } else {
        // Если API еще не загружен, ждем его загрузки
        const checkYmaps = setInterval(() => {
          if (window.ymaps) {
            clearInterval(checkYmaps);
            initMap();
          }
        }, 100);

        // Очищаем интервал через 10 секунд, если API не загрузился
        setTimeout(() => {
          clearInterval(checkYmaps);
          if (!mapLoaded) {
            setMapError(true);
          }
        }, 10000);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [mapLoaded]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Героическая секция с заголовком */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-none mx-0">
          <div className="text-center">
            <FaGraduationCap className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Абитуриенту</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Ваш путь к успешной карьере начинается здесь. Узнайте все о поступлении в Политехнический техникум
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Секция процесса поступления */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Процесс поступления</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Простые шаги к получению качественного профессионального образования
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {admissionSteps.map((step, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="font-semibold text-lg mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Секция с документами и важными датами */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Необходимые документы */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <FaFileAlt className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Необходимые документы</h3>
            </div>

            <ul className="space-y-4 mb-8">
              {documents.map((doc) => (
                <li key={doc.id} className="flex items-start">
                  <FaCheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 leading-relaxed">{doc.title}</span>
                  {doc.description && (
                    <span className="text-gray-500 text-sm block ml-8 mt-1">{doc.description}</span>
                  )}
                </li>
              ))}
            </ul>

          </div>

          {/* Важные даты */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <FaCalendar className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Важные даты</h3>
            </div>

            <div className="space-y-4">
              {dates.map((item) => (
                <div key={item.id} className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="w-20 text-blue-700 font-bold text-lg mr-4">{item.date}</div>
                  <div className="text-gray-700 font-medium">{item.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Контакты приемной комиссии и карта */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8 mb-16">
          <h3 className="text-3xl font-bold mb-8 text-center">Приемная комиссия</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Контакты приемной комиссии */}
            <div className="space-y-6">
              {contacts.map((contact) => {
                const getIcon = (type: string) => {
                  switch (type) {
                    case 'phone': return <FaPhone className="w-6 h-6 text-blue-200 mr-4 flex-shrink-0" />;
                    case 'email': return <FaEnvelope className="w-6 h-6 text-blue-200 mr-4 flex-shrink-0" />;
                    case 'address': return <FaMapMarkerAlt className="w-6 h-6 text-blue-200 mr-4 mt-1 flex-shrink-0" />;
                    case 'schedule': return <FaCalendarAlt className="w-6 h-6 text-blue-200 mr-4 mt-1 flex-shrink-0" />;
                    default: return <FaPhone className="w-6 h-6 text-blue-200 mr-4 flex-shrink-0" />;
                  }
                };

                const getTitle = (type: string) => {
                  switch (type) {
                    case 'phone': return 'Телефон';
                    case 'email': return 'Email';
                    case 'address': return 'Адрес';
                    case 'schedule': return 'График приема документов';
                    default: return 'Контакт';
                  }
                };

                return (
                  <div key={contact.id} className={`flex items-${contact.type === 'address' || contact.type === 'schedule' ? 'start' : 'center'}`}>
                    {getIcon(contact.type)}
                    <div>
                      <div className="font-semibold text-white text-lg">{getTitle(contact.type)}</div>
                      <div className="text-blue-100 whitespace-pre-line">{contact.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Карта */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div id="map" className="h-96 w-full">
                {!mapLoaded && !mapError && (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Загрузка карты...</p>
                    </div>
                  </div>
                )}
                {mapError && (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="text-gray-400 mb-2">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <p className="text-gray-600 font-medium">Карта недоступна</p>
                      <p className="text-gray-500 text-sm mt-1">Проверьте подключение к интернету</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Таблица специальностей с планом набора */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Специальности</h3>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold">Код</th>
                    <th className="px-4 py-4 text-left font-semibold">Наименование специальности</th>
                    <th className="px-4 py-4 text-left font-semibold">Срок обучения</th>
                    <th className="px-4 py-4 text-left font-semibold">Форма обучения</th>
                    <th className="px-4 py-4 text-left font-semibold">Квалификация</th>
                    <th className="px-4 py-4 text-center font-semibold">План набора</th>
                  </tr>
                  <tr className="bg-blue-700">
                    <th colSpan={5} className="px-4 py-2"></th>
                    <th className="px-4 py-2 text-center text-sm">
                      <div className="grid grid-cols-2 gap-1">
                        <span>Бюджет</span>
                        <span>Платные</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {specialties.map((specialty) => (
                    <tr key={specialty.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-medium text-blue-600">{specialty.code}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{specialty.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{specialty.duration}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{specialty.form}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{specialty.qualification}</td>
                      <td className="px-4 py-4 text-center">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                            {specialty.budgetPlaces}
                          </div>
                          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                            {specialty.paidPlaces}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Блок общежития */}
        {(dormitory.description || dormitory.address || dormitory.images.length > 0) && (
          <div className="mb-16">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <FaHome className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-3xl font-bold text-gray-900">Общежитие</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Описание и адрес */}
                  <div className="space-y-6">
                    {dormitory.description && (
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">Условия проживания</h4>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{dormitory.description}</p>
                      </div>
                    )}

                    {dormitory.address && (
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">Адрес</h4>
                        <p className="text-gray-700">{dormitory.address}</p>
                      </div>
                    )}
                  </div>

                  {/* Слайдер изображений */}
                  {dormitory.images.length > 0 && (
                    <div className="relative">
                      <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        className="dormitory-swiper rounded-lg overflow-hidden shadow-lg"
                      >
                        {dormitory.images.map((image, index) => (
                          <SwiperSlide key={index}>
                            <div className="aspect-video">
                              <img
                                src={image}
                                alt={`Общежитие ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                                        <div class="text-center">
                                          <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                          </svg>
                                          <p class="text-sm">Изображение недоступно</p>
                                        </div>
                                      </div>
                                    `;
                                  }
                                }}
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      <style>{`
                        .dormitory-swiper .swiper-button-prev
                        }
                      `}</style>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Контактная информация */}
        <div className="bg-blue-600 text-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Остались вопросы?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Свяжитесь с нашей приемной комиссией для получения подробной консультации
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center justify-center">
              <span className="font-semibold">Телефон:</span>
              <span className="ml-2">{contacts.find(c => c.type === 'phone')?.value || '+7 (999) 123-45-67'}</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="font-semibold">Email:</span>
              <span className="ml-2">{contacts.find(c => c.type === 'email')?.value || 'info@college.ru'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
