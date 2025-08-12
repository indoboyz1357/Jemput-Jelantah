import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Truck, MapPin, Phone, CheckCircle, Clock, AlertCircle, User } from 'lucide-react';

export const KurirPickups: React.FC = () => {
  const { currentUser, pickupRequests, updatePickupStatus } = useApp();
  const [actualLiters, setActualLiters] = useState<{ [key: string]: string }>({});

  const myPickups = pickupRequests.filter(p => 
    p.kurirId === currentUser?.id || (p.status === 'request' && !p.kurirId)
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const pendingPickups = myPickups.filter(p => p.status === 'request');
  const onProcessPickups = myPickups.filter(p => p.status === 'on-process');
  const completedPickups = myPickups.filter(p => p.status === 'completed');

  const handleTakePickup = (pickupId: string) => {
    updatePickupStatus(pickupId, 'on-process', undefined, currentUser?.id);
  };

  const handleCompletePickup = (pickupId: string) => {
    const liters = parseInt(actualLiters[pickupId] || '0');
    if (liters > 0) {
      updatePickupStatus(pickupId, 'completed', liters, currentUser?.id);
      setActualLiters(prev => ({ ...prev, [pickupId]: '' }));
    } else {
      alert('Mohon masukkan jumlah liter aktual');
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'request':
        return {
          label: 'Tersedia',
          color: 'bg-orange-100 text-orange-800',
          icon: AlertCircle,
          iconColor: 'text-orange-500'
        };
      case 'on-process':
        return {
          label: 'Sedang Dikerjakan',
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
        <div className="bg-green-500 rounded-lg p-3">
          <Truck className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pickup Saya</h2>
          <p className="text-gray-600">Kelola tugas pickup Anda</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="text-orange-500" size={24} />
            <h3 className="font-semibold text-orange-800">Tersedia</h3>
          </div>
          <div className="text-2xl font-bold text-orange-900">
            {pendingPickups.length}
          </div>
          <div className="text-sm text-orange-600">pickup baru</div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-blue-500" size={24} />
            <h3 className="font-semibold text-blue-800">Sedang Proses</h3>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {onProcessPickups.length}
          </div>
          <div className="text-sm text-blue-600">pickup aktif</div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-green-500" size={24} />
            <h3 className="font-semibold text-green-800">Selesai</h3>
          </div>
          <div className="text-2xl font-bold text-green-900">
            {completedPickups.length}
          </div>
          <div className="text-sm text-green-600">pickup completed</div>
        </div>
      </div>

      {/* Pickups List */}
      <div className="space-y-4">
        {myPickups.map((pickup) => {
          const statusConfig = getStatusConfig(pickup.status);
          const StatusIcon = statusConfig.icon;
          const isMyPickup = pickup.kurirId === currentUser?.id;

          return (
            <div key={pickup.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${statusConfig.iconColor.replace('text-', 'bg-')}/10`}>
                    <StatusIcon className={statusConfig.iconColor} size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <User size={18} />
                      {pickup.customerName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Phone size={14} />
                        {pickup.customerPhone}
                      </div>
                      <div>
                        {pickup.createdAt.toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Estimasi Liter</div>
                  <div className="text-lg font-semibold text-gray-900">{pickup.estimatedLiters}L</div>
                </div>
                
                {pickup.actualLiters && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-sm text-green-600">Liter Aktual</div>
                    <div className="text-lg font-semibold text-green-800">{pickup.actualLiters}L</div>
                  </div>
                )}

                {pickup.actualLiters && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm text-blue-600">Fee Kurir</div>
                    <div className="text-lg font-semibold text-blue-800">
                      Rp {(pickup.actualLiters * 750).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                {pickup.status === 'request' && !isMyPickup && (
                  <button
                    onClick={() => handleTakePickup(pickup.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    Ambil Pickup
                  </button>
                )}

                {pickup.status === 'on-process' && isMyPickup && (
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={actualLiters[pickup.id] || ''}
                      onChange={(e) => setActualLiters(prev => ({
                        ...prev,
                        [pickup.id]: e.target.value
                      }))}
                      placeholder="Liter aktual"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-32"
                      min="1"
                    />
                    <button
                      onClick={() => handleCompletePickup(pickup.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      Selesai
                    </button>
                  </div>
                )}

                {pickup.status === 'completed' && pickup.completedAt && (
                  <div className="text-sm text-gray-500">
                    Selesai pada: {pickup.completedAt.toLocaleString('id-ID')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {myPickups.length === 0 && (
        <div className="text-center py-12">
          <Truck size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada pickup tersedia</p>
        </div>
      )}
    </div>
  );
};