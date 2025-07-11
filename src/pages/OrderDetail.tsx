
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Star, Lock, MapPin, Phone, User, Clock, CheckCircle, X } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';
import { Button } from '../components/ui/button';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, userType, hasActiveSubscription, updateOrderStatus } = useOrder();
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  
  const order = orders.find(o => o.id === id);
  
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">الطلب غير موجود</h2>
          <Button onClick={() => navigate('/orders')}>العودة للطلبات</Button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'accepted':
      case 'in-progress':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <X className="w-5 h-5 text-red-500" />;
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

  const handleAcceptOrder = () => {
    updateOrderStatus(order.id, 'accepted', 'currentCrafter', 'الحرفي الحالي');
  };

  const handleRejectOrder = () => {
    updateOrderStatus(order.id, 'rejected');
  };

  const handleStartWork = () => {
    updateOrderStatus(order.id, 'in-progress');
  };

  const handleCompleteOrder = () => {
    updateOrderStatus(order.id, 'completed');
  };

  const isDetailsLocked = userType === 'crafter' && !hasActiveSubscription() && order.status === 'pending';

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
            <h1 className="text-lg font-bold text-gray-800">تفاصيل الطلب</h1>
            <div className="w-9" />
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Status Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              <span className="font-medium text-gray-800">{getStatusText(order.status)}</span>
            </div>
            <span className="text-2xl font-bold text-amber-600">{order.price} ر.س</span>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-2">{order.title}</h2>
          <p className="text-gray-600 mb-4">{order.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="bg-gray-100 px-3 py-1 rounded-lg">{order.category}</span>
            <span>{new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
          </div>
        </div>

        {/* Client Details - Locked for unpaid crafters */}
        {isDetailsLocked ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-dashed border-gray-300">
            <div className="text-center py-8">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-700 mb-2">تفاصيل العميل مقفلة</h3>
              <p className="text-gray-500 mb-6">يتطلب اشتراك نشط لعرض تفاصيل العميل والتفاعل مع الطلب</p>
              <Button 
                onClick={() => navigate('/subscription')}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                🔒 الاشتراك لعرض التفاصيل
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">معلومات العميل</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{order.clientName}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <a href={`tel:${order.clientPhone}`} className="text-blue-600">
                  {order.clientPhone}
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{order.clientLocation}</span>
              </div>
            </div>
          </div>
        )}

        {/* Rating Section */}
        {order.rating && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">التقييم</h3>
            <div className="flex items-center gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < order.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-lg font-medium text-gray-700">({order.rating})</span>
            </div>
            {order.review && (
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{order.review}</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {!isDetailsLocked && (
          <div className="space-y-3">
            {/* Crafter Actions */}
            {userType === 'crafter' && order.status === 'pending' && (
              <div className="flex gap-3">
                <Button
                  onClick={handleRejectOrder}
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                >
                  رفض الطلب
                </Button>
                <Button
                  onClick={handleAcceptOrder}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                >
                  قبول الطلب
                </Button>
              </div>
            )}

            {userType === 'crafter' && order.status === 'accepted' && (
              <Button
                onClick={handleStartWork}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                بدء العمل
              </Button>
            )}

            {userType === 'crafter' && order.status === 'in-progress' && (
              <Button
                onClick={handleCompleteOrder}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                إنهاء العمل
              </Button>
            )}

            {/* Client Actions */}
            {userType === 'client' && order.status === 'completed' && !order.rating && (
              <Button
                onClick={() => navigate(`/rate-order/${order.id}`)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              >
                تقييم الحرفي
              </Button>
            )}

            {/* Chat Button */}
            {(order.status === 'accepted' || order.status === 'in-progress') && (
              <Button
                onClick={() => navigate(`/chat/${order.id}`)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                {order.hasUnreadMessages && userType === 'client' ? 'رسائل جديدة' : 'الدردشة'}
                {order.hasUnreadMessages && (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
