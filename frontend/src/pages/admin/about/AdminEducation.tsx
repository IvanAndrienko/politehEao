import { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaArrowLeft, FaSync, FaGraduationCap, FaChevronDown, FaChevronUp, FaBriefcase, FaDownload, FaFileAlt, FaWeightHanging, FaHashtag } from 'react-icons/fa';

interface EducationSettings {
  showPrograms: boolean;
  showProgramsDetail: boolean;
  showEmployment: boolean;
  showDocuments: boolean;
}

interface EducationProgram {
  id: string;
  code: string;
  name: string;
  program: string;
  level: string;
  form: string;
  term: string;
  subjects: string;
  practices: string;
  isActive: boolean;
}

interface EducationalProgramDetail {
  id: string;
  code: string;
  name: string;
  level: string;
  program: string;
  form: string;
  description?: string;
  curriculum?: string;
  workPrograms: string[];
  schedule?: string;
  practices?: string;
  documents?: string;
  isActive: boolean;
  // Новые поля для файлов
  descriptionFile?: string;
  curriculumFile?: string;
  workProgramsFile?: string;
  scheduleFile?: string;
  practicesFile?: string;
  documentsFile?: string;
}


interface GraduateEmployment {
  id: string;
  code: string;
  name: string;
  program: string;
  graduates: number;
  employed: number;
  year: string;
  isActive: boolean;
}

interface EducationDocument {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  isActive: boolean;
}

export default function AdminEducation() {
  const [activeTab, setActiveTab] = useState('settings');
  const [settings, setSettings] = useState<EducationSettings>({
    showPrograms: false,
    showProgramsDetail: false,
    showEmployment: false,
    showDocuments: false
  });

  const [programs, setPrograms] = useState<EducationProgram[]>([]);
  const [programsDetail, setProgramsDetail] = useState<EducationalProgramDetail[]>([]);
  const [employments, setEmployments] = useState<GraduateEmployment[]>([]);
  const [educationDocuments, setEducationDocuments] = useState<EducationDocument[]>([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    program: '',
    level: '',
    form: '',
    term: '',
    subjects: '',
    practices: '',
    description: '',
    curriculum: '',
    workPrograms: [] as string[],
    schedule: '',
    practicesLink: '',
    documents: '',
    graduates: 0,
    employed: 0,
    year: '2023/2024',
    // Для документов
    field: '',
    fileUrl: '',
    fileName: '',
    fileSize: 0,
    fileType: '',
    title: '',
    docDescription: '',
    // Новые поля для файлов программ
    descriptionFile: '',
    curriculumFile: '',
    workProgramsFile: '',
    scheduleFile: '',
    practicesFile: '',
    documentsFile: ''
  });

  // Загрузка всех данных
  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadSettings(),
        loadPrograms(),
        loadProgramsDetail(),
        loadEmployments(),
        loadDocuments()
      ]);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/education/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({
          ...prev,
          ...data
        }));
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    }
  };

  const loadPrograms = async () => {
    try {
      const response = await fetch('/api/admin/education/programs');
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки программ:', error);
    }
  };

  const loadProgramsDetail = async () => {
    try {
      const response = await fetch('/api/admin/education/programs-detail');
      if (response.ok) {
        const data = await response.json();
        setProgramsDetail(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки детальных программ:', error);
    }
  };


  const loadEmployments = async () => {
    try {
      const response = await fetch('/api/admin/education/employment');
      if (response.ok) {
        const data = await response.json();
        setEmployments(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки трудоустройства:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/admin/education/documents');
      if (response.ok) {
        const data = await response.json();
        setEducationDocuments(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки документов:', error);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const toggleRowExpansion = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleDelete = async (id: string, type: string, confirmMessage: string) => {
    if (!confirm(confirmMessage)) return;

    try {
      const response = await fetch(`/api/admin/education/${type}/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        loadAllData();
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  // Сброс формы
  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      program: '',
      level: '',
      form: '',
      term: '',
      subjects: '',
      practices: '',
      description: '',
      curriculum: '',
      workPrograms: [],
      schedule: '',
      practicesLink: '',
      documents: '',
      graduates: 0,
      employed: 0,
      year: '2023/2024',
      field: '',
      fileUrl: '',
      fileName: '',
      fileSize: 0,
      fileType: '',
      title: '',
      docDescription: '',
      descriptionFile: '',
      curriculumFile: '',
      workProgramsFile: '',
      scheduleFile: '',
      practicesFile: '',
      documentsFile: ''
    });
    setEditingItem(null);
    setShowForm(false);
  };

  // Обработка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let url = '';
      let method = 'POST';

      if (activeTab === 'programs') {
        url = editingItem ? `/api/admin/education/programs/${editingItem.id}` : '/api/admin/education/programs';
        method = editingItem ? 'PUT' : 'POST';
      } else if (activeTab === 'programs-detail') {
        url = editingItem ? `/api/admin/education/programs-detail/${editingItem.id}` : '/api/admin/education/programs-detail';
        method = editingItem ? 'PUT' : 'POST';
      } else if (activeTab === 'employment') {
        url = editingItem ? `/api/admin/education/employment/${editingItem.id}` : '/api/admin/education/employment';
        method = editingItem ? 'PUT' : 'POST';
      } else if (activeTab === 'documents') {
        url = editingItem ? `/api/admin/education/documents/${editingItem.id}` : '/api/admin/education/documents';
        method = editingItem ? 'PUT' : 'POST';
      }

      const submitData = activeTab === 'documents' ? {
        title: formData.title,
        description: formData.docDescription,
        fileUrl: formData.fileUrl,
        fileName: formData.fileName,
        fileSize: formData.fileSize,
        fileType: formData.fileType
      } : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        resetForm();
        loadAllData();
      } else {
        alert('Ошибка сохранения данных');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка сохранения данных');
    }
  };

  // Debounced функция обновления настроек видимости
  const updateSetting = useCallback(
    async (key: keyof EducationSettings, value: boolean) => {
      try {
        // Сначала обновляем локальное состояние для мгновенной обратной связи
        setSettings(prev => ({ ...prev, [key]: value }));

        const newSettings = { ...settings, [key]: value };

        const response = await fetch('/api/admin/education/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSettings)
        });

        if (!response.ok) {
          console.error('Ошибка сохранения настроек:', await response.text());
          // В случае ошибки откатываем изменения
          setSettings(prev => ({ ...prev, [key]: !value }));
        }
      } catch (error) {
        console.error('Ошибка обновления настройки:', error);
        // В случае ошибки откатываем изменения
        setSettings(prev => ({ ...prev, [key]: !value }));
      }
    },
    [settings]
  );

  const tabs = [
    { id: 'settings', name: 'Настройки отображения', icon: '⚙️' },
    { id: 'programs', name: 'Основные программы', icon: '📚' },
    { id: 'programs-detail', name: 'Образовательные программы', icon: '🎓' },
    { id: 'employment', name: 'Трудоустройство', icon: '💼' },
    { id: 'documents', name: 'Документы', icon: '📄' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Кнопки навигации */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaArrowLeft className="w-5 h-5 mr-2" />
              Назад
            </button>
            <button
              onClick={loadAllData}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <FaSync className="w-4 h-4 mr-2" />
              Обновить
            </button>
          </div>

          {/* Заголовок */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление образованием</h1>
            <p className="text-lg text-gray-600">Настройка и управление образовательными данными</p>
          </div>

          {/* Табы */}
          <div className="bg-white shadow rounded-lg">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto scrollbar-hide" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Документы */}
              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Документы образования</h3>
                    <button
                      onClick={() => setShowForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <FaPlus className="mr-2" />
                      Загрузить документ
                    </button>
                  </div>

                  <div className="space-y-4">
                    {educationDocuments.map((doc: EducationDocument) => (
                      <div key={doc.id} className="bg-white border rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-lg mb-2">{doc.title}</h4>
                            {doc.description && (
                              <p className="text-gray-600 mb-3">{doc.description}</p>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <FaFileAlt className="w-4 h-4 mr-1" />
                                {doc.fileName}
                              </span>
                              <span className="flex items-center">
                                <FaWeightHanging className="w-4 h-4 mr-1" />
                                {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                              </span>
                              <span className="flex items-center">
                                <FaHashtag className="w-4 h-4 mr-1" />
                                {doc.fileType.split('/')[1]?.toUpperCase() || doc.fileType}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setEditingItem(doc);
                                setFormData({
                                  code: '',
                                  name: '',
                                  program: '',
                                  level: '',
                                  form: '',
                                  term: '',
                                  subjects: '',
                                  practices: '',
                                  description: '',
                                  curriculum: '',
                                  workPrograms: [],
                                  schedule: '',
                                  practicesLink: '',
                                  documents: '',
                                  graduates: 0,
                                  employed: 0,
                                  year: '2023/2024',
                                  field: '',
                                  fileUrl: doc.fileUrl,
                                  fileName: doc.fileName,
                                  fileSize: doc.fileSize,
                                  fileType: doc.fileType,
                                  title: doc.title,
                                  docDescription: doc.description || '',
                                  descriptionFile: '',
                                  curriculumFile: '',
                                  workProgramsFile: '',
                                  scheduleFile: '',
                                  practicesFile: '',
                                  documentsFile: ''
                                });
                                setShowForm(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-2"
                              title="Редактировать"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(doc.id, 'documents', 'Вы уверены, что хотите удалить этот документ?')}
                              className="text-red-600 hover:text-red-900 p-2"
                              title="Удалить"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                        <div className="flex space-x-4">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            <FaDownload className="mr-2" />
                            Скачать документ
                          </a>
                        </div>
                      </div>
                    ))}
                    {educationDocuments.length === 0 && (
                      <div className="text-center py-12">
                        <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Документы не найдены</h3>
                        <p className="text-gray-500">Добавьте первый документ, нажав кнопку "Загрузить документ"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Настройки отображения */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Настройки отображения таблиц</h3>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Разделы</h4>
                    {[
                      { key: 'showPrograms', label: '📚 Основные программы' },
                      { key: 'showProgramsDetail', label: '🎓 Образовательные программы' },
                      { key: 'showEmployment', label: '💼 Трудоустройство' },
                      { key: 'showDocuments', label: '📄 Документы' }
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={!!settings[key as keyof EducationSettings]}
                          onChange={(e) => updateSetting(key as keyof EducationSettings, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                        {settings[key as keyof EducationSettings] ? (
                          <FaEye className="text-green-500" />
                        ) : (
                          <FaEyeSlash className="text-gray-400" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Основные программы */}
              {activeTab === 'programs' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <FaGraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                      Информация о реализуемых уровнях образования, о формах обучения, нормативных сроках обучения
                    </h3>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setShowForm(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <FaPlus className="mr-2" />
                      Добавить основную программу (Таблица 3.5.2)
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Код, шифр
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Наименование профессии, специальности, направления подготовки
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Образовательная программа
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Уровень образования
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Формы обучения
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Нормативный срок обучения
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Учебные предметы, курсы, дисциплины
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Практики
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {programs.map((program, index) => (
                          <tr key={program.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  setEditingItem(program);
                                  setFormData({
                                    code: program.code,
                                    name: program.name,
                                    program: program.program,
                                    level: program.level,
                                    form: program.form,
                                    term: program.term,
                                    subjects: program.subjects,
                                    practices: program.practices,
                                    description: '',
                                    curriculum: '',
                                    workPrograms: [],
                                    schedule: '',
                                    practicesLink: '',
                                    documents: '',
                                    graduates: 0,
                                    employed: 0,
                                    year: '2023/2024',
                                    field: '',
                                    fileUrl: '',
                                    fileName: '',
                                    fileSize: 0,
                                    fileType: '',
                                    title: '',
                                    docDescription: '',
                                    descriptionFile: '',
                                    curriculumFile: '',
                                    workProgramsFile: '',
                                    scheduleFile: '',
                                    practicesFile: '',
                                    documentsFile: ''
                                  });
                                  setShowForm(true);
                                }}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(program.id, 'programs', 'Вы уверены, что хотите удалить эту программу?')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTrash />
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {program.code}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {program.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {program.program}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {program.level}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {program.form}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {program.term}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="flex items-start space-x-2">
                                <span className="flex-1">
                                  {expandedRows.has(index) ? program.subjects : truncateText(program.subjects, 50)}
                                </span>
                                {program.subjects && program.subjects.length > 50 && (
                                  <button
                                    onClick={() => toggleRowExpansion(index)}
                                    className="text-blue-600 hover:text-blue-700 p-1"
                                    title={expandedRows.has(index) ? "Свернуть" : "Развернуть"}
                                  >
                                    {expandedRows.has(index) ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="flex items-start space-x-2">
                                <span className="flex-1">
                                  {expandedRows.has(index) ? program.practices : truncateText(program.practices, 50)}
                                </span>
                                {program.practices && program.practices.length > 50 && (
                                  <button
                                    onClick={() => toggleRowExpansion(index)}
                                    className="text-blue-600 hover:text-blue-700 p-1"
                                    title={expandedRows.has(index) ? "Свернуть" : "Развернуть"}
                                  >
                                    {expandedRows.has(index) ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Детальные программы */}
              {activeTab === 'programs-detail' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <FaGraduationCap className="w-5 h-5 mr-2 text-green-600" />
                      Образовательные программы
                    </h3>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setShowForm(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <FaPlus className="mr-2" />
                      Добавить образовательную программу (Таблица 3.5.6)
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Код, шифр
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Наименование профессии, специальности, направления подготовки
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Уровень образования
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Образовательная программа, направленность, профиль
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Реализуемые формы обучения
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Описание программы
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Учебный план
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Рабочие программы
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Календарный график
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Практики
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Методические документы
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {programsDetail.map((program) => (
                          <tr key={program.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  setEditingItem(program);
                                  setFormData({
                                    code: program.code,
                                    name: program.name,
                                    program: program.program,
                                    level: program.level,
                                    form: program.form,
                                    term: '',
                                    subjects: '',
                                    practices: '',
                                    description: program.description || '',
                                    curriculum: program.curriculum || '',
                                    workPrograms: program.workPrograms || [],
                                    schedule: program.schedule || '',
                                    practicesLink: program.practices || '',
                                    documents: program.documents || '',
                                    graduates: 0,
                                    employed: 0,
                                    year: '2023/2024',
                                    field: '',
                                    fileUrl: '',
                                    fileName: '',
                                    fileSize: 0,
                                    fileType: '',
                                    title: '',
                                    docDescription: '',
                                    descriptionFile: program.descriptionFile || '',
                                    curriculumFile: program.curriculumFile || '',
                                    workProgramsFile: program.workProgramsFile || '',
                                    scheduleFile: program.scheduleFile || '',
                                    practicesFile: program.practicesFile || '',
                                    documentsFile: program.documentsFile || ''
                                  });
                                  setShowForm(true);
                                }}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(program.id, 'programs-detail', 'Вы уверены, что хотите удалить эту программу?')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTrash />
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {program.code}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {program.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {program.level}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {program.program}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {program.form}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {program.description ? (
                                <a href={program.description} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                  Описание
                                </a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {program.curriculum ? (
                                <a href={program.curriculum} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                  Учебный план
                                </a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {program.workPrograms && program.workPrograms.length > 0 ? (
                                program.workPrograms.map((link, idx) => (
                                  <div key={idx}>
                                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                      РПД {idx + 1}
                                    </a>
                                  </div>
                                ))
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {program.schedule ? (
                                <a href={program.schedule} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                  График
                                </a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {program.practices ? (
                                <a href={program.practices} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                  Практики
                                </a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {program.documents ? (
                                <a href={program.documents} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                  Документы
                                </a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}


              {/* Трудоустройство */}
              {activeTab === 'employment' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <FaBriefcase className="w-5 h-5 mr-2 text-green-600" />
                      Информация о трудоустройстве выпускников за 2023/2024 учебный год
                    </h3>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setShowForm(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <FaPlus className="mr-2" />
                      Добавить запись о трудоустройстве (Таблица 3.5.9)
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Код, шифр
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Наименование профессии, специальности, направления подготовки
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Образовательная программа, направленность, профиль
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Количество выпускников
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Количество трудоустроенных выпускников
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {employments.map((employment) => (
                          <tr key={employment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  setEditingItem(employment);
                                  setFormData({
                                    code: employment.code,
                                    name: employment.name,
                                    program: employment.program,
                                    level: '',
                                    form: '',
                                    term: '',
                                    subjects: '',
                                    practices: '',
                                    description: '',
                                    curriculum: '',
                                    workPrograms: [],
                                    schedule: '',
                                    practicesLink: '',
                                    documents: '',
                                    graduates: employment.graduates,
                                    employed: employment.employed,
                                    year: employment.year,
                                    field: '',
                                    fileUrl: '',
                                    fileName: '',
                                    fileSize: 0,
                                    fileType: '',
                                    title: '',
                                    docDescription: '',
                                    descriptionFile: '',
                                    curriculumFile: '',
                                    workProgramsFile: '',
                                    scheduleFile: '',
                                    practicesFile: '',
                                    documentsFile: ''
                                  });
                                  setShowForm(true);
                                }}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(employment.id, 'employment', 'Вы уверены, что хотите удалить эту запись?')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTrash />
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {employment.code}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {employment.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {employment.program}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {employment.graduates}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {employment.employed}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Модальное окно формы */}
          {showForm && (
            <div className="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {editingItem ? 'Редактировать' : 'Добавить'} {
                        activeTab === 'programs' ? 'основную программу (Таблица 3.5.2)' :
                        activeTab === 'programs-detail' ? 'образовательную программу (Таблица 3.5.6)' :
                        activeTab === 'employment' ? 'запись о трудоустройстве (Таблица 3.5.9)' :
                        'документ'
                      }
                    </h3>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Общие поля для всех таблиц (кроме документов) */}
                    {activeTab !== 'documents' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Код, шифр *
                          </label>
                          <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => setFormData({...formData, code: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Наименование *
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Форма для основных программ (Таблица 3.5.2) */}
                    {activeTab === 'programs' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Образовательная программа *
                            </label>
                            <input
                              type="text"
                              value={formData.program}
                              onChange={(e) => setFormData({...formData, program: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Уровень образования *
                            </label>
                            <input
                              type="text"
                              value={formData.level}
                              onChange={(e) => setFormData({...formData, level: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Например: Среднее профессиональное образование"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Формы обучения *
                            </label>
                            <input
                              type="text"
                              value={formData.form}
                              onChange={(e) => setFormData({...formData, form: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Нормативный срок обучения *
                            </label>
                            <input
                              type="text"
                              value={formData.term}
                              onChange={(e) => setFormData({...formData, term: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Учебные предметы, курсы, дисциплины
                            </label>
                            <textarea
                              value={formData.subjects}
                              onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Практики
                            </label>
                            <textarea
                              value={formData.practices}
                              onChange={(e) => setFormData({...formData, practices: e.target.value})}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Форма для детальных программ (Таблица 3.5.6) */}
                    {activeTab === 'programs-detail' && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Образовательная программа *
                            </label>
                            <input
                              type="text"
                              value={formData.program}
                              onChange={(e) => setFormData({...formData, program: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Уровень образования *
                            </label>
                            <input
                              type="text"
                              value={formData.level}
                              onChange={(e) => setFormData({...formData, level: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Например: Среднее профессиональное образование"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Реализуемые формы обучения *
                          </label>
                          <input
                            type="text"
                            value={formData.form}
                            onChange={(e) => setFormData({...formData, form: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Описание образовательной программы *
                          </label>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const formDataUpload = new FormData();
                                formDataUpload.append('file', file);

                                try {
                                  const response = await fetch('/api/upload/education/programs', {
                                    method: 'POST',
                                    body: formDataUpload
                                  });

                                  if (response.ok) {
                                    const data = await response.json();
                                    setFormData({...formData, descriptionFile: data.url});
                                  } else {
                                    alert('Ошибка загрузки файла');
                                  }
                                } catch (error) {
                                  console.error('Ошибка загрузки:', error);
                                  alert('Ошибка загрузки файла');
                                }
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Поддерживаемые форматы: PDF, DOC, DOCX, XLS, XLSX. Максимальный размер: 10MB
                          </p>
                          {formData.descriptionFile && (
                            <p className="text-sm text-green-600 mt-1">Файл загружен: {formData.descriptionFile.split('/').pop()}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Учебный план *
                            </label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const formDataUpload = new FormData();
                                  formDataUpload.append('file', file);

                                  try {
                                    const response = await fetch('/api/upload/education/programs', {
                                      method: 'POST',
                                      body: formDataUpload
                                    });

                                    if (response.ok) {
                                      const data = await response.json();
                                      setFormData({...formData, curriculumFile: data.url});
                                    } else {
                                      alert('Ошибка загрузки файла');
                                    }
                                  } catch (error) {
                                    console.error('Ошибка загрузки:', error);
                                    alert('Ошибка загрузки файла');
                                  }
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Поддерживаемые форматы: PDF, DOC, DOCX, XLS, XLSX. Максимальный размер: 10MB
                            </p>
                            {formData.curriculumFile && (
                              <p className="text-sm text-green-600 mt-1">Файл загружен: {formData.curriculumFile.split('/').pop()}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Календарный учебный график *
                            </label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const formDataUpload = new FormData();
                                  formDataUpload.append('file', file);

                                  try {
                                    const response = await fetch('/api/upload/education/programs', {
                                      method: 'POST',
                                      body: formDataUpload
                                    });

                                    if (response.ok) {
                                      const data = await response.json();
                                      setFormData({...formData, scheduleFile: data.url});
                                    } else {
                                      alert('Ошибка загрузки файла');
                                    }
                                  } catch (error) {
                                    console.error('Ошибка загрузки:', error);
                                    alert('Ошибка загрузки файла');
                                  }
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Поддерживаемые форматы: PDF, DOC, DOCX, XLS, XLSX. Максимальный размер: 10MB
                            </p>
                            {formData.scheduleFile && (
                              <p className="text-sm text-green-600 mt-1">Файл загружен: {formData.scheduleFile.split('/').pop()}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Рабочие программы практик *
                            </label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const formDataUpload = new FormData();
                                  formDataUpload.append('file', file);

                                  try {
                                    const response = await fetch('/api/upload/education/programs', {
                                      method: 'POST',
                                      body: formDataUpload
                                    });

                                    if (response.ok) {
                                      const data = await response.json();
                                      setFormData({...formData, practicesFile: data.url});
                                    } else {
                                      alert('Ошибка загрузки файла');
                                    }
                                  } catch (error) {
                                    console.error('Ошибка загрузки:', error);
                                    alert('Ошибка загрузки файла');
                                  }
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Поддерживаемые форматы: PDF, DOC, DOCX, XLS, XLSX. Максимальный размер: 10MB
                            </p>
                            {formData.practicesFile && (
                              <p className="text-sm text-green-600 mt-1">Файл загружен: {formData.practicesFile.split('/').pop()}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Рабочие программы дисциплин *
                            </label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const formDataUpload = new FormData();
                                  formDataUpload.append('file', file);

                                  try {
                                    const response = await fetch('/api/upload/education/programs', {
                                      method: 'POST',
                                      body: formDataUpload
                                    });

                                    if (response.ok) {
                                      const data = await response.json();
                                      setFormData({...formData, workProgramsFile: data.url});
                                    } else {
                                      alert('Ошибка загрузки файла');
                                    }
                                  } catch (error) {
                                    console.error('Ошибка загрузки:', error);
                                    alert('Ошибка загрузки файла');
                                  }
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Поддерживаемые форматы: PDF, DOC, DOCX, XLS, XLSX. Максимальный размер: 10MB
                            </p>
                            {formData.workProgramsFile && (
                              <p className="text-sm text-green-600 mt-1">Файл загружен: {formData.workProgramsFile.split('/').pop()}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Методические документы *
                            </label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const formDataUpload = new FormData();
                                  formDataUpload.append('file', file);

                                  try {
                                    const response = await fetch('/api/upload/education/programs', {
                                      method: 'POST',
                                      body: formDataUpload
                                    });

                                    if (response.ok) {
                                      const data = await response.json();
                                      setFormData({...formData, documentsFile: data.url});
                                    } else {
                                      alert('Ошибка загрузки файла');
                                    }
                                  } catch (error) {
                                    console.error('Ошибка загрузки:', error);
                                    alert('Ошибка загрузки файла');
                                  }
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Поддерживаемые форматы: PDF, DOC, DOCX, XLS, XLSX. Максимальный размер: 10MB
                            </p>
                            {formData.documentsFile && (
                              <p className="text-sm text-green-600 mt-1">Файл загружен: {formData.documentsFile.split('/').pop()}</p>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Форма для трудоустройства (Таблица 3.5.9) */}
                    {activeTab === 'employment' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Образовательная программа *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.program}
                            onChange={(e) => setFormData({...formData, program: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Количество выпускников *
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={formData.graduates}
                              onChange={(e) => setFormData({...formData, graduates: parseInt(e.target.value) || 0})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Количество трудоустроенных *
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={formData.employed}
                              onChange={(e) => setFormData({...formData, employed: parseInt(e.target.value) || 0})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Форма для документов */}
                    {activeTab === 'documents' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Заголовок документа *
                          </label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Например: Информация о языках обучения"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Описание документа
                          </label>
                          <textarea
                            value={formData.docDescription}
                            onChange={(e) => setFormData({...formData, docDescription: e.target.value})}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Краткое описание документа"
                          />
                        </div>

                        {!editingItem && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Выберите файл *
                            </label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const formDataUpload = new FormData();
                                  formDataUpload.append('file', file);

                                  try {
                                    const response = await fetch('/api/upload/education/documents', {
                                      method: 'POST',
                                      body: formDataUpload
                                    });

                                    if (response.ok) {
                                      const data = await response.json();
                                      setFormData({
                                        ...formData,
                                        fileUrl: data.url,
                                        fileName: data.name,
                                        fileSize: data.size,
                                        fileType: data.type
                                      });
                                    } else {
                                      alert('Ошибка загрузки файла');
                                    }
                                  } catch (error) {
                                    console.error('Ошибка загрузки:', error);
                                    alert('Ошибка загрузки файла');
                                  }
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Поддерживаемые форматы: PDF, DOC, DOCX, XLS, XLSX. Максимальный размер: 10MB
                            </p>
                          </div>
                        )}

                        {formData.fileName && (
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-gray-700">
                              <strong>Файл:</strong> {formData.fileName}
                            </p>
                            <p className="text-sm text-gray-600">
                              Размер: {(formData.fileSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex space-x-4 pt-4">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        {editingItem ? 'Обновить' : 'Создать'}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}