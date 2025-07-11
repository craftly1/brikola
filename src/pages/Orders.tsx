
import React, { useState } from 'react';
import { ArrowLeft, Plus, Package, Clock, CheckCircle, Star, MessageCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { orders, userType, setUserType } = useOrder();
  const [activeFilter, setActiveFilter] = useState<'all' | 'my-orders' | 'pending' | 'in-progress' | 'completed'>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'accepted':
      case 'in-progress':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <CheckCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار';
      case 'accepted':
        return 'مقبول';
      case 'rejected':
        return 'مرفوض';
      case 'in-progress':
        return 'قيد التنفيذ';
      case 'completed':
        return 'مكتمل';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'accepted':
      case 'in-progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const filteredOrders = orders.filter(order => {
    switch (activeFilter) {
      case 'my-orders':
        return userType === 'client';
      case 'pending':
        return order.status === 'pending';
      case 'in-progress':
        return order.status === 'in-progress' || order.status === 'accepted';
      case 'completed':
        return order.status === 'completed';
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">الطلبات</h1>
            <button
              onClick={() => navigate('/create-order')}
              className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* User Type Toggle */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-3 sm:px-4 py-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setUserType('client')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                userType === 'client'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              عميل
            </button>
            <button
              onClick={() => setUserType('crafter')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                userType === 'crafter'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              حرفي
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-3 sm:px-4 py-3">
          <div className="flex space-x-2 space-x-reverse overflow-x-auto">
            {[
              { key: 'all', label: 'جميع الطلبات' },
              { key: 'pending', label: 'في الانتظار' },
              { key: 'in-progress', label: 'قيد التنفيذ' },
              { key: 'completed', label: 'مكتملة' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as any)}
                className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-medium whitespace-nowrap transition-all duration-200 ${
                  activeFilter === filter.key
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="px-3 sm:px-4 py-4 space-y-3 sm:space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Order Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 truncate">
                  {order.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {order.description}
                </p>
              </div>
              <div className={`px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="whitespace-nowrap">{getStatusText(order.status)}</span>
              </div>
            </div>

            {/* Order Details */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span className="bg-gray-100 px-2 py-1 rounded-lg">{order.category}</span>
              <span>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
            </div>

            {/* Client/Crafter Info */}
            {userType === 'crafter' && order.clientName && (
              <div className="text-sm text-gray-600 mb-3">
                العميل: {order.clientName}
              </div>
            )}
            {userType === 'client' && order.crafterName && (
              <div className="text-sm text-gray-600 mb-3">
                الحرفي: {order.crafterName}
              </div>
            )}

            {/* Price and Rating */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg sm:text-xl font-bold text-amber-600">
                {order.price} ر.س
              </div>
              {order.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{order.rating}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3">
              <button 
                onClick={() => navigate(`/order/${order.id}`)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                عرض التفاصيل
              </button>
              
              {(order.status === 'accepted' || order.status === 'in-progress') && (
                <button
                  onClick={() => navigate(`/chat/${order.id}`)}
                  className="px-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm sm:text-base font-medium transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  {order.hasUnreadMessages && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </button>
              )}
              
              {userType === 'client' && order.status === 'completed' && !order.rating && (
                <button
                  onClick={() => navigate(`/rate-order/${order.id}`)}
                  className="px-4 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-sm sm:text-base font-medium transition-colors"
                >
                  تقييم
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
          <Package className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">لا توجد طلبات</h3>
          <p className="text-sm sm:text-base text-gray-500 text-center mb-6">
            {userType === 'client' ? 'ابدأ بإنشاء طلب جديد' : 'لا توجد طلبات متاحة حالياً'}
          </p>
          {userType === 'client' && (
            <button
              onClick={() => navigate('/create-order')}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              إنشاء طلب جديد
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
