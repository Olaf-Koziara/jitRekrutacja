import { z } from 'zod';
import { isValidNip, isValidPesel } from '@/utils/validators';

export const applicantSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Imię musi zawierać min. 2 znaki')
    .max(30, 'Imię może zaweirać max. 30 znaków')
    .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/, 'Imię zawiera niedozwolone znaki'),
  lastName: z
    .string()
    .min(2, 'Nazwisko musi zawierać min. 2 znaki')
    .max(100, 'Nazwisko może zawierać max. 100 znaków')
    .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/, 'Nazwisko zawiera niedozwolone znaki'),
  pesel: z
    .string()
    .length(11, 'PESEL musi zawierać dokładnie 11 cyfr')
    .regex(/^\d{11}$/, 'PESEL musi zawierać tylko cyfry')
    .refine(isValidPesel, 'Nieprawidłowy numer PESEL (błąd sumy kontrolnej)'),
});

export const companySchema = z.object({
  nip: z
    .string()
    .length(10, 'NIP musi zawierać dokładnie 10 cyfr')
    .regex(/^\d{10}$/, 'NIP musi zawierać tylko cyfry')
    .refine(isValidNip, 'Nieprawidłowy numer NIP (błąd sumy kontrolnej)'),
  previousYearIncome: z
    .number({ invalid_type_error: 'Dochód musi być liczbą' })
    .positive('Dochód musi być większy od 0')
    .max(999999999.99, 'Dochód jest zbyt duży'),
  employeesCount: z
    .number({ invalid_type_error: 'Liczba pracowników musi być liczbą całkowitą' })
    .int('Liczba pracowników musi być liczbą całkowitą')
    .min(0, 'Liczba pracowników nie może być ujemna')
    .max(10000, 'Liczba pracowników jest zbyt duża'),
});

export type ApplicantFormData = z.infer<typeof applicantSchema>;
export type CompanyFormData = z.infer<typeof companySchema>;
