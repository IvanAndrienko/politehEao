import { useState, useEffect } from 'react';
import { FaCalendar } from 'react-icons/fa';

// Компонент для безопасного отображения изображений
const SafeImage = ({ src, alt, className, ...props }: { src?: string; alt?: string; className?: string; [key: string]: any }) => {
  const [imageExists, setImageExists] = useState(true);

  useEffect(() => {
    if (src) {
      const img = new Image();
      img.onload = () => setImageExists(true);
      img.onerror = () => setImageExists(false);
      img.src = src;
    }
  }, [src]);

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

  return <img src={src} alt={alt} className={className} {...props} />;
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
      const response = await fetch(`http://localhost:5000/api/news?page=${page}&limit=12`);
      if (response.ok) {
        const data = await response.json();
        setNews(data.news || []);
        setTotalPages(data.pagination?.pages || 1);
        setCurrentPage(page);
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
          {news.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => window.location.href = `/news/${item.slug}`}
            >
              {/* Изображение */}
              {item.previewImage && (
                <div className="h-64 overflow-hidden">
                  <SafeImage
                    src={`http://localhost:5000${item.previewImage}`}
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
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => loadNews(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Предыдущая
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => loadNews(page)}
              className={`px-4 py-2 border rounded-md ${
                page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => loadNews(currentPage + 1)}
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
