import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Plus, User, Phone, MapPin, Zap } from 'lucide-react';

export const QuickPickup: React.FC = () => {
  const { customers, addCustomer, createPickupRequest } = useApp();
  const [phone, setPhone] = useState('');
  const [foundCustomer, setFoundCustomer] = useState<any>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [estimatedLiters, setEstimatedLiters] = useState('');
  
  // New customer form
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    address: '',
    kecamatan: '',
    kota: '',
    referredBy: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    shareLocation: ''
  });

  const handleSearchCustomer = () => {
    if (!phone.trim()) return;
    
    const customer = customers.find(c => c.phone === phone);
    if (customer) {
      setFoundCustomer(customer);
      setShowAddCustomer(false);
    } else {
      setFoundCustomer(null);
      setShowAddCustomer(true);
    }
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.address || !newCustomer.kecamatan || !newCustomer.kota) {
      alert('Mohon lengkapi data wajib: Nama, Alamat, Kecamatan, dan Kota');
      return;
    }
    
    addCustomer({
      ...newCustomer,
      phone,
      role: 'customer'
    });
    
    // Find the newly added customer
    setTimeout(() => {
      const customer = customers.find(c => c.phone === phone);
      if (customer) {
        setFoundCustomer(customer);
        setShowAddCustomer(false);
        setNewCustomer({ 
          name: '', 
          address: '', 
          kecamatan: '', 
          kota: '', 
          referredBy: '', 
          bankName: '', 
          accountName: '', 
          accountNumber: '', 
          shareLocation: '' 
        });
      }
    }, 100);
  };

  const handleCreatePickup = () => {
    if (!foundCustomer || !estimatedLiters) return;
    
    createPickupRequest(foundCustomer.id, parseInt(estimatedLiters));
    
    // Reset form
    setPhone('');
    setFoundCustomer(null);
    setEstimatedLiters('');
    alert('Request pickup berhasil dibuat!');
  };

  const resetForm = () => {
    setPhone('');
    setFoundCustomer(null);
    setShowAddCustomer(false);
    setEstimatedLiters('');
    setNewCustomer({ 
      name: '', 
      address: '', 
      kecamatan: '', 
      kota: '', 
      referredBy: '', 
      bankName: '', 
      accountName: '', 
      accountNumber: '', 
      shareLocation: '' 
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3">
            <Zap className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quick Pickup</h2>
            <p className="text-gray-600">Buat request pickup dengan cepat</p>
          </div>
        </div>

        {/* Step 1: Search Customer */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              1. Masukkan Nomor HP Customer
            </label>
            <div className="flex gap-3">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSearchCustomer}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
              >
                <Search size={18} />
                Cari
              </button>
            </div>
          </div>

          {/* Customer Found */}
          {foundCustomer && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <User size={18} />
                Customer Ditemukan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={16} />
                  <span className="font-medium">Nama:</span> {foundCustomer.name}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone size={16} />
                  <span className="font-medium">HP:</span> {foundCustomer.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-700 md:col-span-2">
                  <MapPin size={16} />
                  <span className="font-medium">Alamat:</span> {foundCustomer.address}
                </div>
              </div>
            </div>
          )}

          {/* Add New Customer */}
          {showAddCustomer && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <Plus size={18} />
                Customer Belum Terdaftar - Daftar Baru
              </h3>
            <div className="space-y-3 sm:space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Kecamatan *
                  </label>
                  <input
                    type="text"
                    value={newCustomer.kecamatan}
                    onChange={(e) => setNewCustomer({...newCustomer, kecamatan: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Masukkan kecamatan"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Alamat Lengkap *
                  </label>
                  <textarea
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Masukkan alamat lengkap"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Kota *
                  </label>
                  <input
                    type="text"
                    value={newCustomer.kota}
                    onChange={(e) => setNewCustomer({...newCustomer, kota: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Masukkan kota"
                  />
                </div>
              </div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <textarea
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan alamat lengkap"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referral (HP yang merekomendasikan) - Opsional
                  </label>
                  <select
                    value={newCustomer.referredBy}
                    onChange={(e) => setNewCustomer({...newCustomer, referredBy: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih referral (opsional)</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAddCustomer}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  Daftar Customer
                </button>
              </div>
            </div>
          )}

              {/* Referral */}
              <div>
          {/* Step 2: Create Pickup Request */}
          {foundCustomer && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">
                2. Buat Request Pickup
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimasi Liter Limbah
                  </label>
                  <input
                    type="number"
                    value={estimatedLiters}
                    onChange={(e) => setEstimatedLiters(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan estimasi liter"
                    min="1"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCreatePickup}
                    disabled={!estimatedLiters}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                  Referral (HP yang merekomendasikan) - Opsional
                  </button>
                <select
                  value={newCustomer.referredBy}
                  onChange={(e) => setNewCustomer({...newCustomer, referredBy: e.target.value})}
                    Reset
                >
                  <option value="">Pilih referral (opsional)</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Payment Info */}
              <div className="border-t pt-3 sm:pt-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Informasi Pembayaran</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Nama Bank
                    </label>
                    <select
                      value={newCustomer.bankName}
                      onChange={(e) => setNewCustomer({...newCustomer, bankName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">Pilih Bank</option>
                      <option value="BCA">BCA</option>
                      <option value="Mandiri">Mandiri</option>
                      <option value="BRI">BRI</option>
                      <option value="BNI">BNI</option>
                      <option value="CIMB">CIMB</option>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Share Lokasi (Google Maps Link)
                      <option value="BTN">BTN</option>
                <input
                  type="url"
                  value={newCustomer.shareLocation}
                  onChange={(e) => setNewCustomer({...newCustomer, shareLocation: e.target.value})}
                  <div>
                  placeholder="https://maps.google.com/?q=..."
                    </label>
                    <input
              
                    />
                  </div>
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm"
              </div>
              
              {/* Share Location */}
              
              <div className="text-xs text-gray-500 mt-2">
                * Field wajib diisi
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};