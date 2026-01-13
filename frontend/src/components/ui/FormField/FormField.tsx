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

// TODO: Może dodać tooltip dla required fields?
// FIXME: error message czasami się nie pokazuje przy szybkiej walidacji
export const FormField = ({
  label,
  error,
  required,
  htmlFor,
  children,
  className,
}: FormFieldProps) => {
  return (
    <div className={cn('mb-4 space-y-2', className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
