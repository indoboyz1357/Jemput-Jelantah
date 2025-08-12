import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LogOut, BarChart3, Zap, Users, Truck, Receipt } from 'lucide-react';
import { QuickPickup } from './QuickPickup';
import { CustomerList } from './CustomerList';
import { PickupList } from './PickupList';
import { BillingList } from './BillingList';
import { Summary } from './Summary';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const { currentUser, logout } = useApp();

  const tabs = [
    { id: 'summary', name: 'Ringkasan', icon: BarChart3 },
    { id: 'quick-pickup', name: 'Quick Pickup', icon: Zap },
    { id: 'customers', name: 'Data Customer', icon: Users },
    { id: 'pickups', name: 'Data Pickup', icon: Truck },
    { id: 'billing', name: 'Tagihan', icon: Receipt }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'summary':
        return <Summary />;
      case 'quick-pickup':
        return <QuickPickup />;
      case 'customers':
        return <CustomerList />;
      case 'pickups':
        return <PickupList />;
      case 'billing':
        return <BillingList />;
      default:
        return <Summary />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Selamat datang, {currentUser?.name}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <div className="space-y-2">
              {tabs.map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === id
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <main className="flex-1 p-6">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};