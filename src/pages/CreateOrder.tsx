
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, MapPin } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const { addOrder } = useOrder();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    clientName: 'العميل الحالي', // سيتم الحصول عليه من المصادقة
    clientPhone: '+966501234567', // سيتم الحصول عليه من المصادقة
    clientLocation: ''
  });

  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'نجارة',
    'سباكة',
    'كهرباء',
    'تكييف',
    'صباغة',
    'بلاط وسيراميك',
    'تنظيف',
    'صيانة عامة',
    'أخرى'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // في التطبيق الحقيقي، سيتم رفع الصور للخادم
      // هنا سنحاكي عملية الرفع
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category || !formData.price) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    
    try {
      addOrder({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseInt(formData.price),
        status: 'pending',
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        clientLocation: formData.clientLocation,
        images: images.length > 0 ? images : undefined
      });

      // إظهار رسالة نجاح
      alert('تم إنشاء الطلب بنجاح! سيتم إشعار الحرفيين المناسبين.');
      navigate('/orders');
    } catch (error) {
      alert('حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.');
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
              onClick={() => navigate('/orders')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-800">إنشاء طلب جديد</h1>
            <div className="w-9" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Service Title */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
            عنوان الخدمة المطلوبة *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="مثال: إصلاح دولاب المطبخ"
            className="w-full"
            required
          />
        </div>

        {/* Category */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 block">
            نوع الخدمة *
          </Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          >
            <option value="">اختر نوع الخدمة</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
            وصف تفصيلي للخدمة *
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="اشرح التفاصيل والمشكلة بوضوح..."
            rows={4}
            className="w-full resize-none"
            required
          />
        </div>

        {/* Price */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2 block">
            الميزانية المتوقعة (ريال سعودي) *
          </Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="مثال: 150"
            className="w-full"
            min="1"
            required
          />
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-2 block">
            الموقع
          </Label>
          <div className="relative">
            <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              id="location"
              value={formData.clientLocation}
              onChange={(e) => handleInputChange('clientLocation', e.target.value)}
              placeholder="المدينة أو الحي"
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Images Upload */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            صور توضيحية (اختياري)
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-4">اضغط لرفع صور توضيحية</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              اختيار صور
            </Button>
          </div>
          
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`صورة ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 text-lg font-medium"
        >
          {isSubmitting ? 'جار الإرسال...' : 'نشر الطلب'}
        </Button>

        <p className="text-xs text-gray-500 text-center px-4">
          بنشر هذا الطلب، سيتم إشعار الحرفيين المناسبين في منطقتك
        </p>
      </form>
    </div>
  );
};

export default CreateOrder;
