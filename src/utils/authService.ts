import { DataManager } from './dataManager';

// Admin credentials (single admin for system management)
const ADMIN_CREDENTIALS = {
  email: 'admin@finobytes.com',
  password: 'admin123'
};

export interface Merchant {
  id: string;
  storeName: string;
  owner: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
}

export interface AuthResult {
  success: boolean;
  user?: any;
  role?: string;
  message?: string;
}

// Authenticate admin
export const authenticateAdmin = (email: string, password: string): AuthResult => {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    return {
      success: true,
      user: {
        id: 'admin',
        email: ADMIN_CREDENTIALS.email,
        role: 'admin'
      },
      role: 'admin'
    };
  }
  
  return {
    success: false,
    message: 'Invalid admin credentials'
  };
};

// Authenticate merchant (using email and password)
export const authenticateMerchant = (email: string, password: string): AuthResult => {
  // Use enhanced DataManager to check both Redux store and localStorage
  const merchant = DataManager.getMerchantByEmail(email);
  
  if (merchant && merchant.password === password) {
    return {
      success: true,
      user: {
        id: merchant.id,
        email: merchant.email,
        storeName: merchant.storeName,
        owner: merchant.owner,
        role: 'merchant'
      },
      role: 'merchant'
    };
  }
  
  return {
    success: false,
    message: 'Invalid merchant credentials'
  };
};

// Check if phone number exists for member (first step of OTP flow)
export const checkMemberPhone = (phone: string): AuthResult => {
  // Use enhanced DataManager to check both Redux store and localStorage
  const user = DataManager.getUserByIdentifier(phone);
  
  if (user) {
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        points: user.points,
        role: 'member'
      },
      role: 'member'
    };
  }
  
  return {
    success: false,
    message: 'Phone number not found'
  };
};

// Verify OTP for member authentication (second step of OTP flow)
export const verifyMemberOTP = (phone: string, otp: string): AuthResult => {
  // First check if phone exists
  const phoneCheck = checkMemberPhone(phone);
  if (!phoneCheck.success) {
    return phoneCheck;
  }
  
  // In a real app, this would verify against a stored/expired OTP
  // For demo purposes, we'll use a fixed OTP: 123456
  if (otp === '123456') {
    return phoneCheck; // Return the user data from phone check
  }
  
  return {
    success: false,
    message: 'Invalid OTP code. Please use 123456 for demo.'
  };
};

// Get all merchants (for admin dashboard)
export const getAllMerchants = (): Merchant[] => {
  return DataManager.getMerchants();
};

// Get all users (for admin dashboard)
export const getAllUsers = (): User[] => {
  return DataManager.getUsers();
};

// Get merchant by ID
export const getMerchantById = (id: string): Merchant | undefined => {
  const merchants = DataManager.getMerchants();
  return merchants.find((m: any) => m.id === id);
};

// Get user by ID
export const getUserById = (id: string): User | undefined => {
  const users = DataManager.getUsers();
  return users.find((u: any) => u.id === id);
};
