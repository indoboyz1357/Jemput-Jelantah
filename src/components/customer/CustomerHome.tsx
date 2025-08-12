import React from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { TrendingUp, Users, Droplets, Gift, Phone, MapPin, Calendar } from 'lucide-react';

export const CustomerHome: React.FC = () => {
  const { currentUser, customers, pickupRequests, bills } = useApp();
  const customer = currentUser as Customer;

  const myPickups = pickupRequests.filter(p => p.customerId === customer.id);
  const completedPickups = myPickups.filter(p => p.status === 'completed');
  const myBills = bills.filter(b => b.customerId === customer.id);
  const unpaidBills = myBills.filter(b => !b.paid);

  const referrerName = customer.referredBy 
    ? customers.find(c => c.id === customer.referredBy)?.name 
    : null;

  const downlineNames = customer.downlines.map(id => {
    const downline = customers.find(c => c.id === id);
    return downline?.name || 'Unknown';
  });

  const stats = [
    {
      title: 'Total Liter Disetor',
      value: `${customer.totalLiters}L`,
      icon: Droplets,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Jumlah Pickup',
      value: completedPickups.length,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Downline',
      value: customer.downlines.length,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Liter Downline',
      value: `${customer.totalDownlineLiters}L`,
      icon: Gift,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang!</h2>
        <p className="text-gray-600">Berikut adalah ringkasan aktivitas Anda</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${stat.textColor} mb-1`}>
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Profil</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="text-gray-400" size={18} />
              <div>
                <div className="text-sm text-gray-600">Nomor HP</div>
                <div className="font-medium text-gray-900">{customer.phone}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-gray-400 mt-0.5" size={18} />
              <div>
                <div className="text-sm text-gray-600">Alamat</div>
                <div className="font-medium text-gray-900">{customer.address}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="text-gray-400" size={18} />
              <div>
                <div className="text-sm text-gray-600">Terdaftar Sejak</div>
                <div className="font-medium text-gray-900">
                  {customer.createdAt.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Referral</h3>
          <div className="space-y-4">
            {referrerName && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Direkomendasikan oleh:</div>
                <div className="text-blue-800 font-semibold">{referrerName}</div>
              </div>
            )}
            
            {customer.downlines.length > 0 ? (
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 font-medium mb-2">
                  Downline Anda ({customer.downlines.length}):
                </div>
                <div className="space-y-1">
                  {downlineNames.map((name, index) => (
                    <div key={index} className="text-sm text-green-800">{name}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  Belum ada downline. Ajak teman untuk bergabung dan dapatkan bonus referral!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {unpaidBills.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">Tagihan Pending</h3>
          <p className="text-orange-700 text-sm mb-4">
            Anda memiliki {unpaidBills.length} tagihan yang belum dibayar
          </p>
          <div className="space-y-2">
            {unpaidBills.slice(0, 3).map(bill => (
              <div key={bill.id} className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="text-sm text-gray-700">
                  {bill.liters}L × Rp {bill.rate.toLocaleString()}
                </span>
                <span className="font-semibold text-orange-600">
                  Rp {bill.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};