import { useState, useEffect } from 'react';
import { FaGraduationCap, FaFileAlt, FaUsers, FaDownload } from 'react-icons/fa';

interface StudentService {
  id: string;
  title: string;
  description: string;
  url?: string;
  icon: string;
  order: number;
  isActive: boolean;
}

interface StudentDocument {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  category?: string;
  isActive: boolean;
  order: number;
}

interface StudentLifeItem {
  id: string;
  title: string;
  description: string;
  images: string[];
}

export default function AdminStudents() {
  const [services, setServices] = useState<StudentService[]>([]);
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    file: null as File | null
  });

  const [studentLife, setStudentLife] = useState<StudentLifeItem[]>([]);
  const [loadingStudentLife, setLoadingStudentLife] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    loadServices();
    loadDocuments();
    loadStudentLife();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch('/api/students/services/all');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/student-documents/all');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const loadStudentLife = async () => {
    try {
      const response = await fetch('/api/student-life/all');
      const data = await response.json();
      setStudentLife(data);
    } catch (error) {
      console.error('Error loading student life:', error);
    } finally {
      setLoadingStudentLife(false);
    }
  };


  const updateService = (id: string, field: string, value: unknown) => {
    setServices(services.map(service =>
      service.id === id ? { ...service, [field]: value } : service
    ));
  };

  const addService = () => {
    const newService = {
      id: `temp-${Date.now()}`,
      title: '¦Ý¦-¦-TË¦¦ TÁ¦¦TÀ¦-¦¬TÁ',
      description: '¦Þ¦¬¦¬TÁ¦-¦-¦¬¦¦ TÁ¦¦TÀ¦-¦¬TÁ¦-',
      url: '',
      icon: 'FaHome',
      order: services.length,
      isActive: true
    };
    setServices([...services, newService]);
  };

  const removeService = async (id: string) => {
    if (confirm('¦ÒTË TÃ¦-¦¦TÀ¦¦¦-TË, TÇTÂ¦- TÅ¦-TÂ¦¬TÂ¦¦ TÃ¦+¦-¦¬¦¬TÂTÌ TÍTÂ¦-TÂ TÁ¦¦TÀ¦-¦¬TÁ?')) {
      try {
        await fetch(`/api/students/services/${id}`, {
          method: 'DELETE',
        });
        setServices(services.filter(service => service.id !== id));
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('¦ÞTÈ¦¬¦-¦¦¦- ¦¬TÀ¦¬ TÃ¦+¦-¦¬¦¦¦-¦¬¦¬ TÁ¦¦TÀ¦-¦¬TÁ¦-');
      }
    }
  };

  const updateDocument = (id: string, field: string, value: unknown) => {
    setDocuments(documents.map(doc =>
      doc.id === id ? { ...doc, [field]: value } : doc
    ));
  };


  const uploadDocument = async () => {
    if (!uploadForm.file || !uploadForm.title.trim()) {
      alert('¦ß¦-¦¦¦-¦¬TÃ¦¦TÁTÂ¦-, ¦-TË¦-¦¦TÀ¦¬TÂ¦¦ TÄ¦-¦¦¦¬ ¦¬ ¦-¦-¦¦¦+¦¬TÂ¦¦ ¦-¦-¦¬¦-¦-¦-¦¬¦¦ ¦+¦-¦¦TÃ¦-¦¦¦-TÂ¦-');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description || '');

    try {
      const response = await fetch('/api/student-documents', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('¦Ô¦-¦¦TÃ¦-¦¦¦-TÂ ¦¬¦-¦¦TÀTÃ¦¦¦¦¦- TÃTÁ¦¬¦¦TÈ¦-¦-!');
        loadDocuments();
        setShowUploadForm(false);
        setUploadForm({ title: '', description: '', file: null });
      } else {
        alert('¦ÞTÈ¦¬¦-¦¦¦- ¦¬TÀ¦¬ ¦¬¦-¦¦TÀTÃ¦¬¦¦¦¦ ¦+¦-¦¦TÃ¦-¦¦¦-TÂ¦-');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('¦ÞTÈ¦¬¦-¦¦¦- ¦¬TÀ¦¬ ¦¬¦-¦¦TÀTÃ¦¬¦¦¦¦ ¦+¦-¦¦TÃ¦-¦¦¦-TÂ¦-');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const removeDocument = async (id: string) => {
    if (confirm('¦ÒTË TÃ¦-¦¦TÀ¦¦¦-TË, TÇTÂ¦- TÅ¦-TÂ¦¬TÂ¦¦ TÃ¦+¦-¦¬¦¬TÂTÌ TÍTÂ¦-TÂ ¦+¦-¦¦TÃ¦-¦¦¦-TÂ?')) {
      try {
        await fetch(`/api/student-documents/${id}`, {
          method: 'DELETE',
        });
        setDocuments(documents.filter(doc => doc.id !== id));
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('¦ÞTÈ¦¬¦-¦¦¦- ¦¬TÀ¦¬ TÃ¦+¦-¦¬¦¦¦-¦¬¦¬ ¦+¦-¦¦TÃ¦-¦¦¦-TÂ¦-');
      }
    }
  };

  const updateStudentLife = (id: string, field: string, value: unknown) => {
    setStudentLife(studentLife.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const saveStudentLifeChanges = async () => {
    setSaving(true);
    try {
      for (const item of studentLife) {
        if (item.id && !item.id.startsWith('temp-')) {
          // ¦Þ¦-¦-¦-¦-¦¬TÏ¦¦¦- TÁTÃTÉ¦¦TÁTÂ¦-TÃTÎTÉ¦¬¦¦
          await fetch(`/api/student-life/${item.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
          });
        } else {
          // ¦á¦-¦¬¦+¦-¦¦¦- ¦-¦-¦-TË¦¦
          const { id: _unused, ...itemData } = item;
          const response = await fetch('/api/student-life', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData),
          });
          const newItem = await response.json();
          item.id = newItem.id;
        }
      }
      alert('¦Ø¦¬¦-¦¦¦-¦¦¦-¦¬TÏ TÁ¦-TÅTÀ¦-¦-¦¦¦-TË TÃTÁ¦¬¦¦TÈ¦-¦-!');
      loadStudentLife();
    } catch (error) {
      console.error('Error saving student life:', error);
      alert('¦ÞTÈ¦¬¦-¦¦¦- ¦¬TÀ¦¬ TÁ¦-TÅTÀ¦-¦-¦¦¦-¦¬¦¬ ¦¬¦¬¦-¦¦¦-¦¦¦-¦¬¦¦');
    } finally {
      setSaving(false);
    }
  };

  const uploadStudentLifeImages = async (files: FileList) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch('/api/upload/student-life/images', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.filenames; // ¦Ò¦-¦¬¦-TÀ¦-TÉ¦-¦¦¦- ¦-¦-TÁTÁ¦¬¦- ¦¬¦-¦¦¦- TÄ¦-¦¦¦¬¦-¦-
      } else {
        throw new Error('¦ÞTÈ¦¬¦-¦¦¦- ¦¬¦-¦¦TÀTÃ¦¬¦¦¦¬ ¦¬¦¬¦-¦-TÀ¦-¦¦¦¦¦-¦¬¦¦');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
       
      throw error;
    }
  };

  const addStudentLife = () => {
    const newItem = {
      id: `temp-${Date.now()}`,
      title: '¦Ý¦-¦-¦-¦¦ ¦-¦¦TÀ¦-¦¬TÀ¦¬TÏTÂ¦¬¦¦',
      description: '¦Þ¦¬¦¬TÁ¦-¦-¦¬¦¦ ¦-¦¦TÀ¦-¦¬TÀ¦¬TÏTÂ¦¬TÏ',
      images: []
    };
    setStudentLife([...studentLife, newItem]);
  };

  const removeStudentLife = async (id: string) => {
    if (confirm('¦ÒTË TÃ¦-¦¦TÀ¦¦¦-TË, TÇTÂ¦- TÅ¦-TÂ¦¬TÂ¦¦ TÃ¦+¦-¦¬¦¬TÂTÌ TÍTÂ¦-TÂ TÍ¦¬¦¦¦-¦¦¦-TÂ?')) {
      try {
        await fetch(`/api/student-life/${id}`, {
          method: 'DELETE',
        });
        setStudentLife(studentLife.filter((item: StudentLifeItem) => item.id !== id));
      } catch (error) {
        console.error('Error deleting student life item:', error);
        alert('¦ÞTÈ¦¬¦-¦¦¦- ¦¬TÀ¦¬ TÃ¦+¦-¦¬¦¦¦-¦¬¦¬ TÍ¦¬¦¦¦-¦¦¦-TÂ¦-');
      }
    }
  };

  const removeImageFromItem = (itemId: string, imageIndex: number) => {
    setStudentLife(studentLife.map((item: StudentLifeItem) =>
      item.id === itemId
        ? { ...item, images: item.images.filter((_: string, index: number) => index !== imageIndex) }
        : item
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* ¦Ú¦-¦-¦¬¦¦¦- ¦-¦-¦¬¦-¦+ */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              ¦Ý¦-¦¬¦-¦+
            </button>
            <button
              onClick={() => {
                loadServices();
                loadDocuments();
                loadStudentLife();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              ¦Þ¦-¦-¦-¦-¦¬TÂTÌ
            </button>
          </div>

          {/* ¦×¦-¦¦¦-¦¬¦-¦-¦-¦¦ */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¦áTÂTÃ¦+¦¦¦-TÇ¦¦TÁ¦¦¦¬¦¦ ¦¬¦-TÀTÂ¦-¦¬ - ¦Ð¦+¦-¦¬¦-¦¬TÁTÂTÀ¦¬TÀ¦-¦-¦-¦-¦¬¦¦</h1>
            <p className="text-lg text-gray-600">¦ã¦¬TÀ¦-¦-¦¬¦¦¦-¦¬¦¦ TÁ¦¦TÀ¦-¦¬TÁ¦-¦-¦-¦¬, ¦+¦-¦¦TÃ¦-¦¦¦-TÂ¦-¦-¦¬ ¦¬ TÁTÂTÃ¦+¦¦¦-TÇ¦¦TÁ¦¦¦-¦¦ ¦¦¦¬¦¬¦-TÌTÎ</p>
          </div>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* ¦áTÂTÃ¦+¦¦¦-TÇ¦¦TÁ¦¦¦¬¦¦ TÁ¦¦TÀ¦-¦¬TÁTË */}
              <div className="bg-white shadow rounded-lg mb-8">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <FaUsers className="w-5 h-5 mr-2 text-blue-600" />
                    ¦áTÂTÃ¦+¦¦¦-TÇ¦¦TÁ¦¦¦¬¦¦ TÁ¦¦TÀ¦-¦¬TÁTË
                  </h2>
                  <button
                    onClick={addService}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    ¦Ô¦-¦-¦-¦-¦¬TÂTÌ TÁ¦¦TÀ¦-¦¬TÁ
                  </button>
                </div>
                <div className="p-6">
                  {loading ? (
                    <p className="text-gray-600">¦×¦-¦¦TÀTÃ¦¬¦¦¦- TÁ¦¦TÀ¦-¦¬TÁ¦-¦-...</p>
                  ) : (
                    <div className="space-y-6">
                      {services.map((service) => (
                        <div key={service.id} className="border rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ¦Ý¦-¦¬¦-¦-¦-¦¬¦¦ TÁ¦¦TÀ¦-¦¬TÁ¦-
                              </label>
                              <input
                                type="text"
                                value={service.title}
                                onChange={(e) => updateService(service.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ¦Ø¦¦¦-¦-¦¦¦-
                              </label>
                              <select
                                value={service.icon}
                                onChange={(e) => updateService(service.id, 'icon', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="FaHome">FaHome</option>
                                <option value="FaUtensils">FaUtensils</option>
                                <option value="FaHeart">FaHeart</option>
                                <option value="FaGraduationCap">FaGraduationCap</option>
                              </select>
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ¦Þ¦¬¦¬TÁ¦-¦-¦¬¦¦
                            </label>
                            <input
                              type="text"
                              value={service.description}
                              onChange={(e) => updateService(service.id, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              URL TÁTÁTË¦¬¦¦¦¬
                            </label>
                            <input
                              type="text"
                              value={service.url || ''}
                              onChange={(e) => updateService(service.id, 'url', e.target.value)}
                              placeholder="https://example.com"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={service.isActive}
                                onChange={(e) => updateService(service.id, 'isActive', e.target.checked)}
                                className="mr-2"
                              />
                              <label className="text-sm font-medium text-gray-700">¦Ð¦¦TÂ¦¬¦-¦¦¦-</label>
                            </div>
                            <button
                              onClick={() => removeService(service.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                            >
                              ¦ã¦+¦-¦¬¦¬TÂTÌ
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ¦Ô¦-¦¦TÃ¦-¦¦¦-TÂTË ¦¬ TÁ¦¬TÀ¦-¦-¦¦¦¬ */}
              <div className="bg-white shadow rounded-lg mb-8">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <FaFileAlt className="w-5 h-5 mr-2 text-green-600" />
                    ¦Ô¦-¦¦TÃ¦-¦¦¦-TÂTË ¦¬ TÁ¦¬TÀ¦-¦-¦¦¦¬
                  </h2>
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    ¦Ý¦-¦-TË¦¦ ¦+¦-¦¦TÃ¦-¦¦¦-TÂ
                  </button>
                </div>
                <div className="p-6">
                  {loadingDocuments ? (
                    <p className="text-gray-600">¦×¦-¦¦TÀTÃ¦¬¦¦¦- ¦+¦-¦¦TÃ¦-¦¦¦-TÂ¦-¦-...</p>
                  ) : (
                    <div className="space-y-4">
                      {/* ¦ä¦-TÀ¦-¦- ¦¬¦-¦¦TÀTÃ¦¬¦¦¦¬ ¦-¦-¦-¦-¦¦¦- ¦+¦-¦¦TÃ¦-¦¦¦-TÂ¦- */}
                      {showUploadForm && (
                        <div className="border rounded-lg p-6 bg-blue-50">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">¦×¦-¦¦TÀTÃ¦¬¦¦¦- ¦-¦-¦-¦-¦¦¦- ¦+¦-¦¦TÃ¦-¦¦¦-TÂ¦-</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ¦Ý¦-¦¬¦-¦-¦-¦¬¦¦ ¦+¦-¦¦TÃ¦-¦¦¦-TÂ¦- *
                              </label>
                              <input
                                type="text"
                                value={uploadForm.title}
                                onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="¦Ò¦-¦¦¦+¦¬TÂ¦¦ ¦-¦-¦¬¦-¦-¦-¦¬¦¦ ¦+¦-¦¦TÃ¦-¦¦¦-TÂ¦-"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ¦ä¦-¦¦¦¬ *
                              </label>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
                                onChange={handleFileSelect}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {uploadForm.file && (
                                <p className="text-sm text-gray-600 mt-1">
                                  ¦ÒTË¦-TÀ¦-¦- TÄ¦-¦¦¦¬: {uploadForm.file.name}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ¦Þ¦¬¦¬TÁ¦-¦-¦¬¦¦
                            </label>
                            <textarea
                              value={uploadForm.description}
                              onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="¦Ò¦-¦¦¦+¦¬TÂ¦¦ ¦-¦¬¦¬TÁ¦-¦-¦¬¦¦ ¦+¦-¦¦TÃ¦-¦¦¦-TÂ¦-"
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="mt-4 flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setShowUploadForm(false);
                                setUploadForm({ title: '', description: '', file: null });
                              }}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
                            >
                              ¦ÞTÂ¦-¦¦¦-¦-
                            </button>
                            <button
                              onClick={uploadDocument}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                            >
                              ¦×¦-¦¦TÀTÃ¦¬¦¬TÂTÌ
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ¦á¦¬¦¬TÁ¦-¦¦ ¦+¦-¦¦TÃ¦-¦¦¦-TÂ¦-¦- */}
                      {documents.map((doc) => (
                        <div key={doc.id} className="border rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ¦Ý¦-¦¬¦-¦-¦-¦¬¦¦
                              </label>
                              <input
                                type="text"
                                value={doc.title}
                                onChange={(e) => updateDocument(doc.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ¦à¦-¦¬¦-¦¦TÀ TÄ¦-¦¦¦¬¦-
                              </label>
                              <p className="text-sm text-gray-600 mt-2">
                                {(doc.fileSize / 1024).toFixed(1)} KB
                              </p>
                            </div>
                            <div className="flex items-end space-x-2">
                              <button
                                onClick={() => window.open(`/uploads/${doc.fileUrl}`, '_blank')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm flex items-center"
                              >
                                <FaDownload className="w-4 h-4 mr-1" />
                                ¦á¦¦¦-TÇ¦-TÂTÌ
                              </button>
                            </div>
                            <div className="flex items-end">
                              <button
                                onClick={() => removeDocument(doc.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm"
                              >
                                ¦ã¦+¦-¦¬¦¬TÂTÌ
                              </button>
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ¦Þ¦¬¦¬TÁ¦-¦-¦¬¦¦
                            </label>
                            <input
                              type="text"
                              value={doc.description || ''}
                              onChange={(e) => updateDocument(doc.id, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="mt-4 flex items-center">
                            <input
                              type="checkbox"
                              checked={doc.isActive}
                              onChange={(e) => updateDocument(doc.id, 'isActive', e.target.checked)}
                              className="mr-2"
                            />
                            <label className="text-sm font-medium text-gray-700">¦Ð¦¦TÂ¦¬¦-¦¦¦-</label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ¦áTÂTÃ¦+¦¦¦-TÇ¦¦TÁ¦¦¦-TÏ ¦¦¦¬¦¬¦-TÌ */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <FaGraduationCap className="w-5 h-5 mr-2 text-purple-600" />
                    ¦áTÂTÃ¦+¦¦¦-TÇ¦¦TÁ¦¦¦-TÏ ¦¦¦¬¦¬¦-TÌ
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={saveStudentLifeChanges}
                      disabled={saving}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-1 rounded-md text-sm"
                    >
                      {saving ? '¦á¦-TÅTÀ¦-¦-¦¦¦-¦¬¦¦...' : '¦á¦-TÅTÀ¦-¦-¦¬TÂTÌ'}
                    </button>
                    <button
                      onClick={addStudentLife}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      ¦Ô¦-¦-¦-¦-¦¬TÂTÌ
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {loadingStudentLife ? (
                    <p className="text-gray-600">¦×¦-¦¦TÀTÃ¦¬¦¦¦-...</p>
                  ) : (
                    <div className="space-y-6">
                      {studentLife.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ¦Ý¦-¦¬¦-¦-¦-¦¬¦¦ ¦-¦¦TÀ¦-¦¬TÀ¦¬TÏTÂ¦¬TÏ
                              </label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateStudentLife(item.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ¦Ø¦¬¦-¦-TÀ¦-¦¦¦¦¦-¦¬TÏ ({item.images.length})
                              </label>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={async (e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    try {
                                      const filenames = await uploadStudentLifeImages(e.target.files);
                                      updateStudentLife(item.id, 'images', [...item.images, ...filenames]);
                                      e.target.value = ''; // ¦á¦-TÀ¦-TÁ¦¬TÂTÌ input
                                    } catch (error) {
                                      console.error('Error uploading images:', error);
                                      alert('¦ÞTÈ¦¬¦-¦¦¦- ¦¬TÀ¦¬ ¦¬¦-¦¦TÀTÃ¦¬¦¦¦¦ ¦¬¦¬¦-¦-TÀ¦-¦¦¦¦¦-¦¬¦¦');
                                    }
                                  }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ¦Þ¦¬¦¬TÁ¦-¦-¦¬¦¦
                            </label>
                            <textarea
                              value={item.description}
                              onChange={(e) => updateStudentLife(item.id, 'description', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          {item.images.length > 0 && (
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                ¦×¦-¦¦TÀTÃ¦¦¦¦¦-¦-TË¦¦ ¦¬¦¬¦-¦-TÀ¦-¦¦¦¦¦-¦¬TÏ
                              </label>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {item.images.map((imageName: string, index: number) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={`/uploads/images/${imageName}`}
                                      alt={`¦Ø¦¬¦-¦-TÀ¦-¦¦¦¦¦-¦¬¦¦ ${index + 1}`}
                                      className="w-full h-20 object-cover rounded-md"
                                      onError={(e) => {
                                        e.currentTarget.src = '/placeholder-image.png';
                                      }}
                                    />
                                    <button
                                      onClick={() => removeImageFromItem(item.id, index)}
                                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                    >
                                      +×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => removeStudentLife(item.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm"
                            >
                              ¦ã¦+¦-¦¬¦¬TÂTÌ ¦-¦¦TÀ¦-¦¬TÀ¦¬TÏTÂ¦¬¦¦
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
