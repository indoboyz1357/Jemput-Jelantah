import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, MapPin, Phone, User, Building, CreditCard, ExternalLink } from 'lucide-react';

export const QuickPickup: React.FC = () => {
  const { customers, addCustomer, createPickupRequest } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    kecamatan: '',
    kota: '',
    referredBy: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    locationUrl: '',
    estimatedLiters: 0
  });

  const bankOptions = [
    'BCA', 'BRI', 'BNI', 'Mandiri', 'CIMB Niaga', 'Danamon', 'Permata', 'BTN', 'BSI', 'Lainnya'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Add new customer
      const newCustomer = await addCustomer({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        kecamatan: formData.kecamatan,
        kota: formData.kota,
        referredBy: formData.referredBy || undefined,
        bankName: formData.bankName,
        accountName: formData.accountName,
        accountNumber: formData.accountNumber,
        shareLocation: formData.locationUrl
      });

      // Add pickup request
      if (formData.estimatedLiters > 0) {
        createPickupRequest(newCustomer.id, formData.estimatedLiters);
      }

      // Reset form
      setFormData({
        name: '',
        phone: '',
        address: '',
        kecamatan: '',
        kota: '',
        referredBy: '',
        bankName: '',
        accountName: '',
        accountNumber: '',
        locationUrl: '',
        estimatedLiters: 0
      });

      alert('Customer berhasil didaftarkan!');
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Gagal mendaftarkan customer');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedLiters' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-blue-500 rounded-lg p-2 sm:p-3">
          <Plus className="text-white" size={20} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Quick Pickup</h2>
          <p className="text-sm sm:text-base text-gray-600">Daftarkan customer baru dan buat pickup</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
            <User size={18} className="text-blue-500" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Informasi Dasar</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan nama lengkap"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No. Handphone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
            <MapPin size={18} className="text-blue-500" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Alamat</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat Lengkap *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Jalan, RT/RW, Kelurahan"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kecamatan *
              </label>
              <input
                type="text"
                name="kecamatan"
                value={formData.kecamatan}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nama kecamatan"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kota *
              </label>
              <input
                type="text"
                name="kota"
                value={formData.kota}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nama kota"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Lokasi (Google Maps)
            </label>
            <div className="relative">
              <input
                type="url"
                name="locationUrl"
                value={formData.locationUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 pr-10 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://maps.google.com/..."
              />
              <ExternalLink size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Referral Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
            <User size={18} className="text-blue-500" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Referral</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referred By
            </label>
            <select
              name="referredBy"
              value={formData.referredBy}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih referrer (opsional)</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
            <CreditCard size={18} className="text-blue-500" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Informasi Pembayaran</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Bank *
              </label>
              <select
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Bank</option>
                {bankOptions.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama di Rekening *
              </label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nama pemilik rekening"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Rekening *
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nomor rekening"
              />
            </div>
          </div>
        </div>

        {/* Pickup Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
            <Building size={18} className="text-blue-500" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Pickup (Opsional)</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimasi Liter
            </label>
            <input
              type="number"
              name="estimatedLiters"
              value={formData.estimatedLiters}
              onChange={handleInputChange}
              min="0"
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Kosongkan jika tidak ingin membuat pickup sekarang
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
          >
            Daftarkan Customer
          </button>
          <button
            type="button"
            onClick={() => setFormData({
              name: '',
              phone: '',
              address: '',
              kecamatan: '',
              kota: '',
              referredBy: '',
              bankName: '',
              accountName: '',
              accountNumber: '',
              locationUrl: '',
              estimatedLiters: 0
            })}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};