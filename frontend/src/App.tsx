import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApplicantPage } from './features/loan-application/pages/ApplicantPage';
import { CompanyPage } from './features/loan-application/pages/CompanyPage';
import { ContractPage } from './features/loan-application/pages/ContractPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ApplicantPage />} />
          <Route path="/application/:id/company" element={<CompanyPage />} />
          <Route path="/application/:id/contract" element={<ContractPage />} />
          <Route path="/application/:id/success" element={<ContractPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
