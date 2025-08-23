import React from 'react';
import { useApp } from '../../context/hooks';
import { Receipt, CheckCircle, AlertCircle, Calendar, Droplets } from 'lucide-react';

export const CustomerBills: React.FC = () => {
  const { currentUser, bills } = useApp();
  
  const myBills = bills
    .filter(bill => bill.customerId === currentUser?.id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const totalUnpaid = myBills.filter(b => !b.paid).reduce((sum, b) => sum + b.total, 0);
  const totalPaid = myBills.filter(b => b.paid).reduce((sum, b) => sum + b.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-yellow-500 rounded-lg p-3">
          <Receipt className="text-white" size={20} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tagihan Saya</h2>
          <p className="text-sm sm:text-base text-gray-600">Kelola pembayaran pickup Anda</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-red-50 rounded-xl p-4 sm:p-6 border border-red-100">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-red-500" size={20} />
            <h3 className="text-sm sm:text-base font-semibold text-red-800">Belum Dibayar</h3>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-red-900">
            Rp {totalUnpaid.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-red-600">
            {myBills.filter(b => !b.paid).length} tagihan
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-4 sm:p-6 border border-green-100">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-green-500" size={20} />
            <h3 className="text-sm sm:text-base font-semibold text-green-800">Sudah Dibayar</h3>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-green-900">
            Rp {totalPaid.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-green-600">
            {myBills.filter(b => b.paid).length} tagihan
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-2">
            <Receipt className="text-blue-500" size={20} />
            <h3 className="text-sm sm:text-base font-semibold text-blue-800">Total Tagihan</h3>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-blue-900">
            Rp {(totalUnpaid + totalPaid).toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-blue-600">
            {myBills.length} tagihan
          </div>
        </div>
      </div>

      {myBills.length === 0 && (
        <div className="text-center py-12">
          <Receipt size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada tagihan</p>
        </div>
      )}

      {/* Bills List */}
      <div className="space-y-3 sm:space-y-4">
        {myBills.map((bill) => (
          <div key={bill.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${bill.paid ? 'bg-green-100' : 'bg-red-100'}`}>
                  {bill.paid ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <AlertCircle className="text-red-500" size={20} />
                  )}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Tagihan Pickup
                  </h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                    <Calendar size={14} />
                    {bill.createdAt.toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                bill.paid 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {bill.paid ? 'Lunas' : 'Belum Bayar'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Droplets size={16} className="text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-600">Liter</span>
                </div>
                <div className="text-base sm:text-lg font-semibold text-gray-900">
                  {bill.liters}L
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-gray-600 mb-1">Rate per Liter</div>
                <div className="text-base sm:text-lg font-semibold text-gray-900">
                  Rp {bill.rate.toLocaleString()}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Tagihan</div>
                <div className="text-base sm:text-lg font-semibold text-gray-900">
                  Rp {bill.total.toLocaleString()}
                </div>
              </div>
            </div>

            {!bill.paid && (
              <div className="pt-4 border-t border-gray-100">
                <div className="bg-yellow-50 rounded-lg p-3">
                  <p className="text-yellow-800 text-xs sm:text-sm">
                    Silakan hubungi admin untuk melakukan pembayaran atau transfer ke rekening yang telah ditentukan.
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