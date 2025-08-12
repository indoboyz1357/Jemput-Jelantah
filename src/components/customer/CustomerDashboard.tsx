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
      <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard Customer</h1>
              <p className="opacity-90">Selamat datang, {currentUser?.name}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
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