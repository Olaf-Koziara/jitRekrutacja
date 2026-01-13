import { z } from 'zod';
import { isValidPesel } from '@/utils/validators';

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

export type ApplicantFormData = z.infer<typeof applicantSchema>;
