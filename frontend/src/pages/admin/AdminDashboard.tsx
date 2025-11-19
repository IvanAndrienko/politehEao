export default function AdminDashboard() {
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Админ-панель
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Выйти
            </button>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Карточка настроек сайта */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold text-sm">⚙️</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Настройки Хедера и Футера
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            Контакты и ссылки
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a
                        href="/admin/settings"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Редактировать
                      </a>
                    </div>
                  </div>
                </div>

                {/* Новости */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold text-sm">📰</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Раздел Новости
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            Новости
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a
                        href="/admin/news"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Управлять
                      </a>
                    </div>
                  </div>
                </div>

                {/* Управление файлами */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold text-sm">📁</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Управление загрузками
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            Файлы
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a
                        href="/admin/files"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Управлять
                      </a>
                    </div>
                  </div>
                </div>

                {/* Приемная комиссия */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold text-sm">🎓</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Раздел Абитуриенту
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            Специальности, документы, контакты
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a
                        href="/admin/admission"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Управлять
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold text-sm">📚</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Раздел Студенту
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            Управление расписанием
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a
                        href="/admin/raspisanie"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Управлять
                      </a>
                    </div>
                  </div>
                </div>

                {/* Объявления */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold text-sm">📢</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Раздел Студенту
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            Управление объявлениями
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a
                        href="/admin/anons"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Управлять
                      </a>
                    </div>
                  </div>
                </div>

                {/* Главная страница */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-cyan-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold text-sm">🏠</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Главная страница
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            Настройки слайдера
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a
                        href="/admin/home"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Управлять
                      </a>
                    </div>
                  </div>
                </div>

                {/* Студенческий портал */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-teal-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold text-sm">🎓</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Раздел Студенту
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            Сервисы, документы
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a
                        href="/admin/students"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Управлять
                      </a>
                    </div>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                          <span className="text-white font-bold text-sm">��</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            ������ ��������
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            ����������
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a
                        href="/admin/students/library"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Управлять
                      </a>
                    </div>
                  </div>
                </div>

                {/* Информация о техникуме */}
                <div className="bg-white overflow-hidden shadow rounded-lg col-span-1 md:col-span-2 lg:col-span-3">
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <h2 className="text-xl font-bold flex items-center">
                      <span className="text-2xl mr-3">🏢</span>
                      Информация о техникуме
                    </h2>
                    <p className="text-blue-100 mt-1">Управление сведениями об образовательной организации</p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Основные сведения */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold">📋</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Основные сведения</h3>
                            <p className="text-sm text-gray-600">Информация об организации</p>
                          </div>
                        </div>
                        <a
                          href="/admin/common"
                          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          Редактировать →
                        </a>
                      </div>

                      {/* Структура и органы управления */}
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold">🏢</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Структура и органы управления</h3>
                            <p className="text-sm text-gray-600">Организационная структура</p>
                          </div>
                        </div>
                        <a
                          href="/admin/structure"
                          className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          Редактировать →
                        </a>
                      </div>

                      {/* Документы */}
                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold">📄</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Документы</h3>
                            <p className="text-sm text-gray-600">Устав, лицензии, документы</p>
                          </div>
                        </div>
                        <a
                          href="/admin/documents"
                          className="inline-flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-700"
                        >
                          Редактировать →
                        </a>
                      </div>

                      {/* Образование */}
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold">🎓</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Образование</h3>
                            <p className="text-sm text-gray-600">Образовательные программы</p>
                          </div>
                        </div>
                        <a
                          href="/admin/education"
                          className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700"
                        >
                          Редактировать →
                        </a>
                      </div>

                      {/* Образовательные стандарты и требования */}
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold">📚</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Образовательные стандарты и требования</h3>
                            <p className="text-sm text-gray-600">ФГОС, стандарты, требования</p>
                          </div>
                        </div>
                        <a
                          href="/admin/edu-standarts"
                          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          Редактировать →
                        </a>
                      </div>

                      {/* Руководство */}
                      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold">👔</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Руководство</h3>
                            <p className="text-sm text-gray-600">Директор, заместители, филиалы</p>
                          </div>
                        </div>
                        <a
                          href="/admin/managers"
                          className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          Редактировать →
                        </a>
                      </div>

                      {/* Педагогический состав */}
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold">👨‍🏫</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Педагогический состав</h3>
                            <p className="text-sm text-gray-600">Преподаватели, квалификация, опыт</p>
                          </div>
                        </div>
                        <a
                          href="/admin/employes"
                          className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700"
                        >
                          Редактировать →
                        </a>
                      </div>

                      {/* Материально-техническое обеспечение */}
                      <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold">🏗️</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Материально-техническое обеспечение и оснащенность образовательного процесса</h3>
                            <p className="text-sm text-gray-600">Кабинеты, оборудование, доступная среда</p>
                          </div>
                        </div>
                        <a
                          href="/admin/objects"
                          className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700"
                        >
                          Редактировать →
                        </a>
                      </div>

                      {/* Стипендии и меры поддержки */}
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold">💰</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Стипендии и меры поддержки обучающихся</h3>
                            <p className="text-sm text-gray-600">Стипендии, социальная поддержка, общежития</p>
                          </div>
                        </div>
                        <a
                          href="/admin/grants"
                          className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700"
                        >
                          Редактировать →
                        </a>
                      </div>

                      {/* Платные образовательные услуги */}
                      <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold">💳</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Платные образовательные услуги</h3>
                            <p className="text-sm text-gray-600">Документы о платных услугах, договоры, стоимость</p>
                          </div>
                        </div>
                        <a
                          href="/admin/paid-edu"
                          className="inline-flex items-center text-sm font-medium text-pink-600 hover:text-pink-700"
                        >
                          Редактировать →
                        </a>
                      </div>

                      {/* Финансово-хозяйственная деятельность */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold">💼</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Финансово-хозяйственная деятельность</h3>
                            <p className="text-sm text-gray-600">Объем деятельности, поступление/расходование средств, планы ФХД</p>
                          </div>
                        </div>
                        <a
                          href="/admin/budget"
                          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-700"
                        >
                          Редактировать →
                        </a>
                      </div>

                      {/* Вакантные места */}
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold">💺</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Вакантные места для приема (перевода) обучающихся</h3>
                            <p className="text-sm text-gray-600">Количество свободных мест по программам</p>
                          </div>
                        </div>
                        <a
                          href="/admin/vacant-places"
                          className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-700"
                        >
                          Редактировать →
                        </a>
                      </div>

                      {/* Международное сотрудничество */}
                      <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold">🌍</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Международное сотрудничество</h3>
                            <p className="text-sm text-gray-600">Договоры с иностранными организациями</p>
                          </div>
                        </div>
                        <a
                          href="/admin/international"
                          className="inline-flex items-center text-sm font-medium text-cyan-600 hover:text-cyan-700"
                        >
                          Редактировать →
                        </a>
                      </div>

                      {/* Организация питания */}
                      <div className="bg-gradient-to-br from-lime-50 to-lime-100 rounded-lg p-4 border border-lime-200">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-lime-500 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold">🍽️</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Организация питания в образовательной организации</h3>
                            <p className="text-sm text-gray-600">Объекты питания и охраны здоровья</p>
                          </div>
                        </div>
                        <a
                          href="/admin/catering"
                          className="inline-flex items-center text-sm font-medium text-lime-600 hover:text-lime-700"
                        >
                          Редактировать →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
