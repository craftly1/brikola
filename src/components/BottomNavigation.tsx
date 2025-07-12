
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Package, User, Settings, Plus } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = useOrder();

  const navItems = [
    { path: '/', icon: Home, label: 'الرئيسية' },
    { path: '/orders', icon: Package, label: 'الطلبات' },
    ...(userType === 'client' ? [{ path: '/create-order', icon: Plus, label: 'طلب جديد' }] : []),
    { path: '/profile', icon: User, label: 'حسابي' },
    { path: '/settings', icon: Settings, label: 'إعدادات' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-bottom">
      <div className="flex justify-around items-center py-1 sm:py-2 px-1">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                isActive 
                  ? 'text-amber-600 bg-amber-50' 
                  : 'text-gray-600 hover:text-amber-500 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} className={`sm:w-5 sm:h-5 ${isActive ? 'text-amber-600' : 'text-gray-600'}`} />
              <span className={`text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium truncate max-w-full ${
                isActive ? 'text-amber-600' : 'text-gray-600'
              }`}>
                {label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 sm:w-8 h-0.5 bg-amber-600 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
