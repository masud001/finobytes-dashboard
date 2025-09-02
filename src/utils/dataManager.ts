// Data management utility for saving new users and merchants
import { store } from '../store';
import { 
  forceSyncFromLocalStorage, 
  forceSyncToLocalStorage, 
  clearAllData,
  deleteMerchant,
  deleteUser
} from '../store/slices/dataSlice';

// Import JSON data for initial sync
import usersData from '../data/users.json';
import merchantsData from '../data/merchants.json';
import purchasesData from '../data/purchases.json';
import notificationsData from '../data/notifications.json';
import pointsData from '../data/points.json';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
}

export interface Merchant {
  id: string;
  storeName: string;
  owner: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

// Enhanced data manager with localStorage as primary database
export class DataManager {
  // Get all users (from localStorage as primary source)
  static getUsers() {
    const localData = this.getLocalStorageData();
    return localData?.users || usersData;
  }

  // Get all merchants (from localStorage as primary source)
  static getMerchants() {
    const localData = this.getLocalStorageData();
    return localData?.merchants || merchantsData;
  }

  // Get all purchases (from localStorage as primary source)
  static getPurchases() {
    const localData = this.getLocalStorageData();
    return localData?.purchases || purchasesData;
  }

  // Get all notifications (from localStorage as primary source)
  static getNotifications() {
    const localData = this.getLocalStorageData();
    return localData?.notifications || notificationsData;
  }

  // Get points for a specific user (from localStorage as primary source)
  static getUserPoints(userId: string) {
    const localData = this.getLocalStorageData();
    const localPoints = localData?.points || {};
    return localPoints[userId] || (pointsData as Record<string, number>)[userId] || 0;
  }

  // Get all points (from localStorage as primary source)
  static getAllPoints() {
    const localData = this.getLocalStorageData();
    return localData?.points || pointsData;
  }

  // Get contribution rate (from localStorage as primary source)
  static getContributionRate() {
    const localData = this.getLocalStorageData();
    return localData?.contributionRate || 0.1;
  }

  // Initialize localStorage with JSON data if empty
  static initializeLocalStorage() {
    if (!this.hasLocalStorageData()) {
      console.log('🔧 Initializing localStorage with JSON data...');
      const initialData = {
        users: usersData,
        merchants: merchantsData,
        purchases: purchasesData,
        notifications: notificationsData,
        points: pointsData,
        contributionRate: 0.1
      };
      localStorage.setItem('app-data', JSON.stringify(initialData));
      return true;
    }
    return false;
  }

  // Sync all data from JSON files to localStorage (merge strategy)
  static syncFromJSONToLocalStorage() {
    console.log('🔄 Syncing JSON data to localStorage...');
    
    const localData = this.getLocalStorageData() || {};
    
    // Merge strategy: JSON data + existing localStorage data
    const mergedData = {
      users: this.mergeArrays(localData.users || [], usersData, 'id'),
      merchants: this.mergeArrays(localData.merchants || [], merchantsData, 'id'),
      purchases: this.mergeArrays(localData.purchases || [], purchasesData, 'id'),
      notifications: this.mergeArrays(localData.notifications || [], notificationsData, 'id'),
      points: { ...pointsData, ...localData.points },
      contributionRate: localData.contributionRate || 0.1
    };
    
    localStorage.setItem('app-data', JSON.stringify(mergedData));
    console.log('✅ JSON data synced to localStorage');
    return mergedData;
  }

  // Sync all data from localStorage to Redux store
  static syncFromLocalStorageToRedux() {
    console.log('🔄 Syncing localStorage to Redux store...');
    store.dispatch(forceSyncFromLocalStorage());
    console.log('✅ localStorage synced to Redux store');
  }

  // Sync all data from Redux store to localStorage
  static syncFromReduxToLocalStorage() {
    console.log('🔄 Syncing Redux store to localStorage...');
    store.dispatch(forceSyncToLocalStorage());
    console.log('✅ Redux store synced to localStorage');
  }

  // Full data synchronization (JSON → localStorage → Redux)
  static fullDataSync() {
    console.log('🚀 Starting full data synchronization...');
    
    // Step 1: Sync JSON to localStorage
    this.syncFromJSONToLocalStorage();
    
    // Step 2: Sync localStorage to Redux
    this.syncFromLocalStorageToRedux();
    
    console.log('✅ Full data synchronization completed');
  }

  // Merge arrays with conflict resolution (localStorage data takes precedence)
  private static mergeArrays(localArray: any[], jsonArray: any[], idKey: string) {
    const merged = [...localArray];
    const localIds = new Set(localArray.map((item: any) => item[idKey]));
    
    // Add JSON items that don't exist in localStorage
    jsonArray.forEach((jsonItem: any) => {
      if (!localIds.has(jsonItem[idKey])) {
        merged.push(jsonItem);
      }
    });
    
    return merged;
  }

  // Force sync from localStorage to Redux store
  static syncFromLocalStorage() {
    store.dispatch(forceSyncFromLocalStorage());
  }

  // Force sync from Redux store to localStorage
  static syncToLocalStorage() {
    store.dispatch(forceSyncToLocalStorage());
  }

  // Delete merchant (removes from both Redux store and localStorage)
  static deleteMerchant(merchantId: string) {
    store.dispatch(deleteMerchant(merchantId));
  }

  // Delete user (removes from both Redux store and localStorage)
  static deleteUser(userId: string) {
    store.dispatch(deleteUser(userId));
  }

  // Clear all data (resets to JSON data and clears localStorage)
  static clearAllData() {
    store.dispatch(clearAllData());
  }

  // Get data directly from localStorage (primary database)
  static getLocalStorageData() {
    try {
      const data = localStorage.getItem('app-data');
      return data ? JSON.parse(data) : null;
  } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  // Check if data exists in localStorage
  static hasLocalStorageData() {
    return localStorage.getItem('app-data') !== null;
  }

  // Get merchant by email (checks localStorage as primary source)
  static getMerchantByEmail(email: string) {
    const merchants = this.getMerchants();
    return merchants.find((m: any) => m.email === email);
  }

  // Get user by email or phone (checks localStorage as primary source)
  static getUserByIdentifier(identifier: string) {
    const users = this.getUsers();
    return users.find((u: any) => u.email === identifier || u.phone === identifier);
  }

  // Validate data consistency between localStorage and Redux store
  static validateDataConsistency() {
    const localData = this.getLocalStorageData();
    const reduxData = {
      users: store.getState().data.users,
      merchants: store.getState().data.merchants,
      purchases: store.getState().data.purchases,
      notifications: store.getState().data.notifications,
      points: store.getState().data.points,
      contributionRate: store.getState().data.contributionRate
    };
    
    if (!localData) {
      return { consistent: false, message: 'No localStorage data found' };
    }

    const inconsistencies = [];
    
    if (reduxData.users.length !== localData.users?.length) {
      inconsistencies.push(`Users count mismatch: Redux=${reduxData.users.length}, Local=${localData.users?.length || 0}`);
    }
    
    if (reduxData.merchants.length !== localData.merchants?.length) {
      inconsistencies.push(`Merchants count mismatch: Redux=${reduxData.merchants.length}, Local=${localData.merchants?.length || 0}`);
    }
    
    if (reduxData.purchases.length !== localData.purchases?.length) {
      inconsistencies.push(`Purchases count mismatch: Redux=${reduxData.purchases.length}, Local=${localData.purchases?.length || 0}`);
    }

    return {
      consistent: inconsistencies.length === 0,
      message: inconsistencies.length > 0 ? inconsistencies.join('; ') : 'Data is consistent',
      inconsistencies
    };
  }

  // Repair data inconsistencies by syncing from localStorage to Redux
  static repairDataInconsistencies() {
    console.log('🔧 Repairing data inconsistencies...');
    this.syncFromLocalStorageToRedux();
  }

  // Get data statistics
  static getDataStats() {
    const localData = this.getLocalStorageData();
    return {
      users: localData?.users?.length || 0,
      merchants: localData?.merchants?.length || 0,
      purchases: localData?.purchases?.length || 0,
      notifications: localData?.notifications?.length || 0,
      hasLocalStorage: this.hasLocalStorageData(),
      lastSync: localData?.lastSync || 'Never'
    };
  }

  // Backup localStorage data
  static backupData() {
    const data = this.getLocalStorageData();
    if (data) {
      const backup = {
        ...data,
        backupDate: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem('app-data-backup', JSON.stringify(backup));
      console.log('💾 Data backup created');
      return backup;
    }
    return null;
  }

  // Restore from backup
  static restoreFromBackup() {
    const backup = localStorage.getItem('app-data-backup');
    if (backup) {
      try {
        const backupData = JSON.parse(backup);
        localStorage.setItem('app-data', JSON.stringify(backupData));
        this.syncFromLocalStorageToRedux();
        console.log('🔄 Data restored from backup');
        return true;
      } catch (error) {
        console.error('Error restoring from backup:', error);
        return false;
      }
    }
    return false;
  }
}

// Legacy functions for backward compatibility
export const getUsers = () => DataManager.getUsers();
export const getMerchants = () => DataManager.getMerchants();
export const getPurchases = () => DataManager.getPurchases();
export const getNotifications = () => DataManager.getNotifications();
export const getUserPoints = (userId: string) => DataManager.getUserPoints(userId);
export const getContributionRate = () => DataManager.getContributionRate();

// Initialize data function for App.tsx
export const initializeData = () => {
  // Initialize localStorage with JSON data if empty
  if (!DataManager.hasLocalStorageData()) {
    console.log('🔧 Initializing localStorage with JSON data...');
    DataManager.initializeLocalStorage();
  } else {
    console.log('🔧 localStorage already has data, syncing with JSON...');
    DataManager.syncFromJSONToLocalStorage();
  }
  
  // Always sync localStorage to Redux store
  DataManager.syncFromLocalStorageToRedux();
  
  console.log('✅ Data initialization completed');
};
