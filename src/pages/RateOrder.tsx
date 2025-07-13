
import React, { useState } from 'react';
import { ArrowLeft, Star, Send } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrders } from '../contexts/FirebaseOrderContext';

const RateOrder: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orders, rateOrder } = useOrders();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">الطلب غير موجود</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitRating = async () => {
    if (rating === 0) {
      alert('يرجى اختيار تقييم للحرفي');
      return;
    }

    if (!review.trim()) {
      alert('يرجى كتابة تعليق على العمل');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await rateOrder(order.id, rating, review.trim());
      alert('شكراً لك! تم إرسال التقييم بنجاح');
      navigate('/');
    } catch (error) {
      console.error('Error rating order:', error);
      alert('حدث خطأ أثناء إرسال التقييم');
    } finally {
      setIsSubmitting(false);
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
            <h1 className="text-xl font-bold text-gray-800">تقييم العمل</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-2">{order.title}</h2>
          <p className="text-gray-600 mb-4">{order.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              <p>الحرفي: <span className="font-medium text-gray-800">{order.crafterName}</span></p>
              <p>السعر: <span className="font-bold text-green-600">{order.price} ر.س</span></p>
            </div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              ✅ مكتمل
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">كيف كانت تجربتك مع الحرفي؟</h3>
          
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-4">اختر تقييمك من 1 إلى 5 نجوم</p>
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-colors hover:scale-110 transform"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 hover:text-yellow-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600">
                {rating === 1 && 'سيء جداً'}
                {rating === 2 && 'سيء'}
                {rating === 3 && 'مقبول'}
                {rating === 4 && 'جيد'}
                {rating === 5 && 'ممتاز'}
              </p>
            )}
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">اكتب تعليقك</h3>
          
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="شاركنا تجربتك مع الحرفي... كيف كانت جودة العمل؟ هل تم الالتزام بالمواعيد؟"
            rows={5}
            className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <p className="text-sm text-gray-500 mt-2">
            سيساعد تقييمك الحرفيين الآخرين على تحسين خدماتهم
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmitRating}
          disabled={rating === 0 || !review.trim() || isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري إرسال التقييم...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              إرسال التقييم
            </>
          )}
        </button>

        {/* Skip Option */}
        <button
          onClick={() => navigate('/')}
          className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm transition-colors"
        >
          تخطي التقييم الآن
        </button>
      </div>
    </div>
  );
};

export default RateOrder;
