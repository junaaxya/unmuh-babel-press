// 
'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export default function FormInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  required = false,
  disabled = false,
  readOnly = false,
  icon,
  helpText,
  maxLength,
  ...props
}) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          className={`
            w-full px-3 py-2 border rounded-lg transition-colors
            ${error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${readOnly ? 'bg-gray-50' : ''}
            focus:ring-2 focus:outline-none
          `}
          {...props}
        />
        
        {maxLength && (
          <div className="absolute right-2 top-2 text-xs text-gray-400">
            {value?.length || 0}/{maxLength}
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center space-x-1 text-red-600 text-sm">
          <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}
