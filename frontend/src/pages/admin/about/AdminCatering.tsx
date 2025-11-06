import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

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

export default function AdminCatering() {
  const [catering, setCatering] = useState<CateringObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<CateringObject | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<CateringObject>>({});

  useEffect(() => {
    loadCatering();
  }, []);

  const loadCatering = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/catering');
      if (response.ok) {
        const data = await response.json();
        setCatering(Array.isArray(data) ? data : []);
      } else {
        console.error('Error loading catering:', response.statusText);
        setCatering([]);
      }
    } catch (error) {
      console.error('Error loading catering:', error);
      setCatering([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: CateringObject) => {
    setEditingItem(item);
    setFormData({ ...item });
  };

  const handleSave = async () => {
    try {
      const url = editingItem?.id
        ? `/api/catering/${editingItem.id}`
        : '/api/catering';

      const method = editingItem?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        loadCatering();
        setEditingItem(null);
        setFormData({});
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот объект?')) return;

    try {
      await fetch(`/api/catering/${id}`, { method: 'DELETE' });
      loadCatering();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const mealsObjects = catering.filter(obj => obj.type === 'meals');
  const healthObjects = catering.filter(obj => obj.type === 'health');

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
              onClick={() => loadCatering()}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление организацией питания</h1>
            <p className="text-lg text-gray-600">Редактирование данных об объектах питания и охраны здоровья</p>
          </div>

          {/* Кнопка добавить */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
              <FaPlus className="mr-2" />
              Добавить объект
            </button>
          </div>

          {/* Объекты питания */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-green-600 text-white">
              <h2 className="text-xl font-bold">Объекты питания</h2>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Наименование объекта</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Адрес</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Площадь, м²</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Количество мест</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Доступность</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mealsObjects.map((obj) => (
                        <tr key={obj.id} itemProp="meals">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="objName">{obj.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-900" itemProp="objAddress">{obj.address}</td>
                          <td className="px-6 py-4 text-sm text-gray-900" itemProp="objSq">{obj.area}</td>
                          <td className="px-6 py-4 text-sm text-gray-900" itemProp="objCnt">{obj.seats}</td>
                          <td className="px-6 py-4 text-sm text-gray-900" itemProp="objOvz">{obj.accessibility}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onClick={() => handleEdit(obj)} className="text-blue-600 hover:text-blue-900 mr-3">
                              <FaEdit />
                            </button>
                            <button onClick={() => handleDelete(obj.id)} className="text-red-600 hover:text-red-900">
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {mealsObjects.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                            Нет данных об объектах питания
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Объекты охраны здоровья */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white">
              <h2 className="text-xl font-bold">Объекты охраны здоровья</h2>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Наименование объекта</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Адрес</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Площадь, м²</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Количество мест</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Доступность</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {healthObjects.map((obj) => (
                      <tr key={obj.id} itemProp="health">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="objName">{obj.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900" itemProp="objAddress">{obj.address}</td>
                        <td className="px-6 py-4 text-sm text-gray-900" itemProp="objSq">{obj.area}</td>
                        <td className="px-6 py-4 text-sm text-gray-900" itemProp="objCnt">{obj.seats}</td>
                        <td className="px-6 py-4 text-sm text-gray-900" itemProp="objOvz">{obj.accessibility}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button onClick={() => handleEdit(obj)} className="text-blue-600 hover:text-blue-900 mr-3">
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(obj.id)} className="text-red-600 hover:text-red-900">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {healthObjects.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Нет данных об объектах охраны здоровья
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно формы */}
      {(showAddForm || editingItem) && (
        <div className="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingItem ? 'Редактировать' : 'Добавить'} объект {editingItem?.type === 'meals' ? 'питания' : 'охраны здоровья'}
              </h3>
              <button onClick={() => { setEditingItem(null); setShowAddForm(false); setFormData({}); }}>
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Тип объекта</label>
                <select
                  value={formData.type || ''}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'meals' | 'health' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Выберите тип</option>
                  <option value="meals">Объект питания</option>
                  <option value="health">Объект охраны здоровья</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Наименование объекта</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Адрес места нахождения</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Площадь, м²</label>
                  <input
                    type="number"
                    value={formData.area || ''}
                    onChange={(e) => setFormData({ ...formData, area: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Количество мест</label>
                  <input
                    type="number"
                    value={formData.seats || ''}
                    onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Приспособленность для использования инвалидами и лицами с ограниченными возможностями здоровья
                </label>
                <input
                  type="text"
                  value={formData.accessibility || ''}
                  onChange={(e) => setFormData({ ...formData, accessibility: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
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