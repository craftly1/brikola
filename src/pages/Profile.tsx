
import React from 'react';
import { User, Edit, Star, Award, MessageCircle } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="px-4 py-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              👤
            </div>
            <h1 className="text-2xl font-bold mb-2">أحمد محمد</h1>
            <p className="text-amber-100">عضو منذ يناير 2024</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-800">5</div>
              <div className="text-sm text-gray-600">منشورات</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">23</div>
              <div className="text-sm text-gray-600">إعجابات</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">12</div>
              <div className="text-sm text-gray-600">تعليقات</div>
            </div>
          </div>
        </div>

        {/* Profile Options */}
        <div className="space-y-3">
          <button className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center space-x-4 space-x-reverse hover:shadow-md transition-shadow">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Edit className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 text-right">
              <h3 className="font-medium text-gray-800">تعديل الملف الشخصي</h3>
              <p className="text-sm text-gray-500">تحديث معلوماتك الشخصية</p>
            </div>
          </button>

          <button className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center space-x-4 space-x-reverse hover:shadow-md transition-shadow">
            <div className="p-2 bg-green-100 rounded-lg">
              <Star className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 text-right">
              <h3 className="font-medium text-gray-800">المنشورات المحفوظة</h3>
              <p className="text-sm text-gray-500">منشوراتك المفضلة</p>
            </div>
          </button>

          <button className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center space-x-4 space-x-reverse hover:shadow-md transition-shadow">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 text-right">
              <h3 className="font-medium text-gray-800">الإنجازات</h3>
              <p className="text-sm text-gray-500">شاراتك وإنجازاتك</p>
            </div>
          </button>

          <button className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center space-x-4 space-x-reverse hover:shadow-md transition-shadow">
            <div className="p-2 bg-amber-100 rounded-lg">
              <MessageCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1 text-right">
              <h3 className="font-medium text-gray-800">نشاطي</h3>
              <p className="text-sm text-gray-500">تاريخ تفاعلاتك</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
