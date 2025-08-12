import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Truck, Clock, CheckCircle, AlertCircle, Filter, User, Phone, Calendar } from 'lucide-react';

export const PickupList: React.FC = () => {
  const { pickupRequests, updatePickupStatus } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actualLiters, setActualLiters] = useState<{ [key: string]: string }>({});

  const filteredRequests = pickupRequests.filter(request => {
    if (statusFilter === 'all') return true;
    return request.status === statusFilter;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'request':
        return {
          label: 'Request Baru',
          color: 'bg-orange-100 text-orange-800',
          icon: AlertCircle,
          iconColor: 'text-orange-500'
        };
      case 'on-process':
        return {
          label: 'Sedang Proses',
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

  const handleStatusChange = (requestId: string, newStatus: 'on-process' | 'completed') => {
    if (newStatus === 'on-process') {
      updatePickupStatus(requestId, newStatus, undefined, 'kurir1');
    } else if (newStatus === 'completed') {
      const liters = parseInt(actualLiters[requestId] || '0');
      if (liters > 0) {
        updatePickupStatus(requestId, newStatus, liters, 'kurir1');
        setActualLiters(prev => ({ ...prev, [requestId]: '' }));
      } else {
        alert('Mohon masukkan jumlah liter aktual');
      }
    }
  };

  const statusCounts = {
    all: pickupRequests.length,
    request: pickupRequests.filter(r => r.status === 'request').length,
    'on-process': pickupRequests.filter(r => r.status === 'on-process').length,
    completed: pickupRequests.filter(r => r.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 rounded-lg p-3">
            <Truck className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Data Pickup</h2>
            <p className="text-gray-600">Kelola request pickup</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={20} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700 mr-2">Filter Status:</span>
          {[
            { value: 'all', label: 'Semua' },
            { value: 'request', label: 'Request Baru' },
            { value: 'on-process', label: 'Sedang Proses' },
            { value: 'completed', label: 'Selesai' }
          ].map(filter => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                statusFilter === filter.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label} ({statusCounts[filter.value as keyof typeof statusCounts]})
            </button>
          ))}
        </div>
      </div>

      {/* Pickup Requests */}
      <div className="space-y-4">
        {filteredRequests.map((request) => {
          const statusConfig = getStatusConfig(request.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${statusConfig.iconColor.replace('text-', 'bg-')}/10`}>
                    <StatusIcon className={statusConfig.iconColor} size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{request.customerName}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Phone size={14} />
                        {request.customerPhone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {request.createdAt.toLocaleDateString('id-ID')}
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
                  <div className="text-lg font-semibold text-gray-900">{request.estimatedLiters}L</div>
                </div>
                {request.actualLiters && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-sm text-green-600">Liter Aktual</div>
                    <div className="text-lg font-semibold text-green-800">{request.actualLiters}L</div>
                  </div>
                )}
                {request.kurirName && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-sm text-blue-600">Kurir</div>
                    <div className="text-lg font-semibold text-blue-800">{request.kurirName}</div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                {request.status === 'request' && (
                  <button
                    onClick={() => handleStatusChange(request.id, 'on-process')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    Proses Pickup
                  </button>
                )}

                {request.status === 'on-process' && (
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={actualLiters[request.id] || ''}
                      onChange={(e) => setActualLiters(prev => ({
                        ...prev,
                        [request.id]: e.target.value
                      }))}
                      placeholder="Liter aktual"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-32"
                      min="1"
                    />
                    <button
                      onClick={() => handleStatusChange(request.id, 'completed')}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      Selesai
                    </button>
                  </div>
                )}

                {request.status === 'completed' && request.completedAt && (
                  <div className="text-sm text-gray-500">
                    Selesai pada: {request.completedAt.toLocaleString('id-ID')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <Truck size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {statusFilter === 'all' 
              ? 'Belum ada request pickup' 
              : `Tidak ada pickup dengan status "${statusFilter}"`
            }
          </p>
        </div>
      )}
    </div>
  );
};