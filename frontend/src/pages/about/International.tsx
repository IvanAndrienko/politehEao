import { useState, useEffect } from 'react';

interface InternationalCooperation {
  id: string;
  stateName: string;
  orgName: string;
  dogReg: string;
  order: number;
  isActive: boolean;
}

export default function International() {
  const [cooperations, setCooperations] = useState<InternationalCooperation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCooperations();
  }, []);

  const loadCooperations = async () => {
    try {
      const response = await fetch('/api/international');
      if (response.ok) {
        const data = await response.json();
        setCooperations(data);
      }
    } catch (error) {
      console.error('Error loading cooperations:', error);
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Международное сотрудничество</h2>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-blue-600 text-white">
          <h3 className="text-lg font-semibold">Международное сотрудничество</h3>
          <p className="text-blue-100 text-sm mt-1">
            Информация о заключенных и планируемых к заключению договорах с иностранными и (или) международными организациями по вопросам образования и науки
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    № п/п
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Государство
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Наименование организации
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Реквизиты договора (наименование, дата, номер, срок действия)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cooperations.length > 0 ? cooperations.map((coop, index) => (
                  <tr key={coop.id} itemProp="internationalDog">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="stateName">{coop.stateName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="orgName">{coop.orgName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-pre-line" itemProp="dogReg">{coop.dogReg}</td>
                  </tr>
                )) : (
                  <tr itemProp="internationalDog">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="stateName">отсутствует</td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="orgName">отсутствует</td>
                    <td className="px-6 py-4 text-sm text-gray-900" itemProp="dogReg">отсутствует</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {cooperations.length === 0 && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <span className="font-medium">Примечание:</span> В настоящее время образовательная организация не имеет заключенных или планируемых к заключению договоров с иностранными и (или) международными организациями по вопросам образования и науки.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}