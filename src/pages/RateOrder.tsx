
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

const RateOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders, rateOrder } = useOrder();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const order = orders.find(o => o.id === orderId);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('يرجى اختيار تقييم');
      return;
    }

    setIsSubmitting(true);
    
    try {
      rateOrder(orderId!, rating, review);
      alert('تم إرسال التقييم بنجاح!');
      navigate(`/order/${orderId}`);
    } catch (error) {
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
              onClick={() => navigate(`/order/${orderId}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-800">تقييم الحرفي</h1>
            <div className="w-9" />
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Order Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{order.title}</h2>
          <p className="text-gray-600 mb-3">{order.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-amber-600 font-bold text-lg">{order.price} ر.س</span>
            <span className="text-gray-500 text-sm">{order.crafterName}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Stars */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <Label className="text-lg font-medium text-gray-800 mb-4 block">
              كيف كانت تجربتك مع الحرفي؟
            </Label>
            
            <div className="flex justify-center items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <div className="text-center">
              <span className="text-lg font-medium text-gray-700">
                {rating === 0 && 'اختر تقييمك'}
                {rating === 1 && 'ضعيف جداً'}
                {rating === 2 && 'ضعيف'}
                {rating === 3 && 'متوسط'}
                {rating === 4 && 'جيد'}
                {rating === 5 && 'ممتاز'}
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <Label htmlFor="review" className="text-lg font-medium text-gray-800 mb-3 block">
              اكتب تعليقك (اختياري)
            </Label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="شاركنا تجربتك مع الحرفي..."
              rows={4}
              className="w-full resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={rating === 0 || isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 text-lg font-medium"
          >
            {isSubmitting ? 'جار الإرسال...' : 'إرسال التقييم'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RateOrder;
