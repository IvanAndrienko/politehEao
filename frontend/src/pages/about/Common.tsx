import { FaUser, FaFileAlt, FaAward } from 'react-icons/fa';

export default function GeneralInfo() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Основные сведения</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                Полное наименование образовательной организации
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="fullName">
                Областное государственное профессиональное образовательное бюджетное учреждение «Политехнический техникум»
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                Сокращенное наименование образовательной организации
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="shortName">
                ОГПОБУ «Политехнический техникум»
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                Дата создания образовательной организации
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="regDate">
                1973 год
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                Учредитель
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div itemProp="uchredLaw">
                  <div itemProp="nameUchred">Департамент образования ЕАО</div>
                  <div className="mt-2 text-xs text-gray-600">
                    <div itemProp="addressUchred">Юридический адрес: 679016, ЕАО, г. Биробиджан, ул. Калинина, 19</div>
                    <div itemProp="telUchred">Телефон: 8 (42622) 6-49-70</div>
                    <div itemProp="mailUchred">Электронный адрес: comobr@eao.ru</div>
                    <div itemProp="websiteUchred">Электронная почта: comobr@mail.ru</div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                Юридический адрес
              </td>
              <td className="px-6 py-4 text-sm text-gray-900" itemProp="address">
                679006 Еврейская автономная область, г. Биробиджан, ул. Косникова, 1в
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                Фактический адрес
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                679006 Еврейская автономная область, г. Биробиджан, ул. Косникова, 1в
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                Адрес общежития
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                ул. Косникова, 1в
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                Режим и график работы
              </td>
              <td className="px-6 py-4 text-sm text-gray-900" itemProp="workTime">
                понедельник - пятница с 09-00 до 18-00, перерыв с 12-00 до 13-00
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                Контактные телефоны
              </td>
              <td className="px-6 py-4 text-sm text-gray-900" itemProp="telephone">
                <div className="space-y-1">
                  <div>Директор, приемная: 8 (42622) 48-0-08, 48-3-96</div>
                  <div>Зам. директора: 8 (42622) 48-0-46</div>
                  <div>Учебная часть: 8 (42622) 48-0-77</div>
                  <div>Отдел кадров: 8 (42622) 48-0-67</div>
                  <div>Гл. бухгалтер: 8 (42622) 48-3-28</div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                Адреса электронной почты
              </td>
              <td className="px-6 py-4 text-sm text-gray-900" itemProp="email">
                politeh79@post.eao.ru
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                Адрес официального сайта
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <a href="https://politeheao.ru" className="text-blue-600 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                  politeheao.ru
                </a>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                Руководитель
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div className="flex items-center">
                  <FaUser className="w-4 h-4 mr-2 text-gray-400" />
                  Калманов Михаил Борисович
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                Место осуществления образовательной деятельности
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                679006 Еврейская автономная область, г. Биробиджан, ул. Косникова, 1в
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Лицензии и аккредитация */}
      <div className="mt-8 space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Лицензии и аккредитация</h3>

        {/* Государственная аккредитация */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FaAward className="w-5 h-5 mr-2 text-green-600" />
            Свидетельство о государственной аккредитации
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Серия и номер бланка свидетельства</p>
              <p className="font-medium" itemProp="accreditationDocLink">Серия 79А02 №0000086</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Регистрационный номер</p>
              <p className="font-medium">№678</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Дата выдачи свидетельства</p>
              <p className="font-medium">06 марта 2017 г.</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Срок действия</p>
              <p className="font-medium">6 марта 2023 г.</p>
            </div>
          </div>
        </div>

        {/* Лицензия */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FaFileAlt className="w-5 h-5 mr-2 text-blue-600" />
            Лицензия на осуществление образовательной деятельности
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Серия и номер бланка лицензии</p>
              <p className="font-medium" itemProp="licenseDocLink">Серия 79Л01 №0000108</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Срок действия</p>
              <p className="font-medium">бессрочная</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}