import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { companySchema, CompanyFormData } from '../validation/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface CompanyFormProps {
  onSubmit: (data: CompanyFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CompanyForm = ({ onSubmit, onCancel, isLoading }: CompanyFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({ resolver: zodResolver(companySchema) });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dane firmowe</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="NIP" error={errors.nip?.message} required>
            <Input
              {...register('nip')}
              error={!!errors.nip}
              maxLength={10}
              inputMode="numeric"
              placeholder="1234567890"
              autoComplete="off"
            />
          </FormField>

          <FormField
            label="Dochód za poprzedni rok (PLN)"
            error={errors.previousYearIncome?.message}
            required
          >
            <Input
              type="number"
              {...register('previousYearIncome', { valueAsNumber: true })}
              error={!!errors.previousYearIncome}
              min={0}
              step={0.01}
              placeholder="150000.00"
            />
          </FormField>

          <FormField label="Liczba pracowników" error={errors.employeesCount?.message} required>
            <Input
              type="number"
              {...register('employeesCount', { valueAsNumber: true })}
              error={!!errors.employeesCount}
              min={0}
              step={1}
              placeholder="5"
            />
          </FormField>

          <div className="flex pt-4 justify-between ">
            <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
              Anuluj
            </Button>
            <Button type="submit" loading={isLoading}>
              Wyślij
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
