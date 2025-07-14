
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ThumbsUp, MessageCircle, Share2, Send } from 'lucide-react';
import { useInquiry } from '../contexts/InquiryContext';

const InquiryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { inquiries, comments, toggleLike, addComment } = useInquiry();
  const [newComment, setNewComment] = useState('');

  const inquiry = inquiries.find(i => i.id === id);
  const inquiryComments = comments.filter(c => c.inquiryId === id);

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">الاستفسار غير موجود</h2>
          <button
            onClick={() => navigate('/inquiries')}
            className="bg-amber-500 text-white px-6 py-2 rounded-full font-medium hover:bg-amber-600 transition-colors"
          >
            العودة للاستفسارات
          </button>
        </div>
      </div>
    );
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(inquiry.id, newComment.trim());
      setNewComment('');
    }
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
              onClick={() => navigate('/inquiries')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowRight className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-800">تفاصيل الاستفسار</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          {/* Author Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="text-3xl">{inquiry.author.avatar}</div>
              <div>
                <h3 className="font-bold text-gray-800">{inquiry.author.name}</h3>
                <p className="text-sm text-gray-500">{formatTimeAgo(inquiry.timestamp)}</p>
              </div>
            </div>
            {inquiry.isMyPost && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                منشوري
              </span>
            )}
          </div>

          {/* Title and Content */}
          <h1 className="text-xl font-bold text-gray-800 mb-4">{inquiry.title}</h1>
          <p className="text-gray-700 leading-relaxed mb-4">{inquiry.description}</p>

          {/* Image if exists */}
          {inquiry.image && (
            <div className="mb-4">
              <img 
                src={inquiry.image} 
                alt="صورة المنشور"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => toggleLike(inquiry.id)}
                className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-full transition-all duration-200 ${
                  inquiry.isLiked
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ThumbsUp className={`w-5 h-5 ${inquiry.isLiked ? 'fill-current' : ''}`} />
                <span className="font-medium">{inquiry.likes}</span>
                <span>إعجاب</span>
              </button>

              <div className="flex items-center space-x-2 space-x-reverse text-gray-600 px-4 py-2">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{inquiry.comments}</span>
                <span>تعليق</span>
              </div>
            </div>

            <button className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-full transition-colors">
              <Share2 className="w-5 h-5" />
              <span>مشاركة</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">التعليقات ({inquiry.comments})</h2>

          {/* Add Comment */}
          <div className="mb-6">
            <div className="flex space-x-3 space-x-reverse">
              <div className="text-2xl">👤</div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="اكتب تعليقك هنا..."
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={3}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="mt-2 bg-amber-500 text-white px-4 py-2 rounded-full font-medium hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 space-x-reverse"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال</span>
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {inquiryComments.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-gray-500">لا توجد تعليقات بعد</p>
                <p className="text-gray-400 text-sm">كن أول من يعلق!</p>
              </div>
            ) : (
              inquiryComments.map(comment => (
                <div key={comment.id} className="flex space-x-3 space-x-reverse p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl">{comment.author.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 space-x-reverse mb-1">
                      <h4 className="font-medium text-gray-800">{comment.author.name}</h4>
                      <span className="text-sm text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetail;
