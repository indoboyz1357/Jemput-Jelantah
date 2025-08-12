import React from 'react';
import { useApp } from '../../context/AppContext';
import { Receipt, Truck, CheckCircle, AlertCircle, Calendar, Droplets } from 'lucide-react';

export const KurirBills: React.FC = () => {
  const { currentUser, bills } = useApp();
  
  const myBills = bills
    .filter(bill => bill.kurirId === currentUser?.id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const totalUnpaid = myBills.filter(b => !b.paid).reduce((sum, b) => sum + b.total, 0);
  const totalPaid = myBills.filter(b => b.paid).reduce((sum, b) => sum + b.total, 0);
  const totalLiters = myBills.reduce((sum, b) => sum + b.liters, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-green-500 rounded-lg p-3">
          <Receipt className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fee Kurir</h2>
          <p className="text-gray-600">Kelola pendapatan Anda</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-orange-500" size={24} />
            <h3 className="font-semibold text-orange-800">Belum Dibayar</h3>
          </div>
          <div className="text-2xl font-bold text-orange-900">
            Rp {totalUnpaid.toLocaleString()}
          </div>
          <div className="text-sm text-orange-600">
            {myBills.filter(b => !b.paid).length} fee pending
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-green-500" size={24} />
            <h3 className="font-semibold text-green-800">Sudah Dibayar</h3>
          </div>
          <div className="text-2xl font-bold text-green-900">
            Rp {totalPaid.toLocaleString()}
          </div>
          <div className="text-sm text-green-600">
            {myBills.filter(b => b.paid).length} fee dibayar
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="text-blue-500" size={24} />
            <h3 className="font-semibold text-blue-800">Total Liter</h3>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {totalLiters}L
          </div>
          <div className="text-sm text-blue-600">
            dari {myBills.length} pickup
          </div>
        </div>
      </div>

      {myBills.length === 0 && (
        <div className="text-center py-12">
          <Receipt size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada fee kurir</p>
        </div>
      )}

      {/* Bills List */}
      <div className="space-y-4">
        {myBills.map((bill) => (
          <div key={bill.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${bill.paid ? 'bg-green-100' : 'bg-orange-100'}`}>
                  {bill.paid ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <AlertCircle className="text-orange-500" size={20} />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Fee Pickup
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Calendar size={14} />
                    {bill.createdAt.toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                bill.paid 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {bill.paid ? 'Dibayar' : 'Pending'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Droplets size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Liter</span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {bill.liters}L
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">Rate per Liter</div>
                <div className="text-lg font-semibold text-gray-900">
                  Rp {bill.rate.toLocaleString()}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">Total Fee</div>
                <div className="text-lg font-semibold text-gray-900">
                  Rp {bill.total.toLocaleString()}
                </div>
              </div>
            </div>

            {!bill.paid && (
              <div className="pt-4 border-t border-gray-100">
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-orange-800 text-sm">
                    Fee akan dibayarkan setelah konfirmasi dari admin. Hubungi admin jika ada pertanyaan.
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};