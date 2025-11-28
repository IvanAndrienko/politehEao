import { useState, useEffect } from 'react';
import { FaDownload } from 'react-icons/fa';
import { apiUrl, assetUrl } from '../../lib/api.ts';

export default function Documents() {
  const [documents, setDocuments] = useState({
    ustavDocLink: '',
    localActStud: '',
    localActOrder: '',
    localActCollec: '',
    reportEduDocLink: '',
    prescriptionDocLink: '',
    priemDocLink: '',
    modeDocLink: '',
    tekKontrolDocLink: '',
    perevodDocLink: '',
    vozDocLink: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      // Пробуем загрузить из объединенного API
      const response = await fetch(apiUrl('/api/page-data?page=documents'));
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const { documents } = result.data;
          setDocuments(documents || {});
          return;
        }
      }

      // Fallback на старый запрос
      console.warn('Page data API failed, falling back to individual request');
      const fallbackResponse = await fetch(apiUrl('/api/documents'));
      if (fallbackResponse.ok) {
        const data = await fallbackResponse.json();
        setDocuments(data.documents || {});
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const documentList = [
    {
      title: 'Устав образовательной организации',
      key: 'ustavDocLink',
      description: 'Основной документ, определяющий статус и деятельность образовательной организации',
      required: true
    },
    {
      title: 'Правила внутреннего распорядка обучающихся',
      key: 'localActStud',
      description: 'Правила поведения и внутреннего распорядка для обучающихся',
      required: true
    },
    {
      title: 'Правила внутреннего трудового распорядка',
      key: 'localActOrder',
      description: 'Правила трудового распорядка для работников организации',
      required: true
    },
    {
      title: 'Коллективный договор',
      key: 'localActCollec',
      description: 'Соглашение между работниками и работодателем',
      required: false
    },
    {
      title: 'Отчёт о результатах самообследования',
      key: 'reportEduDocLink',
      description: 'Результаты внутренней оценки деятельности организации',
      required: true
    },
    {
      title: 'Предписания органов государственного контроля',
      key: 'prescriptionDocLink',
      description: 'Предписания контролирующих органов и отчёты об их исполнении',
      required: false
    },
    {
      title: 'Правила приёма обучающихся',
      key: 'priemDocLink',
      description: 'Порядок и условия приёма в образовательную организацию',
      required: true
    },
    {
      title: 'Режим занятий обучающихся',
      key: 'modeDocLink',
      description: 'Расписание и режим учебных занятий',
      required: true
    },
    {
      title: 'Формы, периодичность и порядок текущего контроля успеваемости',
      key: 'tekKontrolDocLink',
      description: 'Порядок проведения текущего контроля знаний обучающихся',
      required: true
    },
    {
      title: 'Порядок и основания перевода, отчисления и восстановления обучающихся',
      key: 'perevodDocLink',
      description: 'Правила перевода между курсами, отчисления и восстановления',
      required: true
    },
    {
      title: 'Порядок оформления отношений между организацией и обучающимися',
      key: 'vozDocLink',
      description: 'Порядок заключения, изменения и прекращения договоров об образовании',
      required: true
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка документов...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Документы</h2>

      <div className="space-y-6">
        {/* Основные документы */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 text-white">
            <h3 className="text-lg font-medium">Основные документы</h3>
            <p className="text-sm opacity-90">Обязательные документы образовательной организации</p>
          </div>
          <div className="divide-y divide-gray-200">
            {documentList.slice(0, 6).map((doc) => (
              <div key={doc.key} className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    {doc.title}
                    {doc.required && <span className="text-red-500 ml-1">*</span>}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                </div>
                <div className="ml-4">
                  {documents[doc.key as keyof typeof documents] ? (
                    <a
                      href={assetUrl(documents[doc.key as keyof typeof documents])}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      itemProp={doc.key}
                      download
                    >
                      <FaDownload className="w-4 h-4 mr-2" />
                      Скачать
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      {doc.key === 'prescriptionDocLink' ? 'Предписаний нет' : 'Документ отсутствует'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Локальные нормативные акты */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-green-600 text-white">
            <h3 className="text-lg font-medium">Локальные нормативные акты</h3>
            <p className="text-sm opacity-90">Документы, регламентирующие образовательную деятельность</p>
          </div>
          <div className="divide-y divide-gray-200">
            {documentList.slice(6).map((doc) => (
              <div key={doc.key} className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    {doc.title}
                    {doc.required && <span className="text-red-500 ml-1">*</span>}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                </div>
                <div className="ml-4">
                  {documents[doc.key as keyof typeof documents] ? (
                    <a
                      href={assetUrl(documents[doc.key as keyof typeof documents])}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      itemProp={doc.key}
                      download
                    >
                      <FaDownload className="w-4 h-4 mr-2" />
                      Скачать
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      {doc.key === 'prescriptionDocLink' ? 'Предписаний нет' : 'Документ отсутствует'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
