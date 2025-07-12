
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, User, Phone, MessageCircle, CheckCircle, Star, AlertCircle, Package, Wrench } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';

const OrderDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { orders, userType, openForDiscussion, updateOrderStatus, approveWorkStart } = useOrder();
  const [isApplying, setIsApplying] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">الطلب غير موجود</h2>
          <button
            onClick={() => navigate('/orders')}
            className="text-blue-500 hover:text-blue-600 font-medium"
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

  const handleAcceptOrder = async () => {
    setIsAccepting(true);
    setTimeout(() => {
      updateOrderStatus(order.id, 'waiting-client-approval', order.crafterId, order.crafterName);
      setIsAccepting(false);
    }, 1000);
  };

  const handleApproveWork = async () => {
    setIsApproving(true);
    setTimeout(() => {
      approveWorkStart(order.id);
      setIsApproving(false);
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'متاح للتقديم';
      case 'open-for-discussion':
        return 'جاري النقاش';
      case 'accepted':
        return 'تم القبول';
      case 'waiting-client-approval':
        return 'انتظار موافقة العميل';
      case 'in-progress':
        return 'قيد التنفيذ';
      case 'completed':
        return 'مكتمل';
      case 'rejected':
        return 'مرفوض';
      default:
        return status;
    }
  };

  const isMyOrder = userType === 'client' && order.clientName;
  const canApply = userType === 'crafter' && order.status === 'pending';
  const canAccept = userType === 'crafter' && order.status === 'open-for-discussion' && order.crafterId === 'crafter1';
  const canApprove = userType === 'client' && order.status === 'waiting-client-approval';
  const canChat = (order.status === 'open-for-discussion' || order.status === 'waiting-client-approval' || order.status === 'in-progress') && 
                  ((userType === 'client' && isMyOrder) || (userType === 'crafter' && order.crafterId === 'crafter1'));

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
                {getStatusText(order.status)}
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

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Apply Button for Crafters */}
            {canApply && (
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
                    <Wrench className="w-5 h-5" />
                    تقديم على الطلب
                  </>
                )}
              </button>
            )}

            {/* Accept Button for Crafters */}
            {canAccept && (
              <button
                onClick={handleAcceptOrder}
                disabled={isAccepting}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isAccepting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري القبول...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    قبول الطلب
                  </>
                )}
              </button>
            )}

            {/* Approval Button for Clients */}
            {canApprove && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-800 mb-1">موافقة مطلوبة</h3>
                    <p className="text-yellow-700 text-sm mb-3">
                      الحرفي {order.crafterName} جاهز لبدء العمل. هل توافق على البدء؟
                    </p>
                    <button
                      onClick={handleApproveWork}
                      disabled={isApproving}
                      className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      {isApproving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          جاري الموافقة...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          موافقة على البدء
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Button */}
            {canChat && (
              <button
                onClick={() => navigate(`/chat/${order.id}`)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                فتح المحادثة
                {order.hasUnreadMessages && (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </button>
            )}
          </div>
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

        {/* Crafter Info Card (if assigned) */}
        {order.crafterName && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">معلومات الحرفي</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5 text-gray-400" />
                <span className="text-gray-800">{order.crafterName}</span>
              </div>
              
              {order.rating && (
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-800">التقييم: {order.rating} نجمة</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Review Section (if completed and rated) */}
        {order.status === 'completed' && order.review && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">تقييم العمل</h3>
            
            <div className="flex items-center gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-5 h-5 ${i < (order.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
              <span className="text-gray-600 mr-2">{order.rating} من 5</span>
            </div>
            
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{order.review}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
