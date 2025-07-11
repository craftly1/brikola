
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Order {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected' | 'in-progress' | 'completed';
  price: number;
  category: string;
  createdAt: string;
  clientName: string;
  clientPhone: string;
  clientLocation: string;
  crafterId?: string;
  crafterName?: string;
  rating?: number;
  review?: string;
  images?: string[];
  hasUnreadMessages?: boolean;
}

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'location';
}

export interface Subscription {
  id: string;
  userId: string;
  planName: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  price: number;
}

interface OrderContextType {
  orders: Order[];
  messages: Message[];
  subscription: Subscription | null;
  userType: 'client' | 'crafter';
  setUserType: (type: 'client' | 'crafter') => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], crafterId?: string, crafterName?: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  rateOrder: (orderId: string, rating: number, review: string) => void;
  hasActiveSubscription: () => boolean;
  subscribe: (planName: string, price: number) => void;
  sendNotification: (title: string, message: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// بيانات تجريبية
const mockOrders: Order[] = [
  {
    id: '1',
    title: 'إصلاح دولاب المطبخ',
    description: 'أحتاج نجار لإصلاح دولاب المطبخ المكسور',
    status: 'pending',
    price: 150,
    category: 'نجارة',
    createdAt: '2024-01-15T10:00:00Z',
    clientName: 'أحمد محمد',
    clientPhone: '+966501234567',
    clientLocation: 'الرياض، المملكة العربية السعودية'
  },
  {
    id: '2',
    title: 'تركيب مكيف هواء',
    description: 'مطلوب فني تكييف لتركيب مكيف جديد',
    status: 'in-progress',
    price: 300,
    category: 'تكييف',
    createdAt: '2024-01-14T15:30:00Z',
    clientName: 'فاطمة علي',
    clientPhone: '+966507654321',
    clientLocation: 'جدة، المملكة العربية السعودية',
    crafterId: 'crafter1',
    crafterName: 'محمد النجار',
    hasUnreadMessages: true
  },
  {
    id: '3',
    title: 'صباغة غرفة النوم',
    description: 'صباغة غرفة نوم بلون أبيض',
    status: 'completed',
    price: 200,
    category: 'صباغة',
    createdAt: '2024-01-10T09:15:00Z',
    clientName: 'سارة أحمد',
    clientPhone: '+966509876543',
    clientLocation: 'الدمام، المملكة العربية السعودية',
    crafterId: 'crafter2',
    crafterName: 'يوسف الصباغ',
    rating: 5,
    review: 'عمل ممتاز وسريع'
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    orderId: '2',
    senderId: 'client1',
    senderName: 'فاطمة علي',
    content: 'متى يمكنك البدء في العمل؟',
    timestamp: '2024-01-14T16:00:00Z',
    status: 'read',
    type: 'text'
  },
  {
    id: '2',
    orderId: '2',
    senderId: 'crafter1',
    senderName: 'محمد النجار',
    content: 'يمكنني البدء غداً صباحاً إن شاء الله',
    timestamp: '2024-01-14T16:30:00Z',
    status: 'delivered',
    type: 'text'
  }
];

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [userType, setUserType] = useState<'client' | 'crafter'>('client');

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    
    // إرسال إشعار للحرفيين
    sendNotification('طلب جديد', `طلب جديد: ${newOrder.title}`);
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], crafterId?: string, crafterName?: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status, crafterId, crafterName }
        : order
    ));
    
    // إرسال إشعار
    const statusText = {
      'accepted': 'تم قبول الطلب',
      'rejected': 'تم رفض الطلب',
      'in-progress': 'بدء تنفيذ الطلب',
      'completed': 'تم إنجاز الطلب'
    }[status];
    
    if (statusText) {
      sendNotification('تحديث الطلب', statusText);
    }
  };

  const addMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [newMessage, ...prev]);
    
    // تحديث حالة الرسائل غير المقروءة
    setOrders(prev => prev.map(order => 
      order.id === messageData.orderId
        ? { ...order, hasUnreadMessages: true }
        : order
    ));
    
    // إرسال إشعار
    sendNotification('رسالة جديدة', `رسالة من ${messageData.senderName}`);
  };

  const rateOrder = (orderId: string, rating: number, review: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, rating, review }
        : order
    ));
    
    // إرسال إشعار للحرفي
    sendNotification('تقييم جديد', `تم تقييمك بـ ${rating} نجوم`);
  };

  const hasActiveSubscription = () => {
    if (!subscription) return false;
    return subscription.status === 'active' && new Date(subscription.endDate) > new Date();
  };

  const subscribe = (planName: string, price: number) => {
    const newSubscription: Subscription = {
      id: Date.now().toString(),
      userId: 'currentUser',
      planName,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // شهر واحد
      price
    };
    setSubscription(newSubscription);
    
    sendNotification('اشتراك مفعل', `تم تفعيل اشتراك ${planName}`);
  };

  const sendNotification = (title: string, message: string) => {
    console.log('Notification:', { title, message });
    // هنا يتم دمج Firebase Cloud Messaging
  };

  return (
    <OrderContext.Provider value={{
      orders,
      messages,
      subscription,
      userType,
      setUserType,
      addOrder,
      updateOrderStatus,
      addMessage,
      rateOrder,
      hasActiveSubscription,
      subscribe,
      sendNotification
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
