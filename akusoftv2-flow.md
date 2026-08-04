# AKUSOFT v2 — Application Flow Reference

Source: two tutorial videos ("Tutorial Akusoft" and "Tutorial Aplikasi Laporan Keuangan Sederhana bagi UMKM oleh Wirianti").
Purpose: reference doc to supervise a model building a similar UMKM (micro/small business) financial reporting app using single-entry bookkeeping.

---

## 1. What the App Is

A simple financial record-keeping app for UMKM (micro, small, medium businesses) that don't know how to prepare financial statements manually. Uses **single entry** bookkeeping. Users log daily income and expenses, and the app auto-generates:

- **Laba Rugi** (Income Statement / P&L)
- **Neraca** (Balance Sheet)

Access:
- Web: `ukm.akusoftapp.com` (login) / `ukm.akusoftapp.com/auth/login`
- Android app via Play Store

---

## 2. Auth Flow

### Register ("Daftar Pengguna Baru")
Fields:
- Nama (Name)
- E-mail
- Nama Perusahaan (Company Name)
- Sandi (Password)
- Konfirmasi Sandi (Confirm Password)

Actions: **Daftar** (Register) button. Links: "Sudah punya akun?" (login), "Lupa kata sandi?" (forgot password).

### Login
Email + password. Straightforward login for returning users.

### First-time setup
After first login, user is prompted to fill in **Modal Awal** (initial capital/starting balance) for the business.

---

## 3. Main Dashboard Menu Structure

| Menu | Purpose |
|---|---|
| **Akun** (Accounts) | Chart of accounts used across the financial reports |
| **Item** | Products/goods the business sells |
| **Pemasukan / Pendapatan** (Income) | Record incoming money |
| **Pengeluaran / Pembayaran** (Expense) | Record outgoing money |
| **Transaksi** (Transactions) | Summary/log of all recorded transactions |
| **Laporan** (Reports) | Auto-generated financial reports (view/print/download) |
| **Pengaturan** (Settings) | General app/business configuration |

---

## 4. Accounts (Chart of Accounts)

Default accounts provided out of the box:
- Kas (Cash)
- Bank
- Piutang Usaha (Accounts Receivable)
- Persediaan Barang Dagang (Merchandise Inventory)
- Gedung (Building)
- Kendaraan (Vehicle)
- Mesin (Machinery)
- Peralatan Usaha (Business Equipment)
- Hutang Usaha (Accounts Payable)
- Hutang Bank (Bank Loan)
- Hutang Lain-lain (Other Payables)
- Modal Awal (Initial Capital)

Capabilities:
- Add or delete accounts as needed.
- Edit an account's name/category.
- Fill in / edit an account's balance via row-level **Tindakan → Sunting** (Actions → Edit) — this is also how you retroactively fill in initial capital if skipped during setup.

---

## 5. Items / Products

Menu: **Item → Tambah Baru** (Add New)

Form fields ("Item Baru"):
- Nama (Name)
- SKU
- Deskripsi (Description)
- Harga Jual (Selling Price)
- Harga Beli / Harga Pokok (Cost Price / COGS basis)
- Jumlah / Stok (Stock quantity)
- Pajak (Tax, optional)
- Kategori (Category)
- Gambar produk (Product image)
- Status: **Diaktifkan** (Active/enabled toggle)

Multiple items can be added. Save with **Simpan**.

---

## 6. Recording Income (Pemasukan / Pendapatan)

Used whenever money comes in, e.g. a sale to a customer.

Path: **Pemasukan → Pendapatan → Tambah Baru**

Fields:
- Tanggal transaksi (Transaction date)
- Jumlah uang diterima (Amount received)
- Akun terkait (Related account — e.g. Kas or Bank)
- Pelanggan (Customer)
- Tipe pendapatan (Income type)
- Item/produk yang terjual (Item(s) sold) — supports multiple items
- Kuantitas (Quantity, per item)
- Deskripsi (Description)
- Kategori pendapatan (Income category)
- Payment basis: cash (kas) or receivable/credit (piutang)

Save with **Simpan**.

---

## 7. Recording Expenses (Pengeluaran / Pembayaran)

Used for operational expenses, e.g. purchasing raw materials, paying salaries.

Path: **Pengeluaran → Pembayaran → Tambahkan**

Fields:
- Tanggal transaksi (Date)
- Jumlah (Total amount)
- Akun sumber dana (Source account — Kas or Bank)
- Tipe pembayaran: **Pembelian Barang Dagang** (merchandise purchase) or **Non-Barang Dagang** (non-merchandise, e.g. salary, utilities)
- Kategori (Category)
- Deskripsi (Description)
- Metode pembayaran (Payment method, e.g. Cash)

Save with **Simpan**. This same feature covers various expense types (goods purchases, salaries, etc.), differentiated by "tipe" and "kategori."

---

## 8. Transactions Menu

**Transaksi** — a consolidated log/summary of all income and expense entries recorded so far. Used to review/audit daily entries.

---

## 9. Reports (Laporan)

Two auto-generated reports, viewable, printable, and downloadable:

### Laba Rugi (Income Statement)
- Net profit = total sales − COGS − expenses, for a selected period.
- Displayed per period (e.g. quarterly: Jan–Mar, Apr–Jun, etc.), with breakdown of:
  - HPP (Cost of Goods Sold)
  - Total pemasukan (total income)
  - Total pengeluaran (total expenses)
- Action: **"Update Laporan Laba Rugi"** — pushes/transfers net profit into the Neraca (balance sheet).

### Neraca (Balance Sheet)
- Shows: cash, merchandise inventory, other assets, liabilities, and capital.
- Includes net profit transferred in from the Laba Rugi report (after the update action above).

> Implementation note: Laba Rugi and Neraca are linked — net income isn't automatically live on the balance sheet; it requires the explicit "Update" action to roll it into equity/capital.

---

## 10. Settings (Pengaturan)

Sub-sections:
- **Umum** (General) — business name, email, NPWP (tax ID), phone, address, business logo.
- **Kategori** (Categories) — edit income/expense categories used across the app.
- **Mata Uang** (Currency) — select currency preference.
- **Offline Payment** — configure offline payment methods for transactions.

---

## 11. End-to-End User Flow (Summary)

1. Register with email → confirm → login (or login directly if account exists).
2. Fill in initial capital (Modal Awal) on first use.
3. Review/adjust Chart of Accounts (add, delete, rename, edit balances as needed).
4. Add products/items with pricing, cost, stock, category, tax, image.
5. Record daily income entries (sales) — pick item(s), quantity, account, customer, cash/credit.
6. Record daily expense entries (purchases, operational costs) — pick account, type, category, payment method.
7. Check **Transaksi** for a running log of all entries.
8. Open **Laporan** to view/print/download Laba Rugi and Neraca — no manual statement preparation needed.
9. Use **Update Laporan Laba Rugi** to roll net profit into the balance sheet.
10. Adjust **Pengaturan** (business profile, categories, currency, offline payment methods) as needed.

---

## 12. Suggested Core Data Model (for implementation)

- **User** (name, email, company name, password)
- **Account** (name, type/category, balance) — seeded with defaults, editable
- **Item** (name, SKU, description, sell price, cost price, stock qty, tax, category, image, active flag)
- **IncomeEntry** (date, amount, account_id, customer, income_type, category, description, line items: [item_id, qty])
- **ExpenseEntry** (date, amount, account_id, expense_type [merchandise/non-merchandise], category, description, payment_method)
- **Transaction** (unified log/view combining IncomeEntry + ExpenseEntry)
- **Report**: computed views —
  - IncomeStatement(period) → revenue, COGS, expenses, net profit
  - BalanceSheet → assets, liabilities, capital (+ net profit once "updated" from income statement)
- **Settings**: business profile (name, email, tax ID, phone, address, logo), categories, currency, offline payment methods
