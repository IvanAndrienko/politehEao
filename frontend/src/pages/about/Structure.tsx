import { useState, useEffect } from 'react';
import { FaBuilding, FaMapMarkerAlt, FaGlobe, FaFileAlt, FaDownload } from 'react-icons/fa';
import { assetUrl } from '../../lib/api.ts';

export default function Structure() {
  const [structureData, setStructureData] = useState({
    managementInfo: '',
    managementInfo2: '',
    managementLocation: '',
    managementContacts: '',
    departments: []
  });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDocuments, setLoadingDocuments] = useState(true);

  useEffect(() => {
    loadStructureData();
    loadDocuments();
  }, []);

  const loadStructureData = async () => {
    try {
      const response = await fetch('/api/structure');
      if (response.ok) {
        const data = await response.json();
        setStructureData({
          managementInfo: data.managementInfo || '',
          managementInfo2: data.managementInfo2 || '',
          managementLocation: data.managementLocation || '',
          managementContacts: data.managementContacts || '',
          departments: data.departments || []
        });
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
      setDocuments(data.filter((doc: any) => doc.isActive));
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Структура и органы управления образовательной организацией</h2>

      {/* Общая информация об органах управления */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Органы управления образовательной организацией</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Руководитель:</strong> {structureData.managementInfo || 'Учреждение возглавляет директор, назначаемый и освобождаемый от должности Учредителем'}
          </p>
          <p>
            <strong>Коллегиальные органы управления:</strong> {structureData.managementInfo2 || 'общее собрание работников и обучающихся Учреждения, педагогический совет'}
          </p>
          <p>
            <strong>Место нахождения органов управления:</strong> {structureData.managementLocation || 'ЕАО г. Биробиджан, ул. Косникова 1в'}
          </p>
          <p>
            <strong>Контакты органов управления:</strong>{' '}
            {structureData.managementContacts ? (
              <span dangerouslySetInnerHTML={{ __html: structureData.managementContacts }} />
            ) : (
              <>
                <a href="mailto:politeh79@post.eao.ru" className="text-blue-600 hover:text-blue-700">politeh79@post.eao.ru</a> /{' '}
                <a href="http://politeheao.ru" className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">politeheao.ru</a>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Структура и органы управления */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaBuilding className="w-5 h-5 mr-2 text-blue-600" />
          Структура и органы управления
        </h3>

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
              {structureData.departments && structureData.departments.length > 0 ? (
                structureData.departments.map((dept: any, index: number) => (
                  <tr key={index} itemProp="structOrgUprav">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="name">
                      {dept.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fio">
                      {dept.fio}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900" itemProp="post">
                      {dept.post}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {dept.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="addressStr">
                      {dept.address}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="site">
                      {dept.site ? (
                        <a href={dept.site} className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                          {dept.site.replace('http://', '').replace('https://', '')}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                      {dept.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {dept.document ? (
                        <a href={dept.document} className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                          Скачать
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  {/* Администрация */}
                  <tr itemProp="structOrgUprav">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="name">
                      Администрация техникума
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fio">
                      Калманов Михаил Борисович
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900" itemProp="post">
                      Директор
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      48-0-08
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="addressStr">
                      679006, ЕАО, г. Биробиджан, ул. Косникова, 1в
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="site">
                      <a href="http://politeheao.ru" className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                        politeheao.ru
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                      politeh79@post.eao.ru
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      -
                    </td>
                  </tr>

                  {/* Учебная часть */}
                  <tr itemProp="structOrgUprav">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="name">
                      Учебная часть
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fio">
                      Добровольская Евгения Александровна
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900" itemProp="post">
                      <div className="text-xs">Зам. директора по учебно-производственной работе</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      48-0-46
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="addressStr">
                      679006, ЕАО, г. Биробиджан, ул. Косникова, 1в
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="site">
                      <a href="http://politeheao.ru" className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                        politeheao.ru
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                      politeh79@post.eao.ru
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      -
                    </td>
                  </tr>

                  {/* Заместитель директора по техническому обучению */}
                  <tr itemProp="structOrgUprav">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="name">
                      Отдел технического обучения
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fio">
                      Громова Анастасия Павловна
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900" itemProp="post">
                      <div className="text-xs">Зам. директора по техническому обучению</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      -
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="addressStr">
                      679006, ЕАО, г. Биробиджан, ул. Косникова, 1в
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="site">
                      <a href="http://politeheao.ru" className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                        politeheao.ru
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                      politeh79@post.eao.ru
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      -
                    </td>
                  </tr>

                  {/* Заместитель директора по учебно-воспитательной работе */}
                  <tr itemProp="structOrgUprav">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="name">
                      Отдел воспитательной работы
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fio">
                      Белобородова Наталья Борисовна
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900" itemProp="post">
                      <div className="text-xs">Зам. директора по учебно-воспитательной работе</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      48-3-96
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="addressStr">
                      679006, ЕАО, г. Биробиджан, ул. Косникова, 1в
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="site">
                      <a href="http://politeheao.ru" className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                        politeheao.ru
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                      politeh79@post.eao.ru
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      -
                    </td>
                  </tr>

                  {/* Отдел кадров */}
                  <tr itemProp="structOrgUprav">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="name">
                      Отдел кадров
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fio">
                      Саханова Елена Михайловна
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900" itemProp="post">
                      Специалист по кадрам
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      48-0-67
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="addressStr">
                      679006, ЕАО, г. Биробиджан, ул. Косникова, 1в
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="site">
                      <a href="http://politeheao.ru" className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                        politeheao.ru
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                      politeh79@post.eao.ru
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      -
                    </td>
                  </tr>

                  {/* Бухгалтерия */}
                  <tr itemProp="structOrgUprav">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="name">
                      Бухгалтерия
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fio">
                      Зеленская Ольга Ерьесовна
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900" itemProp="post">
                      Главный бухгалтер
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      48-3-28
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="addressStr">
                      679006, ЕАО, г. Биробиджан, ул. Косникова, 1в
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="site">
                      <a href="http://politeheao.ru" className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                        politeheao.ru
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                      politeh79@post.eao.ru
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      -
                    </td>
                  </tr>

                  {/* Библиотека */}
                  <tr itemProp="structOrgUprav">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="name">
                      Библиотека
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fio">
                      Лысакова Галина Николаевна
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900" itemProp="post">
                      Заведующая библиотекой
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      -
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="addressStr">
                      679006, ЕАО, г. Биробиджан, ул. Косникова, 1в
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="site">
                      <a href="http://politeheao.ru" className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                        politeheao.ru
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                      politeh79@post.eao.ru
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      -
                    </td>
                  </tr>

                  {/* Столовая */}
                  <tr itemProp="structOrgUprav">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="name">
                      Столовая
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fio">
                      Осадчук Галина Васильевна
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900" itemProp="post">
                      Заведующая столовой
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      -
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="addressStr">
                      679006, ЕАО, г. Биробиджан, ул. Косникова, 1в
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="site">
                      <a href="http://politeheao.ru" className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                        politeheao.ru
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                      politeh79@post.eao.ru
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      -
                    </td>
                  </tr>

                  {/* Общежитие */}
                  <tr itemProp="structOrgUprav">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="name">
                      Общежитие
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fio">
                      Смалюх Оксана Петровна
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900" itemProp="post">
                      Заведующая общежитием
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      48-2-79
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="addressStr">
                      679006, ЕАО, г. Биробиджан, ул. Косникова, 1в
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="site">
                      <a href="http://politeheao.ru" className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                        politeheao.ru
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                      politeh79@post.eao.ru
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      -
                    </td>
                  </tr>

                  {/* Охрана труда */}
                  <tr itemProp="structOrgUprav">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="name">
                      Служба охраны труда
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fio">
                      Белобородова Наталья Борисовна
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900" itemProp="post">
                      Специалист по охране труда
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      48-3-96
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="addressStr">
                      679006, ЕАО, г. Биробиджан, ул. Косникова, 1в
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="site">
                      <a href="http://politeheao.ru" className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                        politeheao.ru
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                      politeh79@post.eao.ru
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      -
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Документы */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaFileAlt className="w-5 h-5 mr-2 text-red-600" />
          Документы
        </h3>

        {loadingDocuments ? (
          <p className="text-gray-600">Загрузка документов...</p>
        ) : documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between bg-white border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <FaFileAlt className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                    {doc.description && (
                      <p className="text-sm text-gray-600">{doc.description}</p>
                    )}
                  </div>
                </div>
                  <a
                    href={assetUrl(doc.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  download
                >
                  <FaDownload className="w-4 h-4 mr-1" />
                  Скачать
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FaFileAlt className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Положение об администрации</h4>
                  <p className="text-sm text-gray-600">Документ, определяющий структуру и полномочия администрации техникума</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">Документ не загружен</span>
            </div>

            <div className="flex items-center justify-between bg-white border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FaFileAlt className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Положение об учебной части</h4>
                  <p className="text-sm text-gray-600">Организация учебного процесса и образовательной деятельности</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">Документ не загружен</span>
            </div>

            <div className="flex items-center justify-between bg-white border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FaFileAlt className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Положение о бухгалтерии</h4>
                  <p className="text-sm text-gray-600">Финансовая и бухгалтерская деятельность техникума</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">Документ не загружен</span>
            </div>
          </div>
        )}
      </div>

      {/* Филиалы (при наличии) */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaMapMarkerAlt className="w-5 h-5 mr-2 text-green-600" />
          Филиалы образовательной организации
        </h3>

        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-gray-600">
            У образовательной организации филиалы отсутствуют.
          </p>
        </div>
      </div>

      {/* Представительства (при наличии) */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaGlobe className="w-5 h-5 mr-2 text-purple-600" />
          Представительства образовательной организации
        </h3>

        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-gray-600">
            У образовательной организации представительства отсутствуют.
          </p>
        </div>
      </div>

    </div>
  );
}
