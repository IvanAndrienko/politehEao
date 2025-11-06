import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaFileAlt, FaGraduationCap } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface EducationalStandard {
  id: string;
  code: string;
  name: string;
  level: string;
  program: string;
  form: string;
  fedDocUrl?: string;
  fedDocName?: string;
  standartDocUrl?: string;
  standartDocName?: string;
  fedTrebUrl?: string;
  fedTrebName?: string;
  standartTrebUrl?: string;
  standartTrebName?: string;
}

export default function AdminEduStandarts() {
  const [standards, setStandards] = useState<EducationalStandard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStandard, setEditingStandard] = useState<EducationalStandard | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    level: '',
    program: '',
    form: '',
    fedDocUrl: '',
    fedDocName: '',
    standartDocUrl: '',
    standartDocName: '',
    fedTrebUrl: '',
    fedTrebName: '',
    standartTrebUrl: '',
    standartTrebName: ''
  });

  useEffect(() => {
    loadStandards();
  }, []);

  const loadStandards = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/education/standards`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStandards(data);
      }
    } catch (error) {
      console.error('Error loading standards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingStandard
        ? `${API_URL}/api/admin/education/standards/${editingStandard.id}`
        : `${API_URL}/api/admin/education/standards`;

      const method = editingStandard ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        loadStandards();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving standard:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот стандарт?')) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/education/standards/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        loadStandards();
      }
    } catch (error) {
      console.error('Error deleting standard:', error);
    }
  };

  const handleEdit = (standard: EducationalStandard) => {
    setEditingStandard(standard);
    setFormData({
      code: standard.code,
      name: standard.name,
      level: standard.level,
      program: standard.program,
      form: standard.form,
      fedDocUrl: standard.fedDocUrl || '',
      fedDocName: standard.fedDocName || '',
      standartDocUrl: standard.standartDocUrl || '',
      standartDocName: standard.standartDocName || '',
      fedTrebUrl: standard.fedTrebUrl || '',
      fedTrebName: standard.fedTrebName || '',
      standartTrebUrl: standard.standartTrebUrl || '',
      standartTrebName: standard.standartTrebName || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      level: '',
      program: '',
      form: '',
      fedDocUrl: '',
      fedDocName: '',
      standartDocUrl: '',
      standartDocName: '',
      fedTrebUrl: '',
      fedTrebName: '',
      standartTrebUrl: '',
      standartTrebName: ''
    });
    setEditingStandard(null);
  };

  const handleFileUpload = async (field: string, file: File) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/upload/education/documents`, {
        method: 'POST',
        body: formDataUpload
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          [field + 'Url']: data.url,
          [field + 'Name']: data.name
        }));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
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
              onClick={loadStandards}
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
              <FaGraduationCap className="w-8 h-8 mr-3 text-blue-600" />
              Образовательные стандарты и требования
            </h1>
            <p className="text-lg text-gray-600">Управление стандартами и требованиями к образованию</p>
          </div>

          {/* Таблица стандартов */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">Образовательные стандарты и требования</h2>
                <p className="text-sm opacity-90">Нажмите на значение для редактирования</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
              >
                <FaPlus className="w-4 h-4 mr-2" />
                Добавить стандарт
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Код, шифр
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Наименование программы
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Уровень образования
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Федеральные государственные образовательные стандарты
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Образовательные стандарты
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Федеральные государственные требования
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Самостоятельно устанавливаемые требования
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {standards.map((standard) => (
                    <tr key={standard.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {standard.code}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {standard.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {standard.level}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {standard.fedDocUrl ? (
                          <a href={standard.fedDocUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            <FaFileAlt className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {standard.standartDocUrl ? (
                          <a href={standard.standartDocUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            <FaFileAlt className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {standard.fedTrebUrl ? (
                          <a href={standard.fedTrebUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            <FaFileAlt className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {standard.standartTrebUrl ? (
                          <a href={standard.standartTrebUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                            <FaFileAlt className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(standard)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(standard.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {standards.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                        Нет образовательных стандартов
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

      {/* Модальное окно */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingStandard ? 'Редактировать стандарт' : 'Добавить стандарт'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Код, шифр</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Наименование программы</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Уровень образования</label>
                    <input
                      type="text"
                      value={formData.level}
                      onChange={(e) => setFormData({...formData, level: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Форма обучения</label>
                    <input
                      type="text"
                      value={formData.form}
                      onChange={(e) => setFormData({...formData, form: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900">Документы</h4>

                  {/* ФГОС */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Федеральные государственные образовательные стандарты</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600">Название файла</label>
                        <input
                          type="text"
                          value={formData.fedDocName}
                          onChange={(e) => setFormData({...formData, fedDocName: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          placeholder="Оставьте пустым, если не применяется"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Файл</label>
                        <input
                          type="file"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload('fedDoc', e.target.files[0])}
                          className="mt-1 block w-full"
                          accept=".pdf,.doc,.docx"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Образовательный стандарт */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Образовательные стандарты</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600">Название файла</label>
                        <input
                          type="text"
                          value={formData.standartDocName}
                          onChange={(e) => setFormData({...formData, standartDocName: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          placeholder="Оставьте пустым, если не применяется"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Файл</label>
                        <input
                          type="file"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload('standartDoc', e.target.files[0])}
                          className="mt-1 block w-full"
                          accept=".pdf,.doc,.docx"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ФГТ */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Федеральные государственные требования</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600">Название файла</label>
                        <input
                          type="text"
                          value={formData.fedTrebName}
                          onChange={(e) => setFormData({...formData, fedTrebName: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          placeholder="Оставьте пустым, если не применяется"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Файл</label>
                        <input
                          type="file"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload('fedTreb', e.target.files[0])}
                          className="mt-1 block w-full"
                          accept=".pdf,.doc,.docx"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Самостоятельные требования */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Самостоятельно устанавливаемые требования</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600">Название файла</label>
                        <input
                          type="text"
                          value={formData.standartTrebName}
                          onChange={(e) => setFormData({...formData, standartTrebName: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          placeholder="Оставьте пустым, если не применяется"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Файл</label>
                        <input
                          type="file"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload('standartTreb', e.target.files[0])}
                          className="mt-1 block w-full"
                          accept=".pdf,.doc,.docx"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingStandard ? 'Сохранить' : 'Добавить'}
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