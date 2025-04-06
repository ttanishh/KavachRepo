import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700",
        outline: "border border-surface-300 bg-transparent hover:bg-surface-100 text-surface-700",
        ghost: "hover:bg-surface-100 text-surface-700 hover:text-surface-900",
        link: "text-primary-600 underline-offset-4 hover:underline",
        destructive: "bg-error-600 text-white hover:bg-error-700 active:bg-error-800",
        success: "bg-success-600 text-white hover:bg-success-700 active:bg-success-800",
        warning: "bg-warning-500 text-surface-900 hover:bg-warning-600 active:bg-warning-700",
        info: "bg-info-600 text-white hover:bg-info-700 active:bg-info-800",
        light: "bg-white text-surface-700 border border-surface-200 hover:bg-surface-50",
        dark: "bg-surface-800 text-white hover:bg-surface-900",
      },
      size: {
        xs: "h-7 px-2 text-xs",
        sm: "h-8 px-3 text-xs",
        default: "h-10 py-2 px-4",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
      rounded: {
        default: "rounded-md",
        sm: "rounded",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
      width: {
        default: "",
        full: "w-full",
        auto: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
      width: "default",
    },
  }
);

export function Button({
  className,
  variant,
  size,
  rounded,
  width,
  children,
  isLoading,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(
        buttonVariants({ variant, size, rounded, width }),
        isLoading && "opacity-70 cursor-wait",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}