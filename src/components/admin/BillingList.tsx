import React, { useState } from 'react';
import { useApp } from '../../context/hooks';
import { Receipt, Search, Upload, Check, Clock, AlertCircle } from 'lucide-react';

export const BillingList: React.FC = () => {
  const { bills, updateBillStatus, uploadPaymentProof } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingBillId, setUploadingBillId] = useState<string | null>(null);

  const filteredBills = bills.filter(bill =>
    bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.id.includes(searchTerm)
  );

  const handlePaymentProofUpload = async (billId: string, file: File) => {
    setUploadingBillId(billId);
    try {
      await uploadPaymentProof(billId, file);
      await updateBillStatus(billId, 'paid');
    } catch (error) {
      console.error('Error uploading payment proof:', error);
    } finally {
      setUploadingBillId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <Check className="text-green-500" size={16} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={16} />;
      default:
        return <AlertCircle className="text-red-500" size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Sudah Dibayar';
      case 'pending':
        return 'Belum Dibayar';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 rounded-lg p-2 sm:p-3">
            <Receipt className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tagihan</h2>
            <p className="text-sm sm:text-base text-gray-600">Kelola pembayaran tagihan</p>
          </div>
        </div>
        <div className="bg-green-50 px-3 sm:px-4 py-2 rounded-lg">
          <span className="text-green-600 font-semibold text-sm sm:text-base">
            Total: {bills.length} tagihan
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari tagihan berdasarkan nama customer..."
            className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Bills List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredBills.map((bill) => (
          <div key={bill.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {bill.customerName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">ID: {bill.id}</p>
                  </div>
                  <div className={`px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 ${getStatusColor(bill.status)}`}>
                    {getStatusIcon(bill.status)}
                    <span className="text-xs sm:text-sm font-medium">{getStatusText(bill.status)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-blue-600">
                      {bill.totalLiters}L
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Total Liter</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-green-600">
                      Rp {bill.amount.toLocaleString('id-ID')}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Total Tagihan</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-purple-600">
                      {bill.pricePerLiter.toLocaleString('id-ID')}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Per Liter</div>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-gray-500">
                  Tanggal: {bill.createdAt.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>

              {/* Payment Proof Upload */}
              {bill.status === 'pending' && (
                <div className="w-full sm:w-auto">
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handlePaymentProofUpload(bill.id, file);
                        }
                      }}
                      className="hidden"
                      disabled={uploadingBillId === bill.id}
                    />
                    <div className={`
                      flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm sm:text-base
                      ${uploadingBillId === bill.id 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                      }
                    `}>
                      <Upload size={16} />
                      {uploadingBillId === bill.id ? 'Uploading...' : 'Upload Bukti Bayar'}
                    </div>
                  </label>
                </div>
              )}

              {/* Payment Proof Display */}
              {bill.status === 'paid' && bill.paymentProofUrl && (
                <div className="w-full sm:w-32">
                  <img
                    src={bill.paymentProofUrl}
                    alt="Bukti Pembayaran"
                    className="w-full h-20 sm:h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <p className="text-xs text-center text-gray-500 mt-1">Bukti Pembayaran</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBills.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <Receipt size={40} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm sm:text-base">
            {searchTerm ? 'Tidak ada tagihan yang sesuai dengan pencarian' : 'Belum ada data tagihan'}
          </p>
        </div>
      )}
    </div>
  );
};