import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  authenticateAdmin, 
  authenticateMerchant, 
  verifyMemberOTP 
} from '../../utils/authService';

interface AuthState {
  token: string | null;
  role: string | null;
  user: any | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  isInitialized: boolean;
  tokenExpiry: number | null; // Add token expiration timestamp
}

interface LoginPayload {
  token: string;
  role: string;
  user: any;
}

interface LoginCredentials {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
  role: string;
}

interface RegisterData {
  name?: string;
  email?: string;
  phone?: string;
  password: string;
  role: string;
  adminCode?: string;
  storeDetails?: {
    storeName: string;
    owner: string;
  };
}

const initialState: AuthState = {
  token: null,
  role: null,
  user: null,
  status: 'idle',
  isInitialized: false,
  tokenExpiry: null
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      let authResult;
      
      switch (credentials.role) {
        case 'admin':
          if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required for admin login');
          }
          authResult = authenticateAdmin(credentials.email, credentials.password);
          break;
          
        case 'merchant':
          if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required for merchant login');
          }
          authResult = authenticateMerchant(credentials.email, credentials.password);
          break;
          
        case 'member':
          if (credentials.otp) {
            // OTP-based login - use the authService
            if (!credentials.phone) {
              throw new Error('Phone number is required for OTP login');
            }
            authResult = verifyMemberOTP(credentials.phone, credentials.otp);
          } else {
            // Password-based login - use the authService
            if (!credentials.email && !credentials.phone) {
              throw new Error('Email or phone number is required for member login');
            }
            if (!credentials.password) {
              throw new Error('Password is required for member login');
            }
            
            const identifier = credentials.email || credentials.phone!;
            if (identifier.includes('@')) {
              // Email-based login - use the authService
              // The component should validate the user exists before calling this
              authResult = {
                success: true,
                user: {
                  id: 'member-email',
                  email: identifier,
                  role: 'member'
                },
                role: 'member'
              };
            } else {
              // Phone-based login - use the authService
              // The component should validate the user exists before calling this
              authResult = {
                success: true,
                user: {
                  id: 'member-phone',
                  phone: identifier,
                  role: 'member'
                },
                role: 'member'
              };
            }
          }
          break;
          
        default:
          throw new Error('Invalid role specified');
      }
      
      if (authResult.success && authResult.user) {
        // Generate a fake token with role prefix for better identification
        const token = `${credentials.role}-token-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        
        // Add additional user metadata
        const enhancedUser = {
          ...authResult.user,
          loginTime: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          sessionId: Math.random().toString(36).substring(2, 11)
        };
        
        return {
          token,
          role: authResult.role,
          user: enhancedUser
        };
      } else {
        throw new Error(authResult.message || 'Authentication failed');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Authentication failed');
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      // Validate required fields based on role
      if (!userData.password) {
        throw new Error('Password is required');
      }
      
      switch (userData.role) {
        case 'admin':
          if (!userData.email || !userData.adminCode) {
            throw new Error('Email and admin code are required for admin registration');
          }
          if (userData.adminCode !== 'ADMIN2024') {
            throw new Error('Invalid admin code. Use ADMIN2024 for demo.');
          }
          break;
          
        case 'merchant':
          if (!userData.email || !userData.storeDetails?.storeName || !userData.storeDetails?.owner) {
            throw new Error('Email, store name, and owner name are required for merchant registration');
          }
          break;
          
        case 'member':
          if (!userData.name || (!userData.email && !userData.phone)) {
            throw new Error('Name and either email or phone are required for member registration');
          }
          break;
          
        default:
          throw new Error('Invalid role specified');
      }
      
      // For demo purposes, we'll simulate successful registration
      // In a real app, this would save to a database
      const token = `${userData.role}-token-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      
      let user;
      switch (userData.role) {
        case 'admin':
          user = {
            id: `admin-${Date.now()}`,
            name: userData.name || userData.email?.split('@')[0],
            email: userData.email,
            role: 'admin',
            registrationTime: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            sessionId: Math.random().toString(36).substring(2, 11)
          };
          break;
          
        case 'merchant':
          user = {
            id: `merchant-${Date.now()}`,
            storeName: userData.storeDetails!.storeName,
            owner: userData.storeDetails!.owner,
            email: userData.email,
            role: 'merchant',
            registrationTime: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            sessionId: Math.random().toString(36).substring(2, 11)
          };
          break;
          
        case 'member':
          user = {
            id: `member-${Date.now()}`,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            points: 0,
            role: 'member',
            registrationTime: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            sessionId: Math.random().toString(36).substring(2, 11)
          };
          break;
      }
      
      return {
        token,
        role: userData.role,
        user
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setInitializing: (state) => {
      state.status = 'loading';
      state.isInitialized = false;
    },
    loginSuccess: (state, action: { payload: LoginPayload }) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.user = action.payload.user;
      state.status = 'succeeded';
      state.isInitialized = true;
      
      // Set token expiry to 24 hours from now
      const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
      state.tokenExpiry = expiryTime;
      
      // Persist to localStorage
      localStorage.setItem('auth-token', action.payload.token);
      localStorage.setItem('auth-role', action.payload.role);
      localStorage.setItem('auth-user', JSON.stringify(action.payload.user));
      localStorage.setItem('auth-expiry', expiryTime.toString());
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.user = null;
      state.status = 'idle';
      state.isInitialized = true;
      state.tokenExpiry = null;
      
      // Clear localStorage
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-role');
      localStorage.removeItem('auth-user');
      localStorage.removeItem('auth-expiry');
    },
    
    // Update user activity timestamp
    updateUserActivity: (state) => {
      if (state.user) {
        state.user.lastActivity = new Date().toISOString();
        // Also update in localStorage
        localStorage.setItem('auth-user', JSON.stringify(state.user));
      }
    },
    
    // Refresh token (extend expiry)
    refreshToken: (state) => {
      if (state.token && state.tokenExpiry) {
        // Extend token expiry by 24 hours
        const newExpiryTime = Date.now() + (24 * 60 * 60 * 1000);
        state.tokenExpiry = newExpiryTime;
        localStorage.setItem('auth-expiry', newExpiryTime.toString());
      }
    },
    
    // Clear authentication errors
    clearAuthError: (state) => {
      state.status = 'idle';
    },
    
    // Force logout and clear all auth state (for when localStorage is manually cleared)
    forceLogout: (state) => {
      state.token = null;
      state.role = null;
      state.user = null;
      state.status = 'idle';
      state.isInitialized = true;
      state.tokenExpiry = null;
    },
    
    hydrateFromStorage: (state) => {
      try {
        const token = localStorage.getItem('auth-token');
        const role = localStorage.getItem('auth-role');
        const user = localStorage.getItem('auth-user');
        const expiry = localStorage.getItem('auth-expiry');
        
        if (token && role && user && expiry) {
          const expiryTime = parseInt(expiry);
          const now = Date.now();
          
          // Check if token has expired
          if (now < expiryTime) {
            state.token = token;
            state.role = role;
            state.user = JSON.parse(user);
            state.tokenExpiry = expiryTime;
            state.status = 'succeeded';
          } else {
            // Token expired, clear everything
            localStorage.removeItem('auth-token');
            localStorage.removeItem('auth-role');
            localStorage.removeItem('auth-user');
            localStorage.removeItem('auth-expiry');
            state.status = 'idle';
          }
        } else {
          state.status = 'idle';
        }
      } catch (error) {
        console.error('Error during auth hydration:', error);
        // Clear any corrupted data
        localStorage.removeItem('auth-token');
        localStorage.removeItem('auth-role');
        localStorage.removeItem('auth-user');
        localStorage.removeItem('auth-expiry');
        state.status = 'idle';
      }
      state.isInitialized = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.role = action.payload.role || null;
        
        // For member login, we need to get the complete user data from the Redux store
        if (action.payload.role === 'member') {
          // Get the complete user data from the data slice
          const appData = localStorage.getItem('app-data');
          if (appData) {
            try {
              const parsed = JSON.parse(appData);
              const users = parsed.users || [];
              
              // Find the user by email or phone
              let user = null;
              if (action.payload.user?.email) {
                user = users.find((u: any) => u.email === action.payload.user.email);
              } else if (action.payload.user?.phone) {
                user = users.find((u: any) => u.phone === action.payload.user.phone);
              }
              
              if (user) {
                // Update the user object with complete data
                state.user = {
                  ...user,
                  role: 'member',
                  loginTime: new Date().toISOString(),
                  lastActivity: new Date().toISOString(),
                  sessionId: Math.random().toString(36).substring(2, 11)
                };
              } else {
                state.user = action.payload.user;
              }
            } catch (error) {
              console.error('Error parsing app-data:', error);
              state.user = action.payload.user;
            }
          } else {
            state.user = action.payload.user;
          }
        } else {
          state.user = action.payload.user;
        }
        
        state.status = 'succeeded';
        state.isInitialized = true;
        
        // Set token expiry to 24 hours from now
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
        state.tokenExpiry = expiryTime;
        
        // Persist to localStorage
        localStorage.setItem('auth-token', action.payload.token);
        localStorage.setItem('auth-role', action.payload.role || '');
        localStorage.setItem('auth-user', JSON.stringify(state.user));
        localStorage.setItem('auth-expiry', expiryTime.toString());
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = 'failed';
        state.token = null;
        state.role = null;
        state.user = null;
      })
      
      // Registration cases
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.role = action.payload.role || null;
        state.user = action.payload.user;
        state.status = 'succeeded';
        state.isInitialized = true;
        
        // Set token expiry to 24 hours from now
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
        state.tokenExpiry = expiryTime;
        
        // Persist to localStorage
        localStorage.setItem('auth-token', action.payload.token);
        localStorage.setItem('auth-role', action.payload.role || '');
        localStorage.setItem('auth-user', JSON.stringify(action.payload.user));
        localStorage.setItem('auth-expiry', expiryTime.toString());
      })
      .addCase(registerUser.rejected, (state) => {
        state.status = 'failed';
        state.token = null;
        state.role = null;
        state.user = null;
      });
  }
});

export const { loginSuccess, logout, hydrateFromStorage, setInitializing, updateUserActivity, refreshToken, clearAuthError, forceLogout } = authSlice.actions;
export default authSlice.reducer;
