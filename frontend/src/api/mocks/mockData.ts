import { ApplicationResponse, ContractData } from '../types';

export const generateMockId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const generateContractNumber = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `LOAN/${year}/${random}`;
};

export const maskPesel = (pesel: string): string => {
  return '*'.repeat(9) + pesel.slice(-2);
};

export const mockCeidgCompanies: Record<string, string> = {
  '5213017228': 'ANNA KOWALSKA CONSULTING',
  '7811903596': 'JAN NOWAK SOFTWARE DEVELOPMENT',
  '1234567890': 'TECH SOLUTIONS SP. Z O.O.',
  '9876543210': 'DIGITAL SERVICES POLSKA',
  '5551234567': 'INNOVATIVE STARTUP S.A.',
  '1112223334': 'MODERN BUSINESS SOLUTIONS',
  '4445556667': 'ECO FRIENDLY PRODUCTS',
  '7778889990': 'SMART HOME AUTOMATION',
};

export const getCompanyNameByNip = (nip: string): string => {
  return mockCeidgCompanies[nip] || `FIRMA ${nip.slice(0, 4)} SP. Z O.O.`;
};

export const calculateLoanParams = (
  previousYearIncome: number,
  employeesCount: number
): ContractData => {
  const maxLoanMultiplier = Math.min(3, 1 + employeesCount * 0.1);
  const loanAmount = Math.min(previousYearIncome * maxLoanMultiplier, 500000);
  const interestRate = employeesCount > 5 ? 7.5 : 8.9;
  const term = loanAmount > 100000 ? 60 : 36;
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, term)) /
    (Math.pow(1 + monthlyRate, term) - 1);

  return {
    contractNumber: generateContractNumber(),
    loanAmount: Math.round(loanAmount * 100) / 100,
    interestRate,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    term,
  };
};

export interface MockApplicationStore {
  applications: Map<string, ApplicationResponse>;
  smsCodes: Map<string, { code: string; attempts: number; expiresAt: Date }>;
}

const STORAGE_KEY_APPLICATIONS = 'mock_applications';
const STORAGE_KEY_SMS_CODES = 'mock_sms_codes';

const saveApplicationsToStorage = (applications: Map<string, ApplicationResponse>): void => {
  try {
    const serialized = Array.from(applications.entries());
    localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(serialized));
  } catch (error) {
    console.warn('[MockStore] Failed to save applications to localStorage:', error);
  }
};

const loadApplicationsFromStorage = (): Map<string, ApplicationResponse> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
    if (!stored) return new Map();

    const parsed = JSON.parse(stored) as Array<[string, ApplicationResponse]>;
    return new Map(parsed);
  } catch (error) {
    console.warn('[MockStore] Failed to load applications from localStorage:', error);
    return new Map();
  }
};

const saveSmsCodesToStorage = (
  smsCodes: Map<string, { code: string; attempts: number; expiresAt: Date }>
): void => {
  try {
    const serialized = Array.from(smsCodes.entries()).map(([key, value]) => [
      key,
      {
        ...value,
        expiresAt: value.expiresAt.toISOString(),
      },
    ]);
    localStorage.setItem(STORAGE_KEY_SMS_CODES, JSON.stringify(serialized));
  } catch (error) {
    console.warn('[MockStore] Failed to save SMS codes to localStorage:', error);
  }
};

const loadSmsCodesFromStorage = (): Map<
  string,
  { code: string; attempts: number; expiresAt: Date }
> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SMS_CODES);
    if (!stored) return new Map();

    const parsed = JSON.parse(stored) as Array<
      [string, { code: string; attempts: number; expiresAt: string }]
    >;
    const map = new Map<string, { code: string; attempts: number; expiresAt: Date }>();

    for (const [key, value] of parsed) {
      const expiresAt = new Date(value.expiresAt);
      if (expiresAt > new Date()) {
        map.set(key, {
          code: value.code,
          attempts: value.attempts,
          expiresAt,
        });
      }
    }

    return map;
  } catch (error) {
    console.warn('[MockStore] Failed to load SMS codes from localStorage:', error);
    return new Map();
  }
};

const applications = loadApplicationsFromStorage();
const smsCodes = loadSmsCodesFromStorage();

export const mockStore: MockApplicationStore = {
  applications,
  smsCodes,
};

export const saveApplication = (id: string, application: ApplicationResponse): void => {
  mockStore.applications.set(id, application);
  saveApplicationsToStorage(mockStore.applications);
};

export const deleteApplication = (id: string): void => {
  mockStore.applications.delete(id);
  saveApplicationsToStorage(mockStore.applications);
};

export const saveSmsCode = (
  id: string,
  smsData: { code: string; attempts: number; expiresAt: Date }
): void => {
  mockStore.smsCodes.set(id, smsData);
  saveSmsCodesToStorage(mockStore.smsCodes);
};

export const deleteSmsCode = (id: string): void => {
  mockStore.smsCodes.delete(id);
  saveSmsCodesToStorage(mockStore.smsCodes);
};

export const DEMO_SMS_CODE = '123456';

export const MOCK_DELAY = {
  fast: 300,
  normal: 800,
  slow: 1500,
};
