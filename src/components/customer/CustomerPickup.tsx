import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Truck, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export const CustomerPickup: React.FC = () => {
  const { user, pickups, addPickup } = useApp();
  const [estimatedLiters, setEstimatedLiters] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userPickups = pickups.filter(pickup => pickup.customerId === user?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || estimatedLiters <= 0) return;

    setIsSubmitting(true);
    try {
      await addPickup({
        customerId: user.id,
        customerName: user.name,
        customerPhone: user.phone,
        customerAddress: user.address,
        estimatedLiters,
        status: 'pending'
      });
      setEstimatedLiters(0);
      alert('Permintaan pickup berhasil dikirim!');
    } catch (error) {
      console.error('Error creating pickup:', error);
      alert('Gagal membuat permintaan pickup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'in_progress':
        return <Truck className="text-blue-500" size={16} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={16} />;
      default:
        return <AlertCircle className="text-red-500" size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'in_progress':
        return 'Sedang Proses';
      case 'pending':
        return 'Menunggu';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-blue-500 rounded-lg p-2 sm:p-3">
          <Plus className="text-white" size={20} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Request Pickup</h2>
          <p className="text-sm sm:text-base text-gray-600">Buat permintaan pickup minyak jelantah</p>
        </div>
      </div>

      {/* New Pickup Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Buat Pickup Baru</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimasi Liter Minyak Jelantah
            </label>
            <input
              type="number"
              value={estimatedLiters}
              onChange={(e) => setEstimatedLiters(parseInt(e.target.value) || 0)}
              min="1"
              required
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan estimasi liter"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimal 1 liter untuk membuat permintaan pickup
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || estimatedLiters <= 0}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
          >
            {isSubmitting ? 'Mengirim...' : 'Buat Permintaan Pickup'}
          </button>
        </form>
      </div>

      {/* Pickup History */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Riwayat Pickup</h3>
        
        {userPickups.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-xl border border-gray-100">
            <Truck size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">Belum ada riwayat pickup</p>
          </div>
        ) : (
          <div className="space-y-3">
            {userPickups.map((pickup) => (
              <div key={pickup.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                          Pickup #{pickup.id.slice(-6)}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {pickup.createdAt.toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className={`px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 ${getStatusColor(pickup.status)}`}>
                        {getStatusIcon(pickup.status)}
                        <span className="text-xs sm:text-sm font-medium">{getStatusText(pickup.status)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-lg sm:text-xl font-bold text-blue-600">
                          {pickup.estimatedLiters}L
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">Estimasi</div>
                      </div>
                      {pickup.actualLiters && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-lg sm:text-xl font-bold text-green-600">
                            {pickup.actualLiters}L
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">Aktual</div>
                        </div>
                      )}
                      {pickup.kurirName && (
                        <div className="bg-purple-50 p-3 rounded-lg col-span-2 sm:col-span-1">
                          <div className="text-sm sm:text-base font-bold text-purple-600">
                            {pickup.kurirName}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">Kurir</div>
                        </div>
                      )}
                    </div>

                    {/* Pickup Proof */}
                    {pickup.pickupProofUrl && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Bukti Pickup:</p>
                        <img
                          src={pickup.pickupProofUrl}
                          alt="Bukti Pickup"
                          className="w-full max-w-xs h-32 sm:h-40 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};