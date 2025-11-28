import { useState, useEffect } from 'react';
import { FaBuilding, FaSave, FaEdit, FaFileAlt, FaAward } from 'react-icons/fa';

export default function AdminCommon() {
  const [organizationData, setOrganizationData] = useState({
    fullName: '',
    shortName: '',
    creationDate: '',
    founderName: '',
    founderAddress: '',
    founderPhone: '',
    founderEmail: '',
    founderWebsite: '',
    legalAddress: '',
    actualAddress: '',
    dormitoryAddress: '',
    workSchedule: '',
    directorName: '',
    directorPhone: '',
    deputyDirectorPhone: '',
    educationPhone: '',
    hrPhone: '',
    accountingPhone: '',
    email: '',
    website: '',
    activityAddress: '',
    accreditationSeries: '',
    accreditationNumber: '',
    accreditationRegNum: '',
    accreditationDate: '',
    accreditationExpiry: '',
    licenseSeries: '',
    licenseNumber: '',
    licenseExpiry: ''
  });

  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadOrganizationData();
  }, []);

  const loadOrganizationData = async () => {
    try {
      const response = await fetch('/api/organization');
      if (response.ok) {
        const data = await response.json();
        if (Object.keys(data).length > 0) {
          setOrganizationData(data);
        } else {
          // Если данных нет, загружаем дефолтные значения
          setOrganizationData({
            fullName: 'Областное государственное профессиональное образовательное бюджетное учреждение «Политехнический техникум»',
            shortName: 'ОГПОБУ «Политехнический техникум»',
            creationDate: '1973 год',
            founderName: 'Департамент образования ЕАО',
            founderAddress: 'Юридический адрес: 679016, ЕАО, г. Биробиджан, ул. Калинина, 19',
            founderPhone: '8 (42622) 6-49-70',
            founderEmail: 'comobr@eao.ru',
            founderWebsite: 'comobr@mail.ru',
            legalAddress: '679006 Еврейская автономная область, г. Биробиджан, ул. Косникова, 1в',
            actualAddress: '679006 Еврейская автономная область, г. Биробиджан, ул. Косникова, 1в',
            dormitoryAddress: 'ул. Косникова, 1в',
            workSchedule: 'понедельник - пятница с 09-00 до 18-00, перерыв с 12-00 до 13-00',
            directorName: 'Калманов Михаил Борисович',
            directorPhone: '8 (42622) 48-0-08, 48-3-96',
            deputyDirectorPhone: '8 (42622) 48-0-46',
            educationPhone: '8 (42622) 48-0-77',
            hrPhone: '8 (42622) 48-0-67',
            accountingPhone: '8 (42622) 48-3-28',
            email: 'politeh79@post.eao.ru',
            website: 'https://politeheao.ru',
            activityAddress: '679006 Еврейская автономная область, г. Биробиджан, ул. Косникова, 1в',
            accreditationSeries: 'Серия 79А02 №0000086',
            accreditationNumber: '№678',
            accreditationRegNum: '№678',
            accreditationDate: '06 марта 2017 г.',
            accreditationExpiry: '6 марта 2023 г.',
            licenseSeries: 'Серия 79Л01 №0000108',
            licenseNumber: '',
            licenseExpiry: 'бессрочная'
          });
        }
      }
    } catch (error) {
      console.error('Error loading organization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveOrganizationData = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/organization', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organizationData),
      });

      if (response.ok) {
        alert('Данные организации сохранены успешно!');
      } else {
        alert('Ошибка при сохранении данных');
      }
    } catch (error) {
      console.error('Error saving organization data:', error);
      alert('Ошибка при сохранении данных');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setOrganizationData(prev => ({
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
      updateField(editingCell, editValue);
      setEditingCell(null);
      setEditValue('');
    }
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const getFieldValue = (field: string) => {
    return organizationData[field as keyof typeof organizationData] || '';
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

  const tableData = [
    { label: 'Полное наименование образовательной организации', field: 'fullName', itemProp: 'fullName' },
    { label: 'Сокращенное наименование образовательной организации', field: 'shortName', itemProp: 'shortName' },
    { label: 'Дата создания образовательной организации', field: 'creationDate', itemProp: 'regDate' },
    { label: 'Учредитель', field: 'founderName', itemProp: 'uchredLaw' },
    { label: 'Юридический адрес', field: 'legalAddress', itemProp: 'address' },
    { label: 'Фактический адрес', field: 'actualAddress' },
    { label: 'Адрес общежития', field: 'dormitoryAddress' },
    { label: 'Режим и график работы', field: 'workSchedule', itemProp: 'workTime' },
    { label: 'Контактные телефоны', field: 'directorPhone', itemProp: 'telephone', multiline: true },
    { label: 'Адреса электронной почты', field: 'email', itemProp: 'email' },
    { label: 'Адрес официального сайта', field: 'website' },
    { label: 'Руководитель', field: 'directorName' },
    { label: 'Место осуществления образовательной деятельности', field: 'activityAddress' }
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
              onClick={loadOrganizationData}
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
              Основные сведения об организации
            </h1>
            <p className="text-lg text-gray-600">Редактирование основных сведений техникума</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">Таблица основных сведений</h2>
                <p className="text-sm opacity-90">Нажмите на значение для редактирования</p>
              </div>
              <button
                onClick={saveOrganizationData}
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
                    {tableData.map((item, index) => (
                      <tr key={item.field}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/2">
                          {item.label}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 relative">
                          {editingCell === item.field ? (
                            <div className="flex items-center space-x-2">
                              {item.multiline ? (
                                <textarea
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                  rows={3}
                                  autoFocus
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  autoFocus
                                />
                              )}
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
                              onClick={() => startEditing(item.field, getFieldValue(item.field))}
                            >
                              <span className="flex-1" itemProp={item.itemProp}>
                                {getFieldValue(item.field) || 'Не указано'}
                              </span>
                              <FaEdit className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 ml-2" />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Лицензии и аккредитация */}
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <FaFileAlt className="w-5 h-5 mr-2 text-blue-600" />
                  Лицензии и аккредитация
                </h2>
              </div>
              <div className="p-6 space-y-8">

                {/* Государственная аккредитация */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaAward className="w-5 h-5 mr-2 text-green-600" />
                    Свидетельство о государственной аккредитации
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Серия и номер бланка свидетельства
                      </label>
                      <input
                        type="text"
                        value={organizationData.accreditationSeries}
                        onChange={(e) => updateField('accreditationSeries', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Регистрационный номер
                      </label>
                      <input
                        type="text"
                        value={organizationData.accreditationNumber}
                        onChange={(e) => updateField('accreditationNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Дата выдачи свидетельства
                      </label>
                      <input
                        type="text"
                        value={organizationData.accreditationDate}
                        onChange={(e) => updateField('accreditationDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Срок действия
                      </label>
                      <input
                        type="text"
                        value={organizationData.accreditationExpiry}
                        onChange={(e) => updateField('accreditationExpiry', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Лицензия */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaFileAlt className="w-5 h-5 mr-2 text-blue-600" />
                    Лицензия на осуществление образовательной деятельности
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Серия и номер бланка лицензии
                      </label>
                      <input
                        type="text"
                        value={organizationData.licenseSeries}
                        onChange={(e) => updateField('licenseSeries', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Срок действия
                      </label>
                      <input
                        type="text"
                        value={organizationData.licenseExpiry}
                        onChange={(e) => updateField('licenseExpiry', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}