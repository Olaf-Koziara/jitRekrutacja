import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Step {
  label: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface StepperProps {
  steps: Step[];
}

export const Stepper = ({ steps }: StepperProps) => {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => (
          <li
            key={step.label}
            className={cn('relative flex-1', index !== steps.length - 1 && 'pr-8 sm:pr-20')}
          >
            {/* Connecting line */}
            {index !== steps.length - 1 && (
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted" aria-hidden="true">
                {step.status === 'completed' && (
                  <div className="h-full bg-primary transition-all duration-500" />
                )}
              </div>
            )}

            <div className="relative flex flex-col items-center group">
              {/* Step circle */}
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors z-10',
                  {
                    'bg-primary border-primary': step.status === 'completed',
                    'bg-background border-primary': step.status === 'current',
                    'bg-background border-muted': step.status === 'upcoming',
                  }
                )}
              >
                {step.status === 'completed' ? (
                  <Check className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <span
                    className={cn('text-sm font-medium', {
                      'text-primary': step.status === 'current',
                      'text-muted-foreground': step.status === 'upcoming',
                    })}
                  >
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn('mt-2 text-xs sm:text-sm font-medium text-center', {
                  'text-primary': step.status === 'current',
                  'text-muted-foreground':
                    step.status === 'completed' || step.status === 'upcoming',
                })}
              >
                {step.label}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
