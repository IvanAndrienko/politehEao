import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaArrowLeft, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

interface Lesson {
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

interface DaySchedule {
  day: string;
  lessons: Lesson[];
}

interface ScheduleData {
  name: string;
  specialty: string;
  schedule: DaySchedule[];
}

export default function GroupRaspisanie() {
  const { groupCode } = useParams<{ groupCode: string }>();
  const navigate = useNavigate();

  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Сбрасываем состояние при изменении группы
    setLoading(true);
    loadSchedule();
  }, [groupCode]);

  const loadSchedule = async () => {
    try {
      const response = await fetch(`/api/schedule/groups/${groupCode}`);
      if (response.ok) {
        const data = await response.json();
        setScheduleData(data);
      } else {
        console.error('Group not found');
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupInfo = scheduleData;

  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка расписания...</p>
        </div>
      </div>
    );
  }

  if (!groupInfo) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Группа не найдена</h1>
          <button
            onClick={() => navigate('/students/raspisanie')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Вернуться к списку групп
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Героическая секция с заголовком */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="text-center">
            <FaCalendarAlt className="w-12 h-12 mx-auto mb-4 text-blue-200" />
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Группа {groupCode}</h1>
            <p className="text-blue-100">{groupInfo.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        {/* Кнопка назад */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/students/raspisanie')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Назад к группам
          </button>
        </div>

        {/* Расписание по дням в виде таблицы */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="grid grid-cols-5 bg-blue-600 text-white">
            {groupInfo.schedule.slice(0, 5).map((daySchedule, dayIndex) => (
              <div key={dayIndex} className="px-4 py-3 text-center border-r border-blue-500 last:border-r-0">
                <h3 className="text-sm font-semibold">{daySchedule.day}</h3>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5">
            {groupInfo.schedule.slice(0, 5).map((daySchedule, dayIndex) => (
              <div
                key={dayIndex}
                className="min-h-[300px] p-4 border-r border-gray-100 last:border-r-0"
              >
                {daySchedule.lessons.length > 0 ? (
                  <div className="space-y-2">
                    {daySchedule.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lessonIndex}
                        className="bg-gray-50 border border-gray-100 rounded-md p-2 hover:bg-blue-50 transition-all duration-200 hover:shadow-sm animate-slide-up"
                        style={{ animationDelay: `${(dayIndex * 5 + lessonIndex) * 100}ms` }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center text-blue-600 text-xs">
                            <FaClock className="w-2.5 h-2.5 mr-1" />
                            <span className="font-medium">{lesson.time}</span>
                          </div>
                          <div className="flex items-center text-gray-500 text-xs">
                            <FaMapMarkerAlt className="w-3.5 h-3.5 mr-1" />
                            <span>{lesson.room}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-xs leading-tight mb-1">{lesson.subject}</h4>
                          <p className="text-gray-600 text-xs">{lesson.teacher}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <FaCalendarAlt className="w-6 h-6 mb-2 opacity-50" />
                    <p className="text-xs text-center">Нет занятий</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Важная информация</h3>
          <ul className="text-blue-800 space-y-2">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Расписание может изменяться. Следите за объявлениями
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              При заменах занятий информация появляется в разделе объявлений студентов
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