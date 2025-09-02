import { forwardRef } from 'react';

interface FormInputProps {
  id: string;
  name: string;
  type: 'text' | 'email' | 'password' | 'tel';
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  theme?: 'admin' | 'merchant' | 'member';
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  autoComplete,
  className = '',
  theme = 'admin'
}, ref) => {
  // Theme-based color schemes
  const themeColors = {
    admin: {
      focus: 'focus:ring-blue-500 focus:border-blue-500',
      label: 'text-gray-700',
      required: 'text-red-500',
      background: 'bg-blue-50',
      border: 'border-blue-200',
      focusBg: 'focus:bg-white'
    },
    merchant: {
      focus: 'focus:ring-green-500 focus:border-green-500',
      label: 'text-gray-700',
      required: 'text-red-500',
      background: 'bg-green-50',
      border: 'border-green-200',
      focusBg: 'focus:bg-white'
    },
    member: {
      focus: 'focus:ring-purple-500 focus:border-purple-500',
      label: 'text-gray-700',
      required: 'text-red-500',
      background: 'bg-purple-50',
      border: 'border-purple-200',
      focusBg: 'focus:bg-white'
    }
  };

  const colors = themeColors[theme];

  return (
    <div className={className}>
      <label htmlFor={id} className={`block text-sm font-medium ${colors.label} mb-2`}>
        {label}
        {required && <span className={`${colors.required} ml-1`}>*</span>}
      </label>
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`
          block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400
          ${colors.background} ${colors.border}
          focus:outline-none focus:ring-2 ${colors.focus} ${colors.focusBg}
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          transition-colors duration-200
          ${error 
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50' 
            : ''
          }
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
