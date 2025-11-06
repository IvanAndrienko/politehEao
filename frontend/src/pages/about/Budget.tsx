import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface BudgetVolume {
  id: string;
  year: number;
  federalBudget?: number;
  regionalBudget?: number;
  localBudget?: number;
  paidServices?: number;
  isActive: boolean;
}

interface BudgetFlow {
  id: string;
  year: number;
  income: string;
  expenses: string;
  isActive: boolean;
}

interface BudgetPlan {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  isActive: boolean;
}

export default function Budget() {
  const [volumes, setVolumes] = useState<BudgetVolume[]>([]);
  const [flows, setFlows] = useState<BudgetFlow[]>([]);
  const [plans, setPlans] = useState<BudgetPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = async () => {
    try {
      const [volumesRes, flowsRes, plansRes] = await Promise.all([
        fetch(`${API_URL}/api/budget/volume`),
        fetch(`${API_URL}/api/budget/flow`),
        fetch(`${API_URL}/api/budget/plan`)
      ]);

      if (volumesRes.ok) {
        const volumesData = await volumesRes.json();
        setVolumes(volumesData);
      }

      if (flowsRes.ok) {
        const flowsData = await flowsRes.json();
        setFlows(flowsData);
      }

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData);
      }
    } catch (error) {
      console.error('Error loading budget data:', error);
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Финансово-хозяйственная деятельность</h2>

      {/* Объем образовательной деятельности */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Объем образовательной деятельности, финансовое обеспечение которой осуществляется за счет бюджетных ассигнований</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Год
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Федеральный бюджет (тыс. руб.)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Бюджеты субъектов РФ (тыс. руб.)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Местные бюджеты (тыс. руб.)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  По договорам об оказании платных образовательных услуг (тыс. руб.)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {volumes.map((volume) => (
                <tr key={volume.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="finYear">
                    {volume.year}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="finBFVolume">
                    {volume.federalBudget ? volume.federalBudget.toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="finBRVolume">
                    {volume.regionalBudget ? volume.regionalBudget.toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="finBMVolume">
                    {volume.localBudget ? volume.localBudget.toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="finPVolume">
                    {volume.paidServices ? volume.paidServices.toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
              {volumes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Нет данных об объеме образовательной деятельности
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Поступление и расходование средств */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Поступление и расходование финансовых и материальных средств</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Год
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Поступившие финансовые и материальные средства
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Расходованные финансовые и материальные средства
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {flows.map((flow) => (
                <tr key={flow.id} itemProp="volume">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" itemProp="finYear">
                    {flow.year}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="finPost">
                    {flow.income}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" itemProp="finRas">
                    {flow.expenses}
                  </td>
                </tr>
              ))}
              {flows.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    Нет данных о поступлении и расходовании средств
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Планы финансово-хозяйственной деятельности */}
      {plans.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">План финансово-хозяйственной деятельности</h3>

          <div className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{plan.title}</h4>
                    {plan.description && (
                      <p className="text-gray-600 mb-4">{plan.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mb-4">
                      {plan.fileName} ({(plan.fileSize / 1024).toFixed(1)} KB)
                    </p>
                  </div>
                  <a
                    href={plan.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    itemProp="finPlanDocLink"
                  >
                    Скачать документ
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Информация о доступе к сайту bus.gov.ru */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Информация о финансово-хозяйственной деятельности</h3>
        <div className="text-blue-800">
          <p className="mb-3">
            Согласно Федеральному закону от 08.05.2010 № 83-ФЗ и приказу Министерства финансов
            Российской Федерации от 21.07.2011 № 86н, государственные (муниципальные) учреждения
            обязаны размещать информацию о своей финансово-хозяйственной деятельности на сайте
            http://bus.gov.ru/.
          </p>
          <p>
            Для получения подробной информации о финансово-хозяйственной деятельности
            образовательной организации перейдите по следующей ссылке:
          </p>
          <a
            href="http://bus.gov.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Перейти на сайт bus.gov.ru
          </a>
        </div>
      </div>
    </div>
  );
}