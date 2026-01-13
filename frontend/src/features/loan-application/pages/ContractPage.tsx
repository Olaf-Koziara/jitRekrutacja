import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Stepper, Step } from '@/components/ui/Stepper';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ContractView } from '../components/ContractView';
import { SMSVerification } from '../components/SMSVerification';
import { useApplication } from '../hooks/useApplication';
import { useSmsVerification } from '../hooks/useSmsVerification';
import { SmsCodeFormData } from '../validation/schemas';
import { ApplicationStatus } from '@/api/types';
import { Button } from '@/components/ui/Button';

const steps: Step[] = [
  { label: 'Dane wnioskodawcy', status: 'completed' },
  { label: 'Dane firmowe', status: 'completed' },
  { label: 'Umowa', status: 'current' },
];

export const ContractPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    application,
    loadApplication,
    cancelApplication,
    isLoading: appLoading,
  } = useApplication({
    applicationId: id,
  });
  const {
    sendSmsCode,
    verifyAndSign,
    isLoading: smsLoading,
    error: smsError,
    smsSent,
    cooldownSeconds,
    clearError,
  } = useSmsVerification(id || '');

  useEffect(() => {
    if (id) {
      loadApplication();
    }
  }, [id, location.pathname, loadApplication]);

  const handleSendCode = async () => {
    await sendSmsCode();
  };

  const handleSign = async (data: SmsCodeFormData) => {
    await verifyAndSign(data);
  };

  const handleCancel = async () => {
    if (id) {
      await cancelApplication(id);
    } else {
      navigate('/');
    }
  };
  const handleNavigateBackToFormStart = () => {
    navigate('/');
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert variant="error">
          <p>Nieprawidłowy ID wniosku</p>
        </Alert>
      </div>
    );
  }

  if (appLoading && !application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert variant="error">
          <p>Nie znaleziono wniosku</p>
        </Alert>
      </div>
    );
  }

  const isRejected = application.status === ApplicationStatus.REJECTED;
  const isSigned = application.status === ApplicationStatus.SIGNED;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Wniosek o Pożyczkę Firmową
        </h1>

        <Stepper steps={steps} />

        {smsError && (
          <div className="mb-6">
            <Alert variant="error">
              <p className="font-semibold">{smsError.message}</p>

              <button onClick={clearError} className="mt-2 text-sm underline hover:no-underline">
                Zamknij
              </button>
            </Alert>
          </div>
        )}

        <div className="space-y-6">
          {application.contract && (
            <ContractView contractData={application.contract} status={application.status} />
          )}

          {!isRejected && !isSigned && application.contract && (
            <SMSVerification
              onSubmit={handleSign}
              onSendCode={handleSendCode}
              onCancel={handleCancel}
              isLoading={smsLoading}
              isSending={smsLoading}
              smsSent={smsSent}
              cooldownSeconds={cooldownSeconds}
            />
          )}

          {isSigned && (
            <>
              <Alert variant="success">
                <p className="font-semibold text-lg">Umowa została podpisana!</p>
                <p className="mt-2">
                  Dziękujemy za skorzystanie z naszej oferty. Środki zostaną przekazane na Twoje
                  konto w ciągu 2-3 dni roboczych.
                </p>
              </Alert>
              <Button onClick={handleNavigateBackToFormStart}>Zloz nowy wniosek</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
