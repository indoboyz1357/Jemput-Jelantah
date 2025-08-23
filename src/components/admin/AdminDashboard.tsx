import React, { useState } from 'react';
import { useApp } from '../../context/hooks';
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
      <header className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-lg p-2">
                <Receipt className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="opacity-90 text-sm">{currentUser?.name}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile-friendly top navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-2">
          <div className="flex overflow-x-auto scrollbar-hide gap-2">
            {tabs.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-purple-50 text-purple-600 border border-purple-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="p-4 sm:p-6">
        {renderActiveTab()}
      </main>
    </div>
  );
};