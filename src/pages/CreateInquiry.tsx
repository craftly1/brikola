
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, X } from 'lucide-react';
import { useInquiry } from '../contexts/InquiryContext';
import Modal from '../components/Modal';

const CreateInquiry: React.FC = () => {
  const navigate = useNavigate();
  const { addInquiry } = useInquiry();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'general' | 'craftsmen'>('general');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      addInquiry({
        title: title.trim(),
        description: description.trim(),
        author: {
          name: 'أنت',
          avatar: '👤'
        },
        category,
        image: image || undefined,
        isMyPost: true
      });

      // Show success message
      setModal({
        isOpen: true,
        type: 'success',
        title: 'تم النشر بنجاح',
        message: 'تم نشر الاستفسار بنجاح! سيتم إشعارك عند وجود ردود.'
      });
      navigate('/inquiries');
    } catch (error) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'خطأ في النشر',
        message: 'حدث خطأ أثناء نشر الاستفسار. يرجى المحاولة مرة أخرى.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/inquiries')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowRight className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">إنشاء استفسار جديد</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 py-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6">
          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              نوع الاستفسار
            </label>
            <div className="flex space-x-4 space-x-reverse">
              <button
                type="button"
                onClick={() => setCategory('general')}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  category === 'general'
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">🙋‍♂️</div>
                <div className="text-sm font-medium">طلب خدمة</div>
              </button>
              <button
                type="button"
                onClick={() => setCategory('craftsmen')}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  category === 'craftsmen'
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">🧰</div>
                <div className="text-sm font-medium">عرض خدمة</div>
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              العنوان / السؤال *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={category === 'general' ? 'مثال: أحتاج نجار لإصلاح باب' : 'مثال: خدمات نجارة متاحة - خبرة 10 سنوات'}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              الوصف المفصل *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تفاصيل استفسارك هنا..."
              rows={5}
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              إضافة صورة (اختياري)
            </label>
            
            {image ? (
              <div className="relative">
                <img
                  src={image}
                  alt="صورة المنشور"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-gray-600">اضغط لإضافة صورة</span>
                  <span className="text-400 text-sm">PNG, JPG, GIF حتى 10MB</span>
                </label>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!title.trim() || !description.trim() || isSubmitting}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2 space-x-reverse">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري النشر...</span>
              </div>
            ) : (
              'نشر الاستفسار'
            )}
          </button>
        </form>

        {/* Tips */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-medium text-amber-800 mb-2">💡 نصائح للحصول على أفضل النتائج:</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• اكتب عنواناً واضحاً ومحدداً</li>
            <li>• أضف جميع التفاصيل المهمة في الوصف</li>
            <li>• أرفق صوراً إذا كانت تساعد في توضيح المطلوب</li>
            <li>• كن مهذباً واستخدم لغة واضحة ومفهومة</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateInquiry;


