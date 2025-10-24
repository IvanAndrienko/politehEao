import { Link, useParams } from 'react-router-dom';
import { FaBuilding, FaUsers, FaFileAlt, FaAward, FaGraduationCap, FaUser, FaHome, FaDollarSign, FaGlobe, FaUtensils, FaArrowLeft } from 'react-icons/fa';
import Common from './about/Common';
import Structure from './about/Structure';
import DocumentsComponent from './about/Documents';

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
      id: 'structure',
      title: 'Структура и органы управления',
      icon: <FaUsers className="w-6 h-6" />,
      description: 'Организационная структура техникума'
    },
    {
      id: 'documents',
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
      id: 'leadership',
      title: 'Руководство',
      icon: <FaUser className="w-6 h-6" />,
      description: 'Администрация техникума'
    },
    {
      id: 'teachers',
      title: 'Педагогический состав',
      icon: <FaGraduationCap className="w-6 h-6" />,
      description: 'Информация о преподавателях'
    },
    {
      id: 'facilities',
      title: 'Материально-техническое обеспечение',
      icon: <FaHome className="w-6 h-6" />,
      description: 'Оборудование и инфраструктура'
    },
    {
      id: 'paid-services',
      title: 'Платные образовательные услуги',
      icon: <FaDollarSign className="w-6 h-6" />,
      description: 'Информация о платных услугах'
    },
    {
      id: 'financial',
      title: 'Финансово-хозяйственная деятельность',
      icon: <FaDollarSign className="w-6 h-6" />,
      description: 'Финансовая отчетность'
    },
    {
      id: 'vacancies',
      title: 'Вакантные места',
      icon: <FaUsers className="w-6 h-6" />,
      description: 'Свободные места для поступления'
    },
    {
      id: 'scholarships',
      title: 'Стипендии и меры поддержки',
      icon: <FaAward className="w-6 h-6" />,
      description: 'Социальная поддержка обучающихся'
    },
    {
      id: 'international',
      title: 'Международное сотрудничество',
      icon: <FaGlobe className="w-6 h-6" />,
      description: 'Международные связи и проекты'
    },
    {
      id: 'nutrition',
      title: 'Организация питания',
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="max-w-screen-2xl mx-auto px-4">
            <div className="flex items-center space-x-4 mb-4">
              <Link
                to="/sveden"
                className="flex items-center text-blue-200 hover:text-white transition-colors"
              >
                <FaArrowLeft className="w-5 h-5 mr-2" />
                Назад к разделам
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-blue-200">{currentSection.icon}</div>
              <h1 className="text-3xl md:text-4xl font-bold">{currentSection.title}</h1>
            </div>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            {section === 'common' && <Common />}
            {section === 'structure' && <Structure />}
            {section === 'documents' && <DocumentsComponent />}
            {/* Для других секций можно добавить соответствующие компоненты */}
            {!['common', 'structure', 'documents'].includes(section) && (
              <div className="text-center py-12">
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
          {svedenSections.map((section) => (
            <Link
              key={section.id}
              to={`/sveden/${section.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300 block"
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
