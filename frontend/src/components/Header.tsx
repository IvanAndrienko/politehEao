import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTelegram, FaVk, FaSearch, FaEye, FaGlobe, FaChevronDown, FaPhone, FaEnvelope } from "react-icons/fa";

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [settings, setSettings] = useState({
    phone: '+7 (999) 123-45-67',
    email: 'info@college.ru',
    vkLink: '#',
    telegram: '#'
  });

  // Загрузка настроек при монтировании
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Ошибка загрузки настроек:', error);
      }
    };
    loadSettings();
  }, []);

  return (
    <header className="w-full shadow-sm">
      {/* Верхняя синяя полоса */}
      <div className="bg-blue-900 text-white py-3">
        <div className="max-w-screen-2xl mx-auto px-3 flex justify-between items-center">
          {/* Левая часть — соцсети, контакты */}
          <div className="flex items-center space-x-5">
            <a href={settings.telegram} className="hover:scale-110 transition-transform">
              <FaTelegram className="w-6 h-6" />
            </a>
            <a href={settings.vkLink} className="hover:scale-110 transition-transform">
              <FaVk className="w-6 h-6" />
            </a>

            <div className="hidden md:flex items-center space-x-4 border-l border-blue-500 pl-4">
              <div className="flex items-center space-x-1 text-sm opacity-90">
                <FaPhone className="w-5 h-5" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm opacity-90">
                <FaEnvelope className="w-5 h-5" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>

          {/* Правая часть — поиск, кнопки */}
          <div className="flex items-center space-x-4">
            {/* Поле поиска */}
            <div className="flex items-center bg-blue-800 rounded-lg px-2 py-1 focus-within:ring-2 ring-blue-300 transition">
              <FaSearch className="w-5 h-5 text-white opacity-70 mr-2" />
              <input
                type="text"
                placeholder="Поиск..."
                className="bg-transparent outline-none text-sm placeholder-white placeholder-opacity-70 text-white w-32 md:w-48"
              />
            </div>

            {/* Версия для слабовидящих */}
            <button className="flex items-center space-x-2 hover:bg-blue-800 px-3 py-1.5 rounded text-sm font-medium transition-colors">
              <FaEye className="w-5 h-5" />
              <span>Версия для слабовидящих</span>
            </button>

            {/* Переключатель языка */}
            <div
              className="relative"
              onMouseEnter={() => setShowLangDropdown(true)}
              onMouseLeave={() => setShowLangDropdown(false)}
            >
              <button className="flex items-center space-x-1 hover:text-blue-200 transition-colors">
                <FaGlobe className="w-5 h-5" />
                <span className="font-semibold text-sm">RU</span>
                <FaChevronDown className="w-4 h-4 mt-0.5" />
              </button>

              {showLangDropdown && (
                <div className="absolute top-full right-0 bg-blue-800 shadow-lg rounded-md py-2 mt-1 w-16 z-10">
                  <button className="block w-full text-left px-3 py-1 hover:bg-blue-700 text-sm">RU</button>
                  <button className="block w-full text-left px-3 py-1 hover:bg-blue-700 text-sm">EN</button>
                  <button className="block w-full text-left px-3 py-1 hover:bg-blue-700 text-sm">CN</button>
                </div>
              )}
            </div>
          </div>
        </div> {/* ← закрытие flex-контейнера именно здесь */}
      </div>

      {/* Нижняя белая полоса */}
      <div className="bg-white shadow-md py-2">
        <div className="max-w-screen-2xl mx-auto px-3 py-1 flex justify-between items-center">
          {/* Логотип + название */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Logo" className="w-20 h-20" />
            <div className="text-xl font-bold text-gray-900">
              ОГПОБУ<br/>«Политехнический техникум»
            </div>
          </Link>

          {/* Навигация */}
          <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <div className="relative" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
              <a href="#" className="hover:bg-gray-100 px-4 py-2 rounded-md transition-colors flex items-center">
                О техникуме <FaChevronDown className="ml-1 w-5 h-5" />
              </a>
              {showDropdown && (
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 mt-1 w-80 z-10">
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">Основные сведения</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">Структура и органы управления образовательной организацией</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">Документы</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">Образование</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">Образовательные стандарты</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">Руководство</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">«Педагогический состав»</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">Материально-техническое обеспечение и оснащенность образовательного процесса</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">Доступная среда</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">Стипендии и меры поддержки обучающихся</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">Платные образовательные услуги</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">Финансово-хозяйственная деятельность</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">Вакантные места для приема (перевода) обучающихся</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">Международное сотрудничество</a>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">Организация питания в образовательной организации</a>
                </div>
              )}
            </div>
            <Link to="/news" className="hover:bg-gray-100 px-4 py-2 rounded-md transition-colors">Новости</Link>
            <Link to="/admission" className="hover:bg-gray-100 px-4 py-2 rounded-md transition-colors">Абитуриенту</Link>
            <a href="#" className="hover:bg-gray-100 px-4 py-2 rounded-md transition-colors">Студенту</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
