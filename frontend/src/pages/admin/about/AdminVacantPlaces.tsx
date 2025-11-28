import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

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

export default function AdminVacantPlaces() {
  const [vacantPlaces, setVacantPlaces] = useState<VacantPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<VacantPlace | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<VacantPlace>>({});

  // Загрузка данных
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/vacant-places');
      setVacantPlaces(await response.json());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: VacantPlace) => {
    setEditingItem(item);
    setFormData({ ...item });
  };

  const handleSave = async () => {
    try {
      const url = editingItem?.id
        ? `/api/vacant-places/${editingItem.id}`
        : '/api/vacant-places';

      const method = editingItem?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        loadData();
        setEditingItem(null);
        setFormData({});
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) return;

    try {
      await fetch(`/api/vacant-places/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Кнопка назад */}
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
              onClick={() => loadData()}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление вакантными местами</h1>
            <p className="text-lg text-gray-600">Редактирование информации о вакантных местах для приема (перевода) обучающихся</p>
          </div>

          {/* Контент */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <h1 className="text-2xl font-bold">Вакантные места для приема (перевода) обучающихся</h1>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Добавить
              </button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Код</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Наименование</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Уровень</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Курс</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Форма</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ФБ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">РБ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">МБ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ФЛ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onClick={() => handleEdit(place)} className="text-blue-600 hover:text-blue-900 mr-3">
                              <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(place.id)} className="text-red-600 hover:text-red-900">
                              <FaTrash />
                            </button>
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно */}
      {(showAddForm || editingItem) && (
        <div className="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingItem ? 'Редактировать' : 'Добавить'} вакантное место
              </h3>
              <button onClick={() => { setEditingItem(null); setShowAddForm(false); setFormData({}); }}>
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Код, шифр группы научных специальностей</label>
                  <input
                    type="text"
                    value={formData.eduCode || ''}
                    onChange={(e) => setFormData({ ...formData, eduCode: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Уровень образования</label>
                  <select
                    value={formData.eduLevel || ''}
                    onChange={(e) => setFormData({ ...formData, eduLevel: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Выберите уровень</option>
                    <option value="Среднее профессиональное образование">Среднее профессиональное образование</option>
                    <option value="Высшее образование - бакалавриат">Высшее образование - бакалавриат</option>
                    <option value="Высшее образование - специалитет">Высшее образование - специалитет</option>
                    <option value="Высшее образование - магистратура">Высшее образование - магистратура</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Наименование профессии, специальности, направления подготовки</label>
                <input
                  type="text"
                  value={formData.eduName || ''}
                  onChange={(e) => setFormData({ ...formData, eduName: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Образовательная программа, направленность, профиль</label>
                <input
                  type="text"
                  value={formData.eduProf || ''}
                  onChange={(e) => setFormData({ ...formData, eduProf: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Курс</label>
                  <input
                    type="number"
                    value={formData.eduCourse || ''}
                    onChange={(e) => setFormData({ ...formData, eduCourse: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Форма обучения</label>
                  <select
                    value={formData.eduForm || ''}
                    onChange={(e) => setFormData({ ...formData, eduForm: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Выберите форму</option>
                    <option value="Очная">Очная</option>
                    <option value="Заочная">Заочная</option>
                    <option value="Очно-заочная">Очно-заочная</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Порядок отображения</label>
                  <input
                    type="number"
                    value={formData.order || 0}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Количество вакантных мест</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Федеральный бюджет</label>
                    <input
                      type="number"
                      value={formData.numberBFVacant || 0}
                      onChange={(e) => setFormData({ ...formData, numberBFVacant: parseInt(e.target.value) || 0 })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Региональный бюджет</label>
                    <input
                      type="number"
                      value={formData.numberBRVacant || 0}
                      onChange={(e) => setFormData({ ...formData, numberBRVacant: parseInt(e.target.value) || 0 })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Местный бюджет</label>
                    <input
                      type="number"
                      value={formData.numberBMVacant || 0}
                      onChange={(e) => setFormData({ ...formData, numberBMVacant: parseInt(e.target.value) || 0 })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Физические/юридические лица</label>
                    <input
                      type="number"
                      value={formData.numberPVacant || 0}
                      onChange={(e) => setFormData({ ...formData, numberPVacant: parseInt(e.target.value) || 0 })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => { setEditingItem(null); setShowAddForm(false); setFormData({}); }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <FaSave className="mr-2" />
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}