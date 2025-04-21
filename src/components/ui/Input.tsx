import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  error?: string;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      icon,
      iconPosition = 'left',
      error,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    // Base classes
    const baseClasses = 'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400';

    const errorClasses = error
      ? 'border-danger-500 focus:ring-danger-500'
      : '';

    const fullWidthClass = fullWidth ? 'w-full' : '';

    // Icon classes
    const withIconClass = icon
      ? iconPosition === 'left'
        ? 'pl-9'
        : 'pr-9'
      : '';

    return (
      <div className={cn('relative', fullWidthClass)}>
        {icon && (
          <div
            className={cn(
              'absolute inset-y-0 flex items-center',
              iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'
            )}
          >
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            baseClasses,
            errorClasses,
            withIconClass,
            fullWidthClass,
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-danger-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;