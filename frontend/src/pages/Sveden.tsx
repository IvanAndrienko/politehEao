import { Link, useParams } from 'react-router-dom';
import { FaBuilding, FaUsers, FaFileAlt, FaAward, FaGraduationCap, FaUser, FaHome, FaRubleSign, FaGlobe, FaUtensils, FaArrowLeft } from 'react-icons/fa';
import Common from './about/Common';
import Structure from './about/Structure';
import DocumentsComponent from './about/Documents';
import Education from './about/Education';
import EduStandarts from './about/EduStandarts';
import Objects from './about/Objects';
import Employees from './about/Employees';
import Managers from './about/Managers';
import International from './about/International';
import Grants from './about/Grants';
import PaidEdu from './about/PaidEdu';
import Budget from './about/Budget';
import VacantPlaces from './about/VacantPlaces';
import Catering from './about/Catering';

export default function Sveden() {
  const { section } = useParams<{ section?: string }>();

  const svedenSections = [
    {
      id: 'common',
      title: 'Основные сведения',
      icon: <FaBuilding className="w-6 h-6" />,
      description: 'Общая информация об образовательной организации'
    },
    {
      id: 'struct',
      title: 'Структура и органы управления образовательной организацией',
      icon: <FaUsers className="w-6 h-6" />,
      description: 'Организационная структура техникума'
    },
    {
      id: 'document',
      title: 'Документы',
      icon: <FaFileAlt className="w-6 h-6" />,
      description: 'Устав, лицензии и другие документы'
    },
    {
      id: 'education',
      title: 'Образование',
      icon: <FaAward className="w-6 h-6" />,
      description: 'Образовательные программы и стандарты'
    },
    {
      id: 'eduStandarts',
      title: 'Образовательные стандарты и требования',
      icon: <FaGraduationCap className="w-6 h-6" />,
      description: 'Стандарты и требования к образованию'
    },
    {
      id: 'managers',
      title: 'Руководство',
      icon: <FaUser className="w-6 h-6" />,
      description: 'Администрация техникума'
    },
    {
      id: 'employees',
      title: 'Педагогический состав',
      icon: <FaGraduationCap className="w-6 h-6" />,
      description: 'Информация о преподавателях'
    },
    {
      id: 'objects',
      title: 'Материально-техническое обеспечение и оснащённость образовательного процесса. Доступная среда',
      icon: <FaHome className="w-6 h-6" />,
      description: 'Оборудование и инфраструктура'
    },
    {
      id: 'grants',
      title: 'Стипендии и меры поддержки обучающихся',
      icon: <FaAward className="w-6 h-6" />,
      description: 'Социальная поддержка обучающихся'
    },
    {
      id: 'paid_edu',
      title: 'Платные образовательные услуги',
      icon: <FaRubleSign className="w-6 h-6" />,
      description: 'Информация о платных услугах'
    },
    {
      id: 'budget',
      title: 'Финансово-хозяйственная деятельность',
      icon: <FaRubleSign className="w-6 h-6" />,
      description: 'Финансовая отчетность'
    },
    {
      id: 'vacant',
      title: 'Вакантные места для приема (перевода) обучающихся',
      icon: <FaUsers className="w-6 h-6" />,
      description: 'Свободные места для поступления'
    },
    {
      id: 'inter',
      title: 'Международное сотрудничество',
      icon: <FaGlobe className="w-6 h-6" />,
      description: 'Международные связи и проекты'
    },
    {
      id: 'catering',
      title: 'Организация питания в образовательной организации',
      icon: <FaUtensils className="w-6 h-6" />,
      description: 'Столовая и питание в техникуме'
    }
  ];

  // Если указана секция, показываем её содержимое
  if (section) {
    const currentSection = svedenSections.find(s => s.id === section);

    if (!currentSection) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Раздел не найден</h1>
            <Link to="/sveden" className="text-blue-600 hover:text-blue-700">
              Вернуться к списку разделов
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-screen-2xl mx-auto px-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-blue-200">{currentSection.icon}</div>
              <h1 className="text-3xl md:text-4xl font-bold">{currentSection.title}</h1>
            </div>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 py-8">
          {/* Кнопка назад */}
          <div className="mb-6">
            <button
              onClick={() => window.location.href = '/sveden'}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Назад к разделам
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 animate-slide-up">
            {section === 'common' && <Common />}
            {section === 'struct' && <Structure />}
            {section === 'document' && <DocumentsComponent />}
            {section === 'education' && <Education />}
            {section === 'eduStandarts' && <EduStandarts />}
            {section === 'objects' && <Objects />}
            {section === 'managers' && <Managers />}
            {section === 'employees' && <Employees />}
            {section === 'grants' && <Grants />}
            {section === 'paid_edu' && <PaidEdu />}
            {section === 'budget' && <Budget />}
            {section === 'vacant' && <VacantPlaces />}
            {section === 'catering' && <Catering />}
            {section === 'inter' && <International />}
            {/* Для других секций можно добавить соответствующие компоненты */}
            {!['common', 'struct', 'document', 'education', 'eduStandarts', 'objects', 'managers', 'employees', 'grants', 'paid_edu', 'budget', 'vacant', 'catering', 'inter'].includes(section) && (
              <div className="text-center py-12 animate-slide-up">
                <div className="text-gray-400 mb-4">{currentSection.icon}</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{currentSection.title}</h3>
                <p className="text-gray-600">Информация будет добавлена в ближайшее время</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Главная страница с плитками разделов
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="text-center">
            <FaBuilding className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Сведения об образовательной организации</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Информация об Областном государственном профессиональном образовательном бюджетном учреждении «Политехнический техникум»
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {svedenSections.map((section, index) => (
            <Link
              key={section.id}
              to={`/sveden/${section.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300 block animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-blue-600">{section.icon}</div>
                <h3 className="font-semibold text-lg text-gray-900">{section.title}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
