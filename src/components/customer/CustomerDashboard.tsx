import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LogOut, Home, Plus, History, Receipt } from 'lucide-react';
import { CustomerHome } from './CustomerHome';
import { CustomerPickup } from './CustomerPickup';
import { CustomerHistory } from './CustomerHistory';
import { CustomerBills } from './CustomerBills';

export const CustomerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { currentUser, logout } = useApp();

  const tabs = [
    { id: 'home', name: 'Beranda', icon: Home },
    { id: 'pickup', name: 'Request Pickup', icon: Plus },
    { id: 'history', name: 'Riwayat', icon: History },
    { id: 'bills', name: 'Tagihan', icon: Receipt }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <CustomerHome />;
      case 'pickup':
        return <CustomerPickup />;
      case 'history':
        return <CustomerHistory />;
      case 'bills':
        return <CustomerBills />;
      default:
        return <CustomerHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-lg p-2">
                <Home className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold">Customer</h1>
                <p className="opacity-90 text-xs sm:text-sm">{currentUser?.name}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile-friendly top navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-16 sm:top-20 z-10">
        <div className="px-3 sm:px-4 py-2">
          <div className="flex overflow-x-auto scrollbar-hide gap-1 sm:gap-2">
            {tabs.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg whitespace-nowrap transition-all duration-200 min-w-0 ${
                  activeTab === id
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                <span className="font-medium text-xs sm:text-sm">{name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="p-3 sm:p-6">
        {renderActiveTab()}
      </main>
    </div>
  );
};