import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaCalendar, FaFileAlt, FaBullhorn, FaGraduationCap, FaSearch, FaUser } from 'react-icons/fa';

interface SearchResult {
  id: string;
  title: string;
  type: 'news' | 'document' | 'announcement' | 'education' | 'employee' | 'structure_document';
  slug?: string;
  shortDescription?: string;
  description?: string;
  content?: string;
  publishedAt?: string;
  uploadedAt?: string;
  createdAt?: string;
  previewImage?: string;
  fileUrl?: string;
  category?: string;
  urgent?: boolean;
  code?: string;
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<{
    news: SearchResult[];
    documents: SearchResult[];
    announcements: SearchResult[];
    educationPrograms: SearchResult[];
    employees: SearchResult[];
    structureDocuments: SearchResult[];
    total: number;
  }>({
    news: [],
    documents: [],
    announcements: [],
    educationPrograms: [],
    employees: [],
    structureDocuments: [],
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return <FaCalendar className="w-5 h-5 text-blue-600" />;
      case 'document': return <FaFileAlt className="w-5 h-5 text-green-600" />;
      case 'announcement': return <FaBullhorn className="w-5 h-5 text-orange-600" />;
      case 'education': return <FaGraduationCap className="w-5 h-5 text-purple-600" />;
      case 'employee': return <FaUser className="w-5 h-5 text-indigo-600" />;
      case 'structure_document': return <FaFileAlt className="w-5 h-5 text-teal-600" />;
      default: return <FaSearch className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'news': return 'Новость';
      case 'document': return 'Документ';
      case 'announcement': return 'Объявление';
      case 'education': return 'Образовательная программа';
      case 'employee': return 'Сотрудник';
      case 'structure_document': return 'Документ структуры';
      default: return 'Результат';
    }
  };

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'news':
        window.location.href = `/news/${result.slug}`;
        break;
      case 'document':
        // Документы находятся в разделе "Документы"
        window.location.href = '/sveden/document';
        break;
      case 'structure_document':
        // Документы структуры находятся в разделе структуры
        window.location.href = '/sveden/struct';
        break;
      case 'announcement':
        // Объявления обычно показываются на главной странице
        window.location.href = '/';
        break;
      case 'education':
        window.location.href = '/sveden/education';
        break;
      case 'employee':
        // Сотрудники находятся в разделе структуры
        window.location.href = '/sveden/struct';
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Результаты поиска
        </h1>
        <p className="text-gray-600">
          По запросу "{query}" найдено {results.total} результатов
        </p>
      </div>

      {results.total === 0 ? (
        <div className="text-center py-12">
          <FaSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Ничего не найдено
          </h2>
          <p className="text-gray-600">
            Попробуйте изменить запрос или проверьте правильность написания
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Новости */}
          {results.news.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaCalendar className="w-6 h-6 text-blue-600 mr-3" />
                Новости ({results.news.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.news.map((item) => (
                  <article
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleResultClick(item)}
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
                          {item.publishedAt && formatDate(item.publishedAt)}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {getTypeLabel(item.type)}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Документы */}
          {results.documents.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaFileAlt className="w-6 h-6 text-green-600 mr-3" />
                Документы ({results.documents.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.documents.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleResultClick(item)}
                  >
                    <div className="flex items-start space-x-3">
                      {getTypeIcon(item.type)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm mb-2">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {item.uploadedAt && formatDate(item.uploadedAt)}
                          </span>
                          {item.category && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              {item.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Объявления */}
          {results.announcements.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaBullhorn className="w-6 h-6 text-orange-600 mr-3" />
                Объявления ({results.announcements.length})
              </h2>
              <div className="space-y-4">
                {results.announcements.map((item) => (
                  <div
                    key={item.id}
                    className={`border-l-4 pl-4 py-3 rounded-r-lg cursor-pointer hover:shadow-md transition-shadow ${
                      item.urgent ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'
                    }`}
                    onClick={() => handleResultClick(item)}
                  >
                    <div className="flex items-start space-x-3">
                      {getTypeIcon(item.type)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        {item.content && (
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {item.content}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {item.createdAt && formatDate(item.createdAt)}
                          </span>
                          {item.urgent && (
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                              СРОЧНО
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Сотрудники */}
          {results.employees.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaUser className="w-6 h-6 text-indigo-600 mr-3" />
                Сотрудники ({results.employees.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.employees.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleResultClick(item)}
                  >
                    <div className="flex items-start space-x-3">
                      {getTypeIcon(item.type)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm mb-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Документы структуры */}
          {results.structureDocuments.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaFileAlt className="w-6 h-6 text-teal-600 mr-3" />
                Документы структуры ({results.structureDocuments.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.structureDocuments.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleResultClick(item)}
                  >
                    <div className="flex items-start space-x-3">
                      {getTypeIcon(item.type)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm mb-2">
                            {item.description}
                          </p>
                        )}
                        {item.uploadedAt && (
                          <span className="text-xs text-gray-500">
                            Загружено: {formatDate(item.uploadedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Образовательные программы */}
          {results.educationPrograms.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaGraduationCap className="w-6 h-6 text-purple-600 mr-3" />
                Образовательные программы ({results.educationPrograms.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.educationPrograms.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleResultClick(item)}
                  >
                    <div className="flex items-start space-x-3">
                      {getTypeIcon(item.type)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm mb-2">
                            {item.description}
                          </p>
                        )}
                        {item.code && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            Код: {item.code}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}