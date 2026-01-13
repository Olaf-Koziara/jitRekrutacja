import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { applicantSchema, ApplicantFormData } from '../validation/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface ApplicantFormProps {
  onSubmit: (data: ApplicantFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ApplicantForm = ({ onSubmit, onCancel, isLoading }: ApplicantFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicantFormData>({ resolver: zodResolver(applicantSchema) });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dane wnioskodawcy</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Imię" error={errors.firstName?.message} required>
            <Input
              {...register('firstName')}
              error={!!errors.firstName}
              maxLength={50}
              placeholder="Jan"
              autoComplete="given-name"
            />
          </FormField>

          <FormField label="Nazwisko" error={errors.lastName?.message} required>
            <Input
              {...register('lastName')}
              error={!!errors.lastName}
              maxLength={100}
              placeholder="Kowalski"
              autoComplete="family-name"
            />
          </FormField>

          <FormField label="PESEL" error={errors.pesel?.message} required>
            <Input
              {...register('pesel')}
              error={!!errors.pesel}
              maxLength={11}
              inputMode="numeric"
              placeholder="12345678901"
              autoComplete="off"
            />
          </FormField>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
              Anuluj
            </Button>
            <Button type="submit" loading={isLoading} className="">
              Dalej
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
