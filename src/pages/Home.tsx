
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Users, Package, User, Settings } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const mainSections = [
    {
      title: 'استفسارات',
      description: 'اطرح أسئلتك واحصل على إجابات من الخبراء',
      icon: MessageCircle,
      color: 'bg-blue-500',
      path: '/inquiries'
    },
    {
      title: 'الطلبات',
      description: 'اطلب خدمة أو عرض خدماتك',
      icon: Package,
      color: 'bg-green-500',
      path: '/orders'
    }
  ];

  const secondarySections = [
    {
      title: 'حسابي',
      description: 'إدارة الملف الشخصي',
      icon: User,
      color: 'bg-amber-500',
      path: '/profile'
    },
    {
      title: 'الإعدادات',
      description: 'تخصيص التطبيق',
      icon: Settings,
      color: 'bg-gray-500',
      path: '/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 safe-area">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-3 sm:px-4 py-4 sm:py-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-800 mb-1 sm:mb-2">كرافتلي كونيكت</h1>
            <p className="text-sm sm:text-base text-gray-600">منصة ربط الحرفيين مع العملاء</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {mainSections.map((section, index) => (
            <button
              key={index}
              onClick={() => navigate(section.path)}
              className="w-full bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                <div className={`${section.color} p-3 sm:p-4 rounded-xl`}>
                  <section.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">{section.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed px-1">{section.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Secondary Sections */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 text-center">إعدادات سريعة</h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {secondarySections.map((section, index) => (
              <button
                key={index}
                onClick={() => navigate(section.path)}
                className="bg-white rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`${section.color} p-2 sm:p-3 rounded-lg`}>
                    <section.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800">{section.title}</h4>
                    <p className="text-xs text-gray-600 hidden sm:block">{section.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 sm:mt-8">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 text-center">إجراءات سريعة</h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/create')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 sm:p-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
            >
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">➕</div>
              <div className="text-sm sm:text-base">إنشاء استفسار</div>
            </button>
            <button
              onClick={() => navigate('/inquiries')}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 sm:p-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">💬</div>
              <div className="text-sm sm:text-base">تصفح الاستفسارات</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
