import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { ContractData, ApplicationStatus } from '@/api/types';

interface ContractViewProps {
  contractData: ContractData;
  status: ApplicationStatus;
}

export const ContractView = ({ contractData, status }: ContractViewProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(amount);
  };

  if (status === ApplicationStatus.REJECTED) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wynik oceny</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="error">
            <p className="font-semibold mb-2">Wniosek odrzucony</p>
            <p>Niestety, Twój wniosek o pożyczkę nie został zaakceptowany.</p>
            <p className="mt-2 text-sm">
              Możliwe przyczyny: niewystarczający dochód lub inne kryteria finansowe.
            </p>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Umowa pożyczki</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Alert variant="success">
            <p className="font-semibold">Gratulacje! Twój wniosek został zaakceptowany.</p>
          </Alert>

          <div className="border-t border-gray-200 pt-4">
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Numer umowy:</dt>
                <dd className="text-sm font-semibold text-gray-900">
                  {contractData.contractNumber}
                </dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Kwota pożyczki:</dt>
                <dd className="text-lg font-bold text-primary-600">
                  {formatCurrency(contractData.loanAmount)}
                </dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Oprocentowanie:</dt>
                <dd className="text-sm font-semibold text-gray-900">
                  {contractData.interestRate}% rocznie
                </dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">Okres spłaty:</dt>
                <dd className="text-sm font-semibold text-gray-900">
                  {contractData.term} miesięcy
                </dd>
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Miesięczna rata:</dt>
                <dd className="text-xl font-bold text-primary-600">
                  {formatCurrency(contractData.monthlyPayment)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
