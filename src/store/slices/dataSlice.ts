import { createSlice } from '@reduxjs/toolkit';
import usersData from '../../data/users.json';
import merchantsData from '../../data/merchants.json';
import purchasesData from '../../data/purchases.json';
import notificationsData from '../../data/notifications.json';
import pointsData from '../../data/points.json';

// Helper function to generate unique IDs with better uniqueness
const generateUniqueId = (prefix: string = 'n') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const perfTime = (performance as any).now().toString(36).substr(2, 9);
  return `${prefix}${timestamp}_${random}_${perfTime}`;
};

// Helper function to clean up duplicate IDs
const cleanDuplicateIds = (notifications: any[]) => {
  const seen = new Set();
  const cleaned = [];
  
  for (const notification of notifications) {
    if (seen.has(notification.id)) {
      // Generate a new unique ID for duplicate
      notification.id = generateUniqueId('n');
    }
    seen.add(notification.id);
    cleaned.push(notification);
  }
  
  return cleaned;
};

// Helper function to sync Redux store with localStorage
const syncToLocalStorage = (state: DataState) => {
  try {
    localStorage.setItem('app-data', JSON.stringify({
      users: state.users,
      merchants: state.merchants,
      purchases: state.purchases,
      notifications: state.notifications,
      points: state.points,
      contributionRate: state.contributionRate
    }));
  } catch (error) {
    console.error('Failed to sync to localStorage:', error);
  }
};

// Helper function to sync localStorage with Redux store
const syncFromLocalStorage = (state: DataState) => {
  try {
    const storedData = localStorage.getItem('app-data');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      state.users = parsed.users || state.users;
      state.merchants = parsed.merchants || state.merchants;
      state.purchases = parsed.purchases || state.purchases;
      state.notifications = parsed.notifications || state.notifications;
      state.points = parsed.points || state.points;
      state.contributionRate = parsed.contributionRate || state.contributionRate;
    }
  } catch (error) {
    console.error('Failed to sync from localStorage:', error);
  }
};

interface DataState {
  users: any[];
  merchants: any[];
  purchases: any[];
  notifications: any[];
  points: Record<string, number>;
  contributionRate: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: DataState = {
  users: usersData,
  merchants: merchantsData,
  purchases: purchasesData,
  notifications: notificationsData,
  points: pointsData,
  contributionRate: 0.1, // 10% default
  status: 'idle'
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    loadData: (state) => {
      // Load from localStorage if available
      syncFromLocalStorage(state);
      state.status = 'succeeded';
    },
    approvePurchase: (state, action: { payload: string }) => {
      const purchaseId = action.payload;
      const purchase = state.purchases.find(p => p.id === purchaseId);
      if (purchase) {
        purchase.approved = true;
        
        // Add notification with unique ID
        const newNotification = {
          id: generateUniqueId('n'),
          text: `Purchase ${purchaseId} approved`,
          type: 'success'
        };
        state.notifications.push(newNotification);
        
        // Sync to localStorage
        syncToLocalStorage(state);
      }
    },
    setContributionRate: (state, action: { payload: number }) => {
      state.contributionRate = action.payload;
      
      // Sync to localStorage
      syncToLocalStorage(state);
    },
    addNotification: (state, action: { payload: { text: string; type: string } }) => {
      const newNotification = {
        id: generateUniqueId('n'),
        text: action.payload.text,
        type: action.payload.type
      };
      state.notifications.push(newNotification);
      
      // Sync to localStorage
      syncToLocalStorage(state);
    },
    // Add a cleanup action to remove duplicate IDs
    cleanupDuplicateIds: (state) => {
      state.notifications = cleanDuplicateIds(state.notifications);
      
      // Sync to localStorage
      syncToLocalStorage(state);
    },
    
    // Add new user (member registration)
    addUser: (state, action: { payload: { name: string; email?: string; phone?: string; password: string } }) => {
      const newUser = {
        id: generateUniqueId('u'),
        name: action.payload.name,
        email: action.payload.email || '',
        phone: action.payload.phone || '',
        points: 0,
        password: action.payload.password, // Store password for demo purposes
        registrationDate: new Date().toISOString()
      };
      
      state.users.push(newUser);
      
      // Add to points system
      state.points[newUser.id] = 0;
      
      // Sync to localStorage
      syncToLocalStorage(state);
    },
    
    // Add new merchant (merchant registration)
    addMerchant: (state, action: { payload: { storeName: string; owner: string; email: string; password: string } }) => {
      const newMerchant = {
        id: generateUniqueId('m'),
        storeName: action.payload.storeName,
        owner: action.payload.owner,
        email: action.payload.email,
        password: action.payload.password, // Store password for demo purposes
        registrationDate: new Date().toISOString(),
        status: 'active'
      };
      
      state.merchants.push(newMerchant);
      
      // Add notification for new merchant
      const newNotification = {
        id: generateUniqueId('n'),
        text: `New merchant ${action.payload.storeName} registered`,
        type: 'info'
      };
      state.notifications.push(newNotification);
      
      // Sync to localStorage
      syncToLocalStorage(state);
    },
    
    // Delete merchant (removes from both Redux store and localStorage)
    deleteMerchant: (state, action: { payload: string }) => {
      const merchantId = action.payload;
      state.merchants = state.merchants.filter(m => m.id !== merchantId);
      
      // Remove related purchases
      state.purchases = state.purchases.filter(p => p.merchantId !== merchantId);
      
      // Add notification for deleted merchant
      const newNotification = {
        id: generateUniqueId('n'),
        text: `Merchant ${merchantId} deleted`,
        type: 'warning'
      };
      state.notifications.push(newNotification);
      
      // Sync to localStorage
      syncToLocalStorage(state);
    },
    
    // Delete user (removes from both Redux store and localStorage)
    deleteUser: (state, action: { payload: string }) => {
      const userId = action.payload;
      state.users = state.users.filter(u => u.id !== userId);
      
      // Remove related purchases
      state.purchases = state.purchases.filter(p => p.customerId !== userId);
      
      // Remove points
      delete state.points[userId];
      
      // Add notification for deleted user
      const newNotification = {
        id: generateUniqueId('n'),
        text: `User ${userId} deleted`,
        type: 'warning'
      };
      state.notifications.push(newNotification);
      
      // Sync to localStorage
      syncToLocalStorage(state);
    },
    
    // Force sync from localStorage to Redux store
    forceSyncFromLocalStorage: (state) => {
      syncFromLocalStorage(state);
    },
    
    // Force sync from Redux store to localStorage
    forceSyncToLocalStorage: (state) => {
      syncToLocalStorage(state);
    },
    
    // Clear all data (resets to initial state and clears localStorage)
    clearAllData: (state) => {
      state.users = usersData;
      state.merchants = merchantsData;
      state.purchases = purchasesData;
      state.notifications = notificationsData;
      state.points = pointsData;
      state.contributionRate = 0.1;
      
      // Clear localStorage
      localStorage.removeItem('app-data');
    }
  }
});

export const { loadData, approvePurchase, setContributionRate, addNotification, cleanupDuplicateIds, addUser, addMerchant, deleteMerchant, deleteUser, forceSyncFromLocalStorage, forceSyncToLocalStorage, clearAllData } = dataSlice.actions;
export default dataSlice.reducer;
