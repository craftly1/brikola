
import React from 'react';
import { useOrder } from '../contexts/OrderContext';
import ClientDashboard from './ClientDashboard';
import CrafterDashboard from './CrafterDashboard';
import UserTypeSelector from '../components/UserTypeSelector';

const Home: React.FC = () => {
  const { userType } = useOrder();

  if (!userType) {
    return <UserTypeSelector />;
  }

  return userType === 'client' ? <ClientDashboard /> : <CrafterDashboard />;
};

export default Home;
