import { useState, useEffect } from 'react';
import { FaGraduationCap, FaFileAlt, FaDownload, FaUsers, FaBriefcase, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Education() {
  const [educationData, setEducationData] = useState({
    programs: [],
    programsDetail: [],
    documents: [] as any[],
    graduateEmployment: [],
    settings: {
      showPrograms: true,
      showProgramsDetail: true,
      showEmployment: true,
      showDocuments: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadEducationData();
  }, []);

  const loadEducationData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/education`);
      if (response.ok) {
        const data = await response.json();
        setEducationData({
          programs: data.programs || [],
          programsDetail: data.programsDetail || [],
          documents: data.documents || [],
          graduateEmployment: data.graduateEmployment || [],
          settings: data.settings || {
            showPrograms: true,
            showProgramsDetail: true,
            showEmployment: true,
            showDocuments: true
          }
        });
      }
    } catch (error) {
      console.error('Error loading education data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRowExpansion = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Образование</h2>

      {/* Основная таблица образовательных программ */}
      {educationData.settings.showPrograms && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaGraduationCap className="w-5 h-5 mr-2 text-blue-600" />
            Информация о реализуемых уровнях образования, о формах обучения, нормативных сроках обучения
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Код, шифр
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Наименование профессии, специальности, направления подготовки
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Образовательная программа
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Уровень образования
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Формы обучения
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Нормативный срок обучения
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Учебные предметы, курсы, дисциплины
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Практики
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {educationData.programs.map((program: any, index: number) => (
                  <tr key={index} itemProp="eduAccred">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="eduCode">
                      {program.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="eduName">
                      {program.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="eduProf">
                      {program.program}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="eduLevel">
                      {program.level}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="eduForm">
                      {program.form}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="learningTerm">
                      {program.term}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="eduPred">
                      <div className="flex items-start space-x-2">
                        <span className="flex-1">
                          {expandedRows.has(index) ? program.subjects : truncateText(program.subjects, 50)}
                        </span>
                        {program.subjects && program.subjects.length > 50 && (
                          <button
                            onClick={() => toggleRowExpansion(index)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                            title={expandedRows.has(index) ? "Свернуть" : "Развернуть"}
                          >
                            {expandedRows.has(index) ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="eduPrac">
                      <div className="flex items-start space-x-2">
                        <span className="flex-1">
                          {expandedRows.has(index) ? program.practices : truncateText(program.practices, 50)}
                        </span>
                        {program.practices && program.practices.length > 50 && (
                          <button
                            onClick={() => toggleRowExpansion(index)}
                            className="text-blue-600 hover:text-blue-700 p-1"
                            title={expandedRows.has(index) ? "Свернуть" : "Развернуть"}
                          >
                            {expandedRows.has(index) ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Документы */}
      {educationData.settings.showDocuments && educationData.documents.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaFileAlt className="w-5 h-5 mr-2 text-red-600" />
            Документы
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {educationData.documents.map((doc: any) => (
              <div key={doc.id} className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">{doc.title}</h4>
                {doc.description && (
                  <p className="text-sm text-gray-600 mb-4">{doc.description}</p>
                )}
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  itemProp={doc.field || 'educationDocument'}
                >
                  <FaDownload className="w-4 h-4 mr-2" />
                  Скачать документ
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Образовательные программы */}
      {educationData.settings.showProgramsDetail && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaGraduationCap className="w-5 h-5 mr-2 text-green-600" />
            Образовательные программы
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Код, шифр
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Наименование
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Уровень образования
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Образовательная программа
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Формы обучения
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Описание программы
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Учебный план
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Рабочие программы дисциплин
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Календарный график
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Рабочие программы практик
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Методические документы
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {educationData.programsDetail.map((program: any, index: number) => (
                  <tr key={index} itemProp="eduOp">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="eduCode">
                      {program.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="eduName">
                      {program.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="eduLevel">
                      {program.level}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="eduProf">
                      {program.program}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="eduForm">
                      {program.form}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {program.descriptionFile ? (
                        <a href={program.descriptionFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700" itemProp="opMain">Описание</a>
                      ) : program.description ? (
                        <a href={program.description} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700" itemProp="opMain">Описание</a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {program.curriculumFile ? (
                        <a href={program.curriculumFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700" itemProp="educationPlan">Учебный план</a>
                      ) : program.curriculum ? (
                        <a href={program.curriculum} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700" itemProp="educationPlan">Учебный план</a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {program.workProgramsFile ? (
                        <a href={program.workProgramsFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700" itemProp="educationRpd">Рабочие программы дисциплин</a>
                      ) : program.workPrograms && program.workPrograms.length > 0 ? (
                        program.workPrograms.map((link: string, idx: number) => (
                          <div key={idx}>
                            <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700" itemProp="educationRpd">РПД {idx + 1}</a>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {program.scheduleFile ? (
                        <a href={program.scheduleFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700" itemProp="educationShedule">График</a>
                      ) : program.schedule ? (
                        <a href={program.schedule} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700" itemProp="educationShedule">График</a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {program.practicesFile ? (
                        <a href={program.practicesFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700" itemProp="eduPr">Рабочие программы практик</a>
                      ) : program.practices ? (
                        <a href={program.practices} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700" itemProp="eduPr">Рабочие программы практик</a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {program.documentsFile ? (
                        <a href={program.documentsFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700" itemProp="methodology">Документы</a>
                      ) : program.documents ? (
                        <a href={program.documents} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700" itemProp="methodology">Документы</a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* Трудоустройство выпускников */}
      {educationData.settings.showEmployment && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaBriefcase className="w-5 h-5 mr-2 text-green-600" />
            Информация о трудоустройстве выпускников за 2023/2024 учебный год
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Код, шифр
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Наименование профессии, специальности
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Образовательная программа
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Количество выпускников
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Количество трудоустроенных выпускников
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {educationData.graduateEmployment.map((item: any, index: number) => (
                  <tr key={index} itemProp="graduateJob">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="eduCode">
                      {item.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="eduName">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="eduProf">
                      {item.program}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="v1">
                      {item.graduates}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="t1">
                      {item.employed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}