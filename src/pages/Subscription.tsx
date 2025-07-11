
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Crown, Star, Zap } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';
import { Button } from '../components/ui/button';

const Subscription: React.FC = () => {
  const navigate = useNavigate();
  const { subscribe, subscription, hasActiveSubscription } = useOrder();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'الأساسي',
      price: 29,
      duration: 'شهر',
      icon: Star,
      color: 'bg-blue-500',
      features: [
        'عرض تفاصيل الطلبات',
        'التواصل مع العملاء',
        'حتى 20 طلب شهرياً',
        'دعم فني أساسي'
      ]
    },
    {
      id: 'premium',
      name: 'المميز',
      price: 79,
      duration: '3 أشهر',
      icon: Crown,
      color: 'bg-amber-500',
      popular: true,
      features: [
        'جميع مميزات الأساسي',
        'أولوية في عرض الملف الشخصي',
        'طلبات غير محدودة',
        'إحصائيات مفصلة',
        'دعم فني على مدار الساعة'
      ]
    },
    {
      id: 'professional',
      name: 'الاحترافي',
      price: 149,
      duration: '6 أشهر',
      icon: Zap,
      color: 'bg-purple-500',
      features: [
        'جميع مميزات المميز',
        'شارة الحرفي المحترف',
        'تسويق مجاني للخدمات',
        'تحليلات متقدمة',
        'مدير حساب مخصص'
      ]
    }
  ];

  const handleSubscribe = async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    setIsProcessing(true);
    setSelectedPlan(planId);

    try {
      // محاكاة عملية الدفع
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      subscribe(plan.name, plan.price);
      alert(`تم تفعيل اشتراك ${plan.name} بنجاح!`);
      navigate('/orders');
    } catch (error) {
      alert('حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
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
            <h1 className="text-lg font-bold text-gray-800">خطط الاشتراك</h1>
            <div className="w-9" />
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Current Subscription Status */}
        {hasActiveSubscription() && subscription && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-green-800">اشتراك نشط</h3>
                <p className="text-sm text-green-600">
                  خطة {subscription.planName} - تنتهي في {new Date(subscription.endDate).toLocaleDateString('ar-SA')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header Text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">اختر خطتك المناسبة</h2>
          <p className="text-gray-600">
            فعّل اشتراكك للوصول لجميع الطلبات والتواصل مع العملاء
          </p>
        </div>

        {/* Plans */}
        <div className="space-y-4 mb-8">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const isSelected = selectedPlan === plan.id;
            const isProcessingThis = isProcessing && isSelected;
            
            return (
              <div
                key={plan.id}
                className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all ${
                  plan.popular ? 'border-amber-300 ring-2 ring-amber-100' : 'border-gray-100'
                }`}
              >
                {plan.popular && (
                  <div className="bg-amber-500 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                    الأكثر شعبية
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${plan.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                      <p className="text-gray-500 text-sm">{plan.duration}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold text-gray-800">{plan.price}</div>
                    <div className="text-sm text-gray-500">ريال</div>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing || hasActiveSubscription()}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-amber-500 hover:bg-amber-600' 
                      : 'bg-gray-800 hover:bg-gray-900'
                  } text-white`}
                >
                  {isProcessingThis ? 'جار المعالجة...' : 
                   hasActiveSubscription() ? 'مفعل' : 
                   `اشترك في ${plan.name}`}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">طرق الدفع المتاحة</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">💳</div>
              <span className="text-sm text-gray-600">بطاقة ائتمان</span>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">📱</div>
              <span className="text-sm text-gray-600">محفظة رقمية</span>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🏦</div>
              <span className="text-sm text-gray-600">تحويل بنكي</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6 px-4">
          يمكنك إلغاء الاشتراك في أي وقت. جميع الدفعات آمنة ومشفرة.
        </p>
      </div>
    </div>
  );
};

export default Subscription;
