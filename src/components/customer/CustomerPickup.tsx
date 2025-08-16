import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Truck, AlertCircle } from 'lucide-react';

export const CustomerPickup: React.FC = () => {
  const { currentUser, createPickupRequest, pickupRequests } = useApp();
  const [estimatedLiters, setEstimatedLiters] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const myPendingPickups = pickupRequests.filter(
    p => p.customerId === currentUser?.id && p.status !== 'completed'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!estimatedLiters || parseInt(estimatedLiters) < 1) {
      alert('Mohon masukkan estimasi liter yang valid');
      return;
    }

    if (currentUser) {
      createPickupRequest(currentUser.id, parseInt(estimatedLiters));
      setEstimatedLiters('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-3">
          <Plus className="text-white" size={20} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Request Pickup</h2>
          <p className="text-sm sm:text-base text-gray-600">Buat permintaan penjemputan limbah</p>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="bg-green-500 rounded-full p-1">
              <Plus className="text-white" size={16} />
            </div>
            <p className="text-sm sm:text-base text-green-800 font-medium">
              Request pickup berhasil dibuat! Tim kami akan segera menghubungi Anda.
            </p>
          </div>
        </div>
      )}

      {/* Pending Pickups Alert */}
      {myPendingPickups.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-orange-500 mt-0.5" size={20} />
            <div>
              <h3 className="text-sm sm:text-base text-orange-800 font-medium mb-1">
                Anda memiliki {myPendingPickups.length} pickup yang sedang diproses
              </h3>
              <p className="text-orange-700 text-xs sm:text-sm">
                Mohon tunggu pickup yang ada selesai sebelum membuat request baru.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Request Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Estimasi Liter Limbah Cair
            </label>
            <input
              type="number"
              value={estimatedLiters}
              onChange={(e) => setEstimatedLiters(e.target.value)}
              placeholder="Masukkan estimasi liter"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              min="1"
              required
            />
            <p className="mt-2 text-xs sm:text-sm text-gray-500">
              Masukkan perkiraan jumlah liter limbah cair yang akan dijemput
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">Informasi Tarif:</h3>
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <p>• Tarif pickup: Rp 6.000 per liter (40-99L)</p>
              <p>• Tarif pickup: Rp 6.500 per liter (100L+)</p>
              <p>• Pembayaran dilakukan setelah pickup selesai</p>
              <p>• Tarif dihitung berdasarkan liter aktual yang dijemput</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={myPendingPickups.length > 0}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium text-base"
          >
            {myPendingPickups.length > 0 ? 'Ada Pickup yang Sedang Diproses' : 'Buat Request Pickup'}
          </button>
        </form>
      </div>

      {/* Current Pending Pickups */}
      {myPendingPickups.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Truck size={20} />
            Pickup Aktif
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {myPendingPickups.map(pickup => (
              <React.Fragment key={pickup.id}>
                <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm sm:text-base font-medium text-gray-900">
                      Estimasi: {pickup.estimatedLiters}L
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Dibuat: {pickup.createdAt.toLocaleDateString('id-ID')}
                    </div>
                  </div>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                    pickup.status === 'request' 
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {pickup.status === 'request' ? 'Menunggu' : 'Sedang Diproses'}
                  </span>
                </div>

                {pickup.status === 'completed' && pickup.actualLiters && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs sm:text-sm text-blue-600 mb-1">Total Tagihan</div>
                    <div className="text-base sm:text-lg font-semibold text-blue-800">
                      Rp {(pickup.actualLiters * (
                        pickup.actualLiters >= 200 ? 7000 : 
                        pickup.actualLiters >= 100 ? 6500 : 6000
                      )).toLocaleString()}
                <p>• Tarif pickup: Rp 6.500 per liter (100-199L)</p>
                <p>• Tarif pickup: Rp 7.000 per liter (200L+)</p>
                  </div>
                )}
              </div>

              {pickup.kurirName && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-xs sm:text-sm text-gray-600">
                    <span className="font-medium">Kurir:</span> {pickup.kurirName}
                  </div>
                  {pickup.completedAt && (
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                      <span className="font-medium">Selesai pada:</span> {pickup.completedAt.toLocaleString('id-ID')}
                    </div>
                  )}
                </div>
              )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};