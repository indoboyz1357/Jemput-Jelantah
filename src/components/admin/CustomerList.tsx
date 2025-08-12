import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Users, Phone, MapPin, UserCheck, TrendingUp } from 'lucide-react';

export const CustomerList: React.FC = () => {
  const { customers } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getReferrerName = (referredBy: string | undefined) => {
    if (!referredBy) return '-';
    const referrer = customers.find(c => c.id === referredBy);
    return referrer ? referrer.name : '-';
  };

  const getDownlineNames = (downlines: string[]) => {
    if (!downlines.length) return '-';
    return downlines.map(id => {
      const downline = customers.find(c => c.id === id);
      return downline?.name || 'Unknown';
    }).join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 rounded-lg p-3">
            <Users className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Data Customer</h2>
            <p className="text-gray-600">Kelola informasi customer</p>
          </div>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg">
          <span className="text-blue-600 font-semibold">Total: {customers.length} customer</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari customer berdasarkan nama atau nomor HP..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Phone size={14} />
                  <span className="text-sm">{customer.phone}</span>
                </div>
              </div>
              <div className="bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-blue-600 text-sm font-medium">Customer</span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <MapPin size={14} className="mt-0.5 text-gray-400" />
                <span>{customer.address}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <UserCheck size={14} className="text-gray-400" />
                <span>Referral: {getReferrerName(customer.referredBy)}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {customer.totalLiters}L
                </div>
                <div className="text-xs text-gray-500">Total Liter</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {customer.downlines.length}
                </div>
                <div className="text-xs text-gray-500">Downline</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">
                  {customer.totalDownlineLiters}L
                </div>
                <div className="text-xs text-gray-500">Downline Liter</div>
              </div>
            </div>

            {/* Downlines Info */}
            {customer.downlines.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">Downlines:</div>
                <div className="text-sm text-gray-600">{getDownlineNames(customer.downlines)}</div>
              </div>
            )}

            {/* Registration Date */}
            <div className="mt-4 text-xs text-gray-500">
              Terdaftar: {customer.createdAt.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm ? 'Tidak ada customer yang sesuai dengan pencarian' : 'Belum ada data customer'}
          </p>
        </div>
      )}
    </div>
  );
};