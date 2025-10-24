import { FaFileAlt } from 'react-icons/fa';

export default function Documents() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Документы</h2>

      <div className="text-center py-12">
        <FaFileAlt className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Документы в разработке</h3>
        <p className="text-gray-600">Раздел с документами техникума будет добавлен в ближайшее время</p>
      </div>

      {/* Пример структуры для будущих документов */}
      {/*
      <div className="space-y-4">
        <div className="bg-white border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <FaFileAlt className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <h3 className="font-semibold text-gray-900">Устав образовательной организации</h3>
              <p className="text-sm text-gray-600">PDF, 2.5 MB</p>
            </div>
          </div>
          <button className="flex items-center text-blue-600 hover:text-blue-700">
            <FaDownload className="w-4 h-4 mr-2" />
            Скачать
          </button>
        </div>

        <div className="bg-white border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <FaFileAlt className="w-8 h-8 text-green-600 mr-4" />
            <div>
              <h3 className="font-semibold text-gray-900">Лицензия на осуществление образовательной деятельности</h3>
              <p className="text-sm text-gray-600">PDF, 1.2 MB</p>
            </div>
          </div>
          <button className="flex items-center text-blue-600 hover:text-blue-700">
            <FaDownload className="w-4 h-4 mr-2" />
            Скачать
          </button>
        </div>
      </div>
      */}
    </div>
  );
}