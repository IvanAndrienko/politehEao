import { useState, useEffect } from 'react';

interface VacantPlace {
  id: string;
  eduCode: string;
  eduName: string;
  eduLevel: string;
  eduProf?: string;
  eduCourse: number;
  eduForm: string;
  numberBFVacant: number;
  numberBRVacant: number;
  numberBMVacant: number;
  numberPVacant: number;
  order: number;
  isActive: boolean;
}

export default function VacantPlaces() {
  const [vacantPlaces, setVacantPlaces] = useState<VacantPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVacantPlaces();
  }, []);

  const loadVacantPlaces = async () => {
    try {
      const response = await fetch('/api/vacant-places');
      const data = await response.json();
      setVacantPlaces(data);
    } catch (error) {
      console.error('Error loading vacant places:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Вакантные места для приёма (перевода) обучающихся</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Код, шифр группы научных специальностей
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Наименование профессии, специальности, направления подготовки, наименование группы научных специальностей
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Уровень образования
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Образовательная программа, направленность, профиль, шифр и наименование научной специальности
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Курс
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Форма обучения
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Федеральный бюджет
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Региональный бюджет
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Местный бюджет
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Физические и (или) юридические лица
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vacantPlaces.map((place) => (
              <tr key={place.id} itemProp="vacant">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="eduCode">
                  {place.eduCode}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="eduName">
                  {place.eduName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="eduLevel">
                  {place.eduLevel}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="eduProf">
                  {place.eduProf || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="eduCourse">
                  {place.eduCourse}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="eduForm">
                  {place.eduForm}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="numberBFVacant">
                  {place.numberBFVacant}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="numberBRVacant">
                  {place.numberBRVacant}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="numberBMVacant">
                  {place.numberBMVacant}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="numberPVacant">
                  {place.numberPVacant}
                </td>
              </tr>
            ))}
            {vacantPlaces.length === 0 && (
              <tr>
                <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
                  Нет данных о вакантных местах
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}