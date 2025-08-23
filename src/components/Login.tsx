import React, { useState } from 'react';
import { useApp } from '../context/hooks';
import { LogIn, Users, Truck, UserCog } from 'lucide-react';

export const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'admin' | 'customer' | 'kurir'>('customer');
  const [error, setError] = useState('');
  const { login } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!phone.trim()) {
      setError('Nomor HP tidak boleh kosong');
      return;
    }

    const success = login(phone, role);
    if (!success) {
      setError('Login gagal. Periksa nomor HP dan role Anda.');
    }
  };

  const roleOptions = [
    { value: 'customer', label: 'Customer', icon: Users, color: 'bg-blue-500' },
    { value: 'kurir', label: 'Kurir', icon: Truck, color: 'bg-green-500' },
    { value: 'admin', label: 'Admin', icon: UserCog, color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <LogIn className="text-white" size={32} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Jemput Jelantah</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Silakan login untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Pilih Role
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {roleOptions.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 ${
                    role === value
                      ? `${color} border-transparent text-white`
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} className="mx-auto mb-1" />
                  <div className="text-xs font-medium">{label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-3">
              Nomor HP
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Masukkan nomor HP"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium text-base"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-xs sm:text-sm text-gray-500">
          <p className="mb-2">Demo Credentials:</p>
          <div className="space-y-1">
            <p><span className="font-medium">Admin:</span> 08111111111</p>
            <p><span className="font-medium">Kurir:</span> 08222222222</p>
            <p><span className="font-medium">Customer:</span> 081234567890</p>
          </div>
        </div>
      </div>
    </div>
  );
};