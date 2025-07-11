
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Image, MapPin, Phone, Crown } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Chat: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders, messages, addMessage, userType, hasActiveSubscription } = useOrder();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const order = orders.find(o => o.id === orderId);
  const orderMessages = messages.filter(m => m.orderId === orderId);
  
  const currentUser = userType === 'client' ? 'client1' : 'crafter1';
  const currentUserName = userType === 'client' ? order?.clientName || 'العميل' : order?.crafterName || 'الحرفي';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [orderMessages]);

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    addMessage({
      orderId: orderId!,
      senderId: currentUser,
      senderName: currentUserName,
      content: newMessage,
      status: 'sent',
      type: 'text'
    });

    setNewMessage('');
  };

  const handleImageShare = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        addMessage({
          orderId: orderId!,
          senderId: currentUser,
          senderName: currentUserName,
          content: imageUrl,
          status: 'sent',
          type: 'image'
        });
      }
    };
    input.click();
  };

  const handleLocationShare = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        addMessage({
          orderId: orderId!,
          senderId: currentUser,
          senderName: currentUserName,
          content: `https://maps.google.com/?q=${latitude},${longitude}`,
          status: 'sent',
          type: 'location'
        });
      });
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // إظهار رقم الهاتف فقط بعد الموافقة
  const shouldShowPhone = order.clientApproved || order.status === 'in-progress' || order.status === 'completed';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/order/${orderId}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-lg font-bold text-gray-800">
                  {userType === 'client' ? order.crafterName : order.clientName}
                </h1>
                {userType === 'client' && hasActiveSubscription() && (
                  <Crown className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <p className="text-sm text-gray-500">{order.title}</p>
            </div>
            {shouldShowPhone ? (
              <button
                onClick={() => {
                  const phone = userType === 'client' ? order.crafterName : order.clientPhone;
                  window.open(`tel:${phone}`, '_self');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Phone className="w-5 h-5 text-green-600" />
              </button>
            ) : (
              <div className="p-2">
                <Phone className="w-5 h-5 text-gray-300" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Phone Number Notice */}
      {!shouldShowPhone && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <p className="text-yellow-800 text-sm text-center">
            سيظهر رقم الهاتف بعد الموافقة على بداية العمل
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {orderMessages.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg p-6 shadow-sm max-w-sm mx-auto">
              <h3 className="text-lg font-medium text-gray-800 mb-2">ابدأ المحادثة</h3>
              <p className="text-gray-500 text-sm">
                {order.status === 'pending' ? 
                  'يمكن للحرفي فتح المناقشة معك أولاً' : 
                  'تواصل مع الطرف الآخر لمناقشة تفاصيل الطلب'
                }
              </p>
            </div>
          </div>
        ) : (
          orderMessages.map((message) => {
            const isOwn = message.senderId === currentUser;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    isOwn
                      ? 'bg-amber-500 text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  {message.type === 'text' && (
                    <p className="text-sm">{message.content}</p>
                  )}
                  
                  {message.type === 'image' && (
                    <img
                      src={message.content}
                      alt="صورة مرفقة"
                      className="max-w-full h-auto rounded-lg"
                    />
                  )}
                  
                  {message.type === 'location' && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <a
                        href={message.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline"
                      >
                        عرض الموقع
                      </a>
                    </div>
                  )}
                  
                  <div className={`text-xs mt-1 ${isOwn ? 'text-amber-100' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      {order.status !== 'pending' && (
        <div className="bg-white border-t border-gray-200 px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleImageShare}
              className="p-2 text-gray-500 hover:text-amber-500 transition-colors"
            >
              <Image className="w-5 h-5" />
            </button>
            
            <button
              type="button"
              onClick={handleLocationShare}
              className="p-2 text-gray-500 hover:text-amber-500 transition-colors"
            >
              <MapPin className="w-5 h-5" />
            </button>
            
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب رسالتك..."
              className="flex-1"
            />
            
            <Button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-amber-500 hover:bg-amber-600 text-white p-2"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;
