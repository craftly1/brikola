
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Order {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'open-for-discussion' | 'accepted' | 'rejected' | 'waiting-client-approval' | 'in-progress' | 'completed';
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
  clientApproved?: boolean;
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
  type: 'monthly' | 'yearly';
}

interface OrderContextType {
  orders: Order[];
  messages: Message[];
  subscription: Subscription | null;
  userType: 'client' | 'crafter' | null;
  setUserType: (type: 'client' | 'crafter' | null) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], crafterId?: string, crafterName?: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  rateOrder: (orderId: string, rating: number, review: string) => void;
  hasActiveSubscription: () => boolean;
  subscribe: (planName: string, price: number, type: 'monthly' | 'yearly') => void;
  sendNotification: (title: string, message: string) => void;
  approveWorkStart: (orderId: string) => void;
  openForDiscussion: (orderId: string, crafterId: string, crafterName: string) => void;
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
    status: 'open-for-discussion',
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
    review: 'عمل ممتاز وسريع',
    clientApproved: true
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

const mockSubscription: Subscription = {
  id: '1',
  userId: 'crafter1',
  planName: 'العضوية الشهرية',
  status: 'active',
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-02-01T00:00:00Z',
  price: 50,
  type: 'monthly'
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [subscription, setSubscription] = useState<Subscription | null>(mockSubscription);
  const [userType, setUserType] = useState<'client' | 'crafter' | null>(null);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    
    sendNotification('طلب جديد', `طلب جديد: ${newOrder.title}`);
  };

  const openForDiscussion = (orderId: string, crafterId: string, crafterName: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'open-for-discussion', crafterId, crafterName }
        : order
    ));
    
    sendNotification('طلب مفتوح للنقاش', 'حرفي مهتم بطلبك ويريد مناقشة التفاصيل');
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], crafterId?: string, crafterName?: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status, crafterId, crafterName }
        : order
    ));
    
    const statusText = {
      'accepted': 'تم قبول الطلب',
      'rejected': 'تم رفض الطلب',
      'waiting-client-approval': 'في انتظار موافقة العميل',
      'in-progress': 'بدء تنفيذ الطلب',
      'completed': 'تم إنجاز الطلب'
    }[status];
    
    if (statusText) {
      sendNotification('تحديث الطلب', statusText);
    }
  };

  const approveWorkStart = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'in-progress', clientApproved: true }
        : order
    ));
    
    sendNotification('موافقة العميل', 'تم الموافقة على بداية العمل');
  };

  const addMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [newMessage, ...prev]);
    
    setOrders(prev => prev.map(order => 
      order.id === messageData.orderId
        ? { ...order, hasUnreadMessages: true }
        : order
    ));
    
    sendNotification('رسالة جديدة', `رسالة من ${messageData.senderName}`);
  };

  const rateOrder = (orderId: string, rating: number, review: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, rating, review }
        : order
    ));
    
    sendNotification('تقييم جديد', `تم تقييمك بـ ${rating} نجوم`);
  };

  const hasActiveSubscription = () => {
    if (!subscription) return false;
    return subscription.status === 'active' && new Date(subscription.endDate) > new Date();
  };

  const subscribe = (planName: string, price: number, type: 'monthly' | 'yearly') => {
    const duration = type === 'monthly' ? 30 : 365;
    const newSubscription: Subscription = {
      id: Date.now().toString(),
      userId: 'currentUser',
      planName,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
      price,
      type
    };
    setSubscription(newSubscription);
    
    sendNotification('اشتراك مفعل', `تم تفعيل اشتراك ${planName}`);
  };

  const sendNotification = (title: string, message: string) => {
    console.log('Notification:', { title, message });
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
      sendNotification,
      approveWorkStart,
      openForDiscussion
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
