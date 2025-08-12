import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LogOut, Truck, List, Receipt } from 'lucide-react';
import { KurirPickups } from './KurirPickups';
import { KurirBills } from './KurirBills';

export const KurirDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pickups');
  const { currentUser, logout } = useApp();

  const tabs = [
    { id: 'pickups', name: 'Pickup Saya', icon: List },
    { id: 'bills', name: 'Fee Kurir', icon: Receipt }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'pickups':
        return <KurirPickups />;
      case 'bills':
        return <KurirBills />;
      default:
        return <KurirPickups />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-lg p-2">
                <Truck className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dashboard Kurir</h1>
                <p className="opacity-90">Selamat datang, {currentUser?.name}</p>
              </div>
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
                      ? 'bg-green-50 text-green-600 border-green-200'
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