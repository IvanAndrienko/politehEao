import { useState, useEffect } from 'react';
import { FaUser, FaDownload, FaGraduationCap } from 'react-icons/fa';
import { apiUrl } from '../../lib/api.ts';

interface Manager {
  id: string;
  fio: string;
  post: string;
  telephone: string;
  email: string;
  type: 'director' | 'deputy' | 'filial';
  filialName?: string;
}

export default function Managers() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    try {
      const response = await fetch(apiUrl('/api/managers'));
      if (response.ok) {
        const data = await response.json();
        setManagers(data);
      }
    } catch (error) {
      console.error('Error loading managers:', error);
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

  const directors = managers.filter(m => m.type === 'director');
  const deputies = managers.filter(m => m.type === 'deputy');
  const filialManagers = managers.filter(m => m.type === 'filial');

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Руководство</h2>


      {/* Руководитель организации */}
      {directors.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaUser className="w-5 h-5 mr-2 text-blue-600" />
            Руководитель образовательной организации
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ф.И.О.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Должность
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Контактные телефоны
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Адреса электронной почты
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {directors.map((manager) => (
                  <tr key={manager.id} itemProp="rucovodstvo">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="fio">
                      {manager.fio}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="post">
                      {manager.post}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="telephone">
                      {manager.telephone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                      {manager.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Заместители руководителя */}
      {deputies.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaGraduationCap className="w-5 h-5 mr-2 text-green-600" />
            Заместители руководителя образовательной организации
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ф.И.О.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Должность
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Контактные телефоны
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Адреса электронной почты
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deputies.map((manager) => (
                  <tr key={manager.id} itemProp="rucovodstvoZam">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="fio">
                      {manager.fio}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="post">
                      {manager.post}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="telephone">
                      {manager.telephone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                      {manager.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Руководители филиалов */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaUser className="w-5 h-5 mr-2 text-purple-600" />
          Руководители филиалов образовательной организации
        </h3>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700 text-center">
            У образовательной организации нет филиалов
          </p>
        </div>
      </div>

      {/* Руководители представительств */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaUser className="w-5 h-5 mr-2 text-orange-600" />
          Руководители представительств образовательной организации
        </h3>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700 text-center">
            У образовательной организации нет представительств
          </p>
        </div>
      </div>

      {/* Сообщение если нет данных */}
      {managers.length === 0 && (
        <div className="text-center py-12">
          <FaUser className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Информация о руководстве</h3>
          <p className="text-gray-600">Информация будет добавлена в ближайшее время</p>
        </div>
      )}
    </div>
  );
}
