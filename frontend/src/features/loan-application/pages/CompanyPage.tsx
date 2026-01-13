import { useParams, useNavigate } from 'react-router-dom';
import { Stepper, Step } from '@/components/ui/Stepper';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CompanyForm } from '../components/CompanyForm';
import { useApplication } from '../hooks/useApplication';
import { CompanyFormData } from '../validation/schemas';

const steps: Step[] = [
  { label: 'Dane wnioskodawcy', status: 'completed' },
  { label: 'Dane firmowe', status: 'current' },
  { label: 'Umowa', status: 'upcoming' },
];

export const CompanyPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    application,
    addCompanyData,
    submitApplication,
    cancelApplication,
    isLoading,
    error,
    clearError,
  } = useApplication({ applicationId: id });

  const handleSubmit = async (data: CompanyFormData) => {
    if (!id) return;

    const result = await addCompanyData(id, data);

    if (result) {
      await submitApplication(id);
    } else {
      console.warn('addCompanyData returned undefined - może to być błąd');
    }
  };

  const handleCancel = async () => {
    if (id) {
      await cancelApplication(id);
    } else {
      navigate('/');
    }
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

  if (isLoading && !application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Wniosek o Pożyczkę Firmową
        </h1>

        <Stepper steps={steps} />

        {error && (
          <div className="mb-6">
            <Alert variant="error">
              <p className="font-semibold">{error.message}</p>
              <button onClick={clearError} className="mt-2 text-sm underline hover:no-underline">
                Zamknij
              </button>
            </Alert>
          </div>
        )}

        <CompanyForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />
      </div>
    </div>
  );
};
