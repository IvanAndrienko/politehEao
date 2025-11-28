import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaFileUpload, FaDownload } from 'react-icons/fa';
import TiptapEditor from '../../../components/TiptapEditor';

interface GrantsDocument {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  isActive: boolean;
}

interface GrantsInfo {
  id: string;
  content: string;
  isActive: boolean;
}

interface SupportMeasure {
  id: string;
  content: string;
  isActive: boolean;
}

interface HostelInfo {
  id: string;
  hostels: number;
  places: number;
  adapted: number;
  internats: number;
  interPlaces: number;
  interAdapted: number;
}

interface HostelPaymentDocument {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  isActive: boolean;
}

export default function AdminGrants() {
  const [activeTab, setActiveTab] = useState('documents');
  const [loading, setLoading] = useState(false);

  // Данные для различных разделов
  const [documents, setDocuments] = useState<GrantsDocument[]>([]);
  const [grantsInfo, setGrantsInfo] = useState<GrantsInfo[]>([]);
  const [supportMeasures, setSupportMeasures] = useState<SupportMeasure[]>([]);
  const [hostelInfo, setHostelInfo] = useState<HostelInfo | null>(null);
  const [hostelPaymentDocument, setHostelPaymentDocument] = useState<HostelPaymentDocument | null>(null);

  // Формы редактирования
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // Загрузка данных
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'documents':
          const docsRes = await fetch('/api/grants/documents');
          if (docsRes.ok) {
            const data = await docsRes.json();
            setDocuments(Array.isArray(data) ? data : []);
          } else {
            console.error('Error loading grants documents:', docsRes.statusText);
            setDocuments([]);
          }
          break;
        case 'grants-info':
          const grantsRes = await fetch('/api/grants/info');
          setGrantsInfo(await grantsRes.json());
          break;
        case 'support':
          const supportRes = await fetch('/api/grants/support');
          setSupportMeasures(await supportRes.json());
          break;
        case 'hostel-info':
          const hostelRes = await fetch('/api/grants/hostel-info');
          const hostelData = await hostelRes.json();
          setHostelInfo(hostelData);
          break;
        case 'hostel-payment':
          const paymentRes = await fetch('/api/grants/hostel-payment-document');
          const paymentData = await paymentRes.json();
          setHostelPaymentDocument(paymentData);
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
      let url = `/api/grants/${activeTab}`;
      let method = 'POST';

      if (activeTab === 'grants-info') {
        url = '/api/grants/info';
      } else if (activeTab === 'support') {
        url = '/api/grants/support';
      } else if (activeTab === 'hostel-info') {
        url = '/api/grants/hostel-info';
      } else if (editingItem?.id && activeTab !== 'grants-info' && activeTab !== 'support' && activeTab !== 'hostel-info') {
        url = `/api/grants/${activeTab}/${editingItem.id}`;
        method = 'PUT';
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
      await fetch(`/api/grants/${activeTab}/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formDataUpload = new FormData(event.currentTarget);

    try {
      let url = `/api/grants/${activeTab}`;
      if (activeTab === 'hostel-payment') {
        url = '/api/grants/hostel-payment-document';
      }

      const response = await fetch(url, {
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
    { id: 'documents', label: 'Локальные акты', icon: '📄' },
    { id: 'grants-info', label: 'Стипендии', icon: '💰' },
    { id: 'support', label: 'Меры поддержки', icon: '🤝' },
    { id: 'hostel-info', label: 'Общежития', icon: '🏠' },
    { id: 'hostel-payment', label: 'Плата за проживание', icon: '💵' }
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление стипендиями и мерами поддержки</h1>
            <p className="text-lg text-gray-600">Редактирование данных о стипендиях и социальной поддержке обучающихся</p>
          </div>

          {/* Контент таба */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <h1 className="text-2xl font-bold">Стипендии и меры поддержки обучающихся</h1>
              {(activeTab === 'documents' || activeTab === 'hostel-payment') && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Добавить
                </button>
              )}
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
                  {/* Локальные нормативные акты */}
                  {activeTab === 'documents' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Локальные нормативные акты о стипендиях</h3>
                      <div className="space-y-4">
                        {documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900">{doc.title}</h4>
                              <p className="text-sm text-gray-600">{doc.description}</p>
                              <p className="text-xs text-gray-500">{doc.fileName} ({(doc.fileSize / 1024).toFixed(1)} KB)</p>
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
                              <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-900">
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        ))}
                        {documents.length === 0 && (
                          <p className="text-center text-gray-500">Нет документов о стипендиях</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Информация о стипендиях */}
                  {activeTab === 'grants-info' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о предоставлении стипендии</h3>
                      {grantsInfo.length > 0 ? (
                        <div className="space-y-4">
                          {grantsInfo.map((info) => (
                            <div key={info.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium text-gray-900">Информация о стипендиях</h4>
                                <button onClick={() => handleEdit(info)} className="text-blue-600 hover:text-blue-900">
                                  <FaEdit />
                                </button>
                              </div>
                              <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: info.content }} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-4">Информация о стипендиях не задана</p>
                          <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                          >
                            Добавить информацию
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Меры социальной поддержки */}
                  {activeTab === 'support' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Меры социальной поддержки обучающихся</h3>
                      {supportMeasures.length > 0 ? (
                        <div className="space-y-4">
                          {supportMeasures.map((measure) => (
                            <div key={measure.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium text-gray-900">Меры поддержки</h4>
                                <button onClick={() => handleEdit(measure)} className="text-blue-600 hover:text-blue-900">
                                  <FaEdit />
                                </button>
                              </div>
                              <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: measure.content }} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-4">Меры социальной поддержки не заданы</p>
                          <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                          >
                            Добавить меры поддержки
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Информация об общежитиях */}
                  {activeTab === 'hostel-info' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Информация об общежитиях</h3>
                      {hostelInfo ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Количество общежитий</label>
                            <input
                              type="number"
                              value={hostelInfo.hostels}
                              onChange={(e) => setHostelInfo({ ...hostelInfo, hostels: parseInt(e.target.value) })}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Количество мест</label>
                            <input
                              type="number"
                              value={hostelInfo.places}
                              onChange={(e) => setHostelInfo({ ...hostelInfo, places: parseInt(e.target.value) })}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Адаптированных помещений</label>
                            <input
                              type="number"
                              value={hostelInfo.adapted}
                              onChange={(e) => setHostelInfo({ ...hostelInfo, adapted: parseInt(e.target.value) })}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Количество интернатов</label>
                            <input
                              type="number"
                              value={hostelInfo.internats}
                              onChange={(e) => setHostelInfo({ ...hostelInfo, internats: parseInt(e.target.value) })}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                          </div>
                          <div className="flex justify-end space-x-3 col-span-2">
                            <button
                              onClick={() => handleSave()}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                            >
                              <FaSave className="mr-2" />
                              Сохранить
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-4">Информация об общежитиях не задана</p>
                          <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                          >
                            Добавить информацию
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Документ о плате за проживание */}
                  {activeTab === 'hostel-payment' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Документ о плате за проживание в общежитии</h3>
                      {hostelPaymentDocument ? (
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{hostelPaymentDocument.title}</h4>
                            <p className="text-sm text-gray-600">{hostelPaymentDocument.description}</p>
                            <p className="text-xs text-gray-500">{hostelPaymentDocument.fileName} ({(hostelPaymentDocument.fileSize / 1024).toFixed(1)} KB)</p>
                          </div>
                          <div className="flex space-x-2">
                            <a
                              href={hostelPaymentDocument.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FaDownload />
                            </a>
                            <button onClick={() => handleDelete(hostelPaymentDocument.id)} className="text-red-600 hover:text-red-900">
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-center text-gray-500">Документ о плате за проживание не загружен</p>
                      )}
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
                {editingItem ? 'Редактировать' : 'Добавить'} {
                  activeTab === 'documents' ? 'локальный акт' :
                  activeTab === 'grants-info' ? 'информацию о стипендиях' :
                  activeTab === 'support' ? 'меры поддержки' :
                  activeTab === 'hostel-info' ? 'информацию об общежитиях' :
                  activeTab === 'hostel-payment' ? 'документ о плате за проживание' : 'элемент'
                }
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
            {(activeTab === 'documents' || activeTab === 'hostel-payment') && showAddForm && (
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

            {/* Форма для текста (стипендии и меры поддержки) */}
            {(activeTab === 'grants-info' || activeTab === 'support') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Содержимое</label>
                  <TiptapEditor
                    content={formData.content || ''}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="Введите содержимое..."
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
            )}

            {/* Форма для информации об общежитиях */}
            {activeTab === 'hostel-info' && showAddForm && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Количество общежитий</label>
                    <input
                      type="number"
                      value={formData.hostels || 0}
                      onChange={(e) => setFormData({ ...formData, hostels: parseInt(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Количество мест</label>
                    <input
                      type="number"
                      value={formData.places || 0}
                      onChange={(e) => setFormData({ ...formData, places: parseInt(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Адаптированных помещений</label>
                    <input
                      type="number"
                      value={formData.adapted || 0}
                      onChange={(e) => setFormData({ ...formData, adapted: parseInt(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Количество интернатов</label>
                    <input
                      type="number"
                      value={formData.internats || 0}
                      onChange={(e) => setFormData({ ...formData, internats: parseInt(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Мест в интернатах</label>
                    <input
                      type="number"
                      value={formData.interPlaces || 0}
                      onChange={(e) => setFormData({ ...formData, interPlaces: parseInt(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Адаптированных помещений в интернатах</label>
                    <input
                      type="number"
                      value={formData.interAdapted || 0}
                      onChange={(e) => setFormData({ ...formData, interAdapted: parseInt(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      min="0"
                    />
                  </div>
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}