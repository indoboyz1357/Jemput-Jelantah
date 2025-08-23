import React from 'react';
import { useApp } from '../../context/hooks';
import { Users, Truck, TrendingUp, DollarSign } from 'lucide-react';

export const Summary: React.FC = () => {
  const { customers, pickupRequests, bills } = useApp();

  const totalCustomers = customers.length;
  const totalPickups = pickupRequests.length;
  const completedPickups = pickupRequests.filter(p => p.status === 'completed').length;
  const onProcessPickups = pickupRequests.filter(p => p.status === 'on-process').length;
  const pendingPickups = pickupRequests.filter(p => p.status === 'request').length;
  
  const totalRevenue = bills.filter(b => b.type === 'customer').reduce((sum, b) => sum + b.total, 0);
  const totalKurirFees = bills.filter(b => b.type === 'kurir').reduce((sum, b) => sum + b.total, 0);
  const totalReferralFees = bills.filter(b => b.type === 'referral').reduce((sum, b) => sum + b.total, 0);
  
  const totalLiters = customers.reduce((sum, c) => sum + c.totalLiters, 0);
  
  const summaryCards = [
    {
      title: 'Total Customer',
      value: totalCustomers,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Pickup',
      value: totalPickups,
      icon: Truck,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Liter Terkumpul',
      value: `${totalLiters}L`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Revenue',
      value: `Rp ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  const statusCards = [
    {
      title: 'Request Baru',
      value: pendingPickups,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Sedang Proses',
      value: onProcessPickups,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Selesai',
      value: completedPickups,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ringkasan Dashboard</h2>
        
        {/* Main Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <div key={index} className={`${card.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${card.textColor} mb-1`}>
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.color} rounded-lg p-3`}>
                  <card.icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pickup Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Pickup</h3>
            <div className="space-y-4">
              {statusCards.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="font-medium text-gray-700">{status.title}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.textColor}`}>
                    {status.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Keuangan</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                <span className="font-medium text-gray-700">Total Revenue</span>
                <span className="text-green-600 font-semibold">
                  Rp {totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                <span className="font-medium text-gray-700">Fee Kurir</span>
                <span className="text-blue-600 font-semibold">
                  Rp {totalKurirFees.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
                <span className="font-medium text-gray-700">Fee Referral</span>
                <span className="text-purple-600 font-semibold">
                  Rp {totalReferralFees.toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Net Profit</span>
                  <span className="text-lg font-bold text-gray-900">
                    Rp {(totalRevenue - totalKurirFees - totalReferralFees).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};