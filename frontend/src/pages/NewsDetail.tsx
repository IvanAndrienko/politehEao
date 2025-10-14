import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendar, FaArrowLeft, FaDownload } from 'react-icons/fa';

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
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <img 
          src="/placeholder-image.png" 
          alt="Изображение недоступно"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  }
  

  return <img src={src} alt={alt} className={className} {...props} />;
};

interface NewsDetail {
  id: number;
  title: string;
  slug: string;
  shortDescription: string | null;
  fullText: string;
  previewImage: string | null;
  images: string[];
  attachments: string[];
  publishedAt: string;
}

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      if (!slug) return;

      try {
        const response = await fetch(`http://localhost:5000/api/news/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setNews(data);
        } else {
          setError('Новость не найдена');
        }
      } catch (error) {
        console.error('Ошибка загрузки новости:', error);
        setError('Ошибка загрузки новости');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="max-w-screen-2xl mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ошибка</h1>
          <p className="text-gray-600 mb-6">{error || 'Новость не найдена'}</p>
          <Link to="/news" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" />
            Вернуться к списку новостей
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto py-8">
      {/* Кнопка назад */}
      <div className="mb-6">
        <Link to="/news" className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors">
          <FaArrowLeft className="mr-2" />
          К списку новостей
        </Link>
      </div>

      {/* Заголовок новости */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{news.title}</h1>

        <div className="flex items-center text-gray-600 mb-6">
          <FaCalendar className="mr-2" />
          <time dateTime={news.publishedAt}>
            Опубликовано {formatDate(news.publishedAt)}
          </time>
        </div>
      </header>

      {/* Превью изображение */}
      {news.previewImage && (
        <div className="mb-8">
          <SafeImage
            src={`http://localhost:5000${news.previewImage}`}
            alt={news.title}
            className="w-full max-h-96 object-cover rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Краткое описание */}
      {news.shortDescription && (
        <div className="mb-6">
          <p className="text-xl text-gray-700 leading-relaxed">{news.shortDescription}</p>
        </div>
      )}

      {/* Полный текст */}
      <div className="prose prose-lg max-w-none mb-8">
        <div className="text-gray-800 leading-relaxed whitespace-pre-line">
          {news.fullText}
        </div>
      </div>

      {/* Галерея изображений */}
      {news.images && news.images.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Галерея</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.images.map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-md">
                <SafeImage
                  src={`http://localhost:5000${image}`}
                  alt={`Изображение ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Вложения */}
      {news.attachments && news.attachments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Документы и материалы</h2>
          <div className="space-y-3">
            {news.attachments.map((attachment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FaDownload className="text-gray-500 mr-3" />
                  <span className="text-gray-900">
                    {attachment.split('/').pop()}
                  </span>
                </div>
                <a
                  href={`http://localhost:5000${attachment}`}
                  download
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FaDownload className="mr-2" />
                  Скачать
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Социальные кнопки или другие элементы можно добавить здесь */}
    </div>
  );
}
