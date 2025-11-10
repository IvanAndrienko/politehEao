import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaTelegram, FaVk } from 'react-icons/fa';
import { apiUrl } from '../lib/api.ts';

/**
 * Компонент футера сайта
 * Содержит информацию о техникуме, контакты и ссылки
 */
export default function Footer() {
  const [settings, setSettings] = useState({
    phone: '+7 (42622) 4-XX-XX',
    email: 'info@politech-birobidzhan.ru',
    address: '679000, Еврейская автономная область, г. Биробиджан, ул. Образцовая, д. XX',
    vkLink: '#',
    telegram: '#'
  });

  // Загрузка настроек при монтировании
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(apiUrl('/api/settings'));
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
    <footer className="bg-gray-900 text-white">
      <div className="max-w-screen-2xl mx-auto px-2 py-12">
        {/* Основная сетка футера */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          {/* Логотип и описание */}
          <div className="space-y-4 w-full md:w-[45%]">
            {/* Логотип с инициалами */}
            <div className="flex items-center space-x-3">
              <img src="/logo-gray.png" alt="Logo" className="w-22 h-22" />
              <div>
                <h3 className="font-bold text-lg">ОГПОБУ</h3>
                <p className="text-sm text-gray-300">«Политехнический техникум»</p>
              </div>
            </div>

            {/* Краткое описание */}
            <p className="text-gray-300 text-sm leading-relaxed">
              Современное профессиональное образование для успешного будущего наших студентов.
              Подготовка квалифицированных специалистов в различных технических направлениях.
            </p>
          </div>

          {/* Контактная информация */}
          <div className="space-y-4 flex-1">
            <h4 className="font-semibold text-lg">Контактная информация</h4>
            <div className="space-y-3">
              {/* Адрес */}
              <a
                href={`https://yandex.ru/maps/?text=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-3 hover:text-blue-300 transition-colors"
              >
                <FaMapMarkerAlt className="text-blue-400 mt-1 flex-shrink-0" size={18} />
                <div className="text-sm">
                  <p>{settings.address.split(',')[0]}</p>
                  <p>{settings.address.split(',').slice(1).join(',').trim()}</p>
                </div>
              </a>

              {/* Телефон */}
              <a href={`tel:${settings.phone}`} className="flex items-center space-x-3 hover:text-blue-300 transition-colors">
                <FaPhone className="text-blue-400 flex-shrink-0" size={18} />
                <p className="text-sm">{settings.phone}</p>
              </a>

              {/* Email */}
              <a href={`mailto:${settings.email}`} className="flex items-center space-x-3 hover:text-blue-300 transition-colors">
                <FaEnvelope className="text-blue-400 flex-shrink-0" size={18} />
                <p className="text-sm">{settings.email}</p>
              </a>
            </div>
          </div>

          {/* Социальные сети и быстрые ссылки */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Мы в социальных сетях</h4>

            {/* Социальные иконки */}
            <div className="flex space-x-4">
              <a
                href={settings.telegram}
                className="text-gray-300 hover:text-blue-400 transition-colors p-2 hover:bg-gray-800 rounded"
                aria-label="Telegram"
              >
                <FaTelegram className="w-6 h-6" />
              </a>
              <a
                href={settings.vkLink}
                className="text-gray-300 hover:text-blue-400 transition-colors p-2 hover:bg-gray-800 rounded"
                aria-label="VKontakte"
              >
                <FaVk className="w-6 h-6" />
              </a>
            </div>

            {/* Быстрые ссылки */}
            <div className="pt-4 w-full md:w-72">
              <h5 className="font-medium mb-3">Быстрые ссылки</h5>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200">
                  Расписание занятий
                </a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200">
                  Электронный дневник
                </a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200">
                  Библиотека
                </a>
                <a href="#" className="block text-gray-300 hover:text-white transition-colors hover:translate-x-1 transform duration-200">
                  Документооборот
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть с копирайтом */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2024 ОГПОБУ «Политехнический техникум». Все права защищены.</p>
          <p className="mt-1">
            Сайт соответствует требованиям законодательства РФ об образовательных организациях
          </p>
        </div>
      </div>
    </footer>
  );
}
