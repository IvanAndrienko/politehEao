import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTelegram, FaVk, FaSearch, FaEye, FaChevronDown, FaPhone, FaEnvelope, FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(() => {
    return localStorage.getItem('accessibilityMode') === 'true';
  });
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
        // Пробуем загрузить из объединенного API
        const response = await fetch('/api/page-data?page=header');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data.settings) {
            setSettings(result.data.settings);
            return;
          }
        }

        // Fallback на старый способ
        const fallbackResponse = await fetch('/api/settings');
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Ошибка загрузки настроек:', error);
      }
    };
    loadSettings();
  }, []);

  // Применение режима слабовидящих к документу
  useEffect(() => {
    if (isAccessibilityMode) {
      document.documentElement.classList.add('accessibility-mode');
    } else {
      document.documentElement.classList.remove('accessibility-mode');
    }
    localStorage.setItem('accessibilityMode', isAccessibilityMode.toString());
  }, [isAccessibilityMode]);

  const toggleAccessibilityMode = () => {
    setIsAccessibilityMode(!isAccessibilityMode);
  };

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
              <a href={`tel:${settings.phone}`} className="flex items-center space-x-1 text-sm opacity-90 hover:opacity-100 transition-opacity">
                <FaPhone className="w-5 h-5" />
                <span>{settings.phone}</span>
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center space-x-1 text-sm opacity-90 hover:opacity-100 transition-opacity">
                <FaEnvelope className="w-5 h-5" />
                <span>{settings.email}</span>
              </a>
            </div>
          </div>

          {/* Правая часть — поиск, кнопки */}
          <div className="flex items-center space-x-4">
            {/* Поле поиска */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const query = formData.get('search') as string;
                if (query.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
                }
              }}
              className="flex items-center bg-blue-800 rounded-lg px-2 py-1 focus-within:ring-2 ring-blue-300 transition"
            >
              <FaSearch className="w-5 h-5 text-white opacity-70 mr-2" />
              <input
                type="text"
                name="search"
                placeholder="Поиск..."
                className="bg-transparent outline-none text-sm placeholder-white placeholder-opacity-70 text-white w-32 md:w-48"
              />
            </form>

            {/* Версия для слабовидящих */}
            <button
              onClick={toggleAccessibilityMode}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                isAccessibilityMode
                  ? 'bg-blue-700 ring-2 ring-blue-300'
                  : 'hover:bg-blue-800'
              }`}
            >
              <FaEye className="w-5 h-5" />
              <span className="hidden sm:inline">Версия для слабовидящих</span>
            </button>

          </div>
        </div> {/* ← закрытие flex-контейнера именно здесь */}
      </div>

      {/* Нижняя белая полоса */}
      <div className="bg-white shadow-md py-2">
        <div className="max-w-screen-2xl mx-auto px-3 py-1 flex justify-between items-center">
          {/* Логотип + название */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 md:w-20 md:h-20" />
            <div className="text-lg md:text-xl font-bold text-gray-900">
              ОГПОБУ<br/>«Политехнический техникум»
            </div>
          </Link>

          {/* Навигация для десктопа */}
          <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <div className="relative group">
              <Link to="/sveden" className="hover:bg-gray-100 px-4 py-2 rounded-md transition-colors flex items-center">
                О техникуме <FaChevronDown className="ml-1 w-5 h-5" />
              </Link>
              <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 mt-1 w-80 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link to="/sveden/common" className="block px-4 py-2 hover:bg-gray-100">Основные сведения</Link>
                <Link to="/sveden/struct" className="block px-4 py-2 hover:bg-gray-100">Структура и органы управления образовательной организацией</Link>
                <Link to="/sveden/document" className="block px-4 py-2 hover:bg-gray-100">Документы</Link>
                <Link to="/sveden/education" className="block px-4 py-2 hover:bg-gray-100">Образование</Link>
                <Link to="/sveden/eduStandarts" className="block px-4 py-2 hover:bg-gray-100">Образовательные стандарты и требования</Link>
                <Link to="/sveden/managers" className="block px-4 py-2 hover:bg-gray-100">Руководство</Link>
                <Link to="/sveden/employees" className="block px-4 py-2 hover:bg-gray-100">Педагогический состав</Link>
                <Link to="/sveden/objects" className="block px-4 py-2 hover:bg-gray-100">Материально-техническое обеспечение и оснащённость образовательного процесса. Доступная среда</Link>
                <Link to="/sveden/grants" className="block px-4 py-2 hover:bg-gray-100">Стипендии и меры поддержки обучающихся</Link>
                <Link to="/sveden/paid_edu" className="block px-4 py-2 hover:bg-gray-100">Платные образовательные услуги</Link>
                <Link to="/sveden/budget" className="block px-4 py-2 hover:bg-gray-100">Финансово-хозяйственная деятельность</Link>
                <Link to="/sveden/vacant" className="block px-4 py-2 hover:bg-gray-100">Вакантные места для приема (перевода) обучающихся</Link>
                <Link to="/sveden/inter" className="block px-4 py-2 hover:bg-gray-100">Международное сотрудничество</Link>
                <Link to="/sveden/catering" className="block px-4 py-2 hover:bg-gray-100">Организация питания в образовательной организации</Link>
              </div>
            </div>
            <Link to="/news" className="hover:bg-gray-100 px-4 py-2 rounded-md transition-colors">Новости</Link>
            <Link to="/admission" className="hover:bg-gray-100 px-4 py-2 rounded-md transition-colors">Абитуриенту</Link>
            <Link to="/students" className="hover:bg-gray-100 px-4 py-2 rounded-md transition-colors">Студенту</Link>
          </nav>

          {/* Мобильное меню */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Кнопка мобильного меню */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-blue-200 transition-colors p-2 bg-blue-800 rounded-md"
            >
              {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              {/* Контакты в мобильном меню */}
              <div className="flex flex-col space-y-2 pb-4 border-b border-gray-200">
                <a href={`tel:${settings.phone}`} className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600">
                  <FaPhone className="w-4 h-4" />
                  <span>{settings.phone}</span>
                </a>
                <a href={`mailto:${settings.email}`} className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600">
                  <FaEnvelope className="w-4 h-4" />
                  <span>{settings.email}</span>
                </a>
              </div>

              {/* Навигация в мобильном меню */}
              <nav className="space-y-2">
                <div className="space-y-1">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center justify-between w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <span>О техникуме</span>
                    <FaChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showDropdown && (
                    <div className="ml-4 space-y-1">
                      <Link to="/sveden/common" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Основные сведения</Link>
                      <Link to="/sveden/struct" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Структура и органы управления</Link>
                      <Link to="/sveden/document" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Документы</Link>
                      <Link to="/sveden/education" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Образование</Link>
                      <Link to="/sveden/eduStandarts" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Образовательные стандарты</Link>
                      <Link to="/sveden/managers" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Руководство</Link>
                      <Link to="/sveden/employees" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Педагогический состав</Link>
                      <Link to="/sveden/objects" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Материально-техническое обеспечение</Link>
                      <Link to="/sveden/grants" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Стипендии и меры поддержки</Link>
                      <Link to="/sveden/paid_edu" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Платные образовательные услуги</Link>
                      <Link to="/sveden/budget" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Финансово-хозяйственная деятельность</Link>
                      <Link to="/sveden/vacant" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Вакантные места</Link>
                      <Link to="/sveden/inter" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Международное сотрудничество</Link>
                      <Link to="/sveden/catering" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>Организация питания</Link>
                    </div>
                  )}
                </div>
                <Link to="/news" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Новости</Link>
                <Link to="/admission" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Абитуриенту</Link>
                <Link to="/students" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Студенту</Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
