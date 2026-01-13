import { useNavigate } from 'react-router-dom';
import { applicationsApi } from '@/api/mocks';
import { ApplicationResponse, CreateApplicationDTO, CompanyDataDTO } from '@/api/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface UseApplicationOptions {
  applicationId?: string;
}

export function useApplication({ applicationId }: UseApplicationOptions = {}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: application,
    error,
    isLoading,
    refetch: loadApplication,
  } = useQuery<ApplicationResponse>({
    queryKey: ['application', applicationId],
    queryFn: () => applicationsApi.getById(applicationId!),
    enabled: !!applicationId,
    staleTime: 5 * 60 * 1000,
  });

  // Przy prawdziwym API zaimplementowal bym optimistic update z revert on error
  const createApplicationMutation = useMutation({
    mutationFn: (data: CreateApplicationDTO) => {
      return applicationsApi.create(data);
    },
    onSuccess: (response) => {
      queryClient.setQueryData(['application', response.id], response);
      navigate(`/application/${response.id}/company`);
    },
  });

  const addCompanyDataMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CompanyDataDTO }) =>
      applicationsApi.addCompanyData(id, data),
    onSuccess: (response) => {
      queryClient.setQueryData(['application', response.id], response);
      queryClient.invalidateQueries({ queryKey: ['application', response.id] });
    },
  });

  const submitApplicationMutation = useMutation({
    mutationFn: (id: string) => applicationsApi.submit(id),
    onSuccess: (response) => {
      queryClient.setQueryData(['application', response.id], response);
      navigate(`/application/${response.id}/contract`);
    },
  });

  const cancelApplicationMutation = useMutation({
    mutationFn: (id: string) => applicationsApi.cancel(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['application', id] });
      navigate('/');
    },
  });

  return {
    application,
    isLoading:
      isLoading ||
      createApplicationMutation.isPending ||
      addCompanyDataMutation.isPending ||
      submitApplicationMutation.isPending ||
      cancelApplicationMutation.isPending,
    error:
      error ||
      createApplicationMutation.error ||
      addCompanyDataMutation.error ||
      submitApplicationMutation.error ||
      cancelApplicationMutation.error,

    createApplication: createApplicationMutation.mutateAsync,
    addCompanyData: (id: string, data: CompanyDataDTO) =>
      addCompanyDataMutation.mutateAsync({ id, data }),
    submitApplication: submitApplicationMutation.mutateAsync,
    cancelApplication: cancelApplicationMutation.mutateAsync,

    loadApplication,
    clearError: () => {
      createApplicationMutation.reset();
      addCompanyDataMutation.reset();
      submitApplicationMutation.reset();
      cancelApplicationMutation.reset();
    },
  };
}
