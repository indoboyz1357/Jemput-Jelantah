import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Receipt, DollarSign, Users, Truck, UserCheck, Filter } from 'lucide-react';

export const BillingList: React.FC = () => {
  const { bills, customers } = useApp();
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredBills = bills.filter(bill => {
    if (typeFilter === 'all') return true;
    return bill.type === typeFilter;
  });

  const getCustomerName = (customerId?: string) => {
    if (!customerId) return '-';
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown';
  };

  const getReferrerName = (referrerId?: string) => {
    if (!referrerId) return '-';
    const referrer = customers.find(c => c.id === referrerId);
    return referrer?.name || 'Unknown';
  };

  const getBillTypeConfig = (type: string) => {
    switch (type) {
      case 'customer':
        return {
          label: 'Tagihan Customer',
          color: 'bg-blue-100 text-blue-800',
          icon: Users,
          iconColor: 'text-blue-500'
        };
      case 'kurir':
        return {
          label: 'Fee Kurir',
          color: 'bg-green-100 text-green-800',
          icon: Truck,
          iconColor: 'text-green-500'
        };
      case 'referral':
        return {
          label: 'Fee Referral',
          color: 'bg-purple-100 text-purple-800',
          icon: UserCheck,
          iconColor: 'text-purple-500'
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
          icon: Receipt,
          iconColor: 'text-gray-500'
        };
    }
  };

  const billTypeCounts = {
    all: bills.length,
    customer: bills.filter(b => b.type === 'customer').length,
    kurir: bills.filter(b => b.type === 'kurir').length,
    referral: bills.filter(b => b.type === 'referral').length
  };

  const totalAmounts = {
    customer: bills.filter(b => b.type === 'customer').reduce((sum, b) => sum + b.total, 0),
    kurir: bills.filter(b => b.type === 'kurir').reduce((sum, b) => sum + b.total, 0),
    referral: bills.filter(b => b.type === 'referral').reduce((sum, b) => sum + b.total, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500 rounded-lg p-3">
            <Receipt className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tagihan</h2>
            <p className="text-gray-600">Kelola tagihan dan pembayaran</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-blue-500" size={24} />
            <h3 className="font-semibold text-blue-800">Total Revenue</h3>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            Rp {totalAmounts.customer.toLocaleString()}
          </div>
          <div className="text-sm text-blue-600">
            {billTypeCounts.customer} tagihan customer
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="text-green-500" size={24} />
            <h3 className="font-semibold text-green-800">Total Fee Kurir</h3>
          </div>
          <div className="text-2xl font-bold text-green-900">
            Rp {totalAmounts.kurir.toLocaleString()}
          </div>
          <div className="text-sm text-green-600">
            {billTypeCounts.kurir} fee kurir
          </div>
        </div>

        <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck className="text-purple-500" size={24} />
            <h3 className="font-semibold text-purple-800">Total Fee Referral</h3>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            Rp {totalAmounts.referral.toLocaleString()}
          </div>
          <div className="text-sm text-purple-600">
            {billTypeCounts.referral} fee referral
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={20} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700 mr-2">Filter Tipe:</span>
          {[
            { value: 'all', label: 'Semua' },
            { value: 'customer', label: 'Tagihan Customer' },
            { value: 'kurir', label: 'Fee Kurir' },
            { value: 'referral', label: 'Fee Referral' }
          ].map(filter => (
            <button
              key={filter.value}
              onClick={() => setTypeFilter(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                typeFilter === filter.value
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label} ({billTypeCounts[filter.value as keyof typeof billTypeCounts]})
            </button>
          ))}
        </div>
      </div>

      {/* Bills List */}
      <div className="space-y-4">
        {filteredBills.map((bill) => {
          const typeConfig = getBillTypeConfig(bill.type);
          const TypeIcon = typeConfig.icon;

          return (
            <div key={bill.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${typeConfig.iconColor.replace('text-', 'bg-')}/10`}>
                    <TypeIcon className={typeConfig.iconColor} size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {bill.type === 'customer' && getCustomerName(bill.customerId)}
                      {bill.type === 'kurir' && 'Ahmad Kurir'}
                      {bill.type === 'referral' && `Referral: ${getReferrerName(bill.referrerId)}`}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1">
                      ID: {bill.id}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeConfig.color}`}>
                  {typeConfig.label}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Liter</div>
                  <div className="text-lg font-semibold text-gray-900">{bill.liters}L</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Rate</div>
                  <div className="text-lg font-semibold text-gray-900">
                    Rp {bill.rate.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="text-lg font-semibold text-gray-900">
                    Rp {bill.total.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Status</div>
                  <div className={`text-lg font-semibold ${bill.paid ? 'text-green-600' : 'text-red-600'}`}>
                    {bill.paid ? 'Lunas' : 'Belum Bayar'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Tanggal: {bill.createdAt.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
                {!bill.paid && (
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200">
                    Tandai Lunas
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredBills.length === 0 && (
        <div className="text-center py-12">
          <Receipt size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {typeFilter === 'all' 
              ? 'Belum ada tagihan' 
              : `Tidak ada tagihan dengan tipe "${typeFilter}"`
            }
          </p>
        </div>
      )}
    </div>
  );
};