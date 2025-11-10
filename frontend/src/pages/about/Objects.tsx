import { useState, useEffect } from 'react';
import { FaBuilding, FaFlask, FaBook, FaHome, FaWifi, FaLaptop, FaUniversalAccess } from 'react-icons/fa';
import { apiUrl } from '../../lib/api.ts';

interface Cabinet {
  id: string;
  address: string;
  name: string;
  equipment: string;
  accessibility: string;
}

interface PracticeObject {
  id: string;
  address: string;
  name: string;
  equipment: string;
  accessibility: string;
}

interface Library {
  id: string;
  name: string;
  address: string;
  area: number;
  seats: number;
  accessibility: string;
}

interface SportObject {
  id: string;
  name: string;
  address: string;
  area: number;
  seats: number;
  accessibility: string;
}

interface ObjectsDocument {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  category: string;
  order: number;
  isActive: boolean;
}

export default function Objects() {
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [practiceObjects, setPracticeObjects] = useState<PracticeObject[]>([]);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [sportObjects, setSportObjects] = useState<SportObject[]>([]);
  const [documents, setDocuments] = useState<ObjectsDocument[]>([]);
  const [textBlocksContent, setTextBlocksContent] = useState<{ [key: string]: string }>({});
  const [hostelInfo, setHostelInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadObjectsData();
  }, []);

  const loadObjectsData = async () => {
    try {
      // Загружаем данные из API
      const [cabinetsRes, practiceRes, librariesRes, sportRes, textRes, hostelRes, docsRes] = await Promise.all([
        fetch(apiUrl('/api/objects/cabinets')),
        fetch(apiUrl('/api/objects/practice-objects')),
        fetch(apiUrl('/api/objects/libraries')),
        fetch(apiUrl('/api/objects/sport-objects')),
        fetch(apiUrl('/api/objects/text-blocks')),
        fetch(apiUrl('/api/objects/hostel-info')),
        fetch(apiUrl('/api/objects/documents'))
      ]);

      const cabinetsData = await cabinetsRes.json();
      const practiceData = await practiceRes.json();
      const librariesData = await librariesRes.json();
      const sportData = await sportRes.json();
      const textData = await textRes.json();
      const hostelData = await hostelRes.json();
      const documentsData = await docsRes.json();

      setCabinets(cabinetsData);
      setPracticeObjects(practiceData);
      setLibraries(librariesData);
      setSportObjects(sportData);
      setDocuments(documentsData);

      // Создаем объект с текстовыми блоками для быстрого доступа
      const textBlocksMap: { [key: string]: string } = {};
      textData.forEach((block: any) => {
        textBlocksMap[block.blockType] = block.content;
      });

      // Устанавливаем содержимое текстовых блоков
      setTextBlocksContent(textBlocksMap);
      setHostelInfo(hostelData);
    } catch (error) {
      console.error('Error loading objects data:', error);
      // В случае ошибки используем заглушки
      setCabinets([
        {
          id: '1',
          address: 'ул. Косникова, 1в',
          name: 'Кабинет информатики №1',
          equipment: 'Компьютеры, проектор, интерактивная доска',
          accessibility: 'Доступен для инвалидов'
        }
      ]);

      setPracticeObjects([
        {
          id: '1',
          address: 'ул. Косникова, 1в',
          name: 'Мастерская по ремонту автомобилей',
          equipment: 'Станки, инструменты, диагностическое оборудование',
          accessibility: 'Доступен для инвалидов'
        }
      ]);

      setLibraries([
        {
          id: '1',
          name: 'Библиотека техникума',
          address: 'ул. Косникова, 1в',
          area: 120,
          seats: 50,
          accessibility: 'Доступна для инвалидов'
        }
      ]);

      setSportObjects([
        {
          id: '1',
          name: 'Спортивный зал',
          address: 'ул. Косникова, 1в',
          area: 200,
          seats: 100,
          accessibility: 'Доступен для инвалидов'
        }
      ]);

      setTextBlocksContent({
        accessibility: '<p>Здание образовательной организации оснащено пандусами, специальными поручнями, тактильными указателями и другими средствами для обеспечения доступа инвалидов и лиц с ограниченными возможностями здоровья.</p><p>В здании установлены лифты для маломобильных групп населения, адаптированные санитарные комнаты и специальные места для парковки транспортных средств.</p>',
        facilities: '<p>Образовательная организация оснащена современными средствами обучения и воспитания:</p><ul><li>Компьютерная техника и программное обеспечение</li><li>Интерактивные доски и проекторы</li><li>Лабораторное оборудование</li><li>Учебная литература и методические пособия</li><li>Спортивный инвентарь</li></ul>',
        adaptedFacilities: '<p>Для обучающихся с инвалидностью и ограниченными возможностями здоровья предусмотрены:</p><ul><li>Специализированное программное обеспечение для слабовидящих</li><li>Увеличительные устройства и лупы</li><li>Адаптированная мебель</li><li>Специальные учебные пособия с увеличенным шрифтом</li></ul>',
        comNet: '<p>Образовательная организация обеспечивает доступ к следующим ресурсам:</p><ul><li>Интернет с высокой скоростью соединения</li><li>Локальная сеть организации</li><li>Доступ к федеральным образовательным порталам</li><li>Электронные библиотечные системы</li></ul>',
        comNetOvz: '<p>Для обучающихся с инвалидностью предусмотрены:</p><ul><li>Программное обеспечение для чтения с экрана</li><li>Адаптированные интерфейсы сайтов</li><li>Специализированные браузеры</li><li>Программы для увеличения текста</li></ul>',
        eios: '<p>В образовательной организации функционирует электронная информационно-образовательная среда, обеспечивающая доступ к электронным образовательным ресурсам и сервисам.</p><p>Среда включает в себя систему управления обучением, электронную библиотеку, тестовые системы и средства коммуникации между участниками образовательного процесса.</p>',
        erList: '<p>Обучающимся предоставляется доступ к следующим электронным ресурсам:</p><ul><li><a href="https://minobrnauki.gov.ru/" target="_blank" rel="noopener noreferrer">Министерство науки и высшего образования Российской Федерации</a></li><li><a href="https://edu.gov.ru/" target="_blank" rel="noopener noreferrer">Министерство просвещения Российской Федерации</a></li><li><a href="https://obrnadzor.gov.ru/" target="_blank" rel="noopener noreferrer">Федеральная служба по надзору в сфере образования и науки</a></li><li><a href="https://www.edu.ru/" target="_blank" rel="noopener noreferrer">Федеральный портал «Российское образование»</a></li><li>Информационный ресурс библиотеки образовательной организации</li></ul>',
        erListOvz: '<p>Для обучающихся с инвалидностью доступны следующие приспособленные ресурсы:</p><ul><li>Электронные учебники с возможностью увеличения шрифта</li><li>Аудио-версии учебных материалов</li><li>Видео-лекции с субтитрами</li><li>Интерактивные тренажеры с адаптированным интерфейсом</li></ul>',
        techOvz: '<p>Для обеспечения доступности образования обучающимся с инвалидностью и ограниченными возможностями здоровья образовательная организация оснащена специальными техническими средствами обучения:</p><ul><li>Устройства для чтения с экрана (скрин-ридеры)</li><li>Программы распознавания речи</li><li>Альтернативные устройства ввода информации</li><li>Специализированные компьютерные классы</li></ul>',
        hostelInterOvz: '<p>Общежитие образовательной организации полностью адаптировано для проживания обучающихся с инвалидностью и ограниченными возможностями здоровья.</p><p>Здание оснащено пандусами, лифтами, специальными поручнями, расширенными дверными проемами и адаптированными санитарными комнатами.</p>'
      });

      setHostelInfo({
        hostels: 1,
        places: 120,
        adapted: 5,
        internats: 0,
        interPlaces: 0,
        interAdapted: 0
      });
    } finally {
      setLoading(false);
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Материально-техническое обеспечение и оснащённость образовательного процесса. Доступная среда</h2>

      {/* Оборудованные учебные кабинеты */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaBuilding className="w-5 h-5 mr-2 text-blue-600" />
          Оборудованные учебные кабинеты
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Адрес места нахождения
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Наименование оборудованного учебного кабинета
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Оснащенность оборудованного учебного кабинета
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Приспособленность для использования инвалидами и лицами с ограниченными возможностями здоровья
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cabinets.map((cabinet) => (
                <tr key={cabinet.id} itemProp="purposeCab">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="addressCab">
                    {cabinet.address}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="nameCab">
                    {cabinet.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="osnCab">
                    {cabinet.equipment}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="ovzCab">
                    {cabinet.accessibility}
                  </td>
                </tr>
              ))}
              {cabinets.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Нет данных об оборудованных учебных кабинетах
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Объекты для проведения практических занятий */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaFlask className="w-5 h-5 mr-2 text-green-600" />
          Объекты для проведения практических занятий
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Адрес места нахождения
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Наименование объекта для проведения практических занятий
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Оснащенность объекта для проведения практических занятий
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Приспособленность для использования инвалидами и лицами с ограниченными возможностями здоровья
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {practiceObjects.map((obj) => (
                <tr key={obj.id} itemProp="purposePrac">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="addressPrac">
                    {obj.address}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="namePrac">
                    {obj.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="osnPrac">
                    {obj.equipment}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="ovzPrac">
                    {obj.accessibility}
                  </td>
                </tr>
              ))}
              {practiceObjects.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Нет данных об объектах для проведения практических занятий
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Библиотеки и объекты спорта */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaBook className="w-5 h-5 mr-2 text-purple-600" />
          Библиотеки и объекты спорта
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Наименование объекта
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Адрес места нахождения объекта
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Площадь, м²
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Количество мест
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Приспособленность для использования инвалидами и лицами с ограниченными возможностями здоровья
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Библиотеки */}
              {libraries.map((lib) => (
                <tr key={lib.id} itemProp="purposeLibr">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="objName">
                    {lib.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="objAddress">
                    {lib.address}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="objSq">
                    {lib.area}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="objCnt">
                    {lib.seats}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="objOvz">
                    {lib.accessibility}
                  </td>
                </tr>
              ))}

              {/* Объекты спорта */}
              {sportObjects.map((sport) => (
                <tr key={sport.id} itemProp="purposeSport">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="objName">
                    {sport.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="objAddress">
                    {sport.address}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="objSq">
                    {sport.area}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="objCnt">
                    {sport.seats}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="objOvz">
                    {sport.accessibility}
                  </td>
                </tr>
              ))}

              {(libraries.length === 0 && sportObjects.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Нет данных о библиотеках и объектах спорта
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Обеспечение беспрепятственного доступа */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <FaUniversalAccess className="w-5 h-5 mr-2" />
          Обеспечение беспрепятственного доступа в здания образовательной организации
        </h3>
        <div className="text-blue-800" itemProp="ovz" dangerouslySetInnerHTML={{ __html: textBlocksContent.accessibility || '<p>Здание образовательной организации оснащено пандусами, специальными поручнями, тактильными указателями и другими средствами для обеспечения доступа инвалидов и лиц с ограниченными возможностями здоровья.</p><p>В здании установлены лифты для маломобильных групп населения, адаптированные санитарные комнаты и специальные места для парковки транспортных средств.</p>' }} />
      </div>

      {/* Средства обучения и воспитания */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaLaptop className="w-5 h-5 mr-2 text-indigo-600" />
          Средства обучения и воспитания
        </h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6" itemProp="purposeFacil" dangerouslySetInnerHTML={{ __html: textBlocksContent.facilities || '<p>Образовательная организация оснащена современными средствами обучения и воспитания:</p><ul><li>Компьютерная техника и программное обеспечение</li><li>Интерактивные доски и проекторы</li><li>Лабораторное оборудование</li><li>Учебная литература и методические пособия</li><li>Спортивный инвентарь</li></ul>' }} />
      </div>

      {/* Приспособленные средства обучения */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaUniversalAccess className="w-5 h-5 mr-2 text-teal-600" />
          Приспособленные средства обучения и воспитания
        </h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6" itemProp="purposeFacilOvz" dangerouslySetInnerHTML={{ __html: textBlocksContent.adaptedFacilities || '<p>Для обучающихся с инвалидностью и ограниченными возможностями здоровья предусмотрены:</p><ul><li>Специализированное программное обеспечение для слабовидящих</li><li>Увеличительные устройства и лупы</li><li>Адаптированная мебель</li><li>Специальные учебные пособия с увеличенным шрифтом</li></ul>' }} />
      </div>

      {/* Доступ к информационным системам */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaWifi className="w-5 h-5 mr-2 text-cyan-600" />
          Доступ к информационным системам и информационно-телекоммуникационным сетям
        </h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6" itemProp="comNet" dangerouslySetInnerHTML={{ __html: textBlocksContent.comNet || '<p>Образовательная организация обеспечивает доступ к следующим ресурсам:</p><ul><li>Интернет с высокой скоростью соединения</li><li>Локальная сеть организации</li><li>Доступ к федеральным образовательным порталам</li><li>Электронные библиотечные системы</li></ul>' }} />
      </div>

      {/* Приспособленные информационные системы */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaUniversalAccess className="w-5 h-5 mr-2 text-orange-600" />
          Доступ к приспособленным информационным системам и информационно-телекоммуникационным сетям
        </h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6" itemProp="comNetOvz" dangerouslySetInnerHTML={{ __html: textBlocksContent.comNetOvz || '<p>Для обучающихся с инвалидностью предусмотрены:</p><ul><li>Программное обеспечение для чтения с экрана</li><li>Адаптированные интерфейсы сайтов</li><li>Специализированные браузеры</li><li>Программы для увеличения текста</li></ul>' }} />
      </div>

      {/* Электронная информационно-образовательная среда */}
      <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
          <FaLaptop className="w-5 h-5 mr-2" />
          Электронная информационно-образовательная среда
        </h3>
        <div className="text-green-800" itemProp="purposeEios" dangerouslySetInnerHTML={{ __html: textBlocksContent.eios || '<p>В образовательной организации функционирует электронная информационно-образовательная среда, обеспечивающая доступ к электронным образовательным ресурсам и сервисам.</p><p>Среда включает в себя систему управления обучением, электронную библиотеку, тестовые системы и средства коммуникации между участниками образовательного процесса.</p>' }} />
      </div>

      {/* Электронные образовательные ресурсы */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaBook className="w-5 h-5 mr-2 text-pink-600" />
          Электронные образовательные ресурсы
        </h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6" dangerouslySetInnerHTML={{ __html: textBlocksContent.erList || '<p>Обучающимся предоставляется доступ к следующим электронным ресурсам:</p><ul><li><a href="https://minobrnauki.gov.ru/" target="_blank" rel="noopener noreferrer">Министерство науки и высшего образования Российской Федерации</a></li><li><a href="https://edu.gov.ru/" target="_blank" rel="noopener noreferrer">Министерство просвещения Российской Федерации</a></li><li><a href="https://obrnadzor.gov.ru/" target="_blank" rel="noopener noreferrer">Федеральная служба по надзору в сфере образования и науки</a></li><li><a href="https://www.edu.ru/" target="_blank" rel="noopener noreferrer">Федеральный портал «Российское образование»</a></li><li>Информационный ресурс библиотеки образовательной организации</li></ul>' }} />
      </div>

      {/* Приспособленные электронные ресурсы */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaUniversalAccess className="w-5 h-5 mr-2 text-red-600" />
          Приспособленные электронные образовательные ресурсы
        </h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6" dangerouslySetInnerHTML={{ __html: textBlocksContent.erListOvz || '<p>Для обучающихся с инвалидностью доступны следующие приспособленные ресурсы:</p><ul><li>Электронные учебники с возможностью увеличения шрифта</li><li>Аудио-версии учебных материалов</li><li>Видео-лекции с субтитрами</li><li>Интерактивные тренажеры с адаптированным интерфейсом</li></ul>' }} />
      </div>

      {/* Специальные технические средства */}
      <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
          <FaUniversalAccess className="w-5 h-5 mr-2" />
          Специальные технические средства обучения коллективного и индивидуального пользования
        </h3>
        <div className="text-yellow-800" itemProp="techOvz" dangerouslySetInnerHTML={{ __html: textBlocksContent.techOvz || '<p>Для обеспечения доступности образования обучающимся с инвалидностью и ограниченными возможностями здоровья образовательная организация оснащена специальными техническими средствами обучения:</p><ul><li>Устройства для чтения с экрана (скрин-ридеры)</li><li>Программы распознавания речи</li><li>Альтернативные устройства ввода информации</li><li>Специализированные компьютерные классы</li></ul>' }} />
      </div>

      {/* Общежития */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaHome className="w-5 h-5 mr-2 text-brown-600" />
          Общежития и интернаты
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Наименование показателя
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Общежития
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Интернаты
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Количество общежитий/интернатов
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="hostelInfo">{hostelInfo?.hostels || 1}</td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="interInfo">{hostelInfo?.internats || 0}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Количество мест
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="hostelNum">{hostelInfo?.places || 120}</td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="interNum">{hostelInfo?.interPlaces || 0}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Количество жилых помещений, приспособленных для использования инвалидами и лицами с ограниченными возможностями здоровья
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="hostelNumOvz">{hostelInfo?.adapted || 5}</td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="interNumOvz">{hostelInfo?.interAdapted || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Условия доступа в общежитие */}
      <div className="mb-8 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
          <FaUniversalAccess className="w-5 h-5 mr-2" />
          Условия для беспрепятственного доступа в общежитие, интернат
        </h3>
        <div className="text-indigo-800" itemProp="hostelInterOvz" dangerouslySetInnerHTML={{ __html: textBlocksContent.hostelInterOvz || '<p>Общежитие образовательной организации полностью адаптировано для проживания обучающихся с инвалидностью и ограниченными возможностями здоровья.</p><p>Здание оснащено пандусами, лифтами, специальными поручнями, расширенными дверными проемами и адаптированными санитарными комнатами.</p>' }} />
      </div>

      {/* Плата за проживание */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaHome className="w-5 h-5 mr-2 text-emerald-600" />
          Плата за проживание в общежитии
        </h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            Информация о формировании платы за проживание в общежитии:
          </p>
            <a
              href={apiUrl('/api/objects/hostel-payment-document/download')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            itemProp="localActObSt"
          >
            Скачать документ о плате за проживание в общежитии
          </a>
        </div>
      </div>

      {/* Документы */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaBook className="w-5 h-5 mr-2 text-gray-600" />
          Документы
        </h3>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{doc.title}</h4>
                <p className="text-sm text-gray-600">{doc.description}</p>
                <p className="text-xs text-gray-500">{doc.fileName} ({(doc.fileSize / 1024).toFixed(1)} KB)</p>
                {doc.category && (
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {doc.category}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                  <a
                    href={apiUrl(`/api/objects/documents/${doc.id}/download`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-900 font-medium"
                >
                  Скачать
                </a>
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <div className="text-center py-8">
              <FaBook className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Документы не загружены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
