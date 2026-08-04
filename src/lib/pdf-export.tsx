'use client';

import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', fontSize: 10, color: '#1e293b' },
  header: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#cbd5e1', paddingBottom: 10 },
  title: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#0f172a' },
  subtitle: { fontSize: 10, color: '#64748b', marginTop: 4 },
  sectionHeader: { fontSize: 11, fontFamily: 'Helvetica-Bold', marginTop: 12, marginBottom: 6, color: '#2563eb' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingVertical: 5, alignItems: 'center' },
  tableRowHeader: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#cbd5e1', paddingVertical: 6, backgroundColor: '#f8fafc' },
  colAccount: { flex: 2 },
  colQuarter: { flex: 1, textAlign: 'right' },
  colTotal: { flex: 1, textAlign: 'right', fontFamily: 'Helvetica-Bold' },
  textHeader: { fontFamily: 'Helvetica-Bold', color: '#475569', fontSize: 9 },
  totalRow: { flexDirection: 'row', borderTopWidth: 1.5, borderTopColor: '#0f172a', paddingVertical: 8, marginTop: 4, backgroundColor: '#f1f5f9' },
  totalLabel: { flex: 2, fontFamily: 'Helvetica-Bold', fontSize: 11 },
  totalValue: { flex: 1, textAlign: 'right', fontFamily: 'Helvetica-Bold', fontSize: 11, color: '#10b981' },
  statementRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  boldText: { fontFamily: 'Helvetica-Bold' },
});

export async function downloadReportPDF({
  type,
  year,
  companyName,
  plData,
  neracaData,
  quarters,
  formatIDR,
}: {
  type: 'labaRugi' | 'neraca';
  year: number;
  companyName: string;
  plData?: any;
  neracaData?: any;
  quarters: string[];
  formatIDR: (v: number) => string;
}) {
  const fileName = type === 'labaRugi' ? `Laporan_Laba_Rugi_${year}.pdf` : `Laporan_Neraca_${year}.pdf`;

  let doc;
  if (type === 'labaRugi' && plData) {
    doc = (
      <Document title={`Laporan_Laba_Rugi_${year}`}>
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Laporan Laba Rugi — {year}</Text>
            <Text style={styles.subtitle}>{companyName} · Tanggal Ekspor: {new Date().toLocaleDateString('id-ID')}</Text>
          </View>

          <View style={styles.tableRowHeader}>
            <Text style={[styles.colAccount, styles.textHeader]}>Keterangan / Akun</Text>
            {quarters.map((q) => (
              <Text key={q} style={[styles.colQuarter, styles.textHeader]}>{q}</Text>
            ))}
            <Text style={[styles.colTotal, styles.textHeader]}>Total</Text>
          </View>

          <Text style={styles.sectionHeader}>Pemasukan</Text>
          {plData.income.map((row: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colAccount}>{row.code ? `${row.code} ` : ''}{row.name}</Text>
              {row.quarters.map((q: number, qi: number) => (
                <Text key={qi} style={styles.colQuarter}>{formatIDR(q)}</Text>
              ))}
              <Text style={styles.colTotal}>{formatIDR(row.total)}</Text>
            </View>
          ))}
          <View style={styles.tableRow}>
            <Text style={[styles.colAccount, styles.boldText]}>Total Pemasukan</Text>
            {plData.incomeTotals.map((tVal: number, i: number) => (
              <Text key={i} style={[styles.colQuarter, styles.boldText]}>{formatIDR(tVal)}</Text>
            ))}
            <Text style={[styles.colTotal, styles.boldText]}>{formatIDR(plData.incomeTotal)}</Text>
          </View>

          <Text style={styles.sectionHeader}>Pengeluaran</Text>
          {plData.expense.map((row: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colAccount}>{row.code ? `${row.code} ` : ''}{row.name}</Text>
              {row.quarters.map((q: number, qi: number) => (
                <Text key={qi} style={styles.colQuarter}>{formatIDR(q)}</Text>
              ))}
              <Text style={styles.colTotal}>{formatIDR(row.total)}</Text>
            </View>
          ))}
          <View style={styles.tableRow}>
            <Text style={[styles.colAccount, styles.boldText]}>Total Pengeluaran</Text>
            {plData.expenseTotals.map((tVal: number, i: number) => (
              <Text key={i} style={[styles.colQuarter, styles.boldText]}>{formatIDR(tVal)}</Text>
            ))}
            <Text style={[styles.colTotal, styles.boldText]}>{formatIDR(plData.expenseTotal)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Laba Bersih</Text>
            {plData.netByQuarter.map((v: number, i: number) => (
              <Text key={i} style={[styles.colQuarter, styles.boldText]}>{formatIDR(v)}</Text>
            ))}
            <Text style={styles.totalValue}>{formatIDR(plData.net)}</Text>
          </View>
        </Page>
      </Document>
    );
  } else if (neracaData) {
    const totalLiabEquity = neracaData.totalLiabilities + neracaData.modal + neracaData.retained;
    doc = (
      <Document title="Laporan_Neraca">
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Laporan Neraca (Balance Sheet)</Text>
            <Text style={styles.subtitle}>{companyName} · Tanggal Ekspor: {new Date().toLocaleDateString('id-ID')}</Text>
          </View>

          <Text style={styles.sectionHeader}>Aset</Text>
          <View style={styles.statementRow}>
            <Text>Kas & Bank</Text>
            <Text style={styles.boldText}>{formatIDR(neracaData.cash)}</Text>
          </View>
          <View style={styles.statementRow}>
            <Text>Persediaan Barang Dagang</Text>
            <Text style={styles.boldText}>{formatIDR(neracaData.inventory)}</Text>
          </View>
          <View style={styles.statementRow}>
            <Text>Aset Lainnya</Text>
            <Text style={styles.boldText}>{formatIDR(neracaData.otherAssets)}</Text>
          </View>
          <View style={[styles.statementRow, { backgroundColor: '#f1f5f9', marginTop: 4 }]}>
            <Text style={styles.boldText}>Total Aset</Text>
            <Text style={[styles.boldText, { color: '#2563eb' }]}>{formatIDR(neracaData.totalAssets)}</Text>
          </View>

          <Text style={[styles.sectionHeader, { marginTop: 20 }]}>Kewajiban & Modal</Text>
          <View style={styles.statementRow}>
            <Text>Total Kewajiban</Text>
            <Text style={styles.boldText}>{formatIDR(neracaData.totalLiabilities)}</Text>
          </View>
          <View style={styles.statementRow}>
            <Text>Modal</Text>
            <Text style={styles.boldText}>{formatIDR(neracaData.modal)}</Text>
          </View>
          <View style={styles.statementRow}>
            <Text>Laba Ditahan</Text>
            <Text style={styles.boldText}>{formatIDR(neracaData.retained)}</Text>
          </View>
          <View style={[styles.statementRow, { backgroundColor: '#f1f5f9', marginTop: 4 }]}>
            <Text style={styles.boldText}>Total Kewajiban + Modal</Text>
            <Text style={[styles.boldText, { color: '#2563eb' }]}>{formatIDR(totalLiabEquity)}</Text>
          </View>
        </Page>
      </Document>
    );
  }

  if (!doc) return;

  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
