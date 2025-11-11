/**
 * РЎС‚СЂР°РЅРёС†Р° "РђР±РёС‚СѓСЂРёРµРЅС‚Сѓ" - РёРЅС„РѕСЂРјР°С†РёСЏ Рѕ РїРѕСЃС‚СѓРїР»РµРЅРёРё РІ РџРѕР»РёС‚РµС…РЅРёС‡РµСЃРєРёР№ С‚РµС…РЅРёРєСѓРј
 *
 * РЎРѕРґРµСЂР¶РёС‚:
 * - РџСЂРѕС†РµСЃСЃ РїРѕСЃС‚СѓРїР»РµРЅРёСЏ (4 С€Р°РіР°)
 * - РќРµРѕР±С…РѕРґРёРјС‹Рµ РґРѕРєСѓРјРµРЅС‚С‹ (Р·Р°РіСЂСѓР¶Р°СЋС‚СЃСЏ РёР· Р‘Р”)
 * - Р’Р°Р¶РЅС‹Рµ РґР°С‚С‹ (Р·Р°РіСЂСѓР¶Р°СЋС‚СЃСЏ РёР· Р‘Р”)
 * - РџСЂРµРёРјСѓС‰РµСЃС‚РІР° РѕР±СѓС‡РµРЅРёСЏ
 * - РљРѕРЅС‚Р°РєС‚С‹ РїСЂРёРµРјРЅРѕР№ РєРѕРјРёСЃСЃРёРё (Р·Р°РіСЂСѓР¶Р°СЋС‚СЃСЏ РёР· Р‘Р”) Рё РёРЅС‚РµСЂР°РєС‚РёРІРЅР°СЏ РєР°СЂС‚Р° РЇРЅРґРµРєСЃР° (Рі. Р‘РёСЂРѕР±РёРґР¶Р°РЅ)
 * - РўР°Р±Р»РёС†Р° СЃРїРµС†РёР°Р»СЊРЅРѕСЃС‚РµР№ СЃ РїР»Р°РЅРѕРј РЅР°Р±РѕСЂР° (Р±СЋРґР¶РµС‚РЅС‹Рµ/РїР»Р°С‚РЅС‹Рµ РјРµСЃС‚Р°, Р·Р°РіСЂСѓР¶Р°СЋС‚СЃСЏ РёР· Р‘Р”)
 * - РљРѕРЅС‚Р°РєС‚РЅР°СЏ РёРЅС„РѕСЂРјР°С†РёСЏ
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { FaFileAlt, FaCheckCircle, FaCalendar, FaGraduationCap, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendarAlt, FaHome } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Р”РµРєР»Р°СЂР°С†РёСЏ С‚РёРїРѕРІ РґР»СЏ РЇРЅРґРµРєСЃ.РљР°СЂС‚
declare global {
  interface Window {
    ymaps: any;
  }
}

interface Specialty {
  id: string;
  code: string;
  name: string;
  duration: string | null;
  form: string | null;
  qualification: string | null;
  budgetPlaces: number | null;
  paidPlaces: number | null;
}

interface RequiredDocument {
  id: string;
  title: string;
  description: string | null;
}

interface ImportantDate {
  id: string;
  date: string;
  event: string;
}

interface AdmissionContact {
  id: string;
  type: string;
  title: string;
  value: string;
}

interface DormitoryData {
  description: string | null;
  address: string | null;
  images: string[];
}
const DEFAULT_MAP_COORDINATES: [number, number] = [48.758344, 132.88787];
const DEFAULT_MAP_ADDRESS = "г. Биробиджан, ул. Шолом-Алейхема, д. 15";

const parseMapCoordinateValue = (value?: string | null): [number, number] | null => {
  if (!value) {
    return null;
  }

  try {
    const trimmed = value.trim();

    if (trimmed.startsWith('{')) {
      const parsed = JSON.parse(trimmed);
      const latRaw = parsed.lat ?? parsed.latitude;
      const lngRaw = parsed.lng ?? parsed.longitude;
      const lat = latRaw !== undefined ? parseFloat(latRaw) : NaN;
      const lng = lngRaw !== undefined ? parseFloat(lngRaw) : NaN;
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return [lat, lng];
      }
    }

    const separator = trimmed.includes(',') ? ',' : trimmed.includes(';') ? ';' : null;
    if (separator) {
      const [latPart, lngPart] = trimmed.split(separator);
      const lat = parseFloat(latPart);
      const lng = parseFloat(lngPart);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return [lat, lng];
      }
    }
  } catch {
    // ignore parse errors
  }

  return null;
};

// РЁР°РіРё РїСЂРѕС†РµСЃСЃР° РїРѕСЃС‚СѓРїР»РµРЅРёСЏ
const admissionSteps = [
  {
    step: 1,
    title: "РџРѕРґРіРѕС‚РѕРІРєР° РґРѕРєСѓРјРµРЅС‚РѕРІ",
    description: "РЎРѕР±РµСЂРёС‚Рµ РЅРµРѕР±С…РѕРґРёРјС‹Рµ РґРѕРєСѓРјРµРЅС‚С‹ СЃРѕРіР»Р°СЃРЅРѕ СЃРїРёСЃРєСѓ"
  },
  {
    step: 2,
    title: "РџРѕРґР°С‡Р° Р·Р°СЏРІР»РµРЅРёСЏ",
    description: "РџРѕРґР°Р№С‚Рµ Р·Р°СЏРІР»РµРЅРёРµ Рё РґРѕРєСѓРјРµРЅС‚С‹ РІ РїСЂРёРµРјРЅСѓСЋ РєРѕРјРёСЃСЃРёСЋ"
  },
  {
    step: 3,
    title: "РЈС‡Р°СЃС‚РёРµ РІ РєРѕРЅРєСѓСЂСЃРµ",
    description: "Р”РѕР¶РґРёС‚РµСЃСЊ СЂРµР·СѓР»СЊС‚Р°С‚РѕРІ РєРѕРЅРєСѓСЂСЃРЅРѕРіРѕ РѕС‚Р±РѕСЂР°"
  },
  {
    step: 4,
    title: "Р—Р°С‡РёСЃР»РµРЅРёРµ",
    description: "РџРѕР»СѓС‡РёС‚Рµ РїСЂРёРєР°Р· Рѕ Р·Р°С‡РёСЃР»РµРЅРёРё Рё РїСЂРёСЃС‚СѓРїРёС‚Рµ Рє РѕР±СѓС‡РµРЅРёСЋ"
  }
];

// Р”Р°РЅРЅС‹Рµ С‚РµРїРµСЂСЊ Р·Р°РіСЂСѓР¶Р°СЋС‚СЃСЏ РґРёРЅР°РјРёС‡РµСЃРєРё РёР· API

// РљРѕРјРїРѕРЅРµРЅС‚ СЃС‚СЂР°РЅРёС†С‹ "РђР±РёС‚СѓСЂРёРµРЅС‚Сѓ" СЃ РёРЅС„РѕСЂРјР°С†РёРµР№ Рѕ РїРѕСЃС‚СѓРїР»РµРЅРёРё
export default function Admission() {
  // РЎРѕСЃС‚РѕСЏРЅРёСЏ РґР»СЏ РґР°РЅРЅС‹С…
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [documents, setDocuments] = useState<RequiredDocument[]>([]);
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [contacts, setContacts] = useState<AdmissionContact[]>([]);
  const [dormitory, setDormitory] = useState<DormitoryData>({ description: null, address: null, images: [] });
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef<any>(null);
  const placemarkRef = useRef<any>(null);
  const mapAddress = contacts.find((c) => c.type === 'address')?.value || DEFAULT_MAP_ADDRESS;
  const mapCoordinates = useMemo<[number, number]>(() => {
    const mapContact = contacts.find((c) => c.type === 'map');
    const parsed = parseMapCoordinateValue(mapContact?.value);
    return parsed ?? DEFAULT_MAP_COORDINATES;
  }, [contacts]);

  // Р—Р°РіСЂСѓР·РєР° РґР°РЅРЅС‹С… РїСЂРё РјРѕРЅС‚РёСЂРѕРІР°РЅРёРё РєРѕРјРїРѕРЅРµРЅС‚Р°
  useEffect(() => {
    loadAdmissionData();
  }, []);

  const loadAdmissionData = async () => {
    try {
      setLoading(true);

      // РџРѕР»СѓС‡Р°РµРј С‚РѕРєРµРЅ РёР· localStorage РґР»СЏ Р°РІС‚РѕСЂРёР·РѕРІР°РЅРЅС‹С… Р·Р°РїСЂРѕСЃРѕРІ
      const token = localStorage.getItem('adminToken');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // РџСЂРѕР±СѓРµРј Р·Р°РіСЂСѓР·РёС‚СЊ РёР· РѕР±СЉРµРґРёРЅРµРЅРЅРѕРіРѕ API
      const response = await fetch('/api/page-data?page=admission', { headers });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const { specialties, documents, dates, contacts, dormitory } = result.data;
          setSpecialties(specialties || []);
          setDocuments(documents || []);
          setDates(dates || []);
          setContacts(contacts || []);
          setDormitory(dormitory || { description: null, address: null, images: [] });
          return;
        }
      }

      // Fallback РЅР° СЃС‚Р°СЂС‹Рµ РѕС‚РґРµР»СЊРЅС‹Рµ Р·Р°РїСЂРѕСЃС‹
      console.warn('Page data API failed, falling back to individual requests');
      const [specialtiesRes, documentsRes, datesRes, contactsRes, dormitoryRes] = await Promise.all([
        fetch('/api/admission/specialties', { headers }),
        fetch('/api/admission/documents', { headers }),
        fetch('/api/admission/dates', { headers }),
        fetch('/api/admission/contacts', { headers }),
        fetch('/api/admission/dormitory', { headers })
      ]);

      const [specialtiesData, documentsData, datesData, contactsData, dormitoryData] = await Promise.all([
        specialtiesRes.json(),
        documentsRes.json(),
        datesRes.json(),
        contactsRes.json(),
        dormitoryRes.json()
      ]);

      setSpecialties(specialtiesData);
      setDocuments(documentsData);
      setDates(datesData);
      setContacts(contactsData);
      setDormitory(dormitoryData);
    } catch (error) {
      console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РґР°РЅРЅС‹С…:', error);
    } finally {
      setLoading(false);
    }
  };

  // РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ РЇРЅРґРµРєСЃ.РљР°СЂС‚С‹ РїСЂРё Р·Р°РіСЂСѓР·РєРµ РєРѕРјРїРѕРЅРµРЅС‚Р°
  useEffect(() => {
    const initMap = () => {
      if (window.ymaps && !mapLoaded) {
        // РџСЂРѕРІРµСЂСЏРµРј, С‡С‚Рѕ СЌР»РµРјРµРЅС‚ РєР°СЂС‚С‹ СЃСѓС‰РµСЃС‚РІСѓРµС‚ Рё РІРёРґРёРј
        const mapElement = document.getElementById('map');
        if (!mapElement || mapElement.offsetWidth === 0) {
          // Р•СЃР»Рё СЌР»РµРјРµРЅС‚ РЅРµ РіРѕС‚РѕРІ, Р¶РґРµРј РµС‰Рµ РЅРµРјРЅРѕРіРѕ
          setTimeout(initMap, 500);
          return;
        }

        window.ymaps.ready(() => {
          try {
            // РљРѕРѕСЂРґРёРЅР°С‚С‹ Р‘РёСЂРѕР±РёРґР¶Р°РЅР°
            const birobidzhanCoords = [48.758344, 132.887870];

            // РЎРѕР·РґР°РµРј РєР°СЂС‚Сѓ
            const map = new window.ymaps.Map('map', {
              center: birobidzhanCoords,
              zoom: 15,
              controls: ['zoomControl', 'fullscreenControl']
            });

            // Р”РѕР±Р°РІР»СЏРµРј РјРµС‚РєСѓ С‚РµС…РЅРёРєСѓРјР°
            const placemark = new window.ymaps.Placemark(birobidzhanCoords, {
              hintContent: 'РџРѕР»РёС‚РµС…РЅРёС‡РµСЃРєРёР№ С‚РµС…РЅРёРєСѓРј',
              balloonContent: 'Рі. Р‘РёСЂРѕР±РёРґР¶Р°РЅ, СѓР». РўРµС…РЅРёРєСѓРјРѕРІСЃРєР°СЏ, Рґ. 15'
            });

            map.geoObjects.add(placemark);
            setMapLoaded(true);
          } catch (error) {
            console.error('РћС€РёР±РєР° РёРЅРёС†РёР°Р»РёР·Р°С†РёРё РєР°СЂС‚С‹:', error);
            setMapError(true);
          }
        });
      }
    };

    // РќРµР±РѕР»СЊС€Р°СЏ Р·Р°РґРµСЂР¶РєР° РґР»СЏ РѕР±РµСЃРїРµС‡РµРЅРёСЏ РіРѕС‚РѕРІРЅРѕСЃС‚Рё DOM
    const timer = setTimeout(() => {
      // РџСЂРѕРІРµСЂСЏРµРј, Р·Р°РіСЂСѓР¶РµРЅ Р»Рё API РЇРЅРґРµРєСЃ.РљР°СЂС‚
      if (window.ymaps) {
        initMap();
      } else {
        // Р•СЃР»Рё API РµС‰Рµ РЅРµ Р·Р°РіСЂСѓР¶РµРЅ, Р¶РґРµРј РµРіРѕ Р·Р°РіСЂСѓР·РєРё
        const checkYmaps = setInterval(() => {
          if (window.ymaps) {
            clearInterval(checkYmaps);
            initMap();
          }
        }, 100);

        // РћС‡РёС‰Р°РµРј РёРЅС‚РµСЂРІР°Р» С‡РµСЂРµР· 10 СЃРµРєСѓРЅРґ, РµСЃР»Рё API РЅРµ Р·Р°РіСЂСѓР·РёР»СЃСЏ
        setTimeout(() => {
          clearInterval(checkYmaps);
          if (!mapLoaded) {
            setMapError(true);
          }
        }, 10000);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [mapLoaded]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Р—Р°РіСЂСѓР·РєР° РґР°РЅРЅС‹С…...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Р“РµСЂРѕРёС‡РµСЃРєР°СЏ СЃРµРєС†РёСЏ СЃ Р·Р°РіРѕР»РѕРІРєРѕРј */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-none mx-0">
          <div className="text-center">
            <FaGraduationCap className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">РђР±РёС‚СѓСЂРёРµРЅС‚Сѓ</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Р’Р°С€ РїСѓС‚СЊ Рє СѓСЃРїРµС€РЅРѕР№ РєР°СЂСЊРµСЂРµ РЅР°С‡РёРЅР°РµС‚СЃСЏ Р·РґРµСЃСЊ. РЈР·РЅР°Р№С‚Рµ РІСЃРµ Рѕ РїРѕСЃС‚СѓРїР»РµРЅРёРё РІ РџРѕР»РёС‚РµС…РЅРёС‡РµСЃРєРёР№ С‚РµС…РЅРёРєСѓРј
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* РЎРµРєС†РёСЏ РїСЂРѕС†РµСЃСЃР° РїРѕСЃС‚СѓРїР»РµРЅРёСЏ */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">РџСЂРѕС†РµСЃСЃ РїРѕСЃС‚СѓРїР»РµРЅРёСЏ</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              РџСЂРѕСЃС‚С‹Рµ С€Р°РіРё Рє РїРѕР»СѓС‡РµРЅРёСЋ РєР°С‡РµСЃС‚РІРµРЅРЅРѕРіРѕ РїСЂРѕС„РµСЃСЃРёРѕРЅР°Р»СЊРЅРѕРіРѕ РѕР±СЂР°Р·РѕРІР°РЅРёСЏ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {admissionSteps.map((step, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 animate-slide-up" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="font-semibold text-lg mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* РЎРµРєС†РёСЏ СЃ РґРѕРєСѓРјРµРЅС‚Р°РјРё Рё РІР°Р¶РЅС‹РјРё РґР°С‚Р°РјРё */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* РќРµРѕР±С…РѕРґРёРјС‹Рµ РґРѕРєСѓРјРµРЅС‚С‹ */}
          <div className="bg-white rounded-xl shadow-lg p-8 animate-slide-up animation-delay-200">
            <div className="flex items-center mb-6">
              <FaFileAlt className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">РќРµРѕР±С…РѕРґРёРјС‹Рµ РґРѕРєСѓРјРµРЅС‚С‹</h3>
            </div>

            <ul className="space-y-4 mb-8">
              {documents.map((doc) => (
                <li key={doc.id} className="flex items-start">
                  <FaCheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 leading-relaxed">{doc.title}</span>
                  {doc.description && (
                    <span className="text-gray-500 text-sm block ml-8 mt-1">{doc.description}</span>
                  )}
                </li>
              ))}
            </ul>

          </div>

          {/* Р’Р°Р¶РЅС‹Рµ РґР°С‚С‹ */}
          <div className="bg-white rounded-xl shadow-lg p-8 animate-slide-up animation-delay-400">
            <div className="flex items-center mb-6">
              <FaCalendar className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Р’Р°Р¶РЅС‹Рµ РґР°С‚С‹</h3>
            </div>

            <div className="space-y-4">
              {dates.map((item) => {
                const dateParts = item.date.split(' ');
                const dayMonth = dateParts.slice(0, 2).join(' ');
                const year = dateParts[2];
                return (
                  <div key={item.id} className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="text-center mr-6 flex-shrink-0 w-28">
                      <div className="text-blue-700 font-bold text-base leading-tight">{dayMonth}</div>
                      <div className="text-blue-600 font-semibold text-sm">{year}</div>
                    </div>
                    <div className="text-gray-700 font-medium">{item.event}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* РљРѕРЅС‚Р°РєС‚С‹ РїСЂРёРµРјРЅРѕР№ РєРѕРјРёСЃСЃРёРё Рё РєР°СЂС‚Р° */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8 mb-16 animate-slide-up animation-delay-600">
          <h3 className="text-3xl font-bold mb-8 text-center">РџСЂРёРµРјРЅР°СЏ РєРѕРјРёСЃСЃРёСЏ</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* РљРѕРЅС‚Р°РєС‚С‹ РїСЂРёРµРјРЅРѕР№ РєРѕРјРёСЃСЃРёРё */}
            <div className="space-y-6">
              {contacts
                .filter((contact) => contact.type !== 'map')
                .map((contact) => {
                const getIcon = (type: string) => {
                  switch (type) {
                    case 'phone': return <FaPhone className="w-6 h-6 text-blue-200 mr-4 flex-shrink-0" />;
                    case 'email': return <FaEnvelope className="w-6 h-6 text-blue-200 mr-4 flex-shrink-0" />;
                    case 'address': return <FaMapMarkerAlt className="w-6 h-6 text-blue-200 mr-4 mt-1 flex-shrink-0" />;
                    case 'schedule': return <FaCalendarAlt className="w-6 h-6 text-blue-200 mr-4 mt-1 flex-shrink-0" />;
                    default: return <FaPhone className="w-6 h-6 text-blue-200 mr-4 flex-shrink-0" />;
                  }
                };

                const getTitle = (type: string) => {
                  switch (type) {
                    case 'phone': return 'РўРµР»РµС„РѕРЅ';
                    case 'email': return 'Email';
                    case 'address': return 'РђРґСЂРµСЃ';
                    case 'schedule': return 'Р“СЂР°С„РёРє РїСЂРёРµРјР° РґРѕРєСѓРјРµРЅС‚РѕРІ';
                    default: return 'РљРѕРЅС‚Р°РєС‚';
                  }
                };

                return (
                  <div key={contact.id} className={`flex items-${contact.type === 'address' || contact.type === 'schedule' ? 'start' : 'center'}`}>
                    {getIcon(contact.type)}
                    <div>
                      <div className="font-semibold text-white text-lg">{getTitle(contact.type)}</div>
                      <div className="text-blue-100 whitespace-pre-line">{contact.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* РљР°СЂС‚Р° */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div id="map" className="h-96 w-full">
                {!mapLoaded && !mapError && (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Р—Р°РіСЂСѓР·РєР° РєР°СЂС‚С‹...</p>
                    </div>
                  </div>
                )}
                {mapError && (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="text-gray-400 mb-2">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <p className="text-gray-600 font-medium">РљР°СЂС‚Р° РЅРµРґРѕСЃС‚СѓРїРЅР°</p>
                      <p className="text-gray-500 text-sm mt-1">РџСЂРѕРІРµСЂСЊС‚Рµ РїРѕРґРєР»СЋС‡РµРЅРёРµ Рє РёРЅС‚РµСЂРЅРµС‚Сѓ</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* РўР°Р±Р»РёС†Р° СЃРїРµС†РёР°Р»СЊРЅРѕСЃС‚РµР№ СЃ РїР»Р°РЅРѕРј РЅР°Р±РѕСЂР° */}
        <div className="mb-16 animate-slide-up animation-delay-800">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">РЎРїРµС†РёР°Р»СЊРЅРѕСЃС‚Рё</h3>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left font-semibold">РљРѕРґ</th>
                    <th className="px-4 py-4 text-left font-semibold">РќР°РёРјРµРЅРѕРІР°РЅРёРµ СЃРїРµС†РёР°Р»СЊРЅРѕСЃС‚Рё</th>
                    <th className="px-4 py-4 text-left font-semibold">РЎСЂРѕРє РѕР±СѓС‡РµРЅРёСЏ</th>
                    <th className="px-4 py-4 text-left font-semibold">Р¤РѕСЂРјР° РѕР±СѓС‡РµРЅРёСЏ</th>
                    <th className="px-4 py-4 text-left font-semibold">РљРІР°Р»РёС„РёРєР°С†РёСЏ</th>
                    <th className="px-4 py-4 text-center font-semibold">РџР»Р°РЅ РЅР°Р±РѕСЂР°</th>
                  </tr>
                  <tr className="bg-blue-700">
                    <th colSpan={5} className="px-4 py-2"></th>
                    <th className="px-4 py-2 text-center text-sm">
                      <div className="flex justify-center gap-2">
                        <span>Р‘СЋРґР¶РµС‚</span>
                        <span>РџР»Р°С‚РЅС‹Рµ</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {specialties.map((specialty) => (
                    <tr key={specialty.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-medium text-blue-600">{specialty.code}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{specialty.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{specialty.duration}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{specialty.form}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{specialty.qualification}</td>
                      <td className="px-4 py-4 text-center">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                            {specialty.budgetPlaces ?? 0}
                          </div>
                          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                            {specialty.paidPlaces ?? 0}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Р‘Р»РѕРє РѕР±С‰РµР¶РёС‚РёСЏ */}
        {(dormitory.description || dormitory.address || dormitory.images.length > 0) && (
          <div className="mb-16 animate-slide-up animation-delay-1000">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <FaHome className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-3xl font-bold text-gray-900">РћР±С‰РµР¶РёС‚РёРµ</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* РћРїРёСЃР°РЅРёРµ Рё Р°РґСЂРµСЃ */}
                  <div className="space-y-6">
                    {dormitory.description && (
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">РЈСЃР»РѕРІРёСЏ РїСЂРѕР¶РёРІР°РЅРёСЏ</h4>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{dormitory.description}</p>
                      </div>
                    )}

                    {dormitory.address && (
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-3">РђРґСЂРµСЃ</h4>
                        <p className="text-gray-700">{dormitory.address}</p>
                      </div>
                    )}
                  </div>

                  {/* РЎР»Р°Р№РґРµСЂ РёР·РѕР±СЂР°Р¶РµРЅРёР№ */}
                  {dormitory.images.length > 0 && (
                    <div className="relative">
                      <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        className="dormitory-swiper rounded-lg overflow-hidden shadow-lg"
                      >
                        {dormitory.images.map((image, index) => (
                          <SwiperSlide key={index}>
                            <div className="aspect-video">
                              <img
                                src={image}
                                alt={`РћР±С‰РµР¶РёС‚РёРµ ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                                        <div class="text-center">
                                          <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                          </svg>
                                          <p class="text-sm">РР·РѕР±СЂР°Р¶РµРЅРёРµ РЅРµРґРѕСЃС‚СѓРїРЅРѕ</p>
                                        </div>
                                      </div>
                                    `;
                                  }
                                }}
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      <style>{`
                        .dormitory-swiper .swiper-button-prev
                        }
                      `}</style>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* РљРѕРЅС‚Р°РєС‚РЅР°СЏ РёРЅС„РѕСЂРјР°С†РёСЏ */}
        <div className="bg-blue-600 text-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">РћСЃС‚Р°Р»РёСЃСЊ РІРѕРїСЂРѕСЃС‹?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            РЎРІСЏР¶РёС‚РµСЃСЊ СЃ РЅР°С€РµР№ РїСЂРёРµРјРЅРѕР№ РєРѕРјРёСЃСЃРёРµР№ РґР»СЏ РїРѕР»СѓС‡РµРЅРёСЏ РїРѕРґСЂРѕР±РЅРѕР№ РєРѕРЅСЃСѓР»СЊС‚Р°С†РёРё
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center justify-center">
              <span className="font-semibold">РўРµР»РµС„РѕРЅ:</span>
              <span className="ml-2">{contacts.find(c => c.type === 'phone')?.value || '+7 (999) 123-45-67'}</span>
            </div>
            <div className="flex items-center justify-center">
              <span className="font-semibold">Email:</span>
              <span className="ml-2">{contacts.find(c => c.type === 'email')?.value || 'info@college.ru'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



