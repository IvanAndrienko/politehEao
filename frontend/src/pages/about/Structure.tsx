import { FaBuilding, FaUser, FaMapMarkerAlt, FaEnvelope, FaGlobe, FaFileAlt } from 'react-icons/fa';

export default function Structure() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Структура и органы управления образовательной организацией</h2>

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Должность руководителя
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
              <tr itemProp="structOrgUprav">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="name">
                  Администрация техникума
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fio">
                  Калманов Михаил Борисович
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="post">
                  Директор
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="addressStr">
                  679006, Еврейская автономная область, г. Биробиджан, ул. Косникова, 1в
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="site">
                  <a href="https://politeheao.ru" className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                    politeheao.ru
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                  politeh79@post.eao.ru
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <a href="#" className="text-blue-600 hover:text-blue-700 flex items-center" itemProp="divisionClauseDocLink">
                    <FaFileAlt className="w-4 h-4 mr-1" />
                    Положение об администрации
                  </a>
                </td>
              </tr>

              <tr itemProp="structOrgUprav">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="name">
                  Учебная часть
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fio">
                  Иванова Мария Сергеевна
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="post">
                  Заместитель директора по учебной работе
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="addressStr">
                  679006, Еврейская автономная область, г. Биробиджан, ул. Косникова, 1в
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="site">
                  -
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                  politeh79@post.eao.ru
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <a href="#" className="text-blue-600 hover:text-blue-700 flex items-center" itemProp="divisionClauseDocLink">
                    <FaFileAlt className="w-4 h-4 mr-1" />
                    Положение об учебной части
                  </a>
                </td>
              </tr>

              <tr itemProp="structOrgUprav">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="name">
                  Отдел кадров
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fio">
                  Петрова Анна Владимировна
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="post">
                  Начальник отдела кадров
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="addressStr">
                  679006, Еврейская автономная область, г. Биробиджан, ул. Косникова, 1в
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="site">
                  -
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                  politeh79@post.eao.ru
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <a href="#" className="text-blue-600 hover:text-blue-700 flex items-center" itemProp="divisionClauseDocLink">
                    <FaFileAlt className="w-4 h-4 mr-1" />
                    Положение об отделе кадров
                  </a>
                </td>
              </tr>

              <tr itemProp="structOrgUprav">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="name">
                  Бухгалтерия
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fio">
                  Сидорова Елена Михайловна
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="post">
                  Главный бухгалтер
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="addressStr">
                  679006, Еврейская автономная область, г. Биробиджан, ул. Косникова, 1в
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="site">
                  -
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                  politeh79@post.eao.ru
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <a href="#" className="text-blue-600 hover:text-blue-700 flex items-center" itemProp="divisionClauseDocLink">
                    <FaFileAlt className="w-4 h-4 mr-1" />
                    Положение о бухгалтерии
                  </a>
                </td>
              </tr>

              <tr itemProp="structOrgUprav">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="name">
                  Библиотека
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fio">
                  Козлова Ольга Ивановна
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="post">
                  Заведующая библиотекой
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="addressStr">
                  679006, Еврейская автономная область, г. Биробиджан, ул. Косникова, 1в
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="site">
                  -
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                  politeh79@post.eao.ru
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <a href="#" className="text-blue-600 hover:text-blue-700 flex items-center" itemProp="divisionClauseDocLink">
                    <FaFileAlt className="w-4 h-4 mr-1" />
                    Положение о библиотеке
                  </a>
                </td>
              </tr>

              <tr itemProp="structOrgUprav">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="name">
                  Студенческий отдел
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fio">
                  Николаев Дмитрий Александрович
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="post">
                  Заместитель директора по воспитательной работе
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="addressStr">
                  679006, Еврейская автономная область, г. Биробиджан, ул. Косникова, 1в
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="site">
                  -
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                  politeh79@post.eao.ru
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <a href="#" className="text-blue-600 hover:text-blue-700 flex items-center" itemProp="divisionClauseDocLink">
                    <FaFileAlt className="w-4 h-4 mr-1" />
                    Положение о студенческом отделе
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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

      {/* Версия для слабовидящих */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <FaUser className="w-5 h-5 mr-2 text-blue-600" />
          <span className="text-sm text-blue-800" itemProp="copy">
            Версия сайта для слабовидящих доступна по <a href="#" className="underline hover:text-blue-600">ссылке</a>
          </span>
        </div>
      </div>
    </div>
  );
}