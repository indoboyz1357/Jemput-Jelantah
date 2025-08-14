import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Receipt, DollarSign, Users, Truck, UserCheck, Filter, Edit2, Save, X } from 'lucide-react';

export const BillingList: React.FC = () => {
  const { bills, customers, updateBill } = useApp();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [editingBill, setEditingBill] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ liters: '', rate: '', paid: false });

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

  const handleEditBill = (bill: any) => {
    setEditingBill(bill.id);
    setEditForm({
      liters: bill.liters.toString(),
      rate: bill.rate.toString(),
      paid: bill.paid
    });
  };

  const handleSaveBill = (billId: string) => {
    const liters = parseInt(editForm.liters);
    const rate = parseInt(editForm.rate);
    const total = liters * rate;
    
    updateBill(billId, {
      liters,
      rate,
      total,
      paid: editForm.paid
    });
    
    setEditingBill(null);
  };

  const handleCancelEdit = () => {
    setEditingBill(null);
    setEditForm({ liters: '', rate: '', paid: false });
  };

  const togglePaidStatus = (billId: string, currentStatus: boolean) => {
    updateBill(billId, { paid: !currentStatus });
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
          const isEditing = editingBill === bill.id;

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

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm text-blue-600 mb-1">Liter</div>
                    <input
                      type="number"
                      value={editForm.liters}
                      onChange={(e) => setEditForm({...editForm, liters: e.target.value})}
                      className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
                      min="1"
                    />
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm text-blue-600 mb-1">Rate</div>
                    <input
                      type="number"
                      value={editForm.rate}
                      onChange={(e) => setEditForm({...editForm, rate: e.target.value})}
                      className="w-full px-2 py-1 border border-blue-300 rounded text-sm"
                      min="1"
                    />
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm text-blue-600 mb-1">Total</div>
                    <div className="text-lg font-semibold text-blue-800">
                      Rp {(parseInt(editForm.liters || '0') * parseInt(editForm.rate || '0')).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm text-blue-600 mb-1">Status</div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editForm.paid}
                        onChange={(e) => setEditForm({...editForm, paid: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm">Lunas</span>
                    </label>
                  </div>
                </div>
              ) : (
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
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-2">
                <div className="text-sm text-gray-500">
                  Tanggal: {bill.createdAt.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
                
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveBill(bill.id)}
                      className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-1"
                    >
                      <Save size={16} />
                      <span className="hidden sm:inline">Simpan</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-1"
                    >
                      <X size={16} />
                      <span className="hidden sm:inline">Batal</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditBill(bill)}
                      className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-1"
                    >
                      <Edit2 size={16} />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    {!bill.paid && (
                      <button
                        onClick={() => togglePaidStatus(bill.id, bill.paid)}
                        className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                      >
                        <span className="hidden sm:inline">Tandai Lunas</span>
                        <span className="sm:hidden">Lunas</span>
                      </button>
                    )}
                  </div>
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