import { useState, useEffect } from 'react';
import { FaCalendar } from 'react-icons/fa';
import { apiUrl, assetUrl } from '../lib/api.ts';

// Компонент для безопасного отображения изображений
const SafeImage = ({ src, alt, className, ...props }: { src?: string; alt?: string; className?: string; [key: string]: any }) => {
  const [imageExists, setImageExists] = useState(true);
  const resolvedSrc = assetUrl(src);

  useEffect(() => {
    if (resolvedSrc) {
      const img = new Image();
      img.onload = () => setImageExists(true);
      img.onerror = () => setImageExists(false);
      img.src = resolvedSrc;
    }
  }, [resolvedSrc]);

  if (!imageExists) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`} {...props}>
        <img
          src="/placeholder-image.png"
          alt="Изображение недоступно"
          className="max-w-full max-h-full object-contain opacity-60"
        />
      </div>
    );
  }

  return <img src={resolvedSrc} alt={alt} className={className} {...props} />;
};

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  shortDescription: string | null;
  previewImage: string | null;
  publishedAt: string;
}

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Загрузка новостей
  const loadNews = async (page = 1) => {
    try {
      const response = await fetch(apiUrl(`/api/news?page=${page}&limit=12`));
      if (response.ok) {
        const data = await response.json();
        setNews(data.news || []);
        setTotalPages(data.pagination?.pages || 1);
        setCurrentPage(page);
        // Прокрутка наверх страницы
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Функция для рендеринга кнопок пагинации с сокращением
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5; // Максимальное количество видимых страниц

    if (totalPages <= maxVisiblePages) {
      // Если страниц мало, показываем все
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => loadNews(i)}
            className={`px-4 py-2 border rounded-md ${
              i === currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      // Логика сокращения пагинации
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      // Кнопка первой страницы
      if (startPage > 1) {
        buttons.push(
          <button
            key={1}
            onClick={() => loadNews(1)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            1
          </button>
        );
        if (startPage > 2) {
          buttons.push(
            <span key="start-ellipsis" className="px-2 py-2 text-gray-500">
              ...
            </span>
          );
        }
      }

      // Видимые страницы
      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => loadNews(i)}
            className={`px-4 py-2 border rounded-md ${
              i === currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {i}
          </button>
        );
      }

      // Кнопка последней страницы
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          buttons.push(
            <span key="end-ellipsis" className="px-2 py-2 text-gray-500">
              ...
            </span>
          );
        }
        buttons.push(
          <button
            key={totalPages}
            onClick={() => loadNews(totalPages)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {totalPages}
          </button>
        );
      }
    }

    return buttons;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto py-8">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Новости</h1>
        <p className="text-lg text-gray-600">Последние новости и события техникума</p>
      </div>

      {/* Список новостей */}
      {news.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Новостей пока нет</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
          {news.map((item, index) => (
            <article
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow animate-slide-up cursor-pointer"
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => window.location.href = `/news/${item.slug}`}
            >
              {/* Изображение */}
              {item.previewImage && (
                <div className="h-64 overflow-hidden">
                  <SafeImage
                    src={item.previewImage || undefined}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Содержимое */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                  {item.title}
                </h2>

                {item.shortDescription && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {item.shortDescription}
                  </p>
                )}

                {/* Дата публикации */}
                <div className="flex items-center text-sm text-gray-500">
                  <FaCalendar className="mr-2" />
                  {formatDate(item.publishedAt)}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => {
              loadNews(currentPage - 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Предыдущая
          </button>

          {renderPaginationButtons()}

          <button
            onClick={() => {
              loadNews(currentPage + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Следующая
          </button>
        </div>
      )}
    </div>
  );
}
