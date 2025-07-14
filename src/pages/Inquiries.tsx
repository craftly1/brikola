
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ThumbsUp, MessageCircle, Share2, Plus } from 'lucide-react';
import { useInquiry } from '../contexts/InquiryContext';

const Inquiries: React.FC = () => {
  const navigate = useNavigate();
  const { currentFilter, setCurrentFilter, getFilteredInquiries, toggleLike } = useInquiry();
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

  const filters = ['الأحدث', 'الأكثر تفاعلاً', 'الحرفيون فقط', 'منشوراتي'];
  const filteredInquiries = getFilteredInquiries();

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedPosts(newExpanded);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'الآن';
    if (diffInHours < 24) return `قبل ${diffInHours} ساعة`;
    return `قبل ${Math.floor(diffInHours / 24)} يوم`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowRight className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">الاستفسارات</h1>
            <button
              onClick={() => navigate('/create')}
              className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pb-4">
          <div className="flex space-x-2 space-x-reverse overflow-x-auto">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setCurrentFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  currentFilter === filter
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter === 'الأحدث' && '🕒 '}
                {filter === 'الأكثر تفاعلاً' && '🔥 '}
                {filter === 'الحرفيون فقط' && '🧰 '}
                {filter === 'منشوراتي' && '🙋‍♂️ '}
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="px-4 py-4 space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد استفسارات</h3>
            <p className="text-gray-500">كن أول من يطرح سؤالاً!</p>
            <button
              onClick={() => navigate('/create')}
              className="mt-4 bg-amber-500 text-white px-6 py-2 rounded-full font-medium hover:bg-amber-600 transition-colors"
            >
              إنشاء استفسار جديد
            </button>
          </div>
        ) : (
          filteredInquiries.map(inquiry => {
            const isExpanded = expandedPosts.has(inquiry.id);
            const shouldShowReadMore = inquiry.description.length > 100;
            const displayDescription = isExpanded || !shouldShowReadMore 
              ? inquiry.description 
              : inquiry.description.substring(0, 100) + '...';

            return (
              <div key={inquiry.id} className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow">
                {/* Author Info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="text-2xl">{inquiry.author.avatar}</div>
                    <div>
                      <h3 className="font-medium text-gray-800">{inquiry.author.name}</h3>
                      <p className="text-sm text-gray-500">{formatTimeAgo(inquiry.timestamp)}</p>
                    </div>
                  </div>
                  {inquiry.isMyPost && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                      منشوري
                    </span>
                  )}
                </div>

                {/* Content */}
                <button
                  onClick={() => navigate(`/inquiry/${inquiry.id}`)}
                  className="w-full text-right"
                >
                  <h2 className="text-lg font-bold text-gray-800 mb-2 hover:text-amber-600 transition-colors">
                    {inquiry.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    {displayDescription}
                  </p>
                </button>

                {shouldShowReadMore && (
                  <button
                    onClick={() => toggleExpanded(inquiry.id)}
                    className="text-amber-600 text-sm font-medium mb-3 hover:text-amber-700 transition-colors"
                  >
                    {isExpanded ? 'عرض أقل' : 'عرض المزيد'}
                  </button>
                )}

                {/* Image if exists */}
                {inquiry.image && (
                  <div className="mb-4">
                    <img 
                      src={inquiry.image} 
                      alt="صورة المنشور"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <button
                      onClick={() => toggleLike(inquiry.id)}
                      className={`flex items-center space-x-1 space-x-reverse px-3 py-1.5 rounded-full transition-all duration-200 ${
                        inquiry.isLiked
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${inquiry.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{inquiry.likes}</span>
                      <span className="text-sm">إعجاب</span>
                    </button>

                    <button
                      onClick={() => navigate(`/inquiry/${inquiry.id}`)}
                      className="flex items-center space-x-1 space-x-reverse text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">{inquiry.comments}</span>
                      <span className="text-sm">تعليق</span>
                    </button>
                  </div>

                  <button className="flex items-center space-x-1 space-x-reverse text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">مشاركة</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Inquiries;
