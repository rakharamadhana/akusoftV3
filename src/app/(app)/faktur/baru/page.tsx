'use client';

import { useMemo, useState } from 'react';
import {
  UserPlus,
  ListChecks,
  PlusCircle,
  Trash2,
  MessageCircle,
  Download,
  QrCode,
  Printer,
  Landmark,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/i18n/use-translation';
import { formatIDR, formatNumberID, calcPPN } from '@/lib/format';

interface LineItem {
  id: number;
  name: string;
  sub: string;
  qty: number;
  price: number;
}

const INITIAL: LineItem[] = [
  { id: 1, name: 'Enterprise UI/UX Design System', sub: 'Lisensi tahunan & design tokens', qty: 1, price: 27_500_000 },
  { id: 2, name: 'Implementasi Frontend', sub: 'Komponen React Tailwind CSS', qty: 1, price: 0 },
];

export default function InvoiceBuilderPage() {
  const t = useTranslation();
  const [items, setItems] = useState<LineItem[]>(INITIAL);
  const [ppnEnabled, setPpnEnabled] = useState(true);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.qty * i.price, 0), [items]);
  const ppn = ppnEnabled ? calcPPN(subtotal) : 0;
  const grandTotal = subtotal + ppn;

  const removeItem = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));
  const addItem = () =>
    setItems((prev) => [...prev, { id: Date.now(), name: 'Item Baru', sub: '', qty: 1, price: 0 }]);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      {/* Builder */}
      <section className="space-y-6 xl:col-span-7">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-headline-sm font-headline-sm text-slate-heading">{t.invoiceBuilder.title}</h2>
            <p className="text-body-md text-slate-body">Draft #INV-2024-0042</p>
          </div>
          <Badge variant="pending">{t.status.draft}</Badge>
        </header>

        {/* Customer */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-pill-indigo-bg p-2">
              <UserPlus className="h-4 w-4 text-primary-container" />
            </div>
            <h3 className="text-body-lg font-bold text-slate-heading">{t.invoiceBuilder.customerInfo}</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label>{t.invoiceBuilder.customerName}</Label>
              <select className="w-full rounded-lg border border-border-light p-2.5 text-body-md outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20">
                <option>PT. Teknologi Nusantara Sejahtera</option>
                <option>IndoFood Makmur Corp</option>
                <option>Digital Agency Jakarta</option>
              </select>
            </div>
            <div>
              <Label>{t.invoiceBuilder.npwpNumber}</Label>
              <input defaultValue="01.234.567.8-012.000" className="w-full rounded-lg border border-border-light p-2.5 text-body-md outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" />
            </div>
            <div>
              <Label>{t.invoiceBuilder.whatsappNumber}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body-md text-slate-body">+62</span>
                <input defaultValue="81298765432" className="w-full rounded-lg border border-border-light p-2.5 pl-12 text-body-md outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20" />
              </div>
            </div>
          </div>
        </Card>

        {/* Items */}
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border-light p-6">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-pill-indigo-bg p-2">
                <ListChecks className="h-4 w-4 text-primary-container" />
              </div>
              <h3 className="text-body-lg font-bold text-slate-heading">{t.invoiceBuilder.serviceItems}</h3>
            </div>
            <button onClick={addItem} className="flex items-center gap-1 text-body-sm font-bold text-primary-container hover:underline">
              <PlusCircle className="h-4 w-4" /> {t.invoiceBuilder.addItem}
            </button>
          </div>
          <table className="w-full text-left">
            <thead className="border-b border-border-light bg-[#F1F5F9] text-label-md text-slate-body">
              <tr>
                <th className="px-6 py-3 font-semibold">{t.invoiceBuilder.description.toUpperCase()}</th>
                <th className="w-16 px-4 py-3 font-semibold">{t.invoiceBuilder.qty.toUpperCase()}</th>
                <th className="px-4 py-3 font-semibold">{t.invoiceBuilder.priceIdr.toUpperCase()}</th>
                <th className="px-6 py-3 text-right font-semibold">{t.invoiceBuilder.total.toUpperCase()}</th>
                <th className="px-2 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-body-md">
              {items.map((it) => (
                <tr key={it.id}>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-heading">{it.name}</p>
                    {it.sub && <p className="text-body-sm text-slate-body">{it.sub}</p>}
                  </td>
                  <td className="px-4 py-4">{it.qty}</td>
                  <td className="px-4 py-4 font-medium text-slate-body">{formatNumberID(it.price)}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-heading">{formatNumberID(it.qty * it.price)}</td>
                  <td className="px-2 py-4 text-center">
                    <button onClick={() => removeItem(it.id)} className="text-error opacity-50 transition-opacity hover:opacity-100">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col items-end gap-3 bg-surface-container-low p-6">
            <Row label={t.invoiceBuilder.subtotal} value={formatIDR(subtotal)} />
            <div className="flex w-64 items-center justify-between text-body-md">
              <div className="flex items-center gap-2">
                <span className="text-slate-body">{t.invoiceBuilder.ppn}</span>
                <button
                  onClick={() => setPpnEnabled((v) => !v)}
                  role="switch"
                  aria-checked={ppnEnabled}
                  className={`relative h-4 w-7 rounded-full transition-colors ${ppnEnabled ? 'bg-primary-container' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-[2px] h-3 w-3 rounded-full bg-white transition-all ${ppnEnabled ? 'left-[14px]' : 'left-[2px]'}`} />
                </button>
              </div>
              <span className="font-semibold text-slate-heading">{formatIDR(ppn)}</span>
            </div>
            <div className="mt-2 flex w-64 flex-col items-end gap-1 border-t border-border-light pt-4">
              <span className="text-label-md font-bold uppercase tracking-widest text-primary-container">{t.invoiceBuilder.grandTotal}</span>
              <span className="text-metric-display font-metric-display text-primary-container">{formatIDR(grandTotal)}</span>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button variant="primary" className="h-auto flex-1 py-4">{t.invoiceBuilder.confirmSend}</Button>
          <Button variant="secondary" className="h-auto py-4">{t.invoiceBuilder.saveTemplate}</Button>
        </div>
      </section>

      {/* Preview */}
      <section className="xl:col-span-5">
        <div className="sticky top-24 space-y-4">
          <div className="flex items-center justify-between rounded-full border border-border-light bg-white p-1.5 shadow-micro">
            <div className="flex items-center gap-1">
              <IconBtn title={t.invoiceBuilder.whatsappDirect}><MessageCircle className="h-5 w-5 text-secondary" /></IconBtn>
              <IconBtn title={t.invoiceBuilder.print}><Download className="h-5 w-5 text-primary-container" /></IconBtn>
            </div>
            <div className="flex items-center gap-2 pr-1">
              <button className="flex items-center gap-1.5 rounded-full bg-primary-fixed px-4 py-1.5 text-body-sm font-bold text-primary-container">
                <QrCode className="h-4 w-4" /> {t.invoiceBuilder.generateQris}
              </button>
              <IconBtn title={t.invoiceBuilder.print}><Printer className="h-5 w-5 text-slate-heading" /></IconBtn>
            </div>
          </div>

          {/* Document */}
          <div className="flex aspect-[1/1.41] w-full flex-col rounded-sm bg-white p-8 text-[#1e293b] shadow-2xl">
            <div className="mb-8 flex items-start justify-between">
              <div className="space-y-1">
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-container text-white">
                  <Landmark className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold">Akusoft Finansial</h4>
                <p className="max-w-[180px] text-[10px] leading-tight text-slate-body">
                  Prosperity Tower, 18th Floor<br />SCBD Lot 28, Jakarta Selatan<br />finance@akusoft.id
                </p>
              </div>
              <div className="text-right">
                <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-primary-container">INVOICE</h2>
                <p className="text-[10px] font-bold text-slate-body">INV/2024/0042</p>
                <p className="text-[10px] text-slate-body">24 Okt 2024</p>
              </div>
            </div>
            <div className="mb-8 rounded-lg bg-surface-container p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-body">{t.invoiceBuilder.billTo}</p>
              <p className="text-sm font-bold">PT. Teknologi Nusantara Sejahtera</p>
              <p className="text-[10px] text-slate-body">NPWP: 01.234.567.8-012.000</p>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-12 border-b-2 border-slate-heading pb-2 text-[10px] font-bold">
                <div className="col-span-7">DESKRIPSI ITEM</div>
                <div className="col-span-2 text-right">QTY</div>
                <div className="col-span-3 text-right">TOTAL (IDR)</div>
              </div>
              <div className="space-y-4 pt-4">
                {items.map((it) => (
                  <div key={it.id} className={`grid grid-cols-12 text-[11px] leading-tight ${it.price === 0 ? 'opacity-50' : ''}`}>
                    <div className="col-span-7"><p className="font-bold">{it.name}</p><p className="text-[10px] italic text-slate-body">{it.sub}</p></div>
                    <div className="col-span-2 text-right">{it.qty.toFixed(2)}</div>
                    <div className="col-span-3 text-right font-semibold">{formatNumberID(it.qty * it.price)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-auto flex items-end justify-between border-t border-border-light pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-md border border-border-light bg-white">
                  <QrCode className="h-14 w-14 text-slate-heading" />
                </div>
                <div className="max-w-[140px]">
                  <p className="mb-1 text-[8px] font-bold uppercase text-slate-body">{t.invoiceBuilder.paymentInfo}</p>
                  <p className="text-[9px] font-medium text-slate-body">Bank BCA: 8890123982<br />A/N PT. AKUSOFT TEKNOLOGI</p>
                </div>
              </div>
              <div className="w-48 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-body"><span>{t.invoiceBuilder.subtotal}</span><span>{formatNumberID(subtotal)}</span></div>
                <div className="flex justify-between text-[10px] text-slate-body"><span>PPN 11%</span><span>{formatNumberID(ppn)}</span></div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-primary-container"><span>TOTAL</span><span>{formatIDR(grandTotal)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-label-md font-label-md text-slate-heading">{children}</label>;
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-64 items-center justify-between text-body-md">
      <span className="text-slate-body">{label}</span>
      <span className="font-semibold text-slate-heading">{value}</span>
    </div>
  );
}
function IconBtn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <button title={title} className="rounded-full p-2 transition-colors hover:bg-surface-container">
      {children}
    </button>
  );
}
