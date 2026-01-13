import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { smsCodeSchema, SmsCodeFormData } from '../validation/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface SMSVerificationProps {
  onSubmit: (data: SmsCodeFormData) => void;
  onSendCode: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isSending?: boolean;
  smsSent?: boolean;
  cooldownSeconds?: number;
}

export const SMSVerification = ({
  onSubmit,
  onSendCode,
  onCancel,
  isLoading,
  isSending,
  smsSent,
  cooldownSeconds = 0,
}: SMSVerificationProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SmsCodeFormData>({ resolver: zodResolver(smsCodeSchema) });

  const canResend = cooldownSeconds === 0 && !isSending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Podpisanie umowy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert variant="info">
            <p className="text-sm">
              Aby podpisać umowę, wyślij kod SMS, a następnie wprowadź otrzymany 6-cyfrowy kod
              weryfikacyjny.
            </p>
          </Alert>

          {!smsSent && (
            <div>
              <Button
                type="button"
                onClick={onSendCode}
                loading={isSending}
                disabled={!canResend}
                className="w-full"
              >
                {isSending ? 'Wysyłanie...' : 'Wyślij kod SMS'}
              </Button>
            </div>
          )}

          {smsSent && (
            <>
              <Alert variant="success">
                <p className="text-sm">Kod SMS został wysłany. Sprawdź swoją skrzynkę.</p>
              </Alert>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField label="Kod SMS" error={errors.smsCode?.message} required>
                  <Input
                    {...register('smsCode')}
                    error={!!errors.smsCode}
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="123456"
                    autoComplete="one-time-code"
                    autoFocus
                  />
                </FormField>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
                    Zrezygnuj
                  </Button>
                  <Button type="submit" loading={isLoading} className="flex-1">
                    Podpisz
                  </Button>
                </div>
              </form>

              {cooldownSeconds > 0 && (
                <p className="text-sm text-center text-gray-600">
                  Możesz wysłać kolejny kod za {cooldownSeconds} sekund
                </p>
              )}

              {canResend && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={onSendCode}
                    className="text-sm text-primary-600 hover:text-primary-700 underline"
                    disabled={!canResend}
                  >
                    Wyślij kod ponownie
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
