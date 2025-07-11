
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Users, Wrench, ArrowLeft } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'استفسارات',
      description: 'اطرح أسئلتك واحصل على إجابات من الخبراء',
      icon: MessageCircle,
      color: 'bg-blue-500',
      path: '/inquiries'
    },
    {
      title: 'حرفيون',
      description: 'ابحث عن أفضل الحرفيين في منطقتك',
      icon: Users,
      color: 'bg-green-500',
      path: '/inquiries'
    },
    {
      title: 'الخدمات',
      description: 'تصفح جميع الخدمات المتاحة',
      icon: Wrench,
      color: 'bg-amber-500',
      path: '/inquiries'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-amber-800 mb-2">كرافتلي كونيكت</h1>
            <p className="text-gray-600">منصة ربط الحرفيين مع العملاء</p>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🔨</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">أهلاً بك</h2>
            <p className="text-gray-600">ابدأ رحلتك في العثور على أفضل الحرفيين أو عرض خدماتك</p>
          </div>
        </div>

        {/* Main Sections */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => navigate(section.path)}
              className="w-full bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className={`${section.color} p-3 rounded-xl`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-bold text-gray-800">{section.title}</h3>
                    <p className="text-gray-600 text-sm">{section.description}</p>
                  </div>
                </div>
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">إجراءات سريعة</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/create')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="text-2xl mb-2">➕</div>
              إنشاء استفسار
            </button>
            <button
              onClick={() => navigate('/inquiries')}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="text-2xl mb-2">💬</div>
              تصفح الاستفسارات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
