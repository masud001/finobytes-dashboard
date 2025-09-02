import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { loginUser, registerUser, clearAuthError } from '../store/slices/authSlice';
import { addUser, addMerchant } from '../store/slices/dataSlice';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { DataManager } from '../utils/dataManager';

type Role = 'admin' | 'merchant' | 'member';
type Tab = 'login' | 'register';

// Form interfaces
interface AdminForm {
  email: string;
  password: string;
  adminCode: string;
}

interface MerchantForm {
  storeName: string;
  owner: string;
  email: string;
  password: string;
}

interface MemberForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  otp: string;
  isOtpSent: boolean;
  otpExpiry: number | null;
  loginMethod: 'email' | 'phone';
}

interface FieldErrors {
  adminEmail: string;
  adminPassword: string;
  adminCode: string;
  merchantStoreName: string;
  merchantOwner: string;
  merchantEmail: string;
  merchantPassword: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  memberPassword: string;
}

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { token, role, isInitialized, status } = useSelector((state: RootState) => state.auth);
  const { users, merchants } = useSelector((state: RootState) => state.data);
  
  // State management
  const [activeTab, setActiveTab] = useState<Tab>('login');
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [localError, setLocalError] = useState<string>('');
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);
  const [currentMerchants, setCurrentMerchants] = useState<any[]>([]);
  const [currentUsers, setCurrentUsers] = useState<any[]>([]);
  const [redirectCountdown, setRedirectCountdown] = useState<number>(3);

  // Form states
  const [adminForm, setAdminForm] = useState<AdminForm>({
    email: '',
    password: '',
    adminCode: ''
  });

  const [merchantForm, setMerchantForm] = useState<MerchantForm>({
    storeName: '',
    owner: '',
    email: '',
    password: ''
  });

  const [memberForm, setMemberForm] = useState<MemberForm>({
    name: '',
    email: '',
    phone: '',
    password: '',
    otp: '',
    isOtpSent: false,
    otpExpiry: null,
    loginMethod: 'email'
  });

  // Field-specific error states
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    adminEmail: '', adminPassword: '', adminCode: '',
    merchantStoreName: '', merchantOwner: '', merchantEmail: '', merchantPassword: '',
    memberName: '', memberEmail: '', memberPhone: '', memberPassword: ''
  });

  // ===== UTILITY FUNCTIONS =====

  // Form validation functions
  const validateEmailUniqueness = (email: string, role: Role): string => {
    if (!email) return '';
    
    if (role === 'merchant') {
      const existingMerchantEmails = merchants.map((m: any) => m.email);
      if (existingMerchantEmails.includes(email)) {
        return `A merchant with email "${email}" already exists`;
      }
    } else if (role === 'member') {
      const existingUserEmails = users.map((u: any) => u.email);
      if (existingUserEmails.includes(email)) {
        return `A member with email "${email}" already exists`;
      }
    }
    
    return '';
  };

  const validatePhoneUniqueness = (phone: string): string => {
    if (!phone) return '';
    
    const existingUserPhones = users.map((u: any) => u.phone);
    if (existingUserPhones.includes(phone)) {
      return `A member with phone "${phone}" already exists`;
    }
    
    return '';
  };

  const validateEmailFormat = (email: string): string => {
    if (!email) return '';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    return '';
  };

  // Form completion check functions
  const isMemberFormComplete = (): boolean => {
    return memberForm.name.trim() !== '' && 
           memberForm.email.trim() !== '' && 
           memberForm.phone.trim() !== '' && 
           memberForm.password.trim() !== '';
  };

  // Form reset functions
  const resetAllForms = () => {
    setAdminForm({ email: '', password: '', adminCode: '' });
    setMerchantForm({ storeName: '', owner: '', email: '', password: '' });
    setMemberForm({
      name: '', email: '', phone: '', password: '',
      otp: '', isOtpSent: false, otpExpiry: null, loginMethod: 'email'
    });
    setLocalError('');
    dispatch(clearAuthError());
    setRegistrationSuccess(false);
    clearFieldErrors();
    setRedirectCountdown(3);
  };

  // Clear field-specific errors
  const clearFieldErrors = () => {
    setFieldErrors({
      adminEmail: '', adminPassword: '', adminCode: '',
      merchantStoreName: '', merchantOwner: '', merchantEmail: '', merchantPassword: '',
      memberName: '', memberEmail: '', memberPhone: '', memberPassword: ''
    });
  };

  // Field update functions with validation
  const updateAdminField = (field: keyof AdminForm, value: string) => {
    setAdminForm(prev => ({ ...prev, [field]: value }));
    
    if (field === 'email' && activeTab === 'register') {
      const emailError = validateEmailFormat(value);
      setFieldErrors(prev => ({ ...prev, adminEmail: emailError }));
    }
  };

  const updateMerchantField = (field: keyof MerchantForm, value: string) => {
    setMerchantForm(prev => ({ ...prev, [field]: value }));
    
    if (field === 'email' && activeTab === 'register') {
      const emailError = validateEmailUniqueness(value, 'merchant');
      setFieldErrors(prev => ({ ...prev, merchantEmail: emailError }));
    }
  };

  const updateMemberField = (field: keyof MemberForm, value: string) => {
    setMemberForm(prev => ({ ...prev, [field]: value }));
    
    if (field === 'email' && activeTab === 'register') {
      const emailError = validateEmailUniqueness(value, 'member');
      setFieldErrors(prev => ({ ...prev, memberEmail: emailError }));
    } else if (field === 'phone' && activeTab === 'register') {
      const phoneError = validatePhoneUniqueness(value);
      setFieldErrors(prev => ({ ...prev, memberPhone: phoneError }));
    }
  };

  // Navigation functions
  const updateTab = (newTab: Tab) => {
    setActiveTab(newTab);
    const newPath = `/${newTab}/${selectedRole}`;
    setTimeout(() => {
      navigate(newPath, { replace: true });
    }, 0);
    resetAllForms();
  };

  const updateRole = (newRole: Role) => {
    setSelectedRole(newRole);
    
    // If switching to admin role and currently on register tab, redirect to login
    if (newRole === 'admin' && activeTab === 'register') {
      setActiveTab('login');
      const newPath = `/login/${newRole}`;
      setTimeout(() => {
        navigate(newPath, { replace: true });
      }, 0);
    } else {
      const newPath = `/${activeTab}/${newRole}`;
      setTimeout(() => {
        navigate(newPath, { replace: true });
      }, 0);
    }
    
    resetAllForms();
  };

  // Data management functions
  const updateCurrentData = () => {
    setCurrentMerchants(DataManager.getMerchants());
    setCurrentUsers(DataManager.getUsers());
  };

  const proceedToLogin = () => {
    setRegistrationSuccess(false);
    setRedirectCountdown(3);
    updateTab('login');
  };

  // Countdown and redirect functions
  const startRedirectCountdown = () => {
    setRedirectCountdown(3);
    const countdownInterval = setInterval(() => {
      setRedirectCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          updateTab('login');
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ===== EFFECTS =====

  // Initialize from URL params
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    if (pathSegments[1] === 'login' || pathSegments[1] === 'register') {
      setActiveTab(pathSegments[1] as Tab);
    }
    if (pathSegments[2] && ['admin', 'merchant', 'member'].includes(pathSegments[2])) {
      setSelectedRole(pathSegments[2] as Role);
    }
  }, [location.pathname]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isInitialized && token && role) {
      // Use setTimeout to avoid updating during render
      setTimeout(() => {
        navigate(`/dashboard/${role}`);
      }, 0);
    }
  }, [isInitialized, token, role, navigate]);

  // Reset forms when tab changes
  useEffect(() => {
    resetAllForms();
  }, [activeTab]);

  // Clear field errors when switching between login and registration
  useEffect(() => {
    clearFieldErrors();
  }, [activeTab]);

  // Update current data when role changes
  useEffect(() => {
    updateCurrentData();
  }, [selectedRole]);



  // Handle form submissions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    setLocalError('');
    
    // Basic validation
    if (activeTab === 'login') {
      if (selectedRole === 'admin' && (!adminForm.email || !adminForm.password)) {
        setLocalError('Email and password are required for admin login');
        return;
      }
      if (selectedRole === 'merchant' && (!merchantForm.email || !merchantForm.password)) {
        setLocalError('Email and password are required for merchant login');
        return;
      }
      if (selectedRole === 'member') {
        if (memberForm.loginMethod === 'email') {
          // Email + Password validation
          if (!memberForm.email || !memberForm.password) {
            setLocalError('Email and password are required for email login');
            return;
          }
        } else if (memberForm.loginMethod === 'phone') {
          // Phone + OTP validation
          if (!memberForm.phone || !memberForm.otp) {
            setLocalError('Phone number and OTP are required for phone login');
            return;
          }
        }
      }
    } else {
      // Registration validation
      if (selectedRole === 'admin' && (!adminForm.email || !adminForm.password || !adminForm.adminCode)) {
        setLocalError('Email, password, and admin code are required for admin registration');
        return;
      }
      if (selectedRole === 'merchant' && (!merchantForm.storeName || !merchantForm.owner || !merchantForm.email || !merchantForm.password)) {
        setLocalError('Store name, owner, email, and password are required for merchant registration');
        return;
      }
      if (selectedRole === 'member' && (!memberForm.name || !memberForm.email || !memberForm.phone || !memberForm.password)) {
        setLocalError('Name, email, phone number, and password are required for member registration');
        return;
      }
    }

    try {
      if (activeTab === 'login') {
        await handleLogin();
      } else {
        await handleRegistration();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setLocalError(errorMessage);
    }
  };

  const handleLogin = async () => {
    try {
      let result;
      
      if (selectedRole === 'admin') {
        // Admin login - use existing Redux action
        result = await dispatch(loginUser({
          email: adminForm.email,
          password: adminForm.password,
          role: 'admin'
        }));
      } else if (selectedRole === 'merchant') {
        // Check if merchant exists in our data store
        const merchant = merchants.find(m => 
          m.email === merchantForm.email && m.password === merchantForm.password
        );
        
        if (!merchant) {
          setLocalError('Invalid merchant credentials. Please check your email and password.');
          return;
        }
        
        // Login successful - use Redux action
        result = await dispatch(loginUser({
          email: merchantForm.email,
          password: merchantForm.password,
          role: 'merchant'
        }));
      } else if (selectedRole === 'member') {
        let member;
        let loginResult;
        
        if (memberForm.loginMethod === 'email') {
          // Email + Password login
          member = users.find(u => u.email === memberForm.email && u.password === memberForm.password);
          
          if (!member) {
            setLocalError('Invalid email or password. Please check your credentials.');
            return;
          }
          
          // Login successful - use Redux action
          loginResult = await dispatch(loginUser({
            email: memberForm.email,
            password: memberForm.password,
            role: 'member'
          }));
          
          if (loginResult) {
            setLocalError(''); // Clear any previous errors
            // Success message will be shown by Redux status
          }
          
        } else if (memberForm.loginMethod === 'phone') {
          // Phone + OTP login
          member = users.find(u => normalizePhoneNumber(u.phone) === normalizePhoneNumber(memberForm.phone));
          
          if (!member) {
            setLocalError('No account found with this phone number. Please register first.');
            return;
          }
          
          // Verify OTP
          if (!verifyOTP(memberForm.otp)) {
            setLocalError('Invalid OTP code. Please check and try again.');
            return;
          }
          
          // Login successful - use Redux action with OTP
          loginResult = await dispatch(loginUser({
            phone: memberForm.phone,
            otp: memberForm.otp, // Pass OTP for phone login
            role: 'member'
          }));
          
          if (loginResult) {
            setLocalError(''); // Clear any previous errors
            // Success message will be shown by Redux status
          }
        }
      }
      
      if (result) {
        // The login action will handle the redirect
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setLocalError(errorMessage);
    }
  };

  const handleRegistration = async () => {
    try {
      if (selectedRole === 'admin') {
        // For admin registration, we'll use the existing Redux action
        await dispatch(registerUser({
          name: adminForm.email?.split('@')[0] || 'Admin',
          email: adminForm.email,
          password: adminForm.password,
          role: 'admin',
          adminCode: adminForm.adminCode
        }));
        
        // Show success message and redirect to login page
        setRegistrationSuccess(true);
        setLocalError(''); // Clear any errors
        
        // Reset form
        setAdminForm({
          email: '',
          password: '',
          adminCode: ''
        });
        
        // Start countdown and redirect to login page
        startRedirectCountdown();
      } else if (selectedRole === 'merchant') {
        // Check email uniqueness before registration
        const existingMerchantEmails = merchants.map((m: any) => m.email);
        if (existingMerchantEmails.includes(merchantForm.email)) {
          setLocalError(`A merchant with email "${merchantForm.email}" already exists. Please use a different email address.`);
          return;
        }
        
        // Save merchant to data store first
        await dispatch(addMerchant({
          storeName: merchantForm.storeName,
          owner: merchantForm.owner,
          email: merchantForm.email,
          password: merchantForm.password
        }));
        
        // Small delay to ensure Redux store and localStorage are updated
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Use localStorage directly since Redux state might not be updated immediately
        let newMerchant = null;
        try {
          const appData = localStorage.getItem('app-data');
          if (appData) {
            const parsed = JSON.parse(appData);
            const localMerchants = parsed.merchants || [];
            newMerchant = localMerchants.find((m: any) => m.email === merchantForm.email);
          }
        } catch (error) {
          console.warn('Error reading merchant data from localStorage:', error);
        }
        
        if (newMerchant) {
          // Show success message and redirect to login page
          setRegistrationSuccess(true);
          setLocalError(''); // Clear any errors
          
          // Reset form
          setMerchantForm({
            storeName: '',
            owner: '',
            email: '',
            password: ''
          });
          
          // Start countdown and redirect to login page
          startRedirectCountdown();
          
        } else {
          console.error('Merchant not found in localStorage after adding');
          setLocalError('Registration successful but merchant not found in store. Please login manually.');
          setRegistrationSuccess(true);
        }
      } else if (selectedRole === 'member') {
        // Check email uniqueness before registration (if email is provided)
        if (memberForm.email) {
          const existingUserEmails = users.map((u: any) => u.email);
          if (existingUserEmails.includes(memberForm.email)) {
            setLocalError(`A member with email "${memberForm.email}" already exists. Please use a different email address.`);
            return;
          }
        }
        
        // Check phone uniqueness before registration (if phone is provided)
        if (memberForm.phone) {
          const existingUserPhones = users.map((u: any) => u.phone);
          if (existingUserPhones.includes(memberForm.phone)) {
            setLocalError(`A member with phone "${memberForm.phone}" already exists. Please use a different phone number.`);
            return;
          }
        }
        
        // Save member to data store first
        await dispatch(addUser({
          name: memberForm.name,
          email: memberForm.email,
          phone: memberForm.phone,
          password: memberForm.password
        }));
        
        // Small delay to ensure Redux store and localStorage are updated
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Use localStorage directly since Redux state might not be updated immediately
        let newMember = null;
        try {
          const appData = localStorage.getItem('app-data');
          if (appData) {
            const parsed = JSON.parse(appData);
            const localUsers = parsed.users || [];
            newMember = localUsers.find((u: any) => 
              (memberForm.email && u.email === memberForm.email) || 
              (memberForm.phone && u.phone === memberForm.phone)
            );
          }
        } catch (error) {
          console.warn('Error reading user data from localStorage:', error);
        }
        
        if (newMember) {
          // Show success message and redirect to login page
          setRegistrationSuccess(true);
          setLocalError(''); // Clear any errors
          
          // Reset form
          setMemberForm({
            name: '',
            email: '',
            phone: '',
            password: '',
            otp: '',
            isOtpSent: false,
            otpExpiry: null,
            loginMethod: 'email'
          });
          
          // Start countdown and redirect to login page
          startRedirectCountdown();
          
        } else {
          console.error('Member not found in localStorage after adding');
          setLocalError('Registration successful but member not found in store. Please login manually.');
          setRegistrationSuccess(true);
        }
      }
      
      // The login action will handle the redirect
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setLocalError(errorMessage);
    }
  };

  // Get role icon
  const getRoleIcon = (role: Role) => {
    switch (role) {
      case 'admin':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'merchant':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'member':
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Phone number utilities
  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as +880 17XX XXX XXX (Bangladesh format)
    if (cleaned.length === 11 && cleaned.startsWith('17')) {
      return `+880 ${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    } else if (cleaned.length === 13 && cleaned.startsWith('88017')) {
      return `+880 ${cleaned.slice(3, 7)} ${cleaned.slice(7, 10)} ${cleaned.slice(10)}`;
    } else if (cleaned.length === 10 && cleaned.startsWith('17')) {
      return `+880 ${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    } else if (cleaned.length === 13 && cleaned.startsWith('88017')) {
      return `+880 ${cleaned.slice(3, 7)} ${cleaned.slice(7, 10)} ${cleaned.slice(10)}`;
    }
    
    return phone;
  };

  const validatePhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    // Bangladesh mobile: 17XXXXXXXX (11 digits) or +88017XXXXXXXX (13 digits)
    // Also accept: 017XXXXXXXX (10 digits) or 88017XXXXXXXX (13 digits)
    return (cleaned.length === 11 && cleaned.startsWith('17')) || 
           (cleaned.length === 13 && cleaned.startsWith('88017')) ||
           (cleaned.length === 10 && cleaned.startsWith('17')) ||
           (cleaned.length === 13 && cleaned.startsWith('88017'));
  };

  // Normalize phone number for comparison (remove all non-digits)
  const normalizePhoneNumber = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  const generateOTP = () => {
    return "123456"; // Fixed demo OTP for easy testing
  };

  const sendOTP = (phone: string) => {
    // Only validate phone format during registration
    if (activeTab === 'register' && !validatePhoneNumber(phone)) {
      setLocalError('Please enter a valid Bangladesh phone number (e.g., +8801710000001, 01710000001, or 1710000001)');
      return false;
    }

    const otp = generateOTP();
    const expiry = Date.now() + (5 * 60 * 1000); // 5 minutes
    
    setMemberForm(prev => ({
      ...prev,
      otp: '',
      isOtpSent: true,
      otpExpiry: expiry
    }));

    // Simulate OTP sending (in real app, this would call an SMS service)
    
    // For demo purposes, show the OTP in console and alert
    alert(`📱 Demo OTP: ${otp}\n\nThis is a FIXED demo OTP for testing purposes.\n\nPhone: ${formatPhoneNumber(phone)}\n\nIn a real app, this would be sent via SMS.`);
    
    return true;
  };

  const verifyOTP = (otp: string) => {
    // For demo purposes, accept any 6-digit OTP
    if (otp.length === 6 && /^\d{6}$/.test(otp)) {
      return true;
    }
    return false;
  };

  // Render form based on role and tab
  const renderForm = () => {
    if (activeTab === 'login') {
      return renderLoginForm();
    }
    return renderRegistrationForm();
  };

  const renderLoginForm = () => {
    switch (selectedRole) {
      case 'admin':
        return (
          <div className="space-y-4">
            <FormInput
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={adminForm.email}
              onChange={(e) => updateAdminField('email', e.target.value)}
              required
            />
            {fieldErrors.adminEmail && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.adminEmail}</p>
            )}
            <FormInput
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={adminForm.password}
              onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
              required
            />
          </div>
        );

      case 'merchant':
        return (
          <div className="space-y-4">
            <FormInput
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={merchantForm.email}
              onChange={(e) => updateMerchantField('email', e.target.value)}
              required
            />
            {fieldErrors.merchantEmail && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.merchantEmail}</p>
            )}
            <FormInput
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={merchantForm.password}
              onChange={(e) => setMerchantForm({ ...merchantForm, password: e.target.value })}
              required
            />
          </div>
        );

      case 'member':
        return (
          <div className="space-y-4">
            {/* Login Method Selection */}
            <div className="flex space-x-2 mb-4">
              <button
                type="button"
                onClick={() => setMemberForm(prev => ({ ...prev, loginMethod: 'email' }))}
                className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  memberForm.loginMethod === 'email'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📧 Email + Password
              </button>
              <button
                type="button"
                onClick={() => setMemberForm(prev => ({ ...prev, loginMethod: 'phone' }))}
                className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  memberForm.loginMethod === 'phone'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📱 Phone + OTP
              </button>
            </div>

            {/* Email + Password Login Form */}
            {memberForm.loginMethod === 'email' && (
              <div className="space-y-4">
                <FormInput
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  value={memberForm.email}
                  onChange={(e) => updateMemberField('email', e.target.value)}
                  required
                />
                {fieldErrors.memberEmail && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.memberEmail}</p>
                )}
                <FormInput
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={memberForm.password}
                  onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
                  required
                />
                <p className="text-sm text-gray-600">
                  💡 Use your registered email and password to login
                </p>
              </div>
            )}

            {/* Phone + OTP Login Form */}
            {memberForm.loginMethod === 'phone' && (
              <div className="space-y-4">
                {/* Step 1: Phone Number Input */}
                {!memberForm.isOtpSent && (
                  <div className="space-y-3">
                    <FormInput
                      id="phone"
                      name="phone"
                      label="Phone Number"
                      type="tel"
                      placeholder="Enter your phone number (e.g., +8801710000001)"
                      value={memberForm.phone}
                      onChange={(e) => updateMemberField('phone', e.target.value)}
                      required
                    />
                    {fieldErrors.memberPhone && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.memberPhone}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => sendOTP(memberForm.phone)}
                      disabled={!memberForm.phone || (activeTab === 'register' && !validatePhoneNumber(memberForm.phone))}
                      className={`w-full px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        !memberForm.phone || (activeTab === 'register' && !validatePhoneNumber(memberForm.phone))
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                    >
                      📱 Send OTP
                    </button>
                    <p className="text-sm text-gray-600">
                      💡 Enter your registered phone number to receive an OTP
                    </p>
                  </div>
                )}

                {/* Step 2: OTP Input */}
                {memberForm.isOtpSent && (
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                      <p className="text-sm text-purple-700">
                        📱 OTP sent to {formatPhoneNumber(memberForm.phone)}
                      </p>
                      {memberForm.otpExpiry && (
                        <p className="text-xs text-purple-600 mt-1">
                          Expires in {Math.max(0, Math.ceil((memberForm.otpExpiry - Date.now()) / 1000))} seconds
                        </p>
                      )}
                    </div>
                    
                    <FormInput
                      id="otp"
                      name="otp"
                      label="OTP Code"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={memberForm.otp}
                      onChange={(e) => setMemberForm({ ...memberForm, otp: e.target.value })}
                      required
                    />
                    
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => sendOTP(memberForm.phone)}
                        disabled={memberForm.otpExpiry ? Date.now() < memberForm.otpExpiry : false}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                          memberForm.otpExpiry && Date.now() < memberForm.otpExpiry
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-purple-500 text-white hover:bg-purple-600'
                        }`}
                      >
                        {memberForm.otpExpiry && Date.now() < memberForm.otpExpiry
                          ? '⏳ Wait...'
                          : '🔄 Resend OTP'
                        }
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setMemberForm(prev => ({ ...prev, isOtpSent: false, otp: '', otpExpiry: null }))}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        ✏️ Change Phone
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      💡 Enter the 6-digit OTP sent to your phone
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderRegistrationForm = () => {
    switch (selectedRole) {
      case 'admin':
        return (
          <div className="space-y-4">
            <FormInput
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={adminForm.email}
              onChange={(e) => updateAdminField('email', e.target.value)}
              required
            />
            {fieldErrors.adminEmail && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.adminEmail}</p>
            )}
            <FormInput
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="Create a password"
              value={adminForm.password}
              onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
              required
            />
            <FormInput
              id="adminCode"
              name="adminCode"
              label="Admin Code"
              type="text"
              placeholder="Enter admin code (ADMIN2024)"
              value={adminForm.adminCode}
              onChange={(e) => setAdminForm({ ...adminForm, adminCode: e.target.value })}
              required
            />
          </div>
        );

      case 'merchant':
        return (
          <div className="space-y-4">
            <FormInput
              id="storeName"
              name="storeName"
              label="Store Name"
              type="text"
              placeholder="Enter store name"
              value={merchantForm.storeName}
              onChange={(e) => setMerchantForm({ ...merchantForm, storeName: e.target.value })}
              required
            />
            <FormInput
              id="owner"
              name="owner"
              label="Owner Name"
              type="text"
              placeholder="Enter owner name"
              value={merchantForm.owner}
              onChange={(e) => setMerchantForm({ ...merchantForm, owner: e.target.value })}
              required
            />
            <FormInput
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={merchantForm.email}
              onChange={(e) => updateMerchantField('email', e.target.value)}
              required
            />
            {fieldErrors.merchantEmail && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.merchantEmail}</p>
            )}
            <FormInput
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="Create a password"
              value={merchantForm.password}
              onChange={(e) => setMerchantForm({ ...merchantForm, password: e.target.value })}
              required
            />
          </div>
        );

      case 'member':
        return (
          <div className="space-y-4">
            <FormInput
              id="name"
              name="name"
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={memberForm.name}
              onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
              required
            />
            <FormInput
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={memberForm.email}
              onChange={(e) => updateMemberField('email', e.target.value)}
              required
            />
            {fieldErrors.memberEmail && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.memberEmail}</p>
            )}
            <FormInput
              id="phone"
              name="phone"
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number (e.g., +8801710000001)"
              value={memberForm.phone}
              onChange={(e) => updateMemberField('phone', e.target.value)}
              required
            />
            {fieldErrors.memberPhone && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.memberPhone}</p>
            )}
            <FormInput
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="Create a password"
              value={memberForm.password}
              onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
              required
            />
            <p className="text-sm text-gray-600">
              💡 <strong>Note:</strong> Both email and phone number are required. You can use either email+password or phone+OTP for login. 
              {activeTab === 'register' && memberForm.phone && !validatePhoneNumber(memberForm.phone) && (
                <span className="text-red-600 block mt-1">
                  ⚠️ Please enter a valid Bangladesh phone number (e.g., +8801710000001)
                </span>
              )}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (token && role) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-3 ${
              selectedRole === 'admin' ? 'bg-blue-500' 
              : selectedRole === 'merchant' ? 'bg-green-500' 
              : 'bg-purple-500'
            }`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Finobytes</h1>
          </div>
          <p className="text-gray-600">Access your dashboard</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex">
            <button
              onClick={() => updateTab('login')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'login'
                  ? selectedRole === 'admin' 
                    ? 'bg-blue-500 text-white'
                    : selectedRole === 'merchant'
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => updateTab('register')}
              disabled={selectedRole === 'admin'}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                activeTab === 'register'
                  ? selectedRole === 'admin' 
                    ? 'bg-blue-500 text-white'
                    : selectedRole === 'merchant'
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-500 text-white'
                  : selectedRole === 'admin'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Register
            </button>
          </div>

          {/* Role Selection */}
          <div className="p-6 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['admin', 'merchant', 'member'] as Role[]).map((roleOption) => (
                <button
                  key={roleOption}
                  onClick={() => updateRole(roleOption)}
                  className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                    selectedRole === roleOption
                      ? roleOption === 'admin' 
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : roleOption === 'merchant'
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 mb-2 ${
                    selectedRole === roleOption 
                      ? roleOption === 'admin'
                        ? 'text-blue-600'
                        : roleOption === 'merchant'
                        ? 'text-green-600'
                        : 'text-purple-600'
                      : 'text-gray-400'
                  }`}>
                    {getRoleIcon(roleOption)}
                  </div>
                  <span className={`text-xs font-medium capitalize ${
                    selectedRole === roleOption
                      ? roleOption === 'admin'
                        ? 'text-blue-700'
                        : roleOption === 'merchant'
                        ? 'text-green-700'
                        : 'text-purple-700'
                      : 'text-gray-600'
                  }`}>
                    {roleOption}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            {/* Role Indicator */}
            <div className={`mb-4 p-3 rounded-lg border ${
              selectedRole === 'admin' 
                ? 'bg-blue-50 border-blue-200'
                : selectedRole === 'merchant'
                ? 'bg-green-50 border-green-200'
                : 'bg-purple-50 border-purple-200'
            }`}>
              <div className="flex items-center justify-center">
                <div className={`w-5 h-5 mr-2 ${
                  selectedRole === 'admin' 
                    ? 'text-blue-500'
                    : selectedRole === 'merchant'
                    ? 'text-green-500'
                    : 'text-purple-500'
                }`}>
                  {getRoleIcon(selectedRole)}
                </div>
                <span className={`text-sm font-semibold capitalize ${
                  selectedRole === 'admin' 
                    ? 'text-blue-500'
                    : selectedRole === 'merchant'
                    ? 'text-green-500'
                    : 'text-purple-500'
                }`}>
                  {selectedRole} {activeTab === 'login' ? 'Login' : 'Registration'}
                </span>
              </div>
              
              {/* Admin-specific message */}
              {selectedRole === 'admin' && (
                <div className="mt-2 text-center">
                  <p className="text-xs text-blue-600">
                    🔒 Admin accounts are predefined. Contact system administrator for access.
                  </p>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderForm()}

              {/* Local validation errors */}
              {localError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">
                    Error: {typeof localError === 'string' ? localError : JSON.stringify(localError, null, 2)}
                  </p>
                </div>
              )}

              {/* Redux store errors */}
              {status === 'failed' && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">
                    Authentication failed. Please check your credentials and try again.
                  </p>
                </div>
              )}

              {/* Success message */}
              {status === 'succeeded' && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm text-green-600">
                    Authentication successful! Redirecting to dashboard in {redirectCountdown} seconds...
                  </p>
                </div>
              )}

              {/* Registration success message */}
              {activeTab === 'register' && registrationSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm text-green-600 mb-2">
                    ✅ Registration successful! Your account has been created.
                  </p>
                  <p className="text-xs text-green-700 mb-2">
                    💡 You will be automatically redirected to the login page in {redirectCountdown} seconds.
                  </p>
                  <p className="text-xs text-green-700">
                    🚀 You can now sign in with your newly created credentials.
                  </p>
                  <button
                    type="button"
                    onClick={proceedToLogin}
                    className={`mt-2 text-xs px-3 py-1 rounded-md transition-colors ${
                      selectedRole === 'admin' 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : selectedRole === 'merchant'
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    Go to Login Now
                  </button>
                </div>
              )}

              <FormButton
                type="submit"
                disabled={status === 'loading' || (activeTab === 'register' && selectedRole === 'member' && !isMemberFormComplete())}
                className={`w-full text-white font-semibold text-base py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  selectedRole === 'admin' 
                    ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
                    : selectedRole === 'merchant'
                    ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
                    : 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-500'
                }`}
                variant="primary"
              >
                {status === 'loading' ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : null}
                {status === 'loading' 
                  ? 'Processing...' 
                  : activeTab === 'login' 
                    ? 'Sign In' 
                    : 'Create Account'
                }
              </FormButton>
            </form>

            {/* Demo Credentials */}
            {activeTab === 'login' && (
              <div className={`mt-6 p-4 rounded-lg border ${
                selectedRole === 'admin' 
                  ? 'bg-blue-50 border-blue-200'
                  : selectedRole === 'merchant'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-purple-50 border-purple-200'
              }`}>
                <h2 className={`text-sm font-semibold mb-2 ${
                  selectedRole === 'admin' 
                    ? 'text-blue-500'
                    : selectedRole === 'merchant'
                    ? 'text-green-500'
                    : 'text-purple-500'
                }`}>
                  {selectedRole === 'member' 
                    ? `Demo Credentials (${memberForm.loginMethod === 'email' ? 'Email + Password' : 'Phone + OTP'}):`
                    : 'Demo Credentials:'
                  }
                </h2>
                <div className={`text-xs space-y-1 ${
                  selectedRole === 'admin' 
                    ? 'text-blue-500'
                    : selectedRole === 'merchant'
                    ? 'text-green-500'
                    : 'text-purple-500'
                }`}>
                  {selectedRole === 'admin' && (
                    <p><strong>Admin:</strong> admin@finobytes.com / admin123</p>
                  )}
                  {selectedRole === 'merchant' && (
                    <>
                      {currentMerchants.length > 0 ? (
                        <div className="space-y-2">
                          {currentMerchants.slice(-5).map((merchant: any) => (
                            <p key={merchant.id} className="text-xs">
                              <strong>{merchant.storeName}:</strong> {merchant.email} / {merchant.password}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p><strong>Merchant:</strong> mizan@shopone.com / shopone123</p>
                      )}
                    </>
                  )}
                  {selectedRole === 'member' && (
                    <>
                      {currentUsers.length > 0 ? (
                        <div className="space-y-2">
                          {memberForm.loginMethod === 'email' ? (
                            // Show email + password for email login method
                            currentUsers.slice(-5).map((user: any) => (
                              <p key={user.id} className="text-xs">
                                <strong>{user.name}:</strong> {user.email} / {user.password}
                              </p>
                            ))
                          ) : (
                            // Show phone + OTP for phone login method
                            currentUsers.slice(-5).map((user: any) => (
                              <p key={user.id} className="text-xs">
                                <strong>{user.name}:</strong> {user.phone} / OTP: <span className="font-mono bg-purple-100 px-1 rounded">123456</span>
                              </p>
                            ))
                          )}
                        </div>
                      ) : (
                        // Fallback when no users exist
                        memberForm.loginMethod === 'email' ? (
                          <p><strong>Member:</strong> alice@example.com / alice123</p>
                        ) : (
                          <p><strong>Member:</strong> +8801710000001 / OTP: <span className="font-mono bg-purple-100 px-1 rounded">123456</span></p>
                        )
                      )}
                    </>
                  )}
                </div>
                {((selectedRole === 'merchant' && currentMerchants.length > 0) || 
                  (selectedRole === 'member' && currentUsers.length > 0)) && (
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-xs opacity-75">
                      💡 <strong>Login Methods:</strong>
                      {selectedRole === 'member' && (
                        <span className="block mt-1">
                          {memberForm.loginMethod === 'email' ? (
                            <>• <strong>Email:</strong> Use email + password</>
                          ) : (
                            <>• <strong>Phone:</strong> Use phone + OTP (123456)</>
                          )}
                        </span>
                      )}
                      {selectedRole === 'merchant' && (
                        <span className="block mt-1">
                          • Use email + password to login
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back Button - Positioned under the card */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center justify-center mx-auto transition-all duration-200 px-4 py-2 rounded-lg font-medium ${
              selectedRole === 'admin'
                ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-200 hover:border-blue-300'
                : selectedRole === 'merchant'
                ? 'text-green-600 hover:text-green-800 hover:bg-green-50 border border-green-200 hover:border-green-300'
                : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50 border border-purple-200 hover:border-purple-300'
            }`}
          >
            <svg className={`w-5 h-5 mr-2 ${
              selectedRole === 'admin'
                ? 'text-blue-600'
                : selectedRole === 'merchant'
                ? 'text-green-600'
                : 'text-purple-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;