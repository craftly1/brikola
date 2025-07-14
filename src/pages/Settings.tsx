
import React from 'react';
import { Bell, Shield, HelpCircle, Info, LogOut } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">الإعدادات</h1>
        </div>
      </div>

      {/* Settings Options */}
      <div className="px-4 py-6 space-y-3">
        <button className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center space-x-4 space-x-reverse hover:shadow-md transition-shadow">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 text-right">
            <h3 className="font-medium text-gray-800">الإشعارات</h3>
            <p className="text-sm text-gray-500">إدارة إشعاراتك</p>
          </div>
        </button>

        <button className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center space-x-4 space-x-reverse hover:shadow-md transition-shadow">
          <div className="p-2 bg-green-100 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 text-right">
            <h3 className="font-medium text-gray-800">الخصوصية والأمان</h3>
            <p className="text-sm text-gray-500">إعدادات الخصوصية</p>
          </div>
        </button>

        <button className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center space-x-4 space-x-reverse hover:shadow-md transition-shadow">
          <div className="p-2 bg-purple-100 rounded-lg">
            <HelpCircle className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1 text-right">
            <h3 className="font-medium text-gray-800">المساعدة والدعم</h3>
            <p className="text-sm text-gray-500">الحصول على المساعدة</p>
          </div>
        </button>

        <button className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center space-x-4 space-x-reverse hover:shadow-md transition-shadow">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Info className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1 text-right">
            <h3 className="font-medium text-gray-800">حول التطبيق</h3>
            <p className="text-sm text-gray-500">معلومات التطبيق</p>
          </div>
        </button>

        <button className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center space-x-4 space-x-reverse hover:shadow-md transition-shadow border-2 border-red-100">
          <div className="p-2 bg-red-100 rounded-lg">
            <LogOut className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1 text-right">
            <h3 className="font-medium text-red-600">تسجيل الخروج</h3>
            <p className="text-sm text-red-400">الخروج من حسابك</p>
          </div>
        </button>
      </div>

      {/* App Info */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          <div className="text-4xl mb-3">🔨</div>
          <h3 className="font-bold text-gray-800 mb-2">كرافتلي كونيكت</h3>
          <p className="text-gray-600 text-sm">الإصدار 1.0.0</p>
          <p className="text-gray-500 text-xs mt-2">منصة ربط الحرفيين مع العملاء</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
