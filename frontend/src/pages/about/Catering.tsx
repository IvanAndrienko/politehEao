import { useState, useEffect } from 'react';
import { FaUtensils, FaHeartbeat } from 'react-icons/fa';

interface CateringObject {
  id: string;
  type: 'meals' | 'health';
  name: string;
  address: string;
  area: number;
  seats: number;
  accessibility: string;
  order: number;
  isActive: boolean;
}

export default function Catering() {
  const [catering, setCatering] = useState<CateringObject[]>([]);
  const [loading, setLoading] = useState(true);
   
  useEffect(() => {
    loadCatering();
  }, []);

  const loadCatering = async () => {
    try {
      // Пробуем загрузить из объединенного API
      const response = await fetch('/api/page-data?page=catering');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const { catering } = result.data;
          setCatering(Array.isArray(catering) ? catering : []);
          return;
        }
      }

      // Fallback на старый запрос
      console.warn('Page data API failed, falling back to individual request');
      const fallbackResponse = await fetch('/api/catering');
      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        setCatering(Array.isArray(data) ? data : []);
      } else {
        console.error('Error loading catering:', fallbackResponse.statusText);
        setCatering([]);
      }
    } catch (error) {
      console.error('Error loading catering:', error);
      setCatering([]);
    } finally {
      setLoading(false);
    }
  };

  const mealsObjects = catering.filter(obj => obj.type === 'meals');
  const healthObjects = catering.filter(obj => obj.type === 'health');

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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Организация питания в образовательной организации</h2>

      {/* Объекты питания */}
      {mealsObjects.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaUtensils className="w-5 h-5 mr-2 text-green-600" />
            Сведения об условиях питания обучающихся
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Наименование объекта
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Адрес места нахождения объекта
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Площадь, м²
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Количество мест
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Приспособленность для использования инвалидами и лицами с ограниченными возможностями здоровья
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mealsObjects.map((obj) => (
                  <tr key={obj.id} itemProp="meals">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="objName">
                      {obj.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="objAddress">
                      {obj.address}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="objSq">
                      {obj.area}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="objCnt">
                      {obj.seats}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="objOvz">
                      {obj.accessibility}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Объекты охраны здоровья */}
      {healthObjects.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaHeartbeat className="w-5 h-5 mr-2 text-red-600" />
            Сведения об условиях охраны здоровья обучающихся
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Наименование объекта
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Адрес места нахождения объекта
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Площадь, м²
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Количество мест
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Приспособленность для использования инвалидами и лицами с ограниченными возможностями здоровья
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {healthObjects.map((obj) => (
                  <tr key={obj.id} itemProp="health">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="objName">
                      {obj.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="objAddress">
                      {obj.address}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="objSq">
                      {obj.area}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="objCnt">
                      {obj.seats}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="objOvz">
                      {obj.accessibility}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Сообщение если нет данных */}
      {mealsObjects.length === 0 && healthObjects.length === 0 && (
        <div className="text-center py-12">
          <FaUtensils className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Информация об организации питания</h3>
          <p className="text-gray-600">Информация будет добавлена в ближайшее время</p>
        </div>
      )}
    </div>
  );
}