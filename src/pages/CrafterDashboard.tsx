
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Shield, Package, Clock, MessageCircle, Star, Eye, User } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';

const CrafterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders, hasActiveSubscription, subscription } = useOrder();
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'discussion' | 'active'>('all');

  // فلترة الطلبات حسب الحرفي
  const availableOrders = orders.filter(order => 
    order.status === 'pending' || 
    (order.crafterId === 'currentCrafter' && ['open-for-discussion', 'accepted', 'waiting-client-approval', 'in-progress', 'completed'].includes(order.status))
  );

  const filteredOrders = availableOrders.filter(order => {
    switch (activeFilter) {
      case 'pending':
        return order.status === 'pending';
      case 'discussion':
        return order.status === 'open-for-discussion';
      case 'active':
        return ['accepted', 'waiting-client-approval', 'in-progress'].includes(order.status);
      default:
        return true;
    }
  });

  // إحصائيات الحرفي
  const crafterStats = {
    totalOrders: orders.filter(o => o.crafterId === 'currentCrafter' && o.status === 'completed').length,
    activeOrders: orders.filter(o => o.crafterId === 'currentCrafter' && ['open-for-discussion', 'accepted', 'waiting-client-approval', 'in-progress'].includes(o.status)).length,
    averageRating: orders.filter(o => o.crafterId === 'currentCrafter' && o.rating).reduce((acc, o) => acc + (o.rating || 0), 0) / orders.filter(o => o.crafterId === 'currentCrafter' && o.rating).length || 0,
    pendingOrders: orders.filter(o => o.status === 'pending').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'open-for-discussion':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'waiting-client-approval':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'طلب جديد';
      case 'open-for-discussion':
        return 'جاري النقاش';
      case 'waiting-client-approval':
        return 'انتظار موافقة العميل';
      case 'in-progress':
        return 'قيد التنفيذ';
      case 'completed':
        return 'مكتمل';
      default:
        return status;
    }
  };

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
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-800">لوحة الحرفي</h1>
              {hasActiveSubscription() && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                  <Crown className="w-4 h-4" />
                  <span>مميز</span>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate('/subscription')}
              className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
            >
              <Crown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Subscription Status */}
        {subscription && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-amber-600" />
              <div>
                <h3 className="font-bold text-amber-800">{subscription.planName}</h3>
                <p className="text-sm text-amber-600">
                  صالح حتى: {new Date(subscription.endDate).toLocaleDateString('ar-SA')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* إحصائيات الحرفي */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <Package className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{crafterStats.totalOrders}</div>
            <div className="text-sm text-gray-600">طلب مكتمل</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{crafterStats.activeOrders}</div>
            <div className="text-sm text-gray-600">طلب نشط</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{crafterStats.averageRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">متوسط التقييم</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <Eye className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{crafterStats.pendingOrders}</div>
            <div className="text-sm text-gray-600">طلب جديد</div>
          </div>
        </div>

        {/* Subscription Notice */}
        {!hasActiveSubscription() && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="text-center">
              <Crown className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="font-bold text-amber-800 mb-2">اشترك الآن لعرض تفاصيل الطلبات</h3>
              <p className="text-amber-700 text-sm mb-4">
                احصل على إمكانية عرض تفاصيل الطلبات والتفاعل مع العملاء
              </p>
              <button
                onClick={() => navigate('/subscription')}
                className="bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
              >
                عرض خطط الاشتراك
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex space-x-2 space-x-reverse overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'جميع الطلبات' },
            { key: 'pending', label: 'طلبات جديدة' },
            { key: 'discussion', label: 'جاري النقاش' },
            { key: 'active', label: 'طلبات نشطة' }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === filter.key
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{order.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{order.description}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded-lg">{order.category}</span>
                  <span>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="text-lg font-bold text-blue-600">{order.price} ر.س</div>
              </div>

              {order.clientName && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <User className="w-4 h-4" />
                  <span>العميل: {order.clientName}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/order/${order.id}`)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  عرض التفاصيل
                </button>
                
                {(order.status === 'open-for-discussion' || order.status === 'waiting-client-approval' || order.status === 'in-progress') && (
                  <button
                    onClick={() => navigate(`/chat/${order.id}`)}
                    className="px-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {order.hasUnreadMessages && (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد طلبات</h3>
            <p className="text-gray-500">لا توجد طلبات متاحة في هذا القسم حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrafterDashboard;
