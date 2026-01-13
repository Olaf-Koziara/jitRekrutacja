import { ReactNode } from 'react';
import { Label } from '../Label';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export const FormField = ({
  label,
  error,
  required,
  htmlFor,
  children,
  className,
}: FormFieldProps) => {
  return (
    <div className={cn('mb-2 space-y-1', className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      <p className="text-xs text-red-600 pb-1 realative" role="alert">
        <span className="absolute">{error}</span>
      </p>
    </div>
  );
};
