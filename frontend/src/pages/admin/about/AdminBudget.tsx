import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaFileUpload, FaDownload } from 'react-icons/fa';

interface BudgetVolume {
  id: string;
  year: number;
  federalBudget?: number;
  regionalBudget?: number;
  localBudget?: number;
  paidServices?: number;
  isActive: boolean;
}

interface BudgetFlow {
  id: string;
  year: number;
  income: string;
  expenses: string;
  isActive: boolean;
}

interface BudgetPlan {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  isActive: boolean;
}

export default function AdminBudget() {
  const [activeTab, setActiveTab] = useState('volume');
  const [loading, setLoading] = useState(false);

  // Данные для таблиц
  const [volumes, setVolumes] = useState<BudgetVolume[]>([]);
  const [flows, setFlows] = useState<BudgetFlow[]>([]);
  const [plans, setPlans] = useState<BudgetPlan[]>([]);

  // Формы редактирования
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // Загрузка данных
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'volume':
          const volumesRes = await fetch('/api/budget/volume');
          setVolumes(await volumesRes.json());
          break;
        case 'flow':
          const flowsRes = await fetch('/api/budget/flow');
          setFlows(await flowsRes.json());
          break;
        case 'plan':
          const plansRes = await fetch('/api/budget/plan');
          setPlans(await plansRes.json());
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
  };

  const handleSave = async () => {
    try {
      let url = '';
      let method = 'POST';

      if (editingItem?.id) {
        url = `/api/budget/${activeTab}/${editingItem.id}`;
        method = 'PUT';
      } else {
        url = `/api/budget/${activeTab}`;
      }

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
    if (!confirm('Вы уверены, что хотите удалить этот элемент?')) return;

    try {
      await fetch(`/api/budget/${activeTab}/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formDataUpload = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/budget/plan', {
        method: 'POST',
        body: formDataUpload
      });

      if (response.ok) {
        loadData();
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const tabs = [
    { id: 'volume', label: 'Объем деятельности', icon: '📊' },
    { id: 'flow', label: 'Поступление/расходование', icon: '💰' },
    { id: 'plan', label: 'План ФХД', icon: '📄' }
  ];

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление финансово-хозяйственной деятельностью</h1>
            <p className="text-lg text-gray-600">Редактирование данных о финансово-хозяйственной деятельности техникума</p>
          </div>

          {/* Контент таба */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <h1 className="text-2xl font-bold">Финансово-хозяйственная деятельность</h1>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Добавить
              </button>
            </div>

            {/* Табы */}
            <div className="px-6 pt-4">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Объем образовательной деятельности */}
                  {activeTab === 'volume' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Объем образовательной деятельности по источникам финансирования</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Год</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Федеральный бюджет</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Региональный бюджет</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Местный бюджет</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Платные услуги</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {volumes.map((volume) => (
                              <tr key={volume.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{volume.year}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{volume.federalBudget ? `${volume.federalBudget} тыс. руб.` : '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{volume.regionalBudget ? `${volume.regionalBudget} тыс. руб.` : '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{volume.localBudget ? `${volume.localBudget} тыс. руб.` : '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{volume.paidServices ? `${volume.paidServices} тыс. руб.` : '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button onClick={() => handleEdit(volume)} className="text-blue-600 hover:text-blue-900 mr-3">
                                    <FaEdit />
                                  </button>
                                  <button onClick={() => handleDelete(volume.id)} className="text-red-600 hover:text-red-900">
                                    <FaTrash />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Поступление и расходование средств */}
                  {activeTab === 'flow' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Поступление и расходование финансовых и материальных средств</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Год</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Поступившие средства</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Расходованные средства</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {flows.map((flow) => (
                              <tr key={flow.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{flow.year}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{flow.income}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{flow.expenses}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button onClick={() => handleEdit(flow)} className="text-blue-600 hover:text-blue-900 mr-3">
                                    <FaEdit />
                                  </button>
                                  <button onClick={() => handleDelete(flow.id)} className="text-red-600 hover:text-red-900">
                                    <FaTrash />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Планы финансово-хозяйственной деятельности */}
                  {activeTab === 'plan' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Планы финансово-хозяйственной деятельности</h3>
                      <div className="space-y-4">
                        {plans.map((plan) => (
                          <div key={plan.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900">{plan.title}</h4>
                              <p className="text-sm text-gray-600">{plan.description}</p>
                              <p className="text-xs text-gray-500">{plan.fileName} ({(plan.fileSize / 1024).toFixed(1)} KB)</p>
                            </div>
                            <div className="flex space-x-2">
                              <a
                                href={plan.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <FaDownload />
                              </a>
                              <button onClick={() => handleDelete(plan.id)} className="text-red-600 hover:text-red-900">
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                {editingItem ? 'Редактировать' : 'Добавить'} {activeTab === 'volume' ? 'данные об объеме' :
                  activeTab === 'flow' ? 'данные о поступлении/расходовании' :
                  activeTab === 'plan' ? 'план ФХД' : 'элемент'}
              </h3>
              <button onClick={() => { setEditingItem(null); setShowAddForm(false); setFormData({}); }}>
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {/* Форма для планов */}
            {activeTab === 'plan' && showAddForm && (
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Название документа</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Описание</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Файл</label>
                  <input
                    type="file"
                    name="file"
                    required
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    className="mt-1 block w-full"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <FaFileUpload className="mr-2" />
                    Загрузить
                  </button>
                </div>
              </form>
            )}

            {/* Форма для объема и потоков */}
            {activeTab !== 'plan' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Год отчетности</label>
                  <input
                    type="number"
                    value={formData.year || ''}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                {activeTab === 'volume' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Федеральный бюджет (тыс. руб.)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.federalBudget || ''}
                        onChange={(e) => setFormData({ ...formData, federalBudget: e.target.value ? parseFloat(e.target.value) : null })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Региональный бюджет (тыс. руб.)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.regionalBudget || ''}
                        onChange={(e) => setFormData({ ...formData, regionalBudget: e.target.value ? parseFloat(e.target.value) : null })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Местный бюджет (тыс. руб.)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.localBudget || ''}
                        onChange={(e) => setFormData({ ...formData, localBudget: e.target.value ? parseFloat(e.target.value) : null })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Платные услуги (тыс. руб.)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.paidServices || ''}
                        onChange={(e) => setFormData({ ...formData, paidServices: e.target.value ? parseFloat(e.target.value) : null })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                  </>
                )}

                {activeTab === 'flow' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Поступившие финансовые и материальные средства</label>
                      <textarea
                        value={formData.income || ''}
                        onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Опишите поступившие средства..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Расходованные финансовые и материальные средства</label>
                      <textarea
                        value={formData.expenses || ''}
                        onChange={(e) => setFormData({ ...formData, expenses: e.target.value })}
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Опишите расходованные средства..."
                      />
                    </div>
                  </>
                )}

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
            )}
          </div>
        </div>
      )}
    </div>
  );
}