import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaFileUpload, FaDownload } from 'react-icons/fa';

interface PaidEduDocument {
  id: string;
  title?: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  docType: string;
  programName?: string;
  educationLevel?: string;
  isActive: boolean;
  order: number;
}

export default function AdminPaidEdu() {
  const [activeTab, setActiveTab] = useState('paidEdu');
  const [loading, setLoading] = useState(false);

  // Данные для различных типов документов
  const [documents, setDocuments] = useState<{
    paidEdu: PaidEduDocument[];
    paidDog: PaidEduDocument[];
    paidSt: PaidEduDocument[];
    paidParents: PaidEduDocument[];
  }>({
    paidEdu: [],
    paidDog: [],
    paidSt: [],
    paidParents: []
  });

  // Формы редактирования
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // Загрузка данных
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/paid-edu/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
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
      const url = editingItem?.id
        ? `/api/paid-edu/documents/${editingItem.id}`
        : `/api/paid-edu/documents`;

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
    if (!confirm('Вы уверены, что хотите удалить этот документ?')) return;

    try {
      await fetch(`/api/paid-edu/documents/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formDataUpload = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/paid-edu/documents', {
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
    { id: 'paidEdu', label: 'Порядок оказания услуг', icon: '📋', description: 'Порядок оказания платных образовательных услуг' },
    { id: 'paidDog', label: 'Образец договора', icon: '📄', description: 'Образец договора об оказании платных образовательных услуг' },
    { id: 'paidSt', label: 'Стоимость обучения', icon: '💰', description: 'Документ об утверждении стоимости обучения' },
    { id: 'paidParents', label: 'Плата родителей', icon: '👨‍👩‍👧‍👦', description: 'Документ об установлении размера платы родителей' }
  ];

  const getCurrentDocuments = () => {
    return documents[activeTab as keyof typeof documents] || [];
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление платными образовательными услугами</h1>
            <p className="text-lg text-gray-600">Редактирование документов о платных образовательных услугах</p>
          </div>

          {/* Контент таба */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Платные образовательные услуги</h1>
                <p className="text-blue-100 text-sm mt-1">
                  {tabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Добавить документ
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
                  {/* Список документов */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {tabs.find(tab => tab.id === activeTab)?.label}
                    </h3>

                    {/* Таблица для документов стоимости обучения и платы родителей */}
                    {(activeTab === 'paidSt' || activeTab === 'paidParents') && (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                №
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Образовательная программа
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Уровень образования
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ссылка на документ
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Действия
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {getCurrentDocuments().map((doc, index) => (
                              <tr key={doc.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {index + 1}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                  {doc.programName || '-'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                  {doc.educationLevel || '-'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                  {doc.fileUrl ? (
                                    <a
                                      href={doc.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-900 underline"
                                    >
                                      {doc.title}
                                    </a>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button onClick={() => handleEdit(doc)} className="text-green-600 hover:text-green-900 mr-3">
                                    <FaEdit />
                                  </button>
                                  <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-900">
                                    <FaTrash />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {getCurrentDocuments().length === 0 && (
                              <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                  Документы не загружены
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Список для других типов документов */}
                    {(activeTab !== 'paidSt' && activeTab !== 'paidParents') && (
                      <div className="space-y-4">
                        {getCurrentDocuments().map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900">{doc.title}</h4>
                              <p className="text-sm text-gray-600">{doc.description}</p>
                              <p className="text-xs text-gray-500">{doc.fileName} ({doc.fileSize ? (doc.fileSize / 1024).toFixed(1) : 0} KB)</p>
                            </div>
                            <div className="flex space-x-2">
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <FaDownload />
                              </a>
                              <button onClick={() => handleEdit(doc)} className="text-green-600 hover:text-green-900">
                                <FaEdit />
                              </button>
                              <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-900">
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        ))}
                        {getCurrentDocuments().length === 0 && (
                          <p className="text-center text-gray-500">Документы не загружены</p>
                        )}
                      </div>
                    )}
                  </div>
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
                {editingItem ? 'Редактировать' : 'Добавить'} документ
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

            {/* Форма для документов */}
            <form onSubmit={handleFileUpload} className="space-y-4">
              <input type="hidden" name="docType" value={activeTab} />

              {/* Дополнительные поля для документов стоимости обучения и платы родителей */}
              {(activeTab === 'paidSt' || activeTab === 'paidParents') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Образовательная программа</label>
                    <input
                      type="text"
                      name="programName"
                      value={formData.programName || ''}
                      onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Введите название образовательной программы"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Уровень образования</label>
                    <input
                      type="text"
                      name="educationLevel"
                      value={formData.educationLevel || ''}
                      onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="Введите уровень образования"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Название документа</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Описание</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Файл</label>
                <input
                  type="file"
                  name="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  className="mt-1 block w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Если файл не загружен, в таблице будет отображаться прочерк</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
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
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <FaFileUpload className="mr-2" />
                  Загрузить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}