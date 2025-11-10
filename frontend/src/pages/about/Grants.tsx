import { useState, useEffect } from 'react';
import { FaFileDownload, FaHome, FaMoneyBillWave } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface GrantsDocument {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

interface GrantsInfo {
  id: string;
  content: string;
}

interface SupportMeasure {
  id: string;
  content: string;
}

interface HostelInfo {
  hostels: number;
  places: number;
  adapted: number;
  internats: number;
  interPlaces: number;
  interAdapted: number;
}

interface HostelPaymentDocument {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export default function Grants() {
  const [documents, setDocuments] = useState<GrantsDocument[]>([]);
  const [grantsInfo, setGrantsInfo] = useState<GrantsInfo[]>([]);
  const [supportMeasures, setSupportMeasures] = useState<SupportMeasure[]>([]);
  const [hostelInfo, setHostelInfo] = useState<HostelInfo | null>(null);
  const [hostelPaymentDocument, setHostelPaymentDocument] = useState<HostelPaymentDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGrantsData();
  }, []);

  const loadGrantsData = async () => {
    try {
      // Загружаем все данные параллельно
      const [
        documentsRes,
        grantsRes,
        supportRes,
        hostelRes,
        paymentRes
      ] = await Promise.all([
        fetch(`${API_URL}/api/grants/documents`),
        fetch(`${API_URL}/api/grants/info`),
        fetch(`${API_URL}/api/grants/support`),
        fetch(`${API_URL}/api/grants/hostel-info`),
        fetch(`${API_URL}/api/grants/hostel-payment-document`)
      ]);

      if (documentsRes.ok) {
        const docsData = await documentsRes.json();
        setDocuments(docsData);
      }

      if (grantsRes.ok) {
        const grantsData = await grantsRes.json();
        setGrantsInfo(grantsData);
      }

      if (supportRes.ok) {
        const supportData = await supportRes.json();
        setSupportMeasures(supportData);
      }

      if (hostelRes.ok) {
        const hostelData = await hostelRes.json();
        setHostelInfo(hostelData);
      }

      if (paymentRes.ok) {
        const paymentData = await paymentRes.json();
        setHostelPaymentDocument(paymentData);
      }
    } catch (error) {
      console.error('Error loading grants data:', error);
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Стипендии и меры поддержки обучающихся</h2>

      {/* Локальные нормативные акты */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaFileDownload className="w-5 h-5 mr-2 text-blue-600" />
          Локальные нормативные акты, которыми регламентируется наличие и условия предоставления стипендий
        </h3>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900" itemProp="localAct">{doc.title}</h4>
                <p className="text-sm text-gray-600">{doc.description}</p>
                <p className="text-xs text-gray-500">{doc.fileName} ({(doc.fileSize / 1024).toFixed(1)} KB)</p>
              </div>
              <a
                href={`${API_URL}${doc.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaFileDownload className="mr-2" />
                Скачать
              </a>
            </div>
          ))}
          {documents.length === 0 && (
            <p className="text-center text-gray-500">Нет доступных документов</p>
          )}
        </div>
      </div>

      {/* Информация о стипендиях */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaMoneyBillWave className="w-5 h-5 mr-2 text-green-600" />
          Информация о предоставлении стипендии обучающимся
        </h3>
        {grantsInfo.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6" itemProp="grant">
            <div dangerouslySetInnerHTML={{ __html: grantsInfo[0].content }} />
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-700">Выплата стипендий не предусмотрена</p>
          </div>
        )}
      </div>

      {/* Меры социальной поддержки */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaHome className="w-5 h-5 mr-2 text-purple-600" />
          Меры социальной поддержки обучающихся
        </h3>
        {supportMeasures.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6" itemProp="support">
            <div dangerouslySetInnerHTML={{ __html: supportMeasures[0].content }} />
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-700">Меры социальной поддержки не предусмотрены</p>
          </div>
        )}
      </div>

      {/* Общежития и интернаты */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaHome className="w-5 h-5 mr-2 text-indigo-600" />
          Общежития и интернаты
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Наименование показателя
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Общежития
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Интернаты
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Количество общежитий/интернатов
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="hostelInfo">{hostelInfo?.hostels || 0}</td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="interInfo">{hostelInfo?.internats || 0}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Количество мест
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="hostelNum">{hostelInfo?.places || 0}</td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="interNum">{hostelInfo?.interPlaces || 0}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Количество жилых помещений, приспособленных для использования инвалидами и лицами с ограниченными возможностями здоровья
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="hostelNumOvz">{hostelInfo?.adapted || 0}</td>
                <td className="px-6 py-4 text-sm text-gray-900" itemProp="interNumOvz">{hostelInfo?.interAdapted || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Плата за проживание в общежитии */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaMoneyBillWave className="w-5 h-5 mr-2 text-emerald-600" />
          Информация о формировании платы за проживание в общежитии
        </h3>
        {hostelPaymentDocument ? (
          <a
            href={`${API_URL}${hostelPaymentDocument.fileUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            itemProp="localActObSt"
          >
            <FaFileDownload className="mr-2" />
            {hostelPaymentDocument.title}
          </a>
        ) : (
          <p className="text-gray-700">Информация о плате за проживание в общежитии отсутствует</p>
        )}
      </div>
    </div>
  );
}