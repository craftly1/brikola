
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

interface OrderContextType {
  orders: Order[];
  crafters: Crafter[];
  loading: boolean;
  createOrder: (orderData: Omit<Order, 'id' | 'clientId' | 'clientName' | 'createdAt' | 'status'>) => Promise<string>;
  acceptOrder: (orderId: string) => Promise<void>;
  startOrder: (orderId: string) => Promise<void>;
  completeOrder: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string, reason?: string) => Promise<void>;
  rateOrder: (orderId: string, rating: number, review?: string) => Promise<void>;
  searchCrafters: (specialty?: string, location?: string) => Promise<Crafter[]>;
}

const OrderContext = createContext<OrderContextType | null>(null);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const FirebaseOrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [crafters, setCrafters] = useState<Crafter[]>([]);
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

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
      setOrders(ordersData);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser, userProfile]);

  // Load crafters
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
      }
    };

    loadCrafters();
  }, []);

  const createOrder = async (orderData: Omit<Order, 'id' | 'clientId' | 'clientName' | 'createdAt' | 'status'>) => {
    if (!currentUser || !userProfile) throw new Error('User not authenticated');

    const newOrder = {
      ...orderData,
      clientId: currentUser.uid,
      clientName: userProfile.name,
      status: 'pending' as OrderStatus,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'orders'), newOrder);
    return docRef.id;
  };

  const acceptOrder = async (orderId: string) => {
    if (!currentUser || !userProfile) throw new Error('User not authenticated');

    await updateDoc(doc(db, 'orders', orderId), {
      crafterId: currentUser.uid,
      crafterName: userProfile.name,
      crafterPhone: userProfile.phone,
      status: 'accepted',
      acceptedAt: new Date().toISOString()
    });
  };

  const startOrder = async (orderId: string) => {
    await updateDoc(doc(db, 'orders', orderId), {
      status: 'in_progress'
    });
  };

  const completeOrder = async (orderId: string) => {
    await updateDoc(doc(db, 'orders', orderId), {
      status: 'completed',
      completedAt: new Date().toISOString()
    });
  };

  const cancelOrder = async (orderId: string, reason?: string) => {
    await updateDoc(doc(db, 'orders', orderId), {
      status: 'cancelled',
      cancelReason: reason,
      cancelledAt: new Date().toISOString()
    });
  };

  const rateOrder = async (orderId: string, rating: number, review?: string) => {
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
      return [];
    }
  };

  const value = {
    orders,
    crafters,
    loading,
    createOrder,
    acceptOrder,
    startOrder,
    completeOrder,
    cancelOrder,
    rateOrder,
    searchCrafters
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
