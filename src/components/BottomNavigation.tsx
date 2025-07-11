
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Plus, User, Settings } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'الرئيسية' },
    { path: '/inquiries', icon: MessageCircle, label: 'استفسارات' },
    { path: '/create', icon: Plus, label: 'إنشاء' },
    { path: '/profile', icon: User, label: 'حسابي' },
    { path: '/settings', icon: Settings, label: 'إعدادات' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-amber-600 bg-amber-50' 
                  : 'text-gray-600 hover:text-amber-500 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-amber-600' : 'text-gray-600'} />
              <span className={`text-xs mt-1 font-medium ${
                isActive ? 'text-amber-600' : 'text-gray-600'
              }`}>
                {label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-amber-600 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
