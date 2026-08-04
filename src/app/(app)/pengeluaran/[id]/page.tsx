import EditExpenseClient from './edit-expense-client';

export function generateStaticParams() {
  return [{ id: '1' }];
}

export default function Page() {
  return <EditExpenseClient />;
}
