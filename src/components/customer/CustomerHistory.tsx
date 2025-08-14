import React from 'react';
import { useApp } from '../../context/AppContext';
import { History, Calendar, Droplets, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const CustomerHistory: React.FC = () => {
  const { currentUser, pickupRequests } = useApp();
  
  const myPickups = pickupRequests
    .filter(p => p.customerId === currentUser?.id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'request':
        return {
          label: 'Menunggu Konfirmasi',
          color: 'bg-orange-100 text-orange-800',
          icon: AlertCircle,
          iconColor: 'text-orange-500'
        };
      case 'on-process':
        return {
          label: 'Sedang Diproses',
          color: 'bg-blue-100 text-blue-800',
          icon: Clock,
          iconColor: 'text-blue-500'
        };
      case 'completed':
        return {
          label: 'Selesai',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-500'
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle,
          iconColor: 'text-gray-500'
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-purple-500 rounded-lg p-3">
          <History className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Riwayat Pickup</h2>
          <p className="text-gray-600">Lihat semua aktivitas pickup Anda</p>
        </div>
      </div>

      {myPickups.length === 0 && (
        <div className="text-center py-12">
          <History size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada riwayat pickup</p>
        </div>
      )}

      <div className="space-y-4">
        {myPickups.map((pickup) => {
          const statusConfig = getStatusConfig(pickup.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div key={pickup.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${statusConfig.iconColor.replace('text-', 'bg-')}/10`}>
                    <StatusIcon className={statusConfig.iconColor} size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pickup Request
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Calendar size={14} />
                      {pickup.createdAt.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Droplets size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Estimasi Liter</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {pickup.estimatedLiters}L
                  </div>
                </div>

                {pickup.actualLiters && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle size={16} className="text-green-400" />
                      <span className="text-sm text-green-600">Liter Aktual</span>
                    </div>
                    <div className="text-lg font-semibold text-green-800">
                      {pickup.actualLiters}L
                    </div>
                  </div>
                )}

                {pickup.status === 'completed' && pickup.actualLiters && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm text-blue-600 mb-1">Total Tagihan</div>
                    <div className="text-lg font-semibold text-blue-800">
                      Rp {(pickup.actualLiters * (pickup.actualLiters >= 100 ? 6500 : 6000)).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {pickup.kurirName && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Kurir:</span> {pickup.kurirName}
                  </div>
                  {pickup.completedAt && (
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Selesai pada:</span> {pickup.completedAt.toLocaleString('id-ID')}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};