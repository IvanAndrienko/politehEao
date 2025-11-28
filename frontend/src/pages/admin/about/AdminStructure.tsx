import { useState, useEffect } from 'react';
import { FaBuilding, FaSave, FaEdit, FaFileAlt, FaMapMarkerAlt, FaGlobe, FaDownload } from 'react-icons/fa';

export default function AdminStructure() {
  const [structureData, setStructureData] = useState({
    // Общая информация об органах управления
    managementInfo: '',
    managementInfo2: '',
    managementLocation: '',
    managementContacts: '',
    managementEmail: '',
    managementWebsite: '',

    // Данные для таблицы структуры
    departments: [] as any[],

    // Филиалы
    hasFilials: false,
    filials: [],

    // Представительства
    hasRepresentatives: false,
    representatives: []
  });

  const [documents, setDocuments] = useState([] as any[]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    file: null as File | null
  });

  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editingDepartment, setEditingDepartment] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStructureData();
    loadDocuments();
  }, []);

  const loadStructureData = async () => {
    try {
      const response = await fetch('/api/structure');
      if (response.ok) {
        const data = await response.json();
        if (Object.keys(data).length > 0) {
          setStructureData(data);
        }
      }
    } catch (error) {
      console.error('Error loading structure data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/structure-documents/all');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const saveStructureData = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/structure', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(structureData),
      });

      if (response.ok) {
        alert('Данные структуры сохранены успешно!');
      } else {
        alert('Ошибка при сохранении данных');
      }
    } catch (error) {
      console.error('Error saving structure data:', error);
      alert('Ошибка при сохранении данных');
    } finally {
      setSaving(false);
    }
  };

  const updateDocument = (id: string, field: string, value: unknown) => {
    setDocuments(documents.map(doc =>
      doc.id === id ? { ...doc, [field]: value } : doc
    ));
  };

  const uploadDocument = async () => {
    if (!uploadForm.file || !uploadForm.title.trim()) {
      alert('Пожалуйста, выберите файл и введите название документа');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description || '');

    try {
      const response = await fetch('/api/structure-documents', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Документ загружен успешно!');
        loadDocuments();
        setShowUploadForm(false);
        setUploadForm({ title: '', description: '', file: null });
      } else {
        alert('Ошибка при загрузке документа');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Ошибка при загрузке документа');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const removeDocument = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот документ?')) {
      try {
        await fetch(`/api/structure-documents/${id}`, {
          method: 'DELETE',
        });
        setDocuments(documents.filter(doc => doc.id !== id));
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Ошибка при удалении документа');
      }
    }
  };

  const updateField = (field: string, value: string) => {
    setStructureData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateDepartment = (index: number, field: string, value: string) => {
    setStructureData(prev => ({
      ...prev,
      departments: prev.departments.map((dept: any, i: number) =>
        i === index ? { ...dept, [field]: value } : dept
      )
    }));
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditingCell(field);
    setEditValue(currentValue);
  };

  const startEditingDepartment = (index: number, field: string, currentValue: string) => {
    setEditingDepartment(index);
    setEditingCell(field);
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (editingDepartment !== null && editingCell) {
      updateDepartment(editingDepartment, editingCell, editValue);
    } else if (editingCell) {
      updateField(editingCell, editValue);
    }
    setEditingCell(null);
    setEditValue('');
    setEditingDepartment(null);
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
    setEditingDepartment(null);
  };

  const getFieldValue = (field: string): string => {
    const value = structureData[field as keyof typeof structureData];
    return typeof value === 'string' ? value : '';
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
              onClick={loadStructureData}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
              <FaBuilding className="w-8 h-8 mr-3 text-blue-600" />
              Структура и органы управления
            </h1>
            <p className="text-lg text-gray-600">Редактирование структуры техникума</p>
          </div>

          {/* Общая информация об органах управления */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">Общая информация об органах управления</h2>
                <p className="text-sm opacity-90">Нажмите на значение для редактирования</p>
              </div>
              <button
                onClick={saveStructureData}
                disabled={saving}
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center disabled:opacity-50"
              >
                <FaSave className="w-4 h-4 mr-2" />
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/2">
                      Руководитель
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 relative">
                      {editingCell === 'managementInfo' ? (
                        <div className="flex items-center space-x-2">
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={3}
                            autoFocus
                          />
                          <button
                            onClick={saveEdit}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            ✓
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer hover:bg-gray-50 p-1 rounded flex items-center justify-between group"
                          onClick={() => startEditing('managementInfo', getFieldValue('managementInfo'))}
                        >
                          <span className="flex-1">
                            {getFieldValue('managementInfo') || 'Учреждение возглавляет директор, назначаемый и освобождаемый от должности Учредителем'}
                          </span>
                          <FaEdit className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 ml-2" />
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/2">
                      Коллегиальные органы управления
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 relative">
                      {editingCell === 'managementInfo2' ? (
                        <div className="flex items-center space-x-2">
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={3}
                            autoFocus
                          />
                          <button
                            onClick={saveEdit}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            ✓
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer hover:bg-gray-50 p-1 rounded flex items-center justify-between group"
                          onClick={() => startEditing('managementInfo2', getFieldValue('managementInfo2'))}
                        >
                          <span className="flex-1">
                            {getFieldValue('managementInfo2') || 'общее собрание работников и обучающихся Учреждения, педагогический совет'}
                          </span>
                          <FaEdit className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 ml-2" />
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/2">
                      Место нахождения органов управления
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 relative">
                      {editingCell === 'managementLocation' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={saveEdit}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            ✓
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer hover:bg-gray-50 p-1 rounded flex items-center justify-between group"
                          onClick={() => startEditing('managementLocation', getFieldValue('managementLocation'))}
                        >
                          <span className="flex-1">
                            {getFieldValue('managementLocation') || 'ЕАО г. Биробиджан, ул. Косникова 1в'}
                          </span>
                          <FaEdit className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 ml-2" />
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/2">
                      Контакты органов управления
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 relative">
                      {editingCell === 'managementContacts' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={saveEdit}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            ✓
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer hover:bg-gray-50 p-1 rounded flex items-center justify-between group"
                          onClick={() => startEditing('managementContacts', getFieldValue('managementContacts'))}
                        >
                          <span className="flex-1">
                            {getFieldValue('managementContacts') || 'politeh79@post.eao.ru / http://politeheao.ru'}
                          </span>
                          <FaEdit className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 ml-2" />
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Таблица структуры */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white">
              <h2 className="text-lg font-medium">Структура и органы управления</h2>
              <p className="text-sm opacity-90">Нажмите на значение для редактирования</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Наименование органа управления / структурного подразделения
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ФИО руководителя
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Должность
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Контактный телефон
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Адрес местонахождения
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Адрес официального сайта
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Адреса электронной почты
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Положение об органе управления/ о структурном подразделении
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {structureData.departments.map((dept, index) => (
                    <tr key={index} itemProp="structOrgUprav">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="name">
                        {editingDepartment === index && editingCell === 'name' ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={saveEdit}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              ✓
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer hover:bg-gray-50 p-1 rounded flex items-center justify-between group"
                            onClick={() => startEditingDepartment(index, 'name', dept.name)}
                          >
                            <span className="flex-1">{dept.name}</span>
                            <FaEdit className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 ml-2" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fio">
                        {editingDepartment === index && editingCell === 'fio' ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={saveEdit}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              ✓
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer hover:bg-gray-50 p-1 rounded flex items-center justify-between group"
                            onClick={() => startEditingDepartment(index, 'fio', dept.fio)}
                          >
                            <span className="flex-1">{dept.fio}</span>
                            <FaEdit className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 ml-2" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900" itemProp="post">
                        {editingDepartment === index && editingCell === 'post' ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={saveEdit}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              ✓
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer hover:bg-gray-50 p-1 rounded flex items-center justify-between group"
                            onClick={() => startEditingDepartment(index, 'post', dept.post)}
                          >
                            <span className="flex-1">{dept.post}</span>
                            <FaEdit className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 ml-2" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {editingDepartment === index && editingCell === 'phone' ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={saveEdit}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              ✓
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer hover:bg-gray-50 p-1 rounded flex items-center justify-between group"
                            onClick={() => startEditingDepartment(index, 'phone', dept.phone)}
                          >
                            <span className="flex-1">{dept.phone || '-'}</span>
                            <FaEdit className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 ml-2" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900" itemProp="addressStr">
                        {editingDepartment === index && editingCell === 'address' ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={saveEdit}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              ✓
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer hover:bg-gray-50 p-1 rounded flex items-center justify-between group"
                            onClick={() => startEditingDepartment(index, 'address', dept.address)}
                          >
                            <span className="flex-1">{dept.address}</span>
                            <FaEdit className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 ml-2" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900" itemProp="site">
                        {editingDepartment === index && editingCell === 'site' ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={saveEdit}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              ✓
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer hover:bg-gray-50 p-1 rounded flex items-center justify-between group"
                            onClick={() => startEditingDepartment(index, 'site', dept.site)}
                          >
                            <span className="flex-1">
                              <a href={dept.site} className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                                {dept.site.replace('http://', '').replace('https://', '')}
                              </a>
                            </span>
                            <FaEdit className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 ml-2" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                        {editingDepartment === index && editingCell === 'email' ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={saveEdit}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              ✓
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer hover:bg-gray-50 p-1 rounded flex items-center justify-between group"
                            onClick={() => startEditingDepartment(index, 'email', dept.email)}
                          >
                            <span className="flex-1">{dept.email}</span>
                            <FaEdit className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 ml-2" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        -
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Филиалы */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FaMapMarkerAlt className="w-5 h-5 mr-2 text-green-600" />
                Филиалы образовательной организации
              </h2>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600">
                  У образовательной организации филиалы отсутствуют.
                </p>
              </div>
            </div>
          </div>

          {/* Документы структуры */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FaFileAlt className="w-5 h-5 mr-2 text-red-600" />
                Документы структуры
              </h2>
              <button
                onClick={() => setShowUploadForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
              >
                Новый документ
              </button>
            </div>
            <div className="p-6">
              {loadingDocuments ? (
                <p className="text-gray-600">Загрузка документов...</p>
              ) : (
                <div className="space-y-4">
                  {/* Форма загрузки нового документа */}
                  {showUploadForm && (
                    <div className="border rounded-lg p-6 bg-blue-50">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Загрузка нового документа</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Название документа *
                          </label>
                          <input
                            type="text"
                            value={uploadForm.title}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Введите название документа"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Файл *
                          </label>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
                            onChange={handleFileSelect}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {uploadForm.file && (
                            <p className="text-sm text-gray-600 mt-1">
                              Выбран файл: {uploadForm.file.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Описание
                        </label>
                        <textarea
                          value={uploadForm.description}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Введите описание документа"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setShowUploadForm(false);
                            setUploadForm({ title: '', description: '', file: null });
                          }}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
                        >
                          Отмена
                        </button>
                        <button
                          onClick={uploadDocument}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                        >
                          Загрузить
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Список документов */}
                  {documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Название
                          </label>
                          <input
                            type="text"
                            value={doc.title}
                            onChange={(e) => updateDocument(doc.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Размер файла
                          </label>
                          <p className="text-sm text-gray-600 mt-2">
                            {(doc.fileSize / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <div className="flex items-end space-x-2">
                          <button
                            onClick={() => window.open(`/uploads/${doc.fileUrl}`, '_blank')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm flex items-center"
                          >
                            <FaDownload className="w-4 h-4 mr-1" />
                            Скачать
                          </button>
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => removeDocument(doc.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Описание
                        </label>
                        <input
                          type="text"
                          value={doc.description || ''}
                          onChange={(e) => updateDocument(doc.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="mt-4 flex items-center">
                        <input
                          type="checkbox"
                          checked={doc.isActive}
                          onChange={(e) => updateDocument(doc.id, 'isActive', e.target.checked)}
                          className="mr-2"
                        />
                        <label className="text-sm font-medium text-gray-700">Активен</label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Представительства */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FaGlobe className="w-5 h-5 mr-2 text-purple-600" />
                Представительства образовательной организации
              </h2>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600">
                  У образовательной организации представительства отсутствуют.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}