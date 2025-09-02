// Validation utility functions
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

// Email uniqueness validation for merchants
export const validateMerchantEmailUnique = (email: string, existingEmails: string[]): ValidationResult => {
  if (existingEmails.includes(email)) {
    return { 
      isValid: false, 
      error: `A merchant with email "${email}" already exists. Please use a different email address.` 
    };
  }
  
  return { isValid: true };
};

// Email uniqueness validation for members
export const validateMemberEmailUnique = (email: string, existingEmails: string[]): ValidationResult => {
  if (existingEmails.includes(email)) {
    return { 
      isValid: false, 
      error: `A member with email "${email}" already exists. Please use a different email address.` 
    };
  }
  
  return { isValid: true };
};

// Combined email validation for merchants (format + uniqueness)
export const validateMerchantEmail = (email: string, existingEmails: string[]): ValidationResult => {
  // First check format
  const formatResult = validateEmail(email);
  if (!formatResult.isValid) {
    return formatResult;
  }
  
  // Then check uniqueness
  return validateMerchantEmailUnique(email, existingEmails);
};

// Combined email validation for members (format + uniqueness)
export const validateMemberEmail = (email: string, existingEmails: string[]): ValidationResult => {
  // First check format
  const formatResult = validateEmail(email);
  if (!formatResult.isValid) {
    return formatResult;
  }
  
  // Then check uniqueness
  return validateMemberEmailUnique(email, existingEmails);
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }
  
  return { isValid: true };
};

// Phone number validation (Bangladesh format)
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Bangladesh phone number format: 01XXXXXXXXX (11 digits starting with 01)
  const phoneRegex = /^01[3-9]\d{8}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Please enter a valid Bangladesh phone number' };
  }
  
  return { isValid: true };
};

// Required field validation
export const validateRequired = (
  value: string,
  _fieldName: string,
  customMessage?: string
): ValidationResult => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${customMessage || 'This field'} is required` };
  }
  
  return { isValid: true };
};

// OTP validation
export const validateOTP = (otp: string): ValidationResult => {
  if (!otp) {
    return { isValid: false, error: 'OTP is required' };
  }
  
  if (otp.length !== 6) {
    return { isValid: false, error: 'OTP must be 6 digits' };
  }
  
  if (!/^\d{6}$/.test(otp)) {
    return { isValid: false, error: 'OTP must contain only numbers' };
  }
  
  return { isValid: true };
};

// Generic validation function
export const validateField = (
  value: string, 
  _fieldName: string, 
  validators: Array<(value: string) => ValidationResult>
): ValidationResult => {
  for (const validator of validators) {
    const result = validator(value);
    if (!result.isValid) {
      return result;
    }
  }
  
  return { isValid: true };
};
