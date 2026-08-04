import EditIncomeClient from './edit-income-client';

export function generateStaticParams() {
  return [{ id: '1' }];
}

export default function Page() {
  return <EditIncomeClient />;
}
