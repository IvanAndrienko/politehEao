import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

interface StudyGroup {
  id: string;
  code: string;
  name: string;
  fullName: string;
  specialty?: string;
}

interface Lesson {
  id: string;
  groupId: string;
  dayOfWeek: number;
  lessonNumber: number;
  subject: string;
  teacher: string;
  room: string;
}

export default function AdminRaspisanie() {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<StudyGroup | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Формы
  const [groupForm, setGroupForm] = useState({
    code: '',
    name: '',
    fullName: '',
    specialty: ''
  });

  const [lessonForm, setLessonForm] = useState({
    dayOfWeek: 1,
    lessonNumber: 1,
    subject: '',
    teacher: '',
    room: ''
  });

  const timeSlots = {
    1: '9:00–10:30',
    2: '10:40–12:10',
    3: '12:20–13:50',
    4: '14:30–16:00',
    5: '16:10–17:40'
  };

  const dayNames = {
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница'
  };

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      loadLessons(selectedGroup.id);
    }
  }, [selectedGroup]);

  const loadGroups = async () => {
    try {
      const response = await fetch('/api/schedule/groups');
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLessons = async (groupId: string) => {
    try {
      const response = await fetch(`/api/schedule/groups/${groupId}/lessons`);
      const data = await response.json();
      setLessons(data);
    } catch (error) {
      console.error('Error loading lessons:', error);
    }
  };

  const handleCreateGroup = async () => {
    try {
      const response = await fetch('/api/schedule/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupForm)
      });

      if (response.ok) {
        setShowGroupModal(false);
        setGroupForm({ code: '', name: '', fullName: '', specialty: '' });
        loadGroups();
      } else {
        console.error('Failed to create group:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleUpdateGroup = async () => {
    if (!editingGroup) return;

    try {
      const response = await fetch(`/api/schedule/groups/${editingGroup.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupForm)
      });

      if (response.ok) {
        setShowGroupModal(false);
        setEditingGroup(null);
        setGroupForm({ code: '', name: '', fullName: '', specialty: '' });
        loadGroups();
      } else {
        console.error('Failed to update group:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating group:', error);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту группу?')) return;

    try {
      const response = await fetch(`/api/schedule/groups/${groupId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadGroups();
        if (selectedGroup?.id === groupId) {
          setSelectedGroup(null);
          setLessons([]);
        }
      } else {
        console.error('Failed to delete group:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  const handleCreateLesson = async () => {
    if (!selectedGroup) return;

    try {
      const response = await fetch('/api/schedule/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId: selectedGroup.id,
          ...lessonForm
        })
      });

      if (response.ok) {
        setShowLessonModal(false);
        setLessonForm({ dayOfWeek: 1, lessonNumber: 1, subject: '', teacher: '', room: '' });
        loadLessons(selectedGroup.id);
      } else {
        console.error('Failed to create lesson:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
    }
  };

  const handleUpdateLesson = async () => {
    if (!editingLesson) return;

    try {
      const response = await fetch(`/api/schedule/lessons/${editingLesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonForm)
      });

      if (response.ok) {
        setShowLessonModal(false);
        setEditingLesson(null);
        setLessonForm({ dayOfWeek: 1, lessonNumber: 1, subject: '', teacher: '', room: '' });
        if (selectedGroup) {
          loadLessons(selectedGroup.id);
        }
      } else {
        console.error('Failed to update lesson:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот урок?')) return;

    try {
      const response = await fetch(`/api/schedule/lessons/${lessonId}`, {
        method: 'DELETE'
      });

      if (response.ok && selectedGroup) {
        loadLessons(selectedGroup.id);
      } else {
        console.error('Failed to delete lesson:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  const openGroupModal = (group?: StudyGroup) => {
    if (group) {
      setEditingGroup(group);
      setGroupForm({
        code: group.code,
        name: group.name,
        fullName: group.fullName,
        specialty: group.specialty || ''
      });
    } else {
      setEditingGroup(null);
      setGroupForm({ code: '', name: '', fullName: '', specialty: '' });
    }
    setShowGroupModal(true);
  };

  const openLessonModal = (lesson?: Lesson) => {
    if (lesson) {
      setEditingLesson(lesson);
      setLessonForm({
        dayOfWeek: lesson.dayOfWeek,
        lessonNumber: lesson.lessonNumber,
        subject: lesson.subject,
        teacher: lesson.teacher,
        room: lesson.room
      });
    } else {
      setEditingLesson(null);
      setLessonForm({ dayOfWeek: 1, lessonNumber: 1, subject: '', teacher: '', room: '' });
    }
    setShowLessonModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Кнопка назад */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Назад
            </button>
            <button
              onClick={loadGroups}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Обновить
            </button>
          </div>

          {/* Заголовок */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление расписанием</h1>
            <p className="text-lg text-gray-600">Создание и редактирование расписания учебных групп</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <button
                onClick={() => openGroupModal()}
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center"
              >
                <FaPlus className="mr-2" />
                Добавить группу
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Список групп */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Учебные группы</h2>
                  <div className="space-y-2">
                    {groups.map((group) => (
                      <div
                        key={group.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedGroup?.id === group.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedGroup(group)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-gray-900">{group.code}</div>
                            <div className="text-sm text-gray-600">{group.name}</div>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openGroupModal(group);
                              }}
                              className="text-blue-600 hover:text-blue-700 p-1"
                            >
                              <FaEdit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteGroup(group.id);
                              }}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Расписание выбранной группы */}
              <div className="lg:col-span-2">
                {selectedGroup ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Расписание группы {selectedGroup.code}
                      </h2>
                      <button
                        onClick={() => openLessonModal()}
                        className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 flex items-center text-sm"
                      >
                        <FaPlus className="w-3 h-3 mr-2" />
                        Добавить урок
                      </button>
                    </div>

                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map(day => (
                        <div key={day} className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-3">{dayNames[day as keyof typeof dayNames]}</h3>
                          <div className="space-y-2">
                            {lessons
                              .filter(lesson => lesson.dayOfWeek === day)
                              .sort((a, b) => a.lessonNumber - b.lessonNumber)
                              .map((lesson) => (
                                <div key={lesson.id} className="bg-gray-50 border border-gray-100 rounded-md p-3">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-4 mb-2">
                                        <div className="flex items-center text-blue-600 text-sm">
                                          <FaClock className="w-3 h-3 mr-1" />
                                          <span>{timeSlots[lesson.lessonNumber as keyof typeof timeSlots]}</span>
                                        </div>
                                        <div className="flex items-center text-gray-500 text-sm">
                                          <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                                          <span>{lesson.room}</span>
                                        </div>
                                      </div>
                                      <div className="font-semibold text-gray-900">{lesson.subject}</div>
                                      <div className="text-gray-600 text-sm">{lesson.teacher}</div>
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                      <button
                                        onClick={() => openLessonModal(lesson)}
                                        className="text-blue-600 hover:text-blue-700 p-1"
                                      >
                                        <FaEdit className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteLesson(lesson.id)}
                                        className="text-red-600 hover:text-red-700 p-1"
                                      >
                                        <FaTrash className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            {lessons.filter(lesson => lesson.dayOfWeek === day).length === 0 && (
                              <div className="text-center text-gray-400 py-4">
                                <FaCalendarAlt className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Нет занятий</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <FaCalendarAlt className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Выберите группу</h3>
                    <p className="text-gray-600">Выберите учебную группу для управления расписанием</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Модальное окно для группы */}
          {showGroupModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingGroup ? 'Редактировать группу' : 'Добавить группу'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Код группы</label>
                    <input
                      type="text"
                      value={groupForm.code}
                      onChange={(e) => setGroupForm({...groupForm, code: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ИС-21"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                    <input
                      type="text"
                      value={groupForm.name}
                      onChange={(e) => setGroupForm({...groupForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Информационные системы"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Полное название</label>
                    <input
                      type="text"
                      value={groupForm.fullName}
                      onChange={(e) => setGroupForm({...groupForm, fullName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="09.02.07 Информационные системы и программирование"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Специальность</label>
                    <input
                      type="text"
                      value={groupForm.specialty}
                      onChange={(e) => setGroupForm({...groupForm, specialty: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Информационные технологии"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowGroupModal(false);
                      setEditingGroup(null);
                      setGroupForm({ code: '', name: '', fullName: '', specialty: '' });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={editingGroup ? handleUpdateGroup : handleCreateGroup}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingGroup ? 'Сохранить' : 'Создать'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Модальное окно для урока */}
          {showLessonModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingLesson ? 'Редактировать урок' : 'Добавить урок'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">День недели</label>
                    <select
                      value={lessonForm.dayOfWeek}
                      onChange={(e) => setLessonForm({...lessonForm, dayOfWeek: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1}>Понедельник</option>
                      <option value={2}>Вторник</option>
                      <option value={3}>Среда</option>
                      <option value={4}>Четверг</option>
                      <option value={5}>Пятница</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Номер пары</label>
                    <select
                      value={lessonForm.lessonNumber}
                      onChange={(e) => setLessonForm({...lessonForm, lessonNumber: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1}>1 пара (9:00–10:30)</option>
                      <option value={2}>2 пара (10:40–12:10)</option>
                      <option value={3}>3 пара (12:20–13:50)</option>
                      <option value={4}>4 пара (14:30–16:00)</option>
                      <option value={5}>5 пара (16:10–17:40)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Предмет</label>
                    <input
                      type="text"
                      value={lessonForm.subject}
                      onChange={(e) => setLessonForm({...lessonForm, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Математика"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Преподаватель</label>
                    <input
                      type="text"
                      value={lessonForm.teacher}
                      onChange={(e) => setLessonForm({...lessonForm, teacher: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Иванов И.И."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Кабинет</label>
                    <input
                      type="text"
                      value={lessonForm.room}
                      onChange={(e) => setLessonForm({...lessonForm, room: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Каб. 101"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowLessonModal(false);
                      setEditingLesson(null);
                      setLessonForm({ dayOfWeek: 1, lessonNumber: 1, subject: '', teacher: '', room: '' });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={editingLesson ? handleUpdateLesson : handleCreateLesson}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingLesson ? 'Сохранить' : 'Создать'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}