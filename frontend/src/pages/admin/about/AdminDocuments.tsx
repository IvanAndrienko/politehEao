import { useState, useEffect } from 'react';
import { FaFileAlt, FaSave, FaEdit, FaUpload, FaDownload, FaTrash } from 'react-icons/fa';
import { apiUrl, assetUrl } from '../../../lib/api.ts';

export default function AdminDocuments() {
  const [documents, setDocuments] = useState({
    ustavDocLink: '',
    localActStud: '',
    localActOrder: '',
    localActCollec: '',
    reportEduDocLink: '',
    prescriptionDocLink: '',
    priemDocLink: '',
    modeDocLink: '',
    tekKontrolDocLink: '',
    perevodDocLink: '',
    vozDocLink: ''
  });

  const [documentsMeta, setDocumentsMeta] = useState<Record<string, any>>({});

  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await fetch(apiUrl('/api/documents'));
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || {});
        setDocumentsMeta(data.meta || {});
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDocuments = async () => {
    setSaving(true);
    try {
      const response = await fetch(apiUrl('/api/documents'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documents),
      });

      if (response.ok) {
        alert('Документы сохранены успешно!');
      } else {
        alert('Ошибка при сохранении документов');
      }
    } catch (error) {
      console.error('Error saving documents:', error);
      alert('Ошибка при сохранении документов');
    } finally {
      setSaving(false);
    }
  };

  const updateDocument = (field: string, value: string) => {
    setDocuments(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditingCell(field);
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (editingCell) {
      updateDocument(editingCell, editValue);
      setEditingCell(null);
      setEditValue('');
    }
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleFileUpload = async (field: string, file: File) => {
    setUploading(field);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('field', field);

    try {
      const response = await fetch(apiUrl('/api/documents/upload'), {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        updateDocument(field, data.fileUrl);
        await loadDocuments();
        alert('Файл загружен успешно!');
      } else {
        alert('Ошибка при загрузке файла');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Ошибка при загрузке файла');
    } finally {
      setUploading(null);
    }
  };

  const removeDocument = async (field: string) => {
    if (confirm('Вы уверены, что хотите удалить этот документ?')) {
      try {
        const response = await fetch(apiUrl(`/api/documents/${field}`), {
          method: 'DELETE',
        });

        if (response.ok) {
          updateDocument(field, '');
          await loadDocuments();
          alert('Документ удален успешно!');
        } else {
          alert('Ошибка при удалении документа');
        }
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Ошибка при удалении документа');
      }
    }
  };

  const getFieldValue = (field: string) => {
    return documents[field as keyof typeof documents] || '';
  };

  const documentList = [
    {
      title: 'Устав образовательной организации',
      key: 'ustavDocLink',
      description: 'Основной документ, определяющий статус и деятельность образовательной организации',
      required: true,
      category: 'basic'
    },
    {
      title: 'Правила внутреннего распорядка обучающихся',
      key: 'localActStud',
      description: 'Правила поведения и внутреннего распорядка для обучающихся',
      required: true,
      category: 'basic'
    },
    {
      title: 'Правила внутреннего трудового распорядка',
      key: 'localActOrder',
      description: 'Правила трудового распорядка для работников организации',
      required: true,
      category: 'basic'
    },
    {
      title: 'Коллективный договор',
      key: 'localActCollec',
      description: 'Соглашение между работниками и работодателем',
      required: false,
      category: 'basic'
    },
    {
      title: 'Отчёт о результатах самообследования',
      key: 'reportEduDocLink',
      description: 'Результаты внутренней оценки деятельности организации',
      required: true,
      category: 'basic'
    },
    {
      title: 'Предписания органов государственного контроля',
      key: 'prescriptionDocLink',
      description: 'Предписания контролирующих органов и отчёты об их исполнении',
      required: false,
      category: 'basic'
    },
    {
      title: 'Правила приёма обучающихся',
      key: 'priemDocLink',
      description: 'Порядок и условия приёма в образовательную организацию',
      required: true,
      category: 'local'
    },
    {
      title: 'Режим занятий обучающихся',
      key: 'modeDocLink',
      description: 'Расписание и режим учебных занятий',
      required: true,
      category: 'local'
    },
    {
      title: 'Формы, периодичность и порядок текущего контроля успеваемости',
      key: 'tekKontrolDocLink',
      description: 'Порядок проведения текущего контроля знаний обучающихся',
      required: true,
      category: 'local'
    },
    {
      title: 'Порядок и основания перевода, отчисления и восстановления обучающихся',
      key: 'perevodDocLink',
      description: 'Правила перевода между курсами, отчисления и восстановления',
      required: true,
      category: 'local'
    },
    {
      title: 'Порядок оформления отношений между организацией и обучающимися',
      key: 'vozDocLink',
      description: 'Порядок заключения, изменения и прекращения договоров об образовании',
      required: true,
      category: 'local'
    }
  ];

  const basicDocuments = documentList.filter(doc => doc.category === 'basic');
  const localDocuments = documentList.filter(doc => doc.category === 'local');

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
              onClick={loadDocuments}
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
              <FaFileAlt className="w-8 h-8 mr-3 text-blue-600" />
              Управление документами
            </h1>
            <p className="text-lg text-gray-600">Загрузка и управление документами техникума</p>
          </div>

          {/* Основные документы */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">Основные документы</h2>
                <p className="text-sm opacity-90">Обязательные документы образовательной организации</p>
              </div>
              <button
                onClick={saveDocuments}
                disabled={saving}
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center disabled:opacity-50"
              >
                <FaSave className="w-4 h-4 mr-2" />
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {basicDocuments.map((doc) => (
                <div key={doc.key} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 flex items-center mb-2">
                        {doc.title}
                        {doc.required && <span className="text-red-500 ml-1">*</span>}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">{doc.description}</p>

                      {/* Текущее значение */}
                      <div className="text-sm text-gray-700 mb-2">
                        <strong>Текущий файл:</strong> {getFieldValue(doc.key) ? (
                          <a
                            href={assetUrl(getFieldValue(doc.key))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 ml-1"
                          >
                            {documentsMeta[doc.key]?.fileName || getFieldValue(doc.key)}
                          </a>
                        ) : (
                          <span className="text-gray-400 ml-1">Не загружен</span>
                        )}
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col space-y-2">
                      {/* Загрузка файла */}
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(doc.key, file);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploading === doc.key}
                        />
                        <button
                          className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            uploading === doc.key
                              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                          disabled={uploading === doc.key}
                        >
                          <FaUpload className="w-4 h-4 mr-2" />
                          {uploading === doc.key ? 'Загрузка...' : 'Загрузить'}
                        </button>
                      </div>

                      {/* Скачать */}
                      {getFieldValue(doc.key) && (
                        <a
                          href={assetUrl(getFieldValue(doc.key))}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
                        >
                          <FaDownload className="w-4 h-4 mr-2" />
                          Скачать
                        </a>
                      )}

                      {/* Удалить */}
                      {getFieldValue(doc.key) && (
                        <button
                          onClick={() => removeDocument(doc.key)}
                          className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors"
                        >
                          <FaTrash className="w-4 h-4 mr-2" />
                          Удалить
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Локальные нормативные акты */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-green-600 text-white">
              <h2 className="text-lg font-medium">Локальные нормативные акты</h2>
              <p className="text-sm opacity-90">Документы, регламентирующие образовательную деятельность</p>
            </div>
            <div className="divide-y divide-gray-200">
              {localDocuments.map((doc) => (
                <div key={doc.key} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 flex items-center mb-2">
                        {doc.title}
                        {doc.required && <span className="text-red-500 ml-1">*</span>}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">{doc.description}</p>

                      {/* Текущее значение */}
                      <div className="text-sm text-gray-700 mb-2">
                        <strong>Текущий файл:</strong> {getFieldValue(doc.key) ? (
                          <a
                            href={`/uploads/${getFieldValue(doc.key)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 ml-1"
                          >
                            {getFieldValue(doc.key)}
                          </a>
                        ) : (
                          <span className="text-gray-400 ml-1">Не загружен</span>
                        )}
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col space-y-2">
                      {/* Загрузка файла */}
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(doc.key, file);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploading === doc.key}
                        />
                        <button
                          className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            uploading === doc.key
                              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                          disabled={uploading === doc.key}
                        >
                          <FaUpload className="w-4 h-4 mr-2" />
                          {uploading === doc.key ? 'Загрузка...' : 'Загрузить'}
                        </button>
                      </div>

                      {/* Скачать */}
                      {getFieldValue(doc.key) && (
                        <a
                          href={`/uploads/${getFieldValue(doc.key)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
                        >
                          <FaDownload className="w-4 h-4 mr-2" />
                          Скачать
                        </a>
                      )}

                      {/* Удалить */}
                      {getFieldValue(doc.key) && (
                        <button
                          onClick={() => removeDocument(doc.key)}
                          className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors"
                        >
                          <FaTrash className="w-4 h-4 mr-2" />
                          Удалить
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
