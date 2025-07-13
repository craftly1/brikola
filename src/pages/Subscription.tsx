
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Crown, Star, Shield, Zap } from 'lucide-react';
import { useOrders } from '../contexts/FirebaseOrderContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

const Subscription: React.FC = () => {
  const navigate = useNavigate();
  const { subscription, subscribe, hasActiveSubscription } = useOrders();
  const { userProfile } = useAuth();

  const plans = [
    {
      id: 'monthly',
      name: 'العضوية الشهرية',
      price: 50,
      duration: 'شهر واحد',
      type: 'monthly' as const,
      popular: true,
      features: [
        'عرض جميع تفاصيل الطلبات',
        'التواصل مع العملاء',
        'قبول الطلبات ورفضها',
        'الدردشة المباشرة',
        'إشعارات فورية',
        'دعم فني على مدار الساعة'
      ],
      icon: <Crown className="w-6 h-6" />,
      gradient: 'from-amber-400 to-yellow-500'
    },
    {
      id: 'yearly',
      name: 'العضوية السنوية',
      price: 500,
      originalPrice: 600,
      duration: 'سنة كاملة',
      type: 'yearly' as const,
      savings: '100 ر.س',
      features: [
        'جميع مميزات العضوية الشهرية',
        'خصم 17% على السعر',
        'أولوية في عرض الطلبات',
        'تقارير شهرية مفصلة',
        'شارة "حرفي متميز"',
        'دعم فني متقدم'
      ],
      icon: <Star className="w-6 h-6" />,
      gradient: 'from-purple-500 to-indigo-600'
    }
  ];

  const handleSubscribe = (planName: string, price: number, type: 'monthly' | 'yearly') => {
    subscribe(planName, price, type);
    navigate('/orders');
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
        {/* Current Subscription */}
        {hasActiveSubscription() && subscription && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-800">الاشتراك النشط</h3>
                  <p className="text-green-600">{subscription.planName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-800 font-bold">{subscription.price} ر.س</p>
                <p className="text-sm text-green-600">
                  صالح حتى: {new Date(subscription.endDate).toLocaleDateString('ar-SA')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-2xl p-8 mb-6">
            <Crown className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">كن حرفياً مميزاً</h2>
            <p className="text-amber-100">احصل على عضوية مميزة واكسب أكثر من خلال الطلبات</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-lg mb-2 mx-auto w-fit">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-800">وصول فوري</h4>
              <p className="text-sm text-gray-600">للطلبات الجديدة</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-lg mb-2 mx-auto w-fit">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-800">تقييم مميز</h4>
              <p className="text-sm text-gray-600">من العملاء</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-lg mb-2 mx-auto w-fit">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-800">دعم متميز</h4>
              <p className="text-sm text-gray-600">24/7</p>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="space-y-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-all duration-200 ${
                plan.popular ? 'border-amber-300 relative' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    الأكثر شعبية
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${plan.gradient} text-white`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                    <p className="text-gray-600">{plan.duration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-800">{plan.price}</span>
                    <span className="text-gray-600">ر.س</span>
                  </div>
                  {plan.originalPrice && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400 line-through">{plan.originalPrice} ر.س</span>
                      <span className="text-green-600 font-medium">وفر {plan.savings}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-3">المميزات المتاحة:</h4>
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => handleSubscribe(plan.name, plan.price, plan.type)}
                disabled={hasActiveSubscription() && subscription?.type === plan.type}
                className={`w-full py-3 text-lg font-medium rounded-lg transition-colors ${
                  hasActiveSubscription() && subscription?.type === plan.type
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white'
                }`}
              >
                {hasActiveSubscription() && subscription?.type === plan.type 
                  ? 'مفعل حالياً' 
                  : 'اشترك الآن'
                }
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">الأسئلة الشائعة</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-1">متى يبدأ الاشتراك؟</h4>
              <p className="text-gray-600 text-sm">يبدأ الاشتراك فور إتمام عملية الدفع ويستمر للمدة المحددة.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">هل يمكنني إلغاء الاشتراك؟</h4>
              <p className="text-gray-600 text-sm">نعم، يمكنك إلغاء الاشتراك في أي وقت من خلال الإعدادات.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-1">ما طرق الدفع المتاحة؟</h4>
              <p className="text-gray-600 text-sm">نقبل جميع البطاقات الائتمانية والحوالات البنكية المحلية.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
