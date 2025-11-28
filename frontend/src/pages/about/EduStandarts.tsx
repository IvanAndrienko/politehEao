import { useState, useEffect } from 'react';
import { FaDownload, FaGraduationCap } from 'react-icons/fa';
import { apiUrl, assetUrl } from '../../lib/api.ts';

interface EducationalStandard {
  id: string;
  code: string;
  name: string;
  level: string;
  program: string;
  form: string;
  fedDocUrl?: string;
  fedDocName?: string;
  standartDocUrl?: string;
  standartDocName?: string;
  fedTrebUrl?: string;
  fedTrebName?: string;
  standartTrebUrl?: string;
  standartTrebName?: string;
}

export default function EduStandarts() {
  const [standards, setStandards] = useState<EducationalStandard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStandards();
  }, []);

  const loadStandards = async () => {
    try {
      // Пробуем загрузить из объединенного API
      const response = await fetch(apiUrl('/api/page-data?page=edu-standards'));
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const { educationalStandards } = result.data;
          setStandards(educationalStandards || []);
          return;
        }
      }

      // Fallback на старый запрос
      console.warn('Page data API failed, falling back to individual request');
      const fallbackResponse = await fetch(apiUrl('/api/education/standards'));
      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        setStandards(data);
      }
    } catch (error) {
      console.error('Error loading standards:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Образовательные стандарты и требования</h2>


      {/* Таблица образовательных стандартов */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaGraduationCap className="w-5 h-5 mr-2 text-blue-600" />
          Образовательные стандарты и требования по реализуемым образовательным программам
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Код, шифр
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Наименование программы
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Уровень образования
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Федеральные государственные образовательные стандарты
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Образовательные стандарты
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Федеральные государственные требования
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Самостоятельно устанавливаемые требования
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {standards.map((standard: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {standard.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {standard.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {standard.level}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {standard.fedDocUrl ? (
                      <a
                        href={assetUrl(standard.fedDocUrl)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700"
                        itemProp="eduFedDoc"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaDownload className="w-4 h-4 mr-1" />
                        {standard.fedDocName || 'ФГОС'}
                      </a>
                    ) : (
                      <span className="text-gray-500" itemProp="eduFedDoc">Не предусмотрен</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {standard.standartDocUrl ? (
                      <a
                        href={assetUrl(standard.standartDocUrl)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700"
                        itemProp="eduStandartDoc"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaDownload className="w-4 h-4 mr-1" />
                        {standard.standartDocName || 'Образовательный стандарт'}
                      </a>
                    ) : (
                      <span className="text-gray-500" itemProp="eduStandartDoc">Не предусмотрен</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {standard.fedTrebUrl ? (
                      <a
                        href={assetUrl(standard.fedTrebUrl)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700"
                        itemProp="eduFedTreb"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaDownload className="w-4 h-4 mr-1" />
                        {standard.fedTrebName || 'ФГТ'}
                      </a>
                    ) : (
                      <span className="text-gray-500" itemProp="eduFedTreb">Не предусмотрен</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {standard.standartTrebUrl ? (
                      <a
                        href={assetUrl(standard.standartTrebUrl)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700"
                        itemProp="eduStandartTreb"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaDownload className="w-4 h-4 mr-1" />
                        {standard.standartTrebName || 'Самостоятельно устанавливаемые требования'}
                      </a>
                    ) : (
                      <span className="text-gray-500" itemProp="eduStandartTreb">Не предусмотрен</span>
                    )}
                  </td>
                </tr>
              ))}
              {standards.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Нет данных об образовательных стандартах
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
