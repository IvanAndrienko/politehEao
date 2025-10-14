import { useState, useEffect } from 'react';
import { FaFile, FaImage, FaEye, FaFolder, FaFileAlt } from 'react-icons/fa';

interface FileItem {
  name: string;
  path: string;
  size: number;
  modified: string;
  type: string;
  category: string;
}

interface Stats {
  total: number;
  totalSize: number;
  byCategory: {
    images: number;
    documents: number;
    other: number;
  };
}

export default function AdminFiles() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'images' | 'documents'>('all');

  // Загрузка файлов
  const loadFiles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/files');
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Ошибка загрузки файлов:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // Форматирование размера файла
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Получение иконки для файла
  const getFileIcon = (type: string, category: string) => {
    if (category === 'images') return <FaImage className="text-blue-500" />;
    if (type === '.pdf') return <FaFileAlt className="text-red-500" />;
    if (['.doc', '.docx'].includes(type)) return <FaFileAlt className="text-blue-600" />;
    if (['.xls', '.xlsx'].includes(type)) return <FaFileAlt className="text-green-600" />;
    if (['.ppt', '.pptx'].includes(type)) return <FaFileAlt className="text-orange-500" />;
    return <FaFile className="text-gray-500" />;
  };

  // Фильтрация файлов
  const filteredFiles = files.filter(file => {
    if (filter === 'all') return true;
    return file.category === filter;
  });

  // Выбор файла
  const toggleFileSelection = (path: string) => {
    setSelectedFiles(prev =>
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  // Выбор всех файлов
  const selectAll = () => {
    setSelectedFiles(filteredFiles.map(f => f.path));
  };

  const deselectAll = () => {
    setSelectedFiles([]);
  };

  // Удаление выбранных файлов
  const deleteSelectedFiles = async () => {
    if (selectedFiles.length === 0) return;

    if (!confirm(`Удалить ${selectedFiles.length} файл(ов)?`)) return;

    try {
      const deletePromises = selectedFiles.map(async (filePath) => {
        const response = await fetch(`http://localhost:5000/api/files?path=${encodeURIComponent(filePath)}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(`Ошибка удаления ${filePath}: ${error.message}`);
        }
      });

      await Promise.all(deletePromises);
      alert('Файлы удалены успешно');
      setSelectedFiles([]);
      loadFiles(); // Перезагрузка списка
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка при удалении файлов');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Кнопка назад и заголовок */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Назад
            </button>
            <button
              onClick={loadFiles}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Обновить
            </button>
          </div>

          {/* Заголовок */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление файлами</h1>
            <p className="text-lg text-gray-600">Просмотр и управление загруженными файлами</p>
          </div>

      {/* Статистика */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FaFolder className="text-blue-500 mr-2" />
              <span className="text-sm text-gray-600">Всего файлов</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FaImage className="text-green-500 mr-2" />
              <span className="text-sm text-gray-600">Изображений</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.byCategory.images}</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FaFileAlt className="text-red-500 mr-2" />
              <span className="text-sm text-gray-600">Документов</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.byCategory.documents}</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <FaFile className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">Общий размер</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatFileSize(stats.totalSize)}</div>
          </div>
        </div>
      )}

      {/* Фильтры и действия */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Все
            </button>
            <button
              onClick={() => setFilter('images')}
              className={`px-3 py-1 rounded ${filter === 'images' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Изображения
            </button>
            <button
              onClick={() => setFilter('documents')}
              className={`px-3 py-1 rounded ${filter === 'documents' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Документы
            </button>
          </div>

          {selectedFiles.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={deselectAll}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Снять выделение
              </button>
              <button
                onClick={deleteSelectedFiles}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Удалить выбранные ({selectedFiles.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Список файлов */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
              onChange={selectedFiles.length === filteredFiles.length ? deselectAll : selectAll}
              className="mr-3"
            />
            <span className="font-medium text-gray-900">
              Файлы ({filteredFiles.length})
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredFiles.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              Файлы не найдены
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div key={file.path} className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.path)}
                      onChange={() => toggleFileSelection(file.path)}
                      className="mr-3"
                    />

                    <div className="flex items-center mr-4">
                      {getFileIcon(file.type, file.category)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {file.path}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{new Date(file.modified).toLocaleDateString('ru-RU')}</span>

                    <a
                      href={`http://localhost:5000/uploads/${file.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Просмотреть"
                    >
                      <FaEye/>
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}