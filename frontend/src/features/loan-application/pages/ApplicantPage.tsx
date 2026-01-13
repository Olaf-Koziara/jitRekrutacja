import { useNavigate } from 'react-router-dom';
import { Stepper, Step } from '@/components/ui/Stepper';
import { Alert } from '@/components/ui/Alert';
import { ApplicantForm } from '../components/ApplicantForm';
import { useApplication } from '../hooks/useApplication';
import { ApplicantFormData } from '../validation/schemas';

const steps: Step[] = [
  { label: 'Dane wnioskodawcy', status: 'current' },
  { label: 'Dane firmowe', status: 'upcoming' },
  { label: 'Umowa', status: 'upcoming' },
];

export const ApplicantPage = () => {
  const navigate = useNavigate();
  const { createApplication, isLoading, error, clearError } = useApplication();

  const handleSubmit = async (data: ApplicantFormData) => {
    try {
      await createApplication(data);
    } catch (err) {
      console.error('Error creating application:', err);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

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

        <ApplicantForm onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isLoading} />
      </div>
    </div>
  );
};
