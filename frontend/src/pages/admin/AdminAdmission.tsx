import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

interface Specialty {
  id: string;
  code: string;
  name: string;
  duration: string | null;
  form: string | null;
  qualification: string | null;
  budgetPlaces: number | null;
  paidPlaces: number | null;
}

interface RequiredDocument {
  id: string;
  title: string;
  description: string | null;
}

interface ImportantDate {
  id: string;
  date: string;
  event: string;
}

interface AdmissionContact {
  id: string;
  type: string;
  title: string;
  value: string;
}

export default function AdminAdmission() {
  const [activeTab, setActiveTab] = useState<'specialties' | 'documents' | 'dates' | 'contacts' | 'dormitory'>('specialties');
  const [loading, setLoading] = useState(false);

  // Специальности
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [editingSpecialty, setEditingSpecialty] = useState<string | null>(null);
  const [newSpecialty, setNewSpecialty] = useState<Partial<Specialty>>({});

  // Документы
  const [documents, setDocuments] = useState<RequiredDocument[]>([]);
  const [editingDocument, setEditingDocument] = useState<string | null>(null);
  const [newDocument, setNewDocument] = useState<Partial<RequiredDocument>>({});

  // Даты
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [newDate, setNewDate] = useState<Partial<ImportantDate>>({});

  // Контакты
  const [contacts, setContacts] = useState<AdmissionContact[]>([]);

  // Общежитие
  const [dormitory, setDormitory] = useState<{
    description: string;
    address: string;
    images: string[];
  }>({ description: '', address: '', images: [] });
  const [uploadingImages, setUploadingImages] = useState(false);

  // Загрузка данных
  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Загрузка данных общежития
  useEffect(() => {
    if (activeTab === 'dormitory') {
      loadDormitoryData();
    }
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'specialties') {
        const response = await fetch('/api/admission/specialties');
        const data = await response.json();
        setSpecialties(data);
      } else if (activeTab === 'documents') {
        const response = await fetch('/api/admission/documents');
        const data = await response.json();
        setDocuments(data);
      } else if (activeTab === 'dates') {
        const response = await fetch('/api/admission/dates');
        const data = await response.json();
        setDates(data);
      } else if (activeTab === 'contacts') {
        const response = await fetch('/api/admission/contacts');
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDormitoryData = async () => {
    try {
      const response = await fetch('/api/admission/dormitory');
      const data = await response.json();
      setDormitory({
        description: data.description || '',
        address: data.address || '',
        images: data.images || []
      });
    } catch (error) {
      console.error('Ошибка загрузки данных общежития:', error);
    }
  };

  // Специальности
  const handleSaveSpecialty = async (specialty: Partial<Specialty>) => {
    try {
      const method = specialty.id ? 'PUT' : 'POST';
      const url = specialty.id ? `/api/admission/specialties/${specialty.id}` : '/api/admission/specialties';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(specialty)
      });

      if (response.ok) {
        loadData();
        setEditingSpecialty(null);
        setNewSpecialty({});
      }
    } catch (error) {
      console.error('Ошибка сохранения специальности:', error);
    }
  };

  const handleDeleteSpecialty = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту специальность?')) {
      try {
        await fetch(`/api/admission/specialties/${id}`, { method: 'DELETE' });
        loadData();
      } catch (error) {
        console.error('Ошибка удаления специальности:', error);
      }
    }
  };

  // Документы
  const handleSaveDocument = async (document: Partial<RequiredDocument>) => {
    try {
      const method = document.id ? 'PUT' : 'POST';
      const url = document.id ? `/api/admission/documents/${document.id}` : '/api/admission/documents';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(document)
      });

      if (response.ok) {
        loadData();
        setEditingDocument(null);
        setNewDocument({});
      }
    } catch (error) {
      console.error('Ошибка сохранения документа:', error);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот документ?')) {
      try {
        await fetch(`/api/admission/documents/${id}`, { method: 'DELETE' });
        loadData();
      } catch (error) {
        console.error('Ошибка удаления документа:', error);
      }
    }
  };

  // Даты
  const handleSaveDate = async (date: Partial<ImportantDate>) => {
    try {
      const method = date.id ? 'PUT' : 'POST';
      const url = date.id ? `/api/admission/dates/${date.id}` : '/api/admission/dates';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(date)
      });

      if (response.ok) {
        loadData();
        setEditingDate(null);
        setNewDate({});
      }
    } catch (error) {
      console.error('Ошибка сохранения даты:', error);
    }
  };

  const handleDeleteDate = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту дату?')) {
      try {
        await fetch(`/api/admission/dates/${id}`, { method: 'DELETE' });
        loadData();
      } catch (error) {
        console.error('Ошибка удаления даты:', error);
      }
    }
  };

  // Загрузка изображений для общежития
  const handleImageUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload/dormitory/images', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        // Обновляем состояние с новыми изображениями
        const uploadedUrls = Array.isArray(data.files)
          ? data.files.map((file: { url: string }) => file.url)
          : Array.isArray(data.urls)
            ? data.urls
            : [];
        const newImages = [...dormitory.images, ...uploadedUrls];
        setDormitory(prev => ({
          ...prev,
          images: newImages
        }));

        // Автоматически сохраняем в базу данных
        try {
          await fetch('/api/admission/dormitory', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...dormitory,
              images: newImages
            })
          });
          alert('Изображения загружены и сохранены успешно!');
        } catch (saveError) {
          console.error('Ошибка сохранения:', saveError);
          alert('Изображения загружены, но не удалось сохранить в базу данных');
        }
      } else {
        alert('Ошибка загрузки изображений');
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Ошибка загрузки изображений');
    } finally {
      setUploadingImages(false);
    }
  };

  // Удаление изображения
  const handleRemoveImage = async (index: number) => {
    const newImages = dormitory.images.filter((_, i) => i !== index);
    setDormitory(prev => ({
      ...prev,
      images: newImages
    }));

    // Автоматически сохраняем изменения в базу данных
    try {
      await fetch('/api/admission/dormitory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dormitory,
          images: newImages
        })
      });
    } catch (error) {
      console.error('Ошибка сохранения после удаления:', error);
    }
  };

  // Контакты
  const handleSaveContact = async (contact: Partial<AdmissionContact>) => {
    try {
      const method = contact.id ? 'PUT' : 'POST';
      const url = contact.id ? `/api/admission/contacts/${contact.id}` : '/api/admission/contacts';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });

      if (response.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Ошибка сохранения контакта:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Кнопки назад и обновить */}
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
              onClick={loadData}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Загрузка...' : 'Обновить'}
            </button>
          </div>

          {/* Заголовок */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление приемной комиссией</h1>
            <p className="text-lg text-gray-600">Настройка данных для страницы "Абитуриенту"</p>
          </div>
        </div>
  
        {/* Табы */}
        <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg shadow-sm">
          {[
            { key: 'specialties', label: 'Специальности' },
            { key: 'documents', label: 'Документы' },
            { key: 'dates', label: 'Важные даты' },
            { key: 'contacts', label: 'Контакты' },
            { key: 'dormitory', label: 'Общежитие' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Контент табов */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'specialties' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Специальности</h2>
                <button
                  onClick={() => setEditingSpecialty('new')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Добавить специальность
                </button>
              </div>

              {/* Форма добавления/редактирования */}
              {editingSpecialty && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingSpecialty === 'new' ? 'Новая специальность' : 'Редактирование специальности'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Код (09.02.07)"
                      className="px-3 py-2 border rounded-md"
                      value={editingSpecialty === 'new' ? newSpecialty.code || '' : specialties.find(s => s.id === editingSpecialty)?.code || ''}
                      onChange={(e) => {
                        if (editingSpecialty === 'new') {
                          setNewSpecialty({ ...newSpecialty, code: e.target.value });
                        } else {
                          const specialty = specialties.find(s => s.id === editingSpecialty);
                          if (specialty) {
                            setSpecialties(specialties.map(s => s.id === editingSpecialty ? { ...s, code: e.target.value } : s));
                          }
                        }
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Название специальности"
                      className="px-3 py-2 border rounded-md"
                      value={editingSpecialty === 'new' ? newSpecialty.name || '' : specialties.find(s => s.id === editingSpecialty)?.name || ''}
                      onChange={(e) => {
                        if (editingSpecialty === 'new') {
                          setNewSpecialty({ ...newSpecialty, name: e.target.value });
                        } else {
                          const specialty = specialties.find(s => s.id === editingSpecialty);
                          if (specialty) {
                            setSpecialties(specialties.map(s => s.id === editingSpecialty ? { ...s, name: e.target.value } : s));
                          }
                        }
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Срок обучения"
                      className="px-3 py-2 border rounded-md"
                      value={editingSpecialty === 'new' ? newSpecialty.duration || '' : specialties.find(s => s.id === editingSpecialty)?.duration || ''}
                      onChange={(e) => {
                        if (editingSpecialty === 'new') {
                          setNewSpecialty({ ...newSpecialty, duration: e.target.value });
                        } else {
                          const specialty = specialties.find(s => s.id === editingSpecialty);
                          if (specialty) {
                            setSpecialties(specialties.map(s => s.id === editingSpecialty ? { ...s, duration: e.target.value } : s));
                          }
                        }
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Форма обучения"
                      className="px-3 py-2 border rounded-md"
                      value={editingSpecialty === 'new' ? newSpecialty.form || '' : specialties.find(s => s.id === editingSpecialty)?.form || ''}
                      onChange={(e) => {
                        if (editingSpecialty === 'new') {
                          setNewSpecialty({ ...newSpecialty, form: e.target.value });
                        } else {
                          const specialty = specialties.find(s => s.id === editingSpecialty);
                          if (specialty) {
                            setSpecialties(specialties.map(s => s.id === editingSpecialty ? { ...s, form: e.target.value } : s));
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Квалификация"
                      className="px-3 py-2 border rounded-md"
                      value={editingSpecialty === 'new' ? newSpecialty.qualification || '' : specialties.find(s => s.id === editingSpecialty)?.qualification || ''}
                      onChange={(e) => {
                        if (editingSpecialty === 'new') {
                          setNewSpecialty({ ...newSpecialty, qualification: e.target.value });
                        } else {
                          const specialty = specialties.find(s => s.id === editingSpecialty);
                          if (specialty) {
                            setSpecialties(specialties.map(s => s.id === editingSpecialty ? { ...s, qualification: e.target.value } : s));
                          }
                        }
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Бюджетные места"
                      className="px-3 py-2 border rounded-md"
                      value={editingSpecialty === 'new' ? newSpecialty.budgetPlaces ?? '' : specialties.find(s => s.id === editingSpecialty)?.budgetPlaces ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value === '' ? null : parseInt(value);
                        if (editingSpecialty === 'new') {
                          setNewSpecialty({ ...newSpecialty, budgetPlaces: numValue });
                        } else {
                          const specialty = specialties.find(s => s.id === editingSpecialty);
                          if (specialty) {
                            setSpecialties(specialties.map(s => s.id === editingSpecialty ? { ...s, budgetPlaces: numValue } : s));
                          }
                        }
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Платные места"
                      className="px-3 py-2 border rounded-md"
                      value={editingSpecialty === 'new' ? newSpecialty.paidPlaces ?? '' : specialties.find(s => s.id === editingSpecialty)?.paidPlaces ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value === '' ? null : parseInt(value);
                        if (editingSpecialty === 'new') {
                          setNewSpecialty({ ...newSpecialty, paidPlaces: numValue });
                        } else {
                          const specialty = specialties.find(s => s.id === editingSpecialty);
                          if (specialty) {
                            setSpecialties(specialties.map(s => s.id === editingSpecialty ? { ...s, paidPlaces: numValue } : s));
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const data = editingSpecialty === 'new' ? newSpecialty : specialties.find(s => s.id === editingSpecialty);
                        if (data) handleSaveSpecialty(data);
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                    >
                      <FaSave className="mr-2" />
                      Сохранить
                    </button>
                    <button
                      onClick={() => {
                        setEditingSpecialty(null);
                        setNewSpecialty({});
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <FaTimes className="mr-2" />
                      Отмена
                    </button>
                  </div>
                </div>
              )}

              {/* Таблица специальностей */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="px-4 py-3 text-left font-semibold">Код</th>
                      <th className="px-4 py-3 text-left font-semibold">Наименование</th>
                      <th className="px-4 py-3 text-left font-semibold">Срок</th>
                      <th className="px-4 py-3 text-left font-semibold">Форма</th>
                      <th className="px-4 py-3 text-left font-semibold">Квалификация</th>
                      <th className="px-4 py-3 text-center font-semibold">Бюджет</th>
                      <th className="px-4 py-3 text-center font-semibold">Платные</th>
                      <th className="px-4 py-3 text-center font-semibold">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specialties.map((specialty) => (
                      <tr key={specialty.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-blue-600 font-medium">{specialty.code}</td>
                        <td className="px-4 py-3">{specialty.name}</td>
                        <td className="px-4 py-3">{specialty.duration}</td>
                        <td className="px-4 py-3">{specialty.form}</td>
                        <td className="px-4 py-3">{specialty.qualification}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            {specialty.budgetPlaces || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {specialty.paidPlaces || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => setEditingSpecialty(specialty.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteSpecialty(specialty.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Необходимые документы</h2>
                <button
                  onClick={() => setEditingDocument('new')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Добавить документ
                </button>
              </div>

              {/* Форма добавления/редактирования */}
              {editingDocument && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingDocument === 'new' ? 'Новый документ' : 'Редактирование документа'}
                  </h3>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Название документа"
                      className="w-full px-3 py-2 border rounded-md"
                      value={editingDocument === 'new' ? newDocument.title || '' : documents.find(d => d.id === editingDocument)?.title || ''}
                      onChange={(e) => {
                        if (editingDocument === 'new') {
                          setNewDocument({ ...newDocument, title: e.target.value });
                        } else {
                          const document = documents.find(d => d.id === editingDocument);
                          if (document) {
                            setDocuments(documents.map(d => d.id === editingDocument ? { ...d, title: e.target.value } : d));
                          }
                        }
                      }}
                    />
                  </div>
                  <textarea
                    placeholder="Описание документа (необязательно)"
                    className="w-full px-3 py-2 border rounded-md mb-4"
                    rows={3}
                    value={editingDocument === 'new' ? newDocument.description || '' : documents.find(d => d.id === editingDocument)?.description || ''}
                    onChange={(e) => {
                      if (editingDocument === 'new') {
                        setNewDocument({ ...newDocument, description: e.target.value });
                      } else {
                        const document = documents.find(d => d.id === editingDocument);
                        if (document) {
                          setDocuments(documents.map(d => d.id === editingDocument ? { ...d, description: e.target.value } : d));
                        }
                      }
                    }}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const data = editingDocument === 'new' ? newDocument : documents.find(d => d.id === editingDocument);
                        if (data) handleSaveDocument(data);
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                    >
                      <FaSave className="mr-2" />
                      Сохранить
                    </button>
                    <button
                      onClick={() => {
                        setEditingDocument(null);
                        setNewDocument({});
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <FaTimes className="mr-2" />
                      Отмена
                    </button>
                  </div>
                </div>
              )}

              {/* Список документов */}
              <div className="space-y-4">
                {documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">{document.title}</h4>
                      {document.description && (
                        <p className="text-gray-600 text-sm mt-1">{document.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingDocument(document.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(document.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dates' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Важные даты</h2>
                <button
                  onClick={() => setEditingDate('new')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Добавить дату
                </button>
              </div>

              {/* Форма добавления/редактирования */}
              {editingDate && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingDate === 'new' ? 'Новая дата' : 'Редактирование даты'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Дата строго в формате: 1 сентября 2025, 19 мая 2026"
                      className="px-3 py-2 border rounded-md"
                      value={editingDate === 'new' ? newDate.date || '' : dates.find(d => d.id === editingDate)?.date || ''}
                      onChange={(e) => {
                        if (editingDate === 'new') {
                          setNewDate({ ...newDate, date: e.target.value });
                        } else {
                          const date = dates.find(d => d.id === editingDate);
                          if (date) {
                            setDates(dates.map(d => d.id === editingDate ? { ...d, date: e.target.value } : d));
                          }
                        }
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Событие"
                      className="px-3 py-2 border rounded-md"
                      value={editingDate === 'new' ? newDate.event || '' : dates.find(d => d.id === editingDate)?.event || ''}
                      onChange={(e) => {
                        if (editingDate === 'new') {
                          setNewDate({ ...newDate, event: e.target.value });
                        } else {
                          const date = dates.find(d => d.id === editingDate);
                          if (date) {
                            setDates(dates.map(d => d.id === editingDate ? { ...d, event: e.target.value } : d));
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const data = editingDate === 'new' ? newDate : dates.find(d => d.id === editingDate);
                        if (data) handleSaveDate(data);
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                    >
                      <FaSave className="mr-2" />
                      Сохранить
                    </button>
                    <button
                      onClick={() => {
                        setEditingDate(null);
                        setNewDate({});
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <FaTimes className="mr-2" />
                      Отмена
                    </button>
                  </div>
                </div>
              )}

              {/* Список дат */}
              <div className="space-y-4">
                {dates.map((date) => {
                  const dateParts = date.date.split(' ');
                  const dayMonth = dateParts.slice(0, 2).join(' ');
                  const year = dateParts[2];
                  return (
                    <div key={date.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-center flex-shrink-0 w-24">
                          <div className="text-blue-700 font-bold text-base leading-tight">{dayMonth}</div>
                          <div className="text-blue-600 font-semibold text-sm">{year}</div>
                        </div>
                        <div className="text-gray-700 font-medium">{date.event}</div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteDate(date.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Контакты приемной комиссии</h2>
                <p className="text-gray-600 mt-1">Редактируйте контактную информацию приемной комиссии</p>
              </div>

              {/* Форма редактирования контактов */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Контакты приемной комиссии</h3>
                <div className="space-y-4">
                  {/* Телефон */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                    <input
                      type="text"
                      placeholder="+7 (999) 123-45-67"
                      className="w-full px-3 py-2 border rounded-md"
                      value={contacts.find(c => c.type === 'phone')?.value || ''}
                      onChange={(e) => {
                        const phoneContact = contacts.find(c => c.type === 'phone');
                        if (phoneContact) {
                          setContacts(contacts.map(c => c.id === phoneContact.id ? { ...c, value: e.target.value } : c));
                        } else {
                          // Создать новый контакт телефона
                          const newPhoneContact = {
                            id: 'phone',
                            type: 'phone',
                            title: 'Телефон',
                            value: e.target.value,
                            order: 1
                          };
                          setContacts([...contacts, newPhoneContact]);
                        }
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="info@college.ru"
                      className="w-full px-3 py-2 border rounded-md"
                      value={contacts.find(c => c.type === 'email')?.value || ''}
                      onChange={(e) => {
                        const emailContact = contacts.find(c => c.type === 'email');
                        if (emailContact) {
                          setContacts(contacts.map(c => c.id === emailContact.id ? { ...c, value: e.target.value } : c));
                        } else {
                          // Создать новый контакт email
                          const newEmailContact = {
                            id: 'email',
                            type: 'email',
                            title: 'Email',
                            value: e.target.value,
                            order: 2
                          };
                          setContacts([...contacts, newEmailContact]);
                        }
                      }}
                    />
                  </div>

                  {/* Адрес */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
                    <textarea
                      placeholder="г. Биробиджан, ул. Техникумовская, д. 15"
                      className="w-full px-3 py-2 border rounded-md"
                      rows={2}
                      value={contacts.find(c => c.type === 'address')?.value || ''}
                      onChange={(e) => {
                        const addressContact = contacts.find(c => c.type === 'address');
                        if (addressContact) {
                          setContacts(contacts.map(c => c.id === addressContact.id ? { ...c, value: e.target.value } : c));
                        } else {
                          // Создать новый контакт адреса
                          const newAddressContact = {
                            id: 'address',
                            type: 'address',
                            title: 'Адрес',
                            value: e.target.value
                          };
                          setContacts([...contacts, newAddressContact]);
                        }
                      }}
                    />
                  </div>

                  {/* График приема документов */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">График приема документов</label>
                    <textarea
                      placeholder="Понедельник – пятница с 9.30 до 15.30
Обеденный перерыв с 12.00 до 13.00

Суббота, воскресенье – выходной день."
                      className="w-full px-3 py-2 border rounded-md"
                      rows={6}
                      value={contacts.find(c => c.type === 'schedule')?.value || ''}
                      onChange={(e) => {
                        const scheduleContact = contacts.find(c => c.type === 'schedule');
                        if (scheduleContact) {
                          setContacts(contacts.map(c => c.id === scheduleContact.id ? { ...c, value: e.target.value } : c));
                        } else {
                          // Создать новый контакт графика приема документов
                          const newScheduleContact = {
                            id: 'schedule',
                            type: 'schedule',
                            title: 'График приема документов',
                            value: e.target.value
                          };
                          setContacts([...contacts, newScheduleContact]);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={async () => {
                      // Сохранить все контакты
                      for (const contact of contacts) {
                        await handleSaveContact(contact);
                      }
                      alert('Контакты сохранены!');
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                  >
                    <FaSave className="mr-2" />
                    Сохранить все контакты
                  </button>
                </div>
              </div>

              {/* Предпросмотр контактов */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Предпросмотр:</h4>
                {[
                  { type: 'phone', title: 'Телефон', icon: '📞' },
                  { type: 'email', title: 'Email', icon: '✉️' },
                  { type: 'address', title: 'Адрес', icon: '📍' },
                  { type: 'schedule', title: 'График приема документов', icon: '🕒' }
                ].map((contactType) => {
                  const contact = contacts.find(c => c.type === contactType.type);
                  return (
                    <div key={contactType.type} className="flex items-start p-3 bg-white border rounded-lg">
                      <span className="text-lg mr-3 mt-1">{contactType.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{contactType.title}</div>
                        <div className="text-gray-600 whitespace-pre-line">{contact?.value || 'Не указано'}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'dormitory' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Общежитие</h2>
                <p className="text-gray-600 mt-1">Управление информацией об общежитии и фотографиями</p>
              </div>

              {/* Форма редактирования общежития */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Информация об общежитии</h3>
                <div className="space-y-4">
                  {/* Описание */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Описание общежития</label>
                    <textarea
                      placeholder="Опишите условия проживания, удобства, инфраструктуру..."
                      className="w-full px-3 py-2 border rounded-md"
                      rows={4}
                      value={dormitory.description}
                      onChange={(e) => setDormitory({ ...dormitory, description: e.target.value })}
                    />
                  </div>

                  {/* Адрес */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Адрес общежития</label>
                    <input
                      type="text"
                      placeholder="г. Биробиджан, ул. Примерная, д. 123"
                      className="w-full px-3 py-2 border rounded-md"
                      value={dormitory.address}
                      onChange={(e) => setDormitory({ ...dormitory, address: e.target.value })}
                    />
                  </div>

                  {/* Изображения */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Фотографии общежития</label>
                    <div className="space-y-4">
                      {/* Загрузка новых изображений */}
                      <div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                          disabled={uploadingImages}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {uploadingImages && (
                          <p className="text-sm text-blue-600 mt-1">Загрузка изображений...</p>
                        )}
                      </div>

                      {/* Список загруженных изображений */}
                      {dormitory.images.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Загруженные изображения:</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {dormitory.images.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={image}
                                  alt={`Общежитие ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-md border"
                                />
                                <button
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FaTimes className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/admission/dormitory', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(dormitory)
                        });

                        if (response.ok) {
                          alert('Информация об общежитии сохранена!');
                          loadDormitoryData();
                        } else {
                          alert('Ошибка сохранения');
                        }
                      } catch (error) {
                        console.error('Ошибка сохранения:', error);
                        alert('Ошибка сохранения');
                      }
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                  >
                    <FaSave className="mr-2" />
                    Сохранить
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
