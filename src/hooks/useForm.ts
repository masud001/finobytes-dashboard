import { useState, useCallback } from 'react';
import { validateField } from '../utils';

// Define interface locally to avoid import issues
interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

interface FormState {
  [key: string]: FormField;
}

interface UseFormOptions {
  initialValues: { [key: string]: string };
  onSubmit: (values: { [key: string]: string }) => void | Promise<void>;
  validators?: { [key: string]: Array<(value: string) => ValidationResult> };
}

export const useForm = ({ initialValues, onSubmit, validators = {} }: UseFormOptions) => {
  // Initialize form state
  const [formState, setFormState] = useState<FormState>(() => {
    const state: FormState = {};
    Object.keys(initialValues).forEach(key => {
      state[key] = {
        value: initialValues[key],
        error: undefined,
        touched: false
      };
    });
    return state;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | undefined>();

  // Update field value
  const setFieldValue = useCallback((fieldName: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        error: undefined // Clear error when user types
      }
    }));
  }, []);

  // Mark field as touched
  const setFieldTouched = useCallback((fieldName: string) => {
    setFormState(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        touched: true
      }
    }));
  }, []);

  // Validate a single field
  const validateFieldByName = useCallback((fieldName: string): boolean => {
    const field = formState[fieldName];
    const fieldValidators = validators[fieldName] || [];
    
    if (fieldValidators.length === 0) return true;
    
    const result = validateField(field.value, fieldName, fieldValidators);
    
    setFormState(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        error: result.error
      }
    }));
    
    return result.isValid;
  }, [formState, validators]);

  // Validate all fields at once
  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newFormState = { ...formState };
    
    Object.keys(formState).forEach(fieldName => {
      const field = formState[fieldName];
      const fieldValidators = validators[fieldName] || [];
      
      if (fieldValidators.length > 0) {
        const result = validateField(field.value, fieldName, fieldValidators);
        if (!result.isValid) {
          isValid = false;
        }
        newFormState[fieldName] = {
          ...field,
          error: result.error
        };
      }
    });
    
    // Update all fields at once instead of individually
    setFormState(newFormState);
    return isValid;
  }, [formState, validators]);

  // Handle field blur (validate on blur)
  const handleFieldBlur = useCallback((fieldName: string) => {
    setFieldTouched(fieldName);
    validateFieldByName(fieldName);
  }, [setFieldTouched, validateFieldByName]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear general error
    setGeneralError(undefined);
    
    // Validate all fields
    if (!validateForm()) {
      return;
    }
    
    // Mark all fields as touched at once
    const updatedFormState = { ...formState };
    Object.keys(updatedFormState).forEach(fieldName => {
      updatedFormState[fieldName] = {
        ...updatedFormState[fieldName],
        touched: true
      };
    });
    setFormState(updatedFormState);
    
    // Prepare values for submission
    const values: { [key: string]: string } = {};
    Object.keys(formState).forEach(key => {
      values[key] = formState[key].value;
    });
    
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [formState, validateForm, onSubmit]);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setFormState(() => {
      const state: FormState = {};
      Object.keys(initialValues).forEach(key => {
        state[key] = {
          value: initialValues[key],
          error: undefined,
          touched: false
        };
      });
      return state;
    });
    setGeneralError(undefined);
  }, [initialValues]);

  // Get field props for FormInput component
  const getFieldProps = useCallback((fieldName: string) => {
    const field = formState[fieldName];
    return {
      value: field.value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setFieldValue(fieldName, e.target.value),
      onBlur: () => handleFieldBlur(fieldName),
      error: field.touched ? field.error : undefined
    };
  }, [formState, setFieldValue, handleFieldBlur]);

  return {
    formState,
    isSubmitting,
    generalError,
    setFieldValue,
    setFieldTouched,
    validateFieldByName,
    validateForm,
    handleSubmit,
    resetForm,
    getFieldProps
  };
};
