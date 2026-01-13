[Live Demo](https://task.olafwebdev.site)

## Tech Stack

**Frontend:** React 18, TypeScript, React Query, React Hook Form, Zod, Shadcn UI, Tailwind CSS

**CI/CD:** GitHub Actions (automatyczny deploy na VPS przy push do main)

---

## Zadanie 1: Projekt API

### Endpoints

| Metoda   | Endpoint                            | Opis                              | Zabezpieczenia                         |
| -------- | ----------------------------------- | --------------------------------- | -------------------------------------- |
| `POST`   | `/api/v1/applications`              | Utworzenie wniosku (Krok 1)       | Rate limiting, walidacja PESEL         |
| `PATCH`  | `/api/v1/applications/:id/company`  | Dodanie danych firmowych (Krok 2) | Weryfikacja NIP w CEIDG                |
| `POST`   | `/api/v1/applications/:id/submit`   | Wysłanie wniosku do oceny         | Sprawdzenie kompletności               |
| `GET`    | `/api/v1/applications/:id/contract` | Pobranie umowy (Krok 3)           | Autoryzacja właściciela                |
| `POST`   | `/api/v1/applications/:id/sms/send` | Wysłanie kodu SMS                 | Rate limiting (max 3/5min)             |
| `POST`   | `/api/v1/applications/:id/sign`     | Podpisanie umowy kodem SMS        | Weryfikacja kodu, blokada po 3 próbach |
| `DELETE` | `/api/v1/applications/:id`          | Anulowanie/rezygnacja             | Soft delete                            |

### Modele danych

```typescript
enum ApplicationStatus {
  DRAFT = "DRAFT",
  PENDING_COMPANY = "PENDING_COMPANY",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PENDING_SIGNATURE = "PENDING_SIGNATURE",
  SIGNED = "SIGNED",
  CANCELLED = "CANCELLED",
}
```

```typescript
// Krok 1: Dane wnioskodawcy
interface CreateApplicationDTO {
  firstName: string; // min 2, max 50 znaków
  lastName: string; // min 2, max 100 znaków
  pesel: string; // dokładnie 11 cyfr, walidacja sumy kontrolnej
}

// Krok 2: Dane firmowe
interface CompanyDataDTO {
  nip: string; // 10 cyfr, walidacja w CEIDG
  previousYearIncome: number; // > 0, max 2 miejsca po przecinku
  employeesCount: number; // >= 0, integer
}

// Krok 3: Podpisanie umowy
interface SignContractDTO {
  smsCode: string; // 6 cyfr
}
```

```typescript
interface ApplicationResponse {
  id: string; // UUID
  status: ApplicationStatus;
  applicant: ApplicantData;
  company?: CompanyData;
  contract?: ContractData;
  createdAt: string;
  updatedAt: string;
}

interface ApplicantData {
  firstName: string;
  lastName: string;
  peselMasked: string;
}

interface CompanyData {
  nip: string;
  companyName: string; // pobrane z CEIDG
  previousYearIncome: number;
  employeesCount: number;
}

interface ContractData {
  contractNumber: string; // format: LOAN/2026/XXXXX
  loanAmount: number;
  interestRate: number;
  monthlyPayment: number;
  term: number; // miesiące
}
```

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: ValidationError[];
  timestamp: string;
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}
```

---

## Zadanie 2: Implementacja Frontend

Jako rozwiązanie drugiego zadania zaimplementowałem prototyp aplikacji wraz z mockami, co pozwoliło mi wejść w szczegóły i lepiej zaprojektować architekturę komponentów.
[Live Demo](https://task.olafwebdev.site)

### Struktura aplikacji

```

src/
├── App (Router + React Query)
├── components/ui/          # Reusable UI (Button, Card, Input, Stepper...)
├── features/loan-application/
│   ├── components/         # Feature components
│   │   ├── ApplicantForm   # Ekran 1: Dane wnioskodawcy
│   │   ├── CompanyForm     # Ekran 2: Dane firmowe
│   │   ├── ContractView    # Ekran 3: Umowa
│   │   └── SMSVerification # Weryfikacja SMS
│   ├── pages/              # Container components (routing)
│   ├── hooks/              # useApplication, useSmsVerification
│   └── validation/         # Zod schemas
└── api/

```

### Zarządzanie stanem

- **React Query** trzyma dane wniosku w cache (klucz: `['application', id]`)
- **Hook `useApplication`** opakowuje wszystkie operacje API (tworzenie, edycja, submit, anulowanie) w mutacje
- Po każdej udanej operacji cache jest aktualizowany → komponenty od razu widzą świeże dane
- Nawigacja między krokami odbywa się automatycznie po sukcesie mutacji
- Każdy krok walidowany jest po stronie klienta (Zod), a następnie po stronie serwera

---

## Uruchomienie lokalne

```bash
git clone <repo-url>
cd jitRekrutacja


cd frontend
pnpm install
pnpm dev
```

### Docker

```bash
docker-compose up -d
```
