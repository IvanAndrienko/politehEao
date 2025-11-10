import { useState, useEffect } from 'react';
import { FaUser, FaGraduationCap } from 'react-icons/fa';
import { apiUrl } from '../../lib/api.ts';

interface Employee {
  id: string;
  fio: string;
  post: string;
  disciplines: string;
  educationLevel: string;
  degree?: string;
  academicTitle?: string;
  qualification?: string;
  professionalDevelopment?: string;
  experience: string;
  programs: string;
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await fetch(apiUrl('/api/employees'));
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        // Если API недоступен, используем тестовые данные
        setEmployees([
          {
            id: '1',
            fio: 'Иванов Иван Иванович',
            post: 'Преподаватель',
            disciplines: 'Математика, Информатика',
            educationLevel: 'Высшее образование, специалитет, 09.03.01 Информатика и вычислительная техника',
            degree: 'Кандидат технических наук',
            academicTitle: 'Доцент',
            qualification: 'Повышение квалификации "Современные методы преподавания математики" (2023)',
            professionalDevelopment: 'Профессиональная переподготовка "Педагогика высшей школы" (2021)',
            experience: '15',
            programs: '44.02.01 Дошкольное образование, 09.02.01 Информационные системы и программирование'
          },
          {
            id: '2',
            fio: 'Петрова Анна Сергеевна',
            post: 'Старший преподаватель',
            disciplines: 'Русский язык и литература, Методика преподавания русского языка',
            educationLevel: 'Высшее образование, магистратура, 44.04.01 Педагогическое образование',
            degree: 'Кандидат педагогических наук',
            academicTitle: 'Доцент',
            qualification: 'Повышение квалификации "Литературное образование в современной школе" (2024)',
            professionalDevelopment: 'Профессиональная переподготовка "Методика преподавания русского языка" (2020)',
            experience: '12',
            programs: '44.02.01 Дошкольное образование, 44.02.02 Преподавание в начальных классах'
          },
          {
            id: '3',
            fio: 'Сидоров Михаил Петрович',
            post: 'Преподаватель',
            disciplines: 'Физика, Физическая культура',
            educationLevel: 'Высшее образование, специалитет, 03.03.02 Физика',
            degree: 'Кандидат физико-математических наук',
            academicTitle: 'Доцент',
            qualification: 'Повышение квалификации "Физика в современном образовании" (2023)',
            professionalDevelopment: 'Профессиональная переподготовка "Физическая культура и спорт" (2019)',
            experience: '18',
            programs: '09.02.01 Информационные системы и программирование'
          },
          {
            id: '4',
            fio: 'Козлова Елена Владимировна',
            post: 'Преподаватель',
            disciplines: 'История, Обществознание',
            educationLevel: 'Высшее образование, магистратура, 46.04.01 История',
            degree: 'Кандидат исторических наук',
            academicTitle: 'Доцент',
            qualification: 'Повышение квалификации "Историческое образование в цифровую эпоху" (2024)',
            professionalDevelopment: 'Профессиональная переподготовка "Методика преподавания истории" (2022)',
            experience: '10',
            programs: '44.02.02 Преподавание в начальных классах'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      // В случае ошибки также используем тестовые данные
      setEmployees([
        {
          id: '1',
          fio: 'Иванов Иван Иванович',
          post: 'Преподаватель',
          disciplines: 'Математика, Информатика',
          educationLevel: 'Высшее образование, специалитет, 09.03.01 Информатика и вычислительная техника',
          degree: 'Кандидат технических наук',
          academicTitle: 'Доцент',
          qualification: 'Повышение квалификации "Современные методы преподавания математики" (2023)',
          professionalDevelopment: 'Профессиональная переподготовка "Педагогика высшей школы" (2021)',
          experience: '15',
          programs: '44.02.01 Дошкольное образование, 09.02.01 Информационные системы и программирование'
        },
        {
          id: '2',
          fio: 'Петрова Анна Сергеевна',
          post: 'Старший преподаватель',
          disciplines: 'Русский язык и литература, Методика преподавания русского языка',
          educationLevel: 'Высшее образование, магистратура, 44.04.01 Педагогическое образование',
          degree: 'Кандидат педагогических наук',
          academicTitle: 'Доцент',
          qualification: 'Повышение квалификации "Литературное образование в современной школе" (2024)',
          professionalDevelopment: 'Профессиональная переподготовка "Методика преподавания русского языка" (2020)',
          experience: '12',
          programs: '44.02.01 Дошкольное образование, 44.02.02 Преподавание в начальных классах'
        },
        {
          id: '3',
          fio: 'Сидоров Михаил Петрович',
          post: 'Преподаватель',
          disciplines: 'Физика, Физическая культура',
          educationLevel: 'Высшее образование, специалитет, 03.03.02 Физика',
          degree: 'Кандидат физико-математических наук',
          academicTitle: 'Доцент',
          qualification: 'Повышение квалификации "Физика в современном образовании" (2023)',
          professionalDevelopment: 'Профессиональная переподготовка "Физическая культура и спорт" (2019)',
          experience: '18',
          programs: '09.02.01 Информационные системы и программирование'
        },
        {
          id: '4',
          fio: 'Козлова Елена Владимировна',
          post: 'Преподаватель',
          disciplines: 'История, Обществознание',
          educationLevel: 'Высшее образование, магистратура, 46.04.01 История',
          degree: 'Кандидат исторических наук',
          academicTitle: 'Доцент',
          qualification: 'Повышение квалификации "Историческое образование в цифровую эпоху" (2024)',
          professionalDevelopment: 'Профессиональная переподготовка "Методика преподавания истории" (2022)',
          experience: '10',
          programs: '44.02.02 Преподавание в начальных классах'
        }
      ]);
    } finally {
      setLoading(false);
    }
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Педагогический состав</h2>

      {/* Таблица педагогического состава */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaGraduationCap className="w-5 h-5 mr-2 text-blue-600" />
          Состав педагогических работников
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ф.И.О.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Должность преподавателя
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Перечень преподаваемых дисциплин
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Уровень профессионального образования, квалификация
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Учёная степень
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Учёное звание
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сведения о повышении квалификации (за последние 3 года)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сведения о профессиональной переподготовке
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сведения о продолжительности опыта (лет) работы
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Наименование образовательных программ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} itemProp="teachingStaff">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" itemProp="fio">
                    {employee.fio}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="post">
                    {employee.post}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="teachingDiscipline">
                    {employee.disciplines}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="teachingLevel">
                    {employee.educationLevel}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="degree">
                    {employee.degree || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="academStat">
                    {employee.academicTitle || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="qualification">
                    {employee.qualification || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="profDevelopment">
                    {employee.professionalDevelopment || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="specExperience">
                    {employee.experience}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="teachingOp">
                    {employee.programs}
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
                    Нет данных о педагогическом составе
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
