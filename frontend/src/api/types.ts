export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  PENDING_COMPANY = 'PENDING_COMPANY',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING_SIGNATURE = 'PENDING_SIGNATURE',
  SIGNED = 'SIGNED',
  CANCELLED = 'CANCELLED',
}

export interface CreateApplicationDTO {
  firstName: string;
  lastName: string;
  pesel: string;
}

export interface CompanyDataDTO {
  nip: string;
  previousYearIncome: number;
  employeesCount: number;
}

export interface SignContractDTO {
  smsCode: string;
}

export interface ApplicantData {
  firstName: string;
  lastName: string;
  peselMasked: string;
}

export interface CompanyData {
  nip: string;
  companyName: string;
  previousYearIncome: number;
  employeesCount: number;
}

export interface ContractData {
  contractNumber: string;
  loanAmount: number;
  interestRate: number;
  monthlyPayment: number;
  term: number;
}

export interface ApplicationResponse {
  id: string;
  status: ApplicationStatus;
  applicant: ApplicantData;
  company?: CompanyData;
  contract?: ContractData;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: ValidationError[];
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}
