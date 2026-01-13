import { apiClient } from './client';
import {
  ApplicationResponse,
  CreateApplicationDTO,
  CompanyDataDTO,
  SignContractDTO,
} from './types';

export const applicationsApi = {
  create: async (data: CreateApplicationDTO): Promise<ApplicationResponse> => {
    const response = await apiClient.post<ApplicationResponse>('/applications', data);
    return response.data;
  },

  addCompanyData: async (
    applicationId: string,
    data: CompanyDataDTO
  ): Promise<ApplicationResponse> => {
    const response = await apiClient.patch<ApplicationResponse>(
      `/applications/${applicationId}/company`,
      data
    );
    return response.data;
  },

  submit: async (applicationId: string): Promise<ApplicationResponse> => {
    const response = await apiClient.post<ApplicationResponse>(
      `/applications/${applicationId}/submit`
    );
    return response.data;
  },

  getContract: async (applicationId: string): Promise<ApplicationResponse> => {
    const response = await apiClient.get<ApplicationResponse>(
      `/applications/${applicationId}/contract`
    );
    return response.data;
  },

  sendSmsCode: async (applicationId: string): Promise<void> => {
    await apiClient.post(`/applications/${applicationId}/sms/send`);
  },

  signContract: async (
    applicationId: string,
    data: SignContractDTO
  ): Promise<ApplicationResponse> => {
    const response = await apiClient.post<ApplicationResponse>(
      `/applications/${applicationId}/sign`,
      data
    );
    return response.data;
  },

  cancel: async (applicationId: string): Promise<void> => {
    await apiClient.delete(`/applications/${applicationId}`);
  },

  getById: async (applicationId: string): Promise<ApplicationResponse> => {
    const response = await apiClient.get<ApplicationResponse>(`/applications/${applicationId}`);
    return response.data;
  },
};
