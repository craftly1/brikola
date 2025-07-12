
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, User, Phone, MessageCircle, CheckCircle, X, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';

const OrderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { orders, userType, openForDiscussion, updateOrderStatus } = useOrder();
  const [isApplying, setIsApplying] = useState(false);
  
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">الطلب غير موجود</h2>
          <button
            onClick={() => navigate('/orders')}
            className="text-blue-500 hover:text-blue-600"
          >
            العودة للطلبات
          </button>
        </div>
      </div>
    );
  }

  const handleApply = async () => {
    setIsApplying(true);
    setTimeout(() => {
      openForDiscussion(order.id, 'crafter1', 'محمد النجار');
      setIsApplying(false);
      navigate('/');
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'open-for-discussion':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'accepted':
      case 'waiting-client-approval':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/orders')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">تفاصيل الطلب</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{order.title}</h2>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${getStatusColor(order.status)}`}>
                <Clock className="w-4 h-4" />
                متاح للتقديم
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {order.price} ر.س
            </div>
          </div>

          <p className="text-gray-600 mb-4 leading-relaxed">{order.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>الفئة: {order.category}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <MapPin className="w-4 h-4" />
            <span>{order.clientLocation}</span>
          </div>

          {/* Apply Button */}
          {userType === 'crafter' && order.status === 'pending' && (
            <button
              onClick={handleApply}
              disabled={isApplying}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isApplying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري التقديم...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  تقديم على الطلب
                </>
              )}
            </button>
          )}
        </div>

        {/* Client Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">معلومات العميل</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-gray-800">{order.clientName}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <span className="text-gray-800 font-mono">{order.clientPhone}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-800">{order.clientLocation}</span>
            </div>
          </div>
        </div>

        {/* Chat Button - if order is in discussion */}
        {order.status === 'open-for-discussion' && (
          <button
            onClick={() => navigate(`/chat/${order.id}`)}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            فتح المحادثة
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
