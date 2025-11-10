import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface PaidEduDocument {
  id: string;
  title?: string | null;
  description?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  fileType?: string | null;
  docType: string;
  programName?: string | null;
  educationLevel?: string | null;
  isActive: boolean;
  order: number;
}

export default function PaidEdu() {
  const [documents, setDocuments] = useState<{
    paidEdu: PaidEduDocument[];
    paidDog: PaidEduDocument[];
    paidSt: PaidEduDocument[];
    paidParents: PaidEduDocument[];
  }>({
    paidEdu: [],
    paidDog: [],
    paidSt: [],
    paidParents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/paid-edu/documents`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Платные образовательные услуги</h2>

      <div className="space-y-8">
        {/* Порядок оказания платных образовательных услуг */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 text-white">
            <h3 className="text-lg font-semibold">Порядок оказания платных образовательных услуг</h3>
            <p className="text-blue-100 text-sm mt-1">
              Порядок оказания платных образовательных услуг в виде электронного документа, подписанного электронной подписью
            </p>
          </div>

          <div className="p-6">
            {documents.paidEdu.length > 0 ? (
              <div className="space-y-4">
                {documents.paidEdu.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.title}</h4>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                      <p className="text-xs text-gray-500">{doc.fileName} ({doc.fileSize ? (doc.fileSize / 1024).toFixed(1) : 0} KB)</p>
                    </div>
                    <a
                      href={`${API_URL}${doc.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      itemProp="paidEdu"
                    >
                      Скачать
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Порядок оказания платных образовательных услуг не установлен</p>
                <span className="text-gray-400" itemProp="paidEdu">Отсутствует</span>
              </div>
            )}
          </div>
        </div>

        {/* Образец договора */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-green-600 text-white">
            <h3 className="text-lg font-semibold">Образец договора об оказании платных образовательных услуг</h3>
            <p className="text-green-100 text-sm mt-1">
              Образец договора об оказании платных образовательных услуг
            </p>
          </div>

          <div className="p-6">
            {documents.paidDog.length > 0 ? (
              <div className="space-y-4">
                {documents.paidDog.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.title}</h4>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                      <p className="text-xs text-gray-500">{doc.fileName} ({doc.fileSize ? (doc.fileSize / 1024).toFixed(1) : 0} KB)</p>
                    </div>
                    <a
                      href={`${API_URL}${doc.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                      itemProp="paidDog"
                    >
                      Скачать
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Образец договора не предоставлен</p>
                <span className="text-gray-400" itemProp="paidDog">Отсутствует</span>
              </div>
            )}
          </div>
        </div>

        {/* Стоимость обучения */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-purple-600 text-white">
            <h3 className="text-lg font-semibold">Документ об утверждении стоимости обучения по каждой образовательной программе</h3>
            <p className="text-purple-100 text-sm mt-1">
              Документ об утверждении стоимости обучения по каждой образовательной программе в виде электронного документа, подписанного электронной подписью
            </p>
          </div>

          <div className="p-6">
            {documents.paidSt.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Образовательная программа</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Уровень образования</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ссылка на документ</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.paidSt.map((doc, index) => (
                      <tr key={doc.id} itemProp="paidSt">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{doc.programName || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{doc.educationLevel || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {doc.fileUrl ? (
                            <a
                              href={`${API_URL}${doc.fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-700 underline"
                            >
                              {doc.title}
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Документ об утверждении стоимости обучения не предоставлен</p>
                <span className="text-gray-400" itemProp="paidSt">Отсутствует</span>
              </div>
            )}
          </div>
        </div>

        {/* Плата родителей */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-orange-600 text-white">
            <h3 className="text-lg font-semibold">Документ об установлении размера платы, взимаемой с родителей (законных представителей)</h3>
            <p className="text-orange-100 text-sm mt-1">
              Документ об установлении размера платы, взимаемой с родителей (законных представителей) за присмотр и уход за детьми, осваивающими образовательные программы дошкольного образования, за содержание детей в образовательной организации, реализующей образовательные программы начального общего, основного общего или среднего общего образования, если в такой образовательной организации созданы условия для проживания обучающихся в интернате, либо за осуществление присмотра и ухода за детьми в группах продленного дня в образовательной организации, реализующей образовательные программы начального общего, основного общего или среднего общего образования в виде электронного документа, подписанного электронной подписью
            </p>
          </div>

          <div className="p-6">
            {documents.paidParents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Образовательная программа</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Уровень образования</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ссылка на документ</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.paidParents.map((doc, index) => (
                      <tr key={doc.id} itemProp="paidParents">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{doc.programName || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{doc.educationLevel || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {doc.fileUrl ? (
                            <a
                              href={`${API_URL}${doc.fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-600 hover:text-orange-700 underline"
                            >
                              {doc.title}
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Документ об установлении размера платы не предоставлен</p>
                <span className="text-gray-400" itemProp="paidParents">Отсутствует</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}