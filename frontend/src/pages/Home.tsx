import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { FaChevronRight } from 'react-icons/fa';

// Swiper styles imported in index.css

interface SliderItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
}

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  previewImage?: string;
  publishedAt: string;
}

interface EventItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  type: string;
}

export default function Home() {
  const [sliderItems, setSliderItems] = useState<SliderItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      // Загружаем все данные одним запросом
      const response = await fetch('/api/page-data?page=home');
      const result = await response.json();

      if (result.success && result.data) {
        const { settings, homeSlider, news, announcements } = result.data;

        // Обрабатываем слайды
        if (homeSlider && homeSlider.length > 0) {
          setSliderItems(homeSlider.map((slide: any) => ({
            id: slide.id,
            title: slide.title,
            subtitle: slide.subtitle,
            image: slide.imageUrl,
            link: slide.link
          })));
        } else {
          // Заглушки, если в БД нет слайдов
          setSliderItems([
            {
              id: '1',
              title: 'Добро пожаловать в Политехнический техникум!',
              subtitle: 'Лучшее образование для вашего будущего',
              image: '/placeholder-image.png',
              link: '/about'
            },
            {
              id: '2',
              title: 'Современные специальности',
              subtitle: 'Программирование, дизайн, инженерия',
              image: '/placeholder-image.png',
              link: '/specialties'
            },
            {
              id: '3',
              title: 'Активная студенческая жизнь',
              subtitle: 'Спорт, творчество, волонтерство',
              image: '/placeholder-image.png',
              link: '/students'
            }
          ]);
        }

        // Обрабатываем новости
        setNews(news || []);

        // Обрабатываем объявления
        setEvents((announcements || []).slice(0, 4).map((announcement: any) => ({
          id: announcement.id,
          title: announcement.title,
          description: announcement.content,
          date: new Date().toISOString(),
          location: '',
          type: announcement.urgent ? 'urgent' : 'announcement'
        })));
      } else {
        // Fallback на старый способ загрузки
        console.warn('Page data API failed, falling back to individual requests');

        // Загружаем слайды из API
        const slidesResponse = await fetch('/api/home-slider');
        const slidesData = await slidesResponse.json();

        if (slidesData && slidesData.length > 0) {
          setSliderItems(slidesData.map((slide: any) => ({
            id: slide.id,
            title: slide.title,
            subtitle: slide.subtitle,
            image: slide.imageUrl,
            link: slide.link
          })));
        }

        // Загружаем новости
        const newsResponse = await fetch('/api/news?limit=6');
        const newsData = await newsResponse.json();
        setNews(newsData.news || []);

        // Загружаем объявления
        const eventsResponse = await fetch('/api/schedule/announcements?limit=4');
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.slice(0, 4).map((announcement: any) => ({
          id: announcement.id,
          title: announcement.title,
          description: announcement.content,
          date: new Date().toISOString(),
          location: '',
          type: announcement.urgent ? 'urgent' : 'announcement'
        })));
      }

    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Slider */}
      <section className="relative w-full">
        {sliderItems.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="w-full"
          >
            {sliderItems.map((item) => (
              <SwiperSlide key={item.id} >
                <div
                  className={`relative w-full ${item.link ? 'cursor-pointer' : ''}`}
                  onClick={() => item.link && window.open(item.link, '_blank')}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto transition-all duration-500"
                    style={{
                      objectFit: 'contain',
                      maxHeight: '80vh',
                    }}
                    onError={(e) => {
                      console.error('Image failed to load:', item.image);
                      e.currentTarget.src = '/placeholder-image.png';
                    }}
                    onLoad={() => {}}
                  />
                  {item.title && (
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center text-white px-4">
                      <h1 className="text-2xl md:text-4xl font-bold mb-2">{item.title}</h1>
                      {item.subtitle && (
                        <p className="text-base md:text-lg mb-4">{item.subtitle}</p>
                      )}
                      {!item.link && (
                        <a
                          href={item.link}
                          className="inline-flex items-center px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                        >
                          Узнать больше
                          <FaChevronRight className="ml-2" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full flex items-center justify-center bg-gray-200 py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Загрузка слайдера...</p>
            </div>
          </div>
        )}
      </section>

      {/* News and Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* News Section (2/3 on desktop, full width on mobile/tablet) */}
            <div className="lg:col-span-2 order-1 lg:order-1 animate-slide-up animation-delay-200">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Последние новости</h2>
                  <a
                    href="/news"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                  >
                    Все новости
                    <FaChevronRight className="ml-1 w-3 h-3" />
                  </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map((item, index) => (
                    <article
                      key={item.id}
                      className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow animate-slide-up cursor-pointer"
                      style={{ animationDelay: `${200 + index * 100}ms` }}
                      onClick={() => window.location.href = `/news/${item.slug}`}
                    >
                      {item.previewImage && (
                        <img
                          src={item.previewImage}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.png';
                          }}
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        {item.shortDescription && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                            {item.shortDescription}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatDate(item.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            {/* Events Section (1/3 on desktop, full width on mobile/tablet) */}
            <div className="lg:col-span-1 order-2 lg:order-2 animate-slide-up animation-delay-400">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Объявления</h2>
                  <a
                    href="/students/anons"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                  >
                    Все объявления
                    <FaChevronRight className="ml-1 w-3 h-3" />
                  </a>
                </div>
                <div className="space-y-4">
                  {events.map((event, index) => (
                    <div
                      key={event.id}
                      className={`border-l-4 pl-4 py-3 animate-slide-up ${
                        event.type === 'urgent' ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'
                      }`}
                      style={{ animationDelay: `${400 + index * 100}ms` }}
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{event.title}</h3>
                        {event.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                        )}
                        {event.type === 'urgent' && (
                          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                            СРОЧНО
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}