import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';

interface StudyGroup {
  id: string;
  code: string;
  name: string;
  fullName: string;
  specialty?: string;
}

export default function Raspisanie() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<StudyGroup[]>([]);

  useEffect(() => {
    // Скролл к верху страницы при загрузке
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await fetch('/api/schedule/groups');
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const handleGroupClick = async (groupCode: string) => {
    // Проверяем, существует ли группа в базе данных
    try {
      const response = await fetch(`/api/schedule/groups/${groupCode}`);
      if (response.ok) {
        navigate(`/students/raspisanie/${groupCode}`);
      } else {
        console.error('Group not found');
      }
    } catch (error) {
      console.error('Error checking group:', error);
    }
  };

  return (
    <div>
      {/* Героическая секция с заголовком */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="text-center">
            <FaCalendarAlt className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Расписание занятий</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Расписание учебных групп Политехнического техникума
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        {/* Кнопка назад */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/students')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Назад к студенческому порталу
          </button>
        </div>

        {/* Описание */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Расписание групп</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Выберите свою учебную группу, чтобы просмотреть актуальное расписание занятий,
            замен и дополнительной информации
          </p>
        </div>

        {/* Сетка групп */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
              onClick={() => handleGroupClick(group.code)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {group.code}
                </div>
                <FaCalendarAlt className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {group.specialty}
              </p>
              <div className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center transition-colors duration-200">
                Посмотреть расписание
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Дополнительная информация */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Важная информация</h3>
          <ul className="text-blue-800 space-y-2">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Расписание обновляется ежедневно к 18:00
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              При заменах занятий информация появляется в разделе объявлений
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Для вопросов по расписанию обращайтесь к классному руководителю
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}