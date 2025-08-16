import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Receipt, Users, Truck, UserCheck, Filter, Edit2, Save, X, Upload, Image, Camera } from 'lucide-react';
import { uploadImage } from '../../lib/supabase';

export const PickupList: React.FC = () => {
  const { pickupRequests, customers, updatePickupStatus, updatePickupProof } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actualLiters, setActualLiters] = useState<{ [key: string]: string }>({});
  const [uploadingProof, setUploadingProof] = useState<string | null>(null);

  const filteredRequests = pickupRequests.filter(request => {
    if (statusFilter === 'all') return true;
    return request.status === statusFilter;
  });

  const getCustomerName = (customerId?: string) => {
    if (!customerId) return '-';
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown';
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'request':
        return {
          label: 'Request Baru',
          color: 'bg-orange-100 text-orange-800',
          icon: Receipt,
          iconColor: 'text-orange-500'
        };
      case 'on-process':
        return {
          label: 'Sedang Proses',
          color: 'bg-blue-100 text-blue-800',
          icon: Truck,
          iconColor: 'text-blue-500'
        };
      case 'completed':
        return {
          label: 'Selesai',
          color: 'bg-green-100 text-green-800',
          icon: UserCheck,
          iconColor: 'text-green-500'
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

  const statusCounts = {
    all: pickupRequests.length,
    request: pickupRequests.filter(r => r.status === 'request').length,
    'on-process': pickupRequests.filter(r => r.status === 'on-process').length,
    completed: pickupRequests.filter(r => r.status === 'completed').length
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

  const handleUploadProof = async (requestId: string, file: File) => {
    setUploadingProof(requestId);
    try {
      const fileName = `pickup-proof-${requestId}-${Date.now()}`;
      const proofUrl = await uploadImage(file, 'pickup-proofs', fileName);
      
      if (proofUrl) {
        updatePickupProof(requestId, proofUrl);
        alert('Bukti pickup berhasil diupload!');
      } else {
        alert('Gagal upload bukti pickup');
      }
    } catch (error) {
      alert('Error upload bukti pickup');
    } finally {
      setUploadingProof(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 rounded-lg p-3">
            <Truck className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Data Pickup</h2>
            <p className="text-sm sm:text-base text-gray-600">Kelola request pickup</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <Filter size={20} className="text-gray-500" />
          <span className="text-xs sm:text-sm font-medium text-gray-700 mr-1 sm:mr-2">Filter Status:</span>
          {[
            { value: 'all', label: 'Semua' },
            { value: 'request', label: 'Request Baru' },
            { value: 'on-process', label: 'Sedang Proses' },
            { value: 'completed', label: 'Selesai' }
          ].map(filter => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${
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
            <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${statusConfig.iconColor.replace('text-', 'bg-')}/10`}>
                    <StatusIcon className={statusConfig.iconColor} size={20} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{request.customerName}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        {request.customerPhone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Receipt size={12} />
                        {request.createdAt.toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  </div>
                </div>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs sm:text-sm text-gray-600">Estimasi Liter</div>
                  <div className="text-base sm:text-lg font-semibold text-gray-900">{request.estimatedLiters}L</div>
                </div>
                {request.actualLiters && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xs sm:text-sm text-green-600">Liter Aktual</div>
                    <div className="text-base sm:text-lg font-semibold text-green-800">{request.actualLiters}L</div>
                  </div>
                )}
                {request.kurirName && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs sm:text-sm text-blue-600">Kurir</div>
                    <div className="text-base sm:text-lg font-semibold text-blue-800">{request.kurirName}</div>
                  </div>
                )}
              </div>

              {/* Pickup Proof */}
              {request.pickupProofUrl && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="text-green-600" size={16} />
                    <span className="text-xs sm:text-sm font-medium text-green-800">Bukti Pickup</span>
                  </div>
                  <img 
                    src={request.pickupProofUrl} 
                    alt="Bukti pickup" 
                    className="w-full max-w-xs rounded-lg border border-green-300"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-4 border-t border-gray-100">
                {request.status === 'request' && (
                  <button
                    onClick={() => handleStatusChange(request.id, 'on-process')}
                    className="w-full sm:w-auto bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                  >
                    Proses Pickup
                  </button>
                )}

                {request.status === 'on-process' && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="number"
                        value={actualLiters[request.id] || ''}
                        onChange={(e) => setActualLiters(prev => ({
                          ...prev,
                          [request.id]: e.target.value
                        }))}
                        placeholder="Liter aktual"
                        className="flex-1 sm:w-24 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        min="1"
                      />
                      <button
                        onClick={() => handleStatusChange(request.id, 'completed')}
                        className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm"
                      >
                        Selesai
                      </button>
                    </div>
                    
                    {/* Upload Proof */}
                    <div className="w-full sm:w-auto">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleUploadProof(request.id, file);
                          }
                        }}
                        className="hidden"
                        id={`proof-${request.id}`}
                      />
                      <label
                        htmlFor={`proof-${request.id}`}
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer text-sm ${
                          uploadingProof === request.id
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-purple-500 text-white hover:bg-purple-600'
                        }`}
                      >
                        <Upload size={16} />
                        {uploadingProof === request.id ? 'Uploading...' : 'Upload Bukti'}
                      </label>
                    </div>
                  </div>
                )}

                {request.status === 'completed' && request.completedAt && (
                  <div className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-0">
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