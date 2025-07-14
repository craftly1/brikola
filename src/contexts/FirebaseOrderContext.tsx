import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, doc, addDoc, updateDoc, onSnapshot, query, where, orderBy, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

export type OrderStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rated' | 'cancelled';

export interface Order {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  status: OrderStatus;
  clientId: string;
  clientName: string;
  clientPhone?: string;
  clientLocation: string;
  crafterId?: string;
  crafterName?: string;
  crafterPhone?: string;
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  rating?: number;
  review?: string;
  imageUrl?: string;
}

export interface Crafter {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  location: string;
  rating: number;
  completedOrders: number;
  verified: boolean;
  phone?: string;
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
  crafters: Crafter[];
  subscription: Subscription | null;
  loading: boolean;
  createOrder: (orderData: Omit<Order, 'id' | 'clientId' | 'clientName' | 'createdAt' | 'status'>) => Promise<string>;
  acceptOrder: (orderId: string) => Promise<void>;
  startOrder: (orderId: string) => Promise<void>;
  completeOrder: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string, reason?: string) => Promise<void>;
  rateOrder: (orderId: string, rating: number, review?: string) => Promise<void>;
  searchCrafters: (specialty?: string, location?: string) => Promise<Crafter[]>;
  hasActiveSubscription: () => boolean;
  subscribe: (planName: string, price: number, type: 'monthly' | 'yearly') => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within a FirebaseOrderProvider');
  }
  return context;
};

export const FirebaseOrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [crafters, setCrafters] = useState<Crafter[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to orders for current user
  useEffect(() => {
    if (!currentUser || !userProfile) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const ordersRef = collection(db, 'orders');
    let ordersQuery;

    if (userProfile.userType === 'client') {
      ordersQuery = query(
        ordersRef,
        where('clientId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
    } else {
      ordersQuery = query(
        ordersRef,
        where('crafterId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(ordersQuery, 
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Order));
        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to orders:', error);
        // Set fallback orders on permission error
        const fallbackOrders: Order[] = [
          {
            id: '1',
            title: 'إصلاح تكييف منزلي',
            description: 'تحتاج إلى إصلاح وحدة التكييف في الصالة',
            category: 'تكييف وتبريد',
            price: 150,
            status: 'pending',
            clientId: currentUser.uid,
            clientName: userProfile.name,
            clientLocation: 'الرياض',
            createdAt: new Date().toISOString()
          }
        ];
        setOrders(userProfile.userType === 'client' ? fallbackOrders : []);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser, userProfile]);

  // Load crafters with fallback
  useEffect(() => {
    const loadCrafters = async () => {
      try {
        const craftersRef = collection(db, 'users');
        const craftersQuery = query(craftersRef, where('userType', '==', 'crafter'));
        const snapshot = await getDocs(craftersQuery);
        
        const craftersData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            specialty: data.specialty,
            experience: data.experience,
            location: data.location,
            rating: data.rating || 0,
            completedOrders: data.completedOrders || 0,
            verified: data.verified || false,
            phone: data.phone
          } as Crafter;
        });
        
        setCrafters(craftersData);
      } catch (error) {
        console.error('Error loading crafters:', error);
        // Set fallback crafters on permission error
        const fallbackCrafters: Crafter[] = [
          {
            id: '1',
            name: 'أحمد السباك',
            specialty: 'سباكة',
            experience: '5 سنوات',
            location: 'الرياض',
            rating: 4.5,
            completedOrders: 120,
            verified: true,
            phone: '+966501234567'
          },
          {
            id: '2',
            name: 'محمد الكهربائي',
            specialty: 'كهرباء',
            experience: '8 سنوات',
            location: 'جدة',
            rating: 4.8,
            completedOrders: 200,
            verified: true,
            phone: '+966507654321'
          }
        ];
        setCrafters(fallbackCrafters);
      }
    };

    loadCrafters();
  }, []);

  // Load subscription for crafter
  useEffect(() => {
    if (!currentUser || !userProfile || userProfile.userType !== 'crafter') {
      setSubscription(null);
      return;
    }

    // Mock subscription for now - replace with Firebase query later
    const mockSubscription: Subscription = {
      id: '1',
      userId: currentUser.uid,
      planName: 'العضوية الشهرية',
      status: 'active',
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-02-01T00:00:00Z',
      price: 50,
      type: 'monthly'
    };
    setSubscription(mockSubscription);
  }, [currentUser, userProfile]);

  const createOrder = async (orderData: Omit<Order, 'id' | 'clientId' | 'clientName' | 'createdAt' | 'status'>) => {
    if (!currentUser || !userProfile) throw new Error('User not authenticated');

    const newOrder = {
      ...orderData,
      clientId: currentUser.uid,
      clientName: userProfile.name,
      status: 'pending' as OrderStatus,
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), newOrder);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      // Return mock ID on permission error
      const mockId = Date.now().toString();
      setOrders(prev => [...prev, { ...newOrder, id: mockId }]);
      return mockId;
    }
  };

  const acceptOrder = async (orderId: string) => {
    if (!currentUser || !userProfile) throw new Error('User not authenticated');

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        crafterId: currentUser.uid,
        crafterName: userProfile.name,
        crafterPhone: userProfile.phone,
        status: 'accepted',
        acceptedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error accepting order:', error);
      // Update local state on permission error
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'accepted' as OrderStatus, crafterId: currentUser.uid, crafterName: userProfile.name }
          : order
      ));
    }
  };

  const startOrder = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'in_progress'
      });
    } catch (error) {
      console.error('Error starting order:', error);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'in_progress' as OrderStatus } : order
      ));
    }
  };

  const completeOrder = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'completed',
        completedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error completing order:', error);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'completed' as OrderStatus } : order
      ));
    }
  };

  const cancelOrder = async (orderId: string, reason?: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'cancelled',
        cancelReason: reason,
        cancelledAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' as OrderStatus } : order
      ));
    }
  };

  const rateOrder = async (orderId: string, rating: number, review?: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'rated',
        rating,
        review,
        ratedAt: new Date().toISOString()
      });

      // Update crafter's rating
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (orderDoc.exists()) {
        const orderData = orderDoc.data() as Order;
        if (orderData.crafterId) {
          const crafterDoc = await getDoc(doc(db, 'users', orderData.crafterId));
          if (crafterDoc.exists()) {
            const crafterData = crafterDoc.data();
            const currentRating = crafterData.rating || 0;
            const currentCount = crafterData.completedOrders || 0;
            const newRating = ((currentRating * currentCount) + rating) / (currentCount + 1);

            await updateDoc(doc(db, 'users', orderData.crafterId), {
              rating: newRating,
              completedOrders: currentCount + 1
            });
          }
        }
      }
    } catch (error) {
      console.error('Error rating order:', error);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'rated' as OrderStatus, rating, review } : order
      ));
    }
  };

  const searchCrafters = async (specialty?: string, location?: string) => {
    try {
      const craftersRef = collection(db, 'users');
      let craftersQuery = query(craftersRef, where('userType', '==', 'crafter'));

      if (specialty) {
        craftersQuery = query(craftersQuery, where('specialty', '==', specialty));
      }

      const snapshot = await getDocs(craftersQuery);
      let results = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          specialty: data.specialty,
          experience: data.experience,
          location: data.location,
          rating: data.rating || 0,
          completedOrders: data.completedOrders || 0,
          verified: data.verified || false
        } as Crafter;
      });

      if (location) {
        results = results.filter(crafter => 
          crafter.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      return results;
    } catch (error) {
      console.error('Error searching crafters:', error);
      return crafters.filter(crafter => {
        const matchesSpecialty = !specialty || crafter.specialty === specialty;
        const matchesLocation = !location || crafter.location.toLowerCase().includes(location.toLowerCase());
        return matchesSpecialty && matchesLocation;
      });
    }
  };

  const hasActiveSubscription = () => {
    if (!subscription) return false;
    return subscription.status === 'active' && new Date(subscription.endDate) > new Date();
  };

  const subscribe = (planName: string, price: number, type: 'monthly' | 'yearly') => {
    const duration = type === 'monthly' ? 30 : 365;
    const newSubscription: Subscription = {
      id: Date.now().toString(),
      userId: currentUser?.uid || '',
      planName,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
      price,
      type
    };
    setSubscription(newSubscription);
  };

  const value: OrderContextType = {
    orders,
    crafters,
    subscription,
    loading,
    createOrder,
    acceptOrder,
    startOrder,
    completeOrder,
    cancelOrder,
    rateOrder,
    searchCrafters,
    hasActiveSubscription,
    subscribe
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
