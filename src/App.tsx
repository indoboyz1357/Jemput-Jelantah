import React from 'react';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/hooks';
import { Login } from './components/Login';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { KurirDashboard } from './components/kurir/KurirDashboard';

const AppContent: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Login />;
  }

  switch (currentUser.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'customer':
      return <CustomerDashboard />;
    case 'kurir':
      return <KurirDashboard />;
    default:
      return <Login />;
  }
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;