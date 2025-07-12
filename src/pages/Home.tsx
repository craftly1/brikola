
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Users, Package, User, Settings, Crown, Wrench } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'client' | 'crafter' | null>(null);

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-800 mb-2">كرافتلي كونيكت</h1>
            <p className="text-gray-600">منصة ربط الحرفيين مع العملاء</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setUserType('client')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-3"
            >
              <User className="w-6 h-6" />
              <div>
                <div className="text-lg">أنا عميل</div>
                <div className="text-sm opacity-90">أبحث عن خدمات حرفية</div>
              </div>
            </button>

            <button
              onClick={() => setUserType('crafter')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-3"
            >
              <Wrench className="w-6 h-6" />
              <div>
                <div className="text-lg">أنا حرفي</div>
                <div className="text-sm opacity-90">أقدم خدمات حرفية</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const clientSections = [
    {
      title: 'لوحة العميل',
      description: 'عرض طلباتك والحرفيين المتواصلين معك',
      icon: User,
      color: 'bg-blue-500',
      path: '/client-dashboard'
    },
    {
      title: 'إنشاء طلب جديد',
      description: 'اطلب خدمة حرفية جديدة',
      icon: Package,
      color: 'bg-green-500',
      path: '/create-order'
    }
  ];

  const crafterSections = [
    {
      title: 'لوحة الحرفي',
      description: 'عرض الطلبات المتاحة وإدارة أعمالك',
      icon: Wrench,
      color: 'bg-amber-500',
      path: '/crafter-dashboard'
    },
    {
      title: 'الاشتراك',
      description: 'عرض وإدارة اشتراكك',
      icon: Crown,
      color: 'bg-purple-500',
      path: '/subscription'
    }
  ];

  const commonSections = [
    {
      title: 'استفسارات',
      description: 'اطرح أسئلتك واحصل على إجابات',
      icon: MessageCircle,
      color: 'bg-blue-500',
      path: '/inquiries'
    },
    {
      title: 'جميع الطلبات',
      description: 'عرض جميع الطلبات',
      icon: Package,
      color: 'bg-green-500',
      path: '/orders'
    }
  ];

  const mainSections = userType === 'client' ? clientSections : crafterSections;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 safe-area">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-amber-800 mb-2">كرافتلي كونيكت</h1>
              <p className="text-gray-600">
                {userType === 'client' ? 'مرحباً بك كعميل' : 'مرحباً بك كحرفي'}
              </p>
            </div>
            <button
              onClick={() => setUserType(null)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm transition-colors"
            >
              تغيير
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Main Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mainSections.map((section, index) => (
            <button
              key={index}
              onClick={() => navigate(section.path)}
              className="w-full bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`${section.color} p-4 rounded-xl`}>
                  <section.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{section.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Common Sections */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800 text-center">أقسام إضافية</h3>
          <div className="grid grid-cols-2 gap-4">
            {commonSections.map((section, index) => (
              <button
                key={index}
                onClick={() => navigate(section.path)}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`${section.color} p-3 rounded-lg`}>
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-800">{section.title}</h4>
                    <p className="text-xs text-gray-600 hidden sm:block">{section.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Profile & Settings */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="bg-gray-500 p-3 rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-base font-semibold text-gray-800">حسابي</h4>
            </div>
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="bg-gray-500 p-3 rounded-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-base font-semibold text-gray-800">الإعدادات</h4>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
