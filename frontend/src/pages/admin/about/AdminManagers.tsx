import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUser, FaSave, FaGraduationCap } from 'react-icons/fa';
import { apiUrl } from '../../../lib/api.ts';

interface Manager {
  id: string;
  fio: string;
  post: string;
  telephone: string;
  email: string;
  type: 'director' | 'deputy' | 'filial';
  filialName?: string;
}

export default function AdminManagers() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const [formData, setFormData] = useState({
    fio: '',
    post: '',
    telephone: '',
    email: '',
    type: 'director' as 'director' | 'deputy' | 'filial',
    filialName: ''
  });

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    try {
      const response = await fetch(apiUrl('/api/admin/managers'));
      if (response.ok) {
        const data = await response.json();
        setManagers(data);
      }
    } catch (error) {
      console.error('Error loading managers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingManager
        ? apiUrl(`/api/admin/managers/${editingManager.id}`)
        : apiUrl('/api/admin/managers');

      const method = editingManager ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        loadManagers();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving manager:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого сотрудника?')) return;

    try {
      const response = await fetch(apiUrl(`/api/admin/managers/${id}`), {
        method: 'DELETE'
      });

      if (response.ok) {
        loadManagers();
      }
    } catch (error) {
      console.error('Error deleting manager:', error);
    }
  };

  const handleEdit = (manager: Manager) => {
    setEditingManager(manager);
    setFormData({
      fio: manager.fio,
      post: manager.post,
      telephone: manager.telephone,
      email: manager.email,
      type: manager.type,
      filialName: manager.filialName || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      fio: '',
      post: '',
      telephone: '',
      email: '',
      type: 'director',
      filialName: ''
    });
    setEditingManager(null);
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

  const directors = managers.filter(m => m.type === 'director');
  const deputies = managers.filter(m => m.type === 'deputy');

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
              onClick={loadManagers}
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
              <FaUser className="w-8 h-8 mr-3 text-blue-600" />
              Руководство
            </h1>
            <p className="text-lg text-gray-600">Управление руководством образовательной организации</p>
          </div>

          {/* Руководитель организации */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">Руководитель образовательной организации</h2>
                <p className="text-sm opacity-90">Директор и другие руководители</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
              >
                <FaPlus className="w-4 h-4 mr-2" />
                Добавить руководителя
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ф.И.О.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Должность
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Контактные телефоны
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Адреса электронной почты
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {directors.map((manager) => (
                    <tr key={manager.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {manager.fio}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {manager.post}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {manager.telephone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {manager.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(manager)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(manager.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {directors.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        Нет данных о руководителях
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Заместители руководителя */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-green-600 text-white">
              <h2 className="text-lg font-medium">Заместители руководителя образовательной организации</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ф.И.О.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Должность
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Контактные телефоны
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Адреса электронной почты
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deputies.map((manager) => (
                    <tr key={manager.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {manager.fio}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {manager.post}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {manager.telephone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {manager.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(manager)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(manager.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {deputies.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        Нет данных о заместителях
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
              <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingManager ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Ф.И.О.</label>
                        <input
                          type="text"
                          value={formData.fio}
                          onChange={(e) => setFormData({...formData, fio: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Должность</label>
                        <input
                          type="text"
                          value={formData.post}
                          onChange={(e) => setFormData({...formData, post: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Контактные телефоны</label>
                        <input
                          type="text"
                          value={formData.telephone}
                          onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Адрес электронной почты</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Тип</label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value as 'director' | 'deputy'})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                          required
                        >
                          <option value="director">Руководитель</option>
                          <option value="deputy">Заместитель руководителя</option>
                        </select>
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
                        {editingManager ? 'Сохранить' : 'Добавить'}
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
