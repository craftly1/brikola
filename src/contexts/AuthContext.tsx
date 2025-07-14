
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  userType: 'client' | 'crafter';
  phone?: string;
  location?: string;
  specialty?: string;
  experience?: string;
  rating?: number;
  completedOrders?: number;
  verified?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, userType: 'client' | 'crafter', additionalData?: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, name: string, userType: 'client' | 'crafter', additionalData: any = {}) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
    
    const userDoc = {
      uid: user.uid,
      email,
      name,
      userType,
      ...additionalData,
      createdAt: new Date().toISOString(),
      verified: false,
      rating: userType === 'crafter' ? 0 : undefined,
      completedOrders: userType === 'crafter' ? 0 : undefined
    };

    try {
      await setDoc(doc(db, 'users', user.uid), userDoc);
    } catch (error) {
      console.error('Error creating user document:', error);
      // Continue with fallback profile even if Firestore write fails
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          } else {
            // Create fallback profile if document doesn't exist
            const fallbackProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              name: user.displayName || 'مستخدم',
              userType: 'client',
              verified: false
            };
            setUserProfile(fallbackProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Create fallback profile on permission error
          const fallbackProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            name: user.displayName || 'مستخدم',
            userType: 'client',
            phone: '+966501234567',
            location: 'الرياض',
            verified: false
          };
          setUserProfile(fallbackProfile);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
