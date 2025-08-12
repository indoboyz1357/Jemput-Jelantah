import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Customer, PickupRequest, Bill } from '../types';

interface AppContextType {
  currentUser: User | null;
  customers: Customer[];
  pickupRequests: PickupRequest[];
  bills: Bill[];
  login: (phone: string, role: 'admin' | 'customer' | 'kurir') => boolean;
  logout: () => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  createPickupRequest: (customerId: string, estimatedLiters: number) => void;
  updatePickupStatus: (id: string, status: PickupRequest['status'], actualLiters?: number, kurirId?: string) => void;
  generateBills: (pickupId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

const initialCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '081234567890',
    role: 'customer',
    address: 'Jl. Sudirman No. 123, Jakarta',
    referredBy: '',
    totalLiters: 150,
    downlines: ['2', '3'],
    totalDownlineLiters: 80,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '081234567891',
    role: 'customer',
    address: 'Jl. Thamrin No. 456, Jakarta',
    referredBy: '1',
    totalLiters: 45,
    downlines: [],
    totalDownlineLiters: 0,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Bob Wilson',
    phone: '081234567892',
    role: 'customer',
    address: 'Jl. Gatot Subroto No. 789, Jakarta',
    referredBy: '1',
    totalLiters: 35,
    downlines: [],
    totalDownlineLiters: 0,
    createdAt: new Date('2024-01-25')
  }
];

const initialPickupRequests: PickupRequest[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'John Doe',
    customerPhone: '081234567890',
    estimatedLiters: 25,
    actualLiters: 30,
    status: 'completed',
    kurirId: 'kurir1',
    kurirName: 'Ahmad Kurir',
    createdAt: new Date('2024-01-30'),
    completedAt: new Date('2024-01-31')
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Jane Smith',
    customerPhone: '081234567891',
    estimatedLiters: 15,
    status: 'on-process',
    kurirId: 'kurir1',
    kurirName: 'Ahmad Kurir',
    createdAt: new Date('2024-02-01')
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Bob Wilson',
    customerPhone: '081234567892',
    estimatedLiters: 20,
    status: 'request',
    createdAt: new Date('2024-02-02')
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>(initialPickupRequests);
  const [bills, setBills] = useState<Bill[]>([]);

  const login = (phone: string, role: 'admin' | 'customer' | 'kurir'): boolean => {
    if (role === 'admin' && phone === '08111111111') {
      setCurrentUser({ id: 'admin', name: 'Administrator', phone, role: 'admin' });
      return true;
    }
    
    if (role === 'kurir' && phone === '08222222222') {
      setCurrentUser({ id: 'kurir1', name: 'Ahmad Kurir', phone, role: 'kurir' });
      return true;
    }
    
    if (role === 'customer') {
      const customer = customers.find(c => c.phone === phone);
      if (customer) {
        setCurrentUser(customer);
        return true;
      }
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date(),
      totalLiters: 0,
      downlines: [],
      totalDownlineLiters: 0
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    
    // Update referrer's downlines
    if (customerData.referredBy) {
      setCustomers(prev => prev.map(customer => 
        customer.id === customerData.referredBy 
          ? { ...customer, downlines: [...customer.downlines, newCustomer.id] }
          : customer
      ));
    }
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    ));
  };

  const createPickupRequest = (customerId: string, estimatedLiters: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const newRequest: PickupRequest = {
      id: Date.now().toString(),
      customerId,
      customerName: customer.name,
      customerPhone: customer.phone,
      estimatedLiters,
      status: 'request',
      createdAt: new Date()
    };

    setPickupRequests(prev => [...prev, newRequest]);
  };

  const updatePickupStatus = (id: string, status: PickupRequest['status'], actualLiters?: number, kurirId?: string) => {
    setPickupRequests(prev => prev.map(request => {
      if (request.id === id) {
        const updated = {
          ...request,
          status,
          ...(actualLiters && { actualLiters }),
          ...(kurirId && { kurirId, kurirName: 'Ahmad Kurir' }),
          ...(status === 'completed' && { completedAt: new Date() })
        };
        
        if (status === 'completed' && actualLiters) {
          // Update customer total liters
          setCustomers(prev => prev.map(customer => 
            customer.id === request.customerId 
              ? { ...customer, totalLiters: customer.totalLiters + actualLiters }
              : customer
          ));
          
          // Update referrer's downline liters
          const customer = customers.find(c => c.id === request.customerId);
          if (customer?.referredBy) {
            setCustomers(prev => prev.map(c => 
              c.id === customer.referredBy 
                ? { ...c, totalDownlineLiters: c.totalDownlineLiters + actualLiters }
                : c
            ));
          }
          
          generateBills(id);
        }
        
        return updated;
      }
      return request;
    }));
  };

  const generateBills = (pickupId: string) => {
    const pickup = pickupRequests.find(p => p.id === pickupId);
    if (!pickup || !pickup.actualLiters) return;

    const customer = customers.find(c => c.id === pickup.customerId);
    const liters = pickup.actualLiters;
    
    // Customer bill
    const customerBill: Bill = {
      id: `customer-${pickupId}`,
      type: 'customer',
      customerId: pickup.customerId,
      liters,
      rate: 6000,
      total: liters * 6000,
      pickupId,
      createdAt: new Date(),
      paid: false
    };

    // Kurir bill
    const kurirBill: Bill = {
      id: `kurir-${pickupId}`,
      type: 'kurir',
      kurirId: pickup.kurirId,
      liters,
      rate: 750,
      total: liters * 750,
      pickupId,
      createdAt: new Date(),
      paid: false
    };

    const newBills = [customerBill, kurirBill];

    // Referral bill if customer has referrer
    if (customer?.referredBy) {
      const referralBill: Bill = {
        id: `referral-${pickupId}`,
        type: 'referral',
        referrerId: customer.referredBy,
        liters,
        rate: 200,
        total: liters * 200,
        pickupId,
        createdAt: new Date(),
        paid: false
      };
      newBills.push(referralBill);
    }

    setBills(prev => [...prev, ...newBills]);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      customers,
      pickupRequests,
      bills,
      login,
      logout,
      addCustomer,
      updateCustomer,
      createPickupRequest,
      updatePickupStatus,
      generateBills
    }}>
      {children}
    </AppContext.Provider>
  );
};