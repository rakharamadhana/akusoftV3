import EditItemClient from './edit-item-client';

export function generateStaticParams() {
  return [{ id: '1' }];
}

export default function Page() {
  return <EditItemClient />;
}
