import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

interface InternationalCooperation {
  id: string;
  stateName: string;
  orgName: string;
  dogReg: string;
  order: number;
  isActive: boolean;
}

export default function AdminInternational() {
  const [loading, setLoading] = useState(false);
  const [cooperations, setCooperations] = useState<InternationalCooperation[]>([]);
  const [editingItem, setEditingItem] = useState<InternationalCooperation | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<InternationalCooperation>>({});

  // Загрузка данных
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/international');
      if (response.ok) {
        const data = await response.json();
        setCooperations(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: InternationalCooperation) => {
    setEditingItem(item);
    setFormData({ ...item });
  };

  const handleSave = async () => {
    try {
      const url = editingItem?.id
        ? `/api/international/${editingItem.id}`
        : '/api/international';

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
    if (!confirm('Вы уверены, что хотите удалить эту запись о международном сотрудничестве?')) return;

    try {
      await fetch(`/api/international/${id}`, { method: 'DELETE' });
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление международным сотрудничеством</h1>
            <p className="text-lg text-gray-600">Редактирование данных о международных договорах и сотрудничестве</p>
          </div>

          {/* Контент */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <h1 className="text-2xl font-bold">Международное сотрудничество</h1>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Добавить запись
              </button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Таблица сотрудничества */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№ п/п</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Государство</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Наименование организации</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Реквизиты договора</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cooperations.map((coop, index) => (
                          <tr key={coop.id} itemProp="internationalDog">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                            <td className="px-6 py-4 text-sm text-gray-900" itemProp="stateName">{coop.stateName}</td>
                            <td className="px-6 py-4 text-sm text-gray-900" itemProp="orgName">{coop.orgName}</td>
                            <td className="px-6 py-4 text-sm text-gray-900" itemProp="dogReg">{coop.dogReg}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleEdit(coop)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(coop.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {cooperations.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Нет данных о международном сотрудничестве</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно формы */}
      {(showAddForm || editingItem) && (
        <div className="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingItem ? 'Редактировать запись' : 'Добавить запись о международном сотрудничестве'}
              </h3>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setShowAddForm(false);
                  setFormData({});
                }}
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {/* Форма сотрудничества */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Государство</label>
                  <input
                    type="text"
                    value={formData.stateName || ''}
                    onChange={(e) => setFormData({ ...formData, stateName: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Например: Российская Федерация"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Наименование организации</label>
                  <input
                    type="text"
                    value={formData.orgName || ''}
                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Например: Министерство образования"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Реквизиты договора (наименование, дата, номер, срок действия)</label>
                <textarea
                  value={formData.dogReg || ''}
                  onChange={(e) => setFormData({ ...formData, dogReg: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Например: Договор о сотрудничестве №123 от 01.01.2024, срок действия до 31.12.2025"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Порядок отображения</label>
                <input
                  type="number"
                  min="1"
                  value={formData.order || 1}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1) {
                      setFormData({ ...formData, order: value });
                    }
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setShowAddForm(false);
                    setFormData({});
                  }}
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