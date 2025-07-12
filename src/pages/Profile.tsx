
import React from 'react';
import { ArrowLeft, User, Phone, MapPin, Star, Calendar, Package, Crown, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { userType, orders, subscription, hasActiveSubscription } = useOrder();

  const userOrders = userType === 'client' 
    ? orders.filter(order => order.clientName === 'أحمد محمد') // Mock data
    : orders.filter(order => order.crafterId === 'crafter1'); // Mock data

  const completedOrders = userOrders.filter(order => order.status === 'completed');
  const averageRating = completedOrders.reduce((acc, order) => acc + (order.rating || 0), 0) / completedOrders.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">الملف الشخصي</h1>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">
                {userType === 'client' ? 'أحمد محمد' : 'محمد النجار'}
              </h2>
              <p className="text-gray-600">
                {userType === 'client' ? 'عميل' : 'حرفي نجارة'}
              </p>
              {userType === 'crafter' && averageRating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">{averageRating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="w-5 h-5" />
              <span>+966501234567</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>الرياض، المملكة العربية السعودية</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>عضو منذ يناير 2024</span>
            </div>
          </div>
        </div>

        {/* Subscription Card for Crafters */}
        {userType === 'crafter' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">الاشتراك</h3>
              <Crown className="w-6 h-6 text-amber-500" />
            </div>
            
            {hasActiveSubscription() && subscription ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">الخطة الحالية:</span>
                  <span className="font-medium text-green-600">{subscription.planName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">تاريخ الانتهاء:</span>
                  <span className="font-medium">{new Date(subscription.endDate).toLocaleDateString('ar-SA')}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-3">لا يوجد اشتراك نشط</p>
                <button
                  onClick={() => navigate('/subscription')}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  عرض الخطط
                </button>
              </div>
            )}
          </div>
        )}

        {/* Statistics Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">الإحصائيات</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {userOrders.length}
              </div>
              <div className="text-sm text-blue-600">
                {userType === 'client' ? 'إجمالي الطلبات' : 'الطلبات المتقدم عليها'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {completedOrders.length}
              </div>
              <div className="text-sm text-green-600">الطلبات المكتملة</div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">الطلبات الأخيرة</h3>
          
          {userOrders.length > 0 ? (
            <div className="space-y-3">
              {userOrders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{order.title}</h4>
                    <p className="text-sm text-gray-600">{order.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{order.price} ر.س</div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>لا توجد طلبات حتى الآن</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
