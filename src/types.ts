export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'admin' | 'customer' | 'kurir';
  address?: string;
  referredBy?: string;
}

export interface Customer extends User {
  role: 'customer';
  address: string;
  kecamatan: string;
  kota: string;
  referredBy?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  shareLocation?: string;
  totalLiters: number;
  downlines: string[];
  totalDownlineLiters: number;
  createdAt: Date;
}

export interface PickupRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  estimatedLiters: number;
  actualLiters?: number;
  status: 'request' | 'on-process' | 'completed';
  kurirId?: string;
  kurirName?: string;
  pickupProofUrl?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Bill {
  id: string;
  type: 'customer' | 'kurir' | 'referral';
  customerId?: string;
  kurirId?: string;
  referrerId?: string;
  liters: number;
  rate: number;
  total: number;
  pickupId: string;
  paymentProofUrl?: string;
  createdAt: Date;
  paid: boolean;
}