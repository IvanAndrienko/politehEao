import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaFileUpload, FaBuilding, FaFlask, FaBook, FaRunning, FaHome, FaLaptop } from 'react-icons/fa';
import TiptapEditor from '../../../components/TiptapEditor';

interface Cabinet {
  id: string;
  address: string;
  name: string;
  equipment: string;
  accessibility: string;
  order: number;
  isActive: boolean;
}

interface PracticeObject {
  id: string;
  address: string;
  name: string;
  equipment: string;
  accessibility: string;
  order: number;
  isActive: boolean;
}

interface Library {
  id: string;
  name: string;
  address: string;
  area: number;
  seats: number;
  accessibility: string;
  order: number;
  isActive: boolean;
}

interface SportObject {
  id: string;
  name: string;
  address: string;
  area: number;
  seats: number;
  accessibility: string;
  order: number;
  isActive: boolean;
}

interface TextBlock {
  id: string;
  blockType: string;
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

interface ObjectsDocument {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  category: string;
  order: number;
  isActive: boolean;
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

export default function AdminObjects() {
  const [activeTab, setActiveTab] = useState('cabinets');
  const [loading, setLoading] = useState(false);

  // Данные для таблиц
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [practiceObjects, setPracticeObjects] = useState<PracticeObject[]>([]);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [sportObjects, setSportObjects] = useState<SportObject[]>([]);
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [hostelInfo, setHostelInfo] = useState<HostelInfo | null>(null);
  const [documents, setDocuments] = useState<ObjectsDocument[]>([]);
  const [hostelPaymentDocument, setHostelPaymentDocument] = useState<HostelPaymentDocument | null>(null);

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
        case 'cabinets':
          const cabinetsRes = await fetch('/api/objects/cabinets');
          setCabinets(await cabinetsRes.json());
          break;
        case 'practice-objects':
          const practiceRes = await fetch('/api/objects/practice-objects');
          setPracticeObjects(await practiceRes.json());
          break;
        case 'libraries':
          const librariesRes = await fetch('/api/objects/libraries');
          setLibraries(await librariesRes.json());
          break;
        case 'sport-objects':
          const sportRes = await fetch('/api/objects/sport-objects');
          setSportObjects(await sportRes.json());
          break;
        case 'text-blocks':
          const textRes = await fetch('/api/objects/text-blocks');
          setTextBlocks(await textRes.json());
          break;
        case 'hostel-info':
          const hostelRes = await fetch('/api/objects/hostel-info');
          const hostelData = await hostelRes.json();
          setHostelInfo(hostelData);
          break;
        case 'documents':
          const docsRes = await fetch('/api/objects/documents');
          setDocuments(await docsRes.json());
          break;
        case 'hostel-payment':
          const paymentDocRes = await fetch('/api/objects/hostel-payment-document');
          const paymentDoc = await paymentDocRes.json();
          setHostelPaymentDocument(paymentDoc);
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
      let method = '';

      if (activeTab === 'hostel-info') {
        url = `/api/objects/hostel-info`;
        method = 'POST';
      } else if (activeTab === 'text-blocks') {
        url = `/api/objects/text-blocks`;
        method = 'POST';
      } else {
        url = editingItem?.id
          ? `/api/objects/${activeTab}/${editingItem.id}`
          : `/api/objects/${activeTab}`;
        method = editingItem?.id ? 'PUT' : 'POST';
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
      await fetch(`/api/objects/${activeTab}/${id}`, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formDataUpload = new FormData(event.currentTarget);

    try {
      const response = await fetch(`/api/objects/${activeTab === 'hostel-payment' ? 'hostel-payment-document' : activeTab}`, {
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

  const handleHostelPaymentDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить документ о плате за проживание?')) return;

    try {
      await fetch('/api/objects/hostel-payment-document', { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Error deleting hostel payment document:', error);
    }
  };

  const tabs = [
    { id: 'cabinets', label: 'Кабинеты', icon: <FaBuilding />, description: 'Оборудованные учебные кабинеты' },
    { id: 'practice-objects', label: 'Практические занятия', icon: <FaFlask />, description: 'Объекты для проведения практических занятий' },
    { id: 'libraries', label: 'Библиотеки', icon: <FaBook />, description: 'Библиотеки и объекты спорта' },
    { id: 'sport-objects', label: 'Спорт. объекты', icon: <FaRunning />, description: 'Объекты спорта' },
    { id: 'text-blocks', label: 'Текстовые блоки', icon: <FaLaptop />, description: 'Текстовые блоки материально-технического обеспечения' },
    { id: 'hostel-info', label: 'Общежития', icon: <FaHome />, description: 'Информация об общежитиях' },
    { id: 'documents', label: 'Документы', icon: <FaFileUpload />, description: 'Документы материально-технического обеспечения' },
    { id: 'hostel-payment', label: 'Плата за проживание', icon: <FaHome />, description: 'Документ о плате за проживание в общежитии' }
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление материально-техническим обеспечением</h1>
            <p className="text-lg text-gray-600">Редактирование данных о материально-техническом обеспечении техникума</p>
          </div>

          {/* Контент таба */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Управление материально-техническим обеспечением</h1>
                <p className="text-blue-100 text-sm mt-1">{tabs.find(tab => tab.id === activeTab)?.description}</p>
              </div>
              {activeTab !== 'hostel-info' && activeTab !== 'hostel-payment' && (
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
                <nav className="-mb-px flex flex-wrap gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-2 px-3 border-b-2 font-medium text-sm rounded-t-md transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
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
                  {/* Кабинеты */}
                  {activeTab === 'cabinets' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <FaBuilding className="w-5 h-5 mr-2 text-blue-600" />
                        Оборудованные учебные кабинеты
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Адрес</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Оборудование</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Доступность</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {cabinets.map((cabinet) => (
                              <tr key={cabinet.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cabinet.address}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{cabinet.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{cabinet.equipment}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{cabinet.accessibility}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button onClick={() => handleEdit(cabinet)} className="text-blue-600 hover:text-blue-900 mr-3">
                                    <FaEdit />
                                  </button>
                                  <button onClick={() => handleDelete(cabinet.id)} className="text-red-600 hover:text-red-900">
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

                  {/* Практические объекты */}
                  {activeTab === 'practice-objects' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <FaFlask className="w-5 h-5 mr-2 text-green-600" />
                        Объекты для проведения практических занятий
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Адрес</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Оборудование</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Доступность</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {practiceObjects.map((obj) => (
                              <tr key={obj.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{obj.address}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{obj.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{obj.equipment}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{obj.accessibility}</td>
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
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Библиотеки */}
                  {activeTab === 'libraries' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <FaBook className="w-5 h-5 mr-2 text-purple-600" />
                        Библиотеки
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Адрес</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Площадь</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Места</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Доступность</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {libraries.map((lib) => (
                              <tr key={lib.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lib.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{lib.address}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{lib.area} м²</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{lib.seats}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{lib.accessibility}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button onClick={() => handleEdit(lib)} className="text-blue-600 hover:text-blue-900 mr-3">
                                    <FaEdit />
                                  </button>
                                  <button onClick={() => handleDelete(lib.id)} className="text-red-600 hover:text-red-900">
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

                  {/* Спортивные объекты */}
                  {activeTab === 'sport-objects' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <FaRunning className="w-5 h-5 mr-2 text-orange-600" />
                        Объекты спорта
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Адрес</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Площадь</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Места</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Доступность</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {sportObjects.map((obj) => (
                              <tr key={obj.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{obj.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{obj.address}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{obj.area} м²</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{obj.seats}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{obj.accessibility}</td>
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
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Текстовые блоки */}
                  {activeTab === 'text-blocks' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <FaLaptop className="w-5 h-5 mr-2 text-indigo-600" />
                        Текстовые блоки
                      </h3>
                      <div className="space-y-4">
                        {textBlocks.map((block) => (
                          <div key={block.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-900">
                                {block.blockType === 'accessibility' ? 'Обеспечение беспрепятственного доступа' :
                                 block.blockType === 'facilities' ? 'Средства обучения и воспитания' :
                                 block.blockType === 'adaptedFacilities' ? 'Приспособленные средства обучения' :
                                 block.blockType === 'comNet' ? 'Доступ к информационным системам' :
                                 block.blockType === 'comNetOvz' ? 'Приспособленные информационные системы' :
                                 block.blockType === 'eios' ? 'Электронная информационно-образовательная среда' :
                                 block.blockType === 'erList' ? 'Электронные образовательные ресурсы' :
                                 block.blockType === 'erListOvz' ? 'Приспособленные электронные ресурсы' :
                                 block.blockType === 'techOvz' ? 'Специальные технические средства' :
                                 block.blockType === 'hostelInterOvz' ? 'Условия доступа в общежитие' :
                                 block.blockType}
                              </h4>
                              <button onClick={() => handleEdit(block)} className="text-blue-600 hover:text-blue-900">
                                <FaEdit />
                              </button>
                            </div>
                            <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: block.content }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Информация об общежитиях */}
                  {activeTab === 'hostel-info' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <FaHome className="w-5 h-5 mr-2 text-teal-600" />
                        Информация об общежитиях
                      </h3>
                      {hostelInfo && (
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
                          <div className="col-span-2 flex justify-end">
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
                  )}

                  {/* Документы */}
                  {activeTab === 'documents' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <FaFileUpload className="w-5 h-5 mr-2 text-cyan-600" />
                        Документы
                      </h3>
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
                                Скачать
                              </a>
                              <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-900">
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Документ о плате за проживание */}
                  {activeTab === 'hostel-payment' && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <FaHome className="w-5 h-5 mr-2 text-emerald-600" />
                        Документ о плате за проживание в общежитии
                      </h3>
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
                              Скачать
                            </a>
                            <button onClick={handleHostelPaymentDelete} className="text-red-600 hover:text-red-900">
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FaFileUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">Документ не загружен</p>
                          <button
                            onClick={() => setShowAddForm(true)}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                          >
                            Загрузить документ
                          </button>
                        </div>
                      )}
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
                {editingItem ? 'Редактировать' : 'Добавить'} {activeTab === 'cabinets' ? 'кабинет' :
                  activeTab === 'practice-objects' ? 'объект для практических занятий' :
                  activeTab === 'libraries' ? 'библиотеку' :
                  activeTab === 'sport-objects' ? 'спортивный объект' :
                  activeTab === 'text-blocks' ? 'текстовый блок' :
                  activeTab === 'documents' ? 'документ' :
                  activeTab === 'hostel-payment' ? 'документ о плате за проживание' : 'элемент'}
              </h3>
              <button onClick={() => { setEditingItem(null); setShowAddForm(false); setFormData({}); }}>
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
                {activeTab === 'documents' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Категория</label>
                    <input
                      type="text"
                      name="category"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                )}
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

            {/* Форма для текстовых блоков */}
            {activeTab === 'text-blocks' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Тип блока</label>
                  <select
                    value={formData.blockType || ''}
                    onChange={(e) => setFormData({ ...formData, blockType: e.target.value })}
                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Выберите тип</option>
                    <option value="accessibility">Обеспечение беспрепятственного доступа</option>
                    <option value="facilities">Средства обучения и воспитания</option>
                    <option value="adaptedFacilities">Приспособленные средства обучения</option>
                    <option value="comNet">Доступ к информационным системам</option>
                    <option value="comNetOvz">Приспособленные информационные системы</option>
                    <option value="eios">Электронная информационно-образовательная среда</option>
                    <option value="erList">Электронные образовательные ресурсы</option>
                    <option value="erListOvz">Приспособленные электронные ресурсы</option>
                    <option value="techOvz">Специальные технические средства</option>
                    <option value="hostelInterOvz">Условия доступа в общежитие</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Содержимое</label>
                  <TiptapEditor
                    content={formData.content || ''}
                    onChange={(content: string) => setFormData({ ...formData, content })}
                    placeholder="Введите содержимое блока..."
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
            )}

            {/* Форма для остальных элементов */}
            {activeTab !== 'documents' && activeTab !== 'text-blocks' && activeTab !== 'hostel-payment' && (
              <div className="space-y-4">
                {(activeTab === 'cabinets' || activeTab === 'practice-objects') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Адрес места нахождения</label>
                      <input
                        type="text"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {activeTab === 'cabinets' ? 'Наименование оборудованного учебного кабинета' : 'Наименование объекта для проведения практических занятий'}
                      </label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {activeTab === 'cabinets' ? 'Оснащенность оборудованного учебного кабинета' : 'Оснащенность объекта для проведения практических занятий'}
                      </label>
                      <textarea
                        value={formData.equipment || ''}
                        onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                  </>
                )}

                {(activeTab === 'libraries' || activeTab === 'sport-objects') && (
                  <>
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
                      <label className="block text-sm font-medium text-gray-700">Адрес места нахождения объекта</label>
                      <input
                        type="text"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
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
                  </>
                )}

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
            )}
          </div>
        </div>
      )}
    </div>
  );
}