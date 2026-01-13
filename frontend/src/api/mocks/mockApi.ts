import {
  ApplicationResponse,
  ApplicationStatus,
  CreateApplicationDTO,
  CompanyDataDTO,
  SignContractDTO,
  ApiError,
} from '../types';

import {
  generateMockId,
  maskPesel,
  getCompanyNameByNip,
  calculateLoanParams,
  mockStore,
  DEMO_SMS_CODE,
  MOCK_DELAY,
  saveApplication,
  saveSmsCode,
  deleteSmsCode,
} from './mockData';

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const createError = (code: string, message: string, field?: string): ApiError => ({
  code,
  message,
  details: field ? [{ field, message, code }] : undefined,
  timestamp: new Date().toISOString(),
});

export const mockApplicationsApi = {
  create: async (data: CreateApplicationDTO): Promise<ApplicationResponse> => {
    await delay(MOCK_DELAY.normal);

    if (!/^\d{11}$/.test(data.pesel)) {
      throw createError('VALIDATION_ERROR', 'PESEL musi zawierać 11 cyfr', 'pesel');
    }

    if (data.firstName.length < 2) {
      throw createError('VALIDATION_ERROR', 'Imię musi mieć minimum 2 znaki', 'firstName');
    }

    if (data.lastName.length < 2) {
      throw createError('VALIDATION_ERROR', 'Nazwisko musi mieć minimum 2 znaki', 'lastName');
    }

    const now = new Date().toISOString();
    const application: ApplicationResponse = {
      id: generateMockId(),
      status: ApplicationStatus.PENDING_COMPANY,
      applicant: {
        firstName: data.firstName,
        lastName: data.lastName,
        peselMasked: maskPesel(data.pesel),
      },
      createdAt: now,
      updatedAt: now,
    };

    saveApplication(application.id, application);
    console.log('[MockAPI] Created application:', application.id);

    return application;
  },

  addCompanyData: async (
    applicationId: string,
    data: CompanyDataDTO
  ): Promise<ApplicationResponse> => {
    await delay(MOCK_DELAY.slow);

    const application = mockStore.applications.get(applicationId);

    if (!application) {
      throw createError('NOT_FOUND', 'Wniosek nie został znaleziony');
    }

    if (!/^\d{10}$/.test(data.nip)) {
      throw createError('VALIDATION_ERROR', 'NIP musi zawierać 10 cyfr', 'nip');
    }

    if (data.previousYearIncome <= 0) {
      throw createError(
        'VALIDATION_ERROR',
        'Przychód musi być większy niż 0',
        'previousYearIncome'
      );
    }

    if (data.employeesCount < 0 || !Number.isInteger(data.employeesCount)) {
      throw createError(
        'VALIDATION_ERROR',
        'Liczba pracowników musi być liczbą całkowitą >= 0',
        'employeesCount'
      );
    }

    const companyName = getCompanyNameByNip(data.nip);

    const updatedApplication: ApplicationResponse = {
      ...application,
      status: ApplicationStatus.SUBMITTED,
      company: {
        nip: data.nip,
        companyName,
        previousYearIncome: data.previousYearIncome,
        employeesCount: data.employeesCount,
      },
      updatedAt: new Date().toISOString(),
    };

    saveApplication(applicationId, updatedApplication);
    console.log('Company added', applicationId);

    return updatedApplication;
  },

  submit: async (applicationId: string): Promise<ApplicationResponse> => {
    await delay(MOCK_DELAY.slow);

    const application = mockStore.applications.get(applicationId);

    if (!application) {
      throw createError('NOT_FOUND', 'Wniosek nie został znaleziony');
    }

    if (!application.company) {
      throw createError('VALIDATION_ERROR', 'Brak danych firmowych');
    }

    const contract = calculateLoanParams(
      application.company.previousYearIncome,
      application.company.employeesCount
    );

    const updatedApplication: ApplicationResponse = {
      ...application,
      status: ApplicationStatus.PENDING_SIGNATURE,
      contract,
      updatedAt: new Date().toISOString(),
    };

    saveApplication(applicationId, updatedApplication);
    console.log('submittd application:', applicationId);

    return updatedApplication;
  },

  getContract: async (applicationId: string): Promise<ApplicationResponse> => {
    await delay(MOCK_DELAY.fast);

    let application = mockStore.applications.get(applicationId);

    if (!application) {
      throw createError('NOT_FOUND', 'Wniosek nie został znaleziony');
    }

    if (!application.contract && application.company) {
      const contract = calculateLoanParams(
        application.company.previousYearIncome,
        application.company.employeesCount
      );

      application = {
        ...application,
        status: ApplicationStatus.PENDING_SIGNATURE,
        contract,
        updatedAt: new Date().toISOString(),
      };

      saveApplication(applicationId, application);
    }

    return application;
  },

  sendSmsCode: async (applicationId: string): Promise<void> => {
    await delay(MOCK_DELAY.normal);

    const application = mockStore.applications.get(applicationId);

    if (!application) {
      throw createError('NOT_FOUND', 'Wniosek nie został znaleziony');
    }

    saveSmsCode(applicationId, {
      code: DEMO_SMS_CODE,
      attempts: 0,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.info(DEMO_SMS_CODE);
  },

  signContract: async (
    applicationId: string,
    data: SignContractDTO
  ): Promise<ApplicationResponse> => {
    await delay(MOCK_DELAY.normal);

    const application = mockStore.applications.get(applicationId);

    if (!application) {
      throw createError('NOT_FOUND', 'Wniosek nie został znaleziony');
    }

    const smsData = mockStore.smsCodes.get(applicationId);

    if (!smsData) {
      throw createError('VALIDATION_ERROR', 'Najpierw wyślij kod SMS');
    }

    if (new Date() > smsData.expiresAt) {
      deleteSmsCode(applicationId);
      throw createError('VALIDATION_ERROR', 'Kod SMS wygasł. Wyślij nowy kod.');
    }

    if (smsData.attempts >= 3) {
      deleteSmsCode(applicationId);
      throw createError('VALIDATION_ERROR', 'Przekroczono limit prób. Wyślij nowy kod SMS.');
    }

    if (data.smsCode !== smsData.code) {
      smsData.attempts++;
      saveSmsCode(applicationId, smsData);
      const remaining = 3 - smsData.attempts;
      throw createError(
        'VALIDATION_ERROR',
        `Nieprawidłowy kod SMS. Pozostało prób: ${remaining}`,
        'smsCode'
      );
    }

    const signedApplication: ApplicationResponse = {
      ...application,
      status: ApplicationStatus.SIGNED,
      updatedAt: new Date().toISOString(),
    };

    saveApplication(applicationId, signedApplication);
    deleteSmsCode(applicationId);

    console.log('[MockAPI] Contract signed for application:', applicationId);

    return signedApplication;
  },

  cancel: async (applicationId: string): Promise<void> => {
    await delay(MOCK_DELAY.fast);

    const application = mockStore.applications.get(applicationId);

    if (!application) {
      throw createError('NOT_FOUND', 'Wniosek nie został znaleziony');
    }

    const cancelledApplication: ApplicationResponse = {
      ...application,
      status: ApplicationStatus.CANCELLED,
      updatedAt: new Date().toISOString(),
    };

    saveApplication(applicationId, cancelledApplication);
    console.log('[MockAPI] Application cancelled:', applicationId);
  },

  getById: async (applicationId: string): Promise<ApplicationResponse> => {
    await delay(MOCK_DELAY.fast);

    const application = mockStore.applications.get(applicationId);

    if (!application) {
      throw createError('NOT_FOUND', 'Wniosek nie został znaleziony');
    }

    return application;
  },
};
