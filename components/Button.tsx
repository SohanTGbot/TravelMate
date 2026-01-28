import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading = false, 
  disabled,
  size = 'md',
  ...props 
}) => {
  const baseStyles = "relative font-medium transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group active:scale-[0.98]";
  
  const sizeStyles = {
    sm: "px-4 py-1.5 text-xs rounded-lg",
    md: "px-6 py-2.5 text-sm rounded-xl",
    lg: "px-8 py-4 text-base rounded-2xl",
  };

  const variants = {
    primary: "bg-forest-900 hover:bg-forest-800 text-white shadow-lg shadow-forest-900/20 hover:shadow-forest-900/40 focus:ring-forest-500 dark:bg-forest-600 dark:hover:bg-forest-500",
    secondary: "bg-sand-200 hover:bg-sand-300 text-charcoal-900 focus:ring-sand-400 dark:bg-charcoal-700 dark:text-sand-100 dark:hover:bg-charcoal-600",
    outline: "border border-forest-900/20 text-forest-900 hover:bg-forest-50 focus:ring-forest-500 dark:border-forest-400/30 dark:text-forest-300 dark:hover:bg-forest-900/30 backdrop-blur-sm",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 focus:ring-red-500",
    ghost: "text-charcoal-600 hover:text-charcoal-900 hover:bg-charcoal-100 dark:text-sand-300 dark:hover:text-sand-100 dark:hover:bg-charcoal-800"
  };

  return (
    <button 
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
           {/* Ripple effect overlay */}
           <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
           {children}
        </>
      )}
    </button>
  );
};