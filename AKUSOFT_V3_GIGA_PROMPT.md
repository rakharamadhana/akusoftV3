# GIGA PROMPT: Akusoft v3.0 (Modern Next.js, Supabase & Ionic Capacitor Mobile SaaS)

> **Instructions for AI**: You are an Elite Principal Software Architect and Full-Stack Engineering Lead. Follow the complete specifications in this document to build **Akusoft v3.0**, a cloud-native, multi-tenant accounting SaaS optimized for **Indonesian UKMs (Usaha Kecil & Menengah)** hosted on **Vercel** (Web) and packaged with **Ionic Capacitor** for **Android & iOS Mobile App Stores**.

---

## 1. System Persona & Role

You are a Principal Software Architect specializing in:
- Next.js 14+ (App Router, Server Actions, TypeScript)
- Ionic Capacitor (`@capacitor/core`, `@capacitor/android`, `@capacitor/ios`) for 100% unified Web + Mobile cross-platform deployment.
- Supabase (Managed PostgreSQL, Row Level Security / RLS, Auth, Storage, Edge Functions).
- Tailwind CSS & Shadcn UI Design Systems.
- Indonesian Financial, Accounting, Tax Compliance (PPN 11%, PPh 0.5% Final), and Payment Gateways (QRIS & Virtual Accounts).

Your objective is to extract 100% of the accounting features from Akusoft v1.0 (Akaunting) and rebuild them into **Akusoft v3.0**, a modern, fast, serverless web app + native mobile app suite.

---

## 2. Technical Stack & Multi-Platform Architecture

```text
                                 +-----------------------------------+
                                 |         Next.js 14 Web App        |
                                 | (Tailwind CSS + Shadcn UI + React)|
                                 +-----------------+-----------------+
                                                   |
                         +-------------------------+-------------------------+
                         |                                                   |
                         v                                                   v
           +---------------------------+                       +---------------------------+
           |       Vercel Deployment   |                       |  Ionic Capacitor Wrapper  |
           |      (Web SaaS Browser)   |                       | (Native iOS & Android)    |
           +-------------+-------------+                       +-------------+-------------+
                         |                                                   |
                         +-------------------------+-------------------------+
                                                   |
                                                   v
                                 +-----------------------------------+
                                 |       Supabase Cloud Service      |
                                 | (PostgreSQL, Auth, Storage, Edge) |
                                 +-----------------------------------+
```

- **Frontend & Web API**: Next.js 14+ (App Router) + React 18 + TypeScript hosted on **Vercel** (Singapore `sin1` / Jakarta `cgk` Edge Network).
- **Mobile Native Runtime**: **Ionic Capacitor 6+** (`@capacitor/core`, `@capacitor/camera`, `@capacitor/push-notifications`, `@capacitor-community/bluetooth-le`).
- **Styling & UI**: Tailwind CSS + Shadcn UI + Radix UI + Lucide Icons + Framer Motion.
- **State Management**: TanStack Query (React Query v5) + Zustand.
- **Database & Security**: Supabase Managed PostgreSQL (Singapore `ap-southeast-1` region) with Row Level Security (RLS) policies per `company_id`.
- **Authentication**: Supabase Auth (Email/Password, Magic Link, Biometric/Passkey).
- **Object Storage**: Supabase Storage Buckets (`invoices`, `bills`, `logos`, `receipts`).
- **Analytics & Charts**: Recharts / Tremor for financial dashboards, cash flow, and tax reporting.
- **PDF Engine**: `@react-pdf/renderer` for client-side and edge PDF generation.

---

## 3. Ionic Capacitor Configuration & Mobile Features

### Native Plugins & Capabilities
1. **Receipt / Struk Camera Scanner (`@capacitor/camera`)**:
   - Business owners take photos of physical expense receipts/struk directly via mobile camera.
   - Files are automatically compressed and uploaded directly to Supabase Storage `bills/` bucket.
2. **Bluetooth Thermal Receipt Printing (`@capacitor-community/bluetooth-le`)**:
   - Direct Bluetooth printing support for 58mm & 80mm POS thermal printers commonly used by Indonesian UKMs.
3. **Native Push Notifications (`@capacitor/push-notifications`)**:
   - Push alerts for invoice payment confirmations, overdue invoice reminders, and low stock warnings.
4. **Biometric Quick Login (`@capacitor/biometrics`)**:
   - FaceID / Fingerprint quick authentication for fast app access.

### `capacitor.config.ts` Template
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.akusoft.app',
  appName: 'Akusoft UKM',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Live reload during development:
    // url: 'http://192.168.1.x:3000',
    // cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
```

---

## 4. Extracted Domain Modules

Extract and implement all core accounting modules from Akusoft v1.0:

1. **Incomes & Billing**:
   - Invoices list, creation wizard, line items, automatic tax calculations (PPN 11%), PDF generation, status tracking (`draft`, `sent`, `partial`, `paid`, `overdue`).
   - Direct Revenues logging.
   - Customer Portal view for invoice review & direct payments.
2. **Expenses & Accounts Payable**:
   - Vendor Bills, Mobile Camera receipt scan upload to Supabase Storage, direct expense logging.
   - Vendor directory with NPWP / NIK identification fields.
3. **Banking & Cash Flow (Kas & Bank)**:
   - Account management (BCA, Mandiri, BRI, BNI, Kas Kecil) with IDR default currency.
   - Internal account transfers with zero-fee tracking.
   - Bank reconciliation against uploaded *mutasi rekening*.
4. **Items & Inventory**:
   - Product/Service catalog with buy/sell prices.
   - Real-time stock warnings when items fall below threshold levels.
5. **Multi-Tenancy & Access Control**:
   - Instant switching between tenant companies.
   - All database queries strictly scoped by `company_id` via Supabase RLS.
6. **Financial Reports**:
   - Income Summary, Expense Summary, Income vs Expense chart.
   - Profit & Loss Statement (P&L) exportable to Excel/PDF.
   - Tax summary (Collected PPN 11% vs PPh 0.5% Final UKM).

---

## 5. Supabase Database Schema (SQL DDL)

Copy and execute this schema in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies (Multi-Tenant Scope)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    tax_number VARCHAR(50), -- NPWP Perusahaan
    currency VARCHAR(10) DEFAULT 'IDR',
    domain VARCHAR(255),
    logo_path TEXT,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Companies Junction (RBAC)
CREATE TABLE user_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'owner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts (Customers & Vendors)
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    type VARCHAR(20) CHECK (type IN ('customer', 'vendor')),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50), -- No. WhatsApp
    tax_number VARCHAR(50), -- NPWP / NIK
    address TEXT,
    currency VARCHAR(10) DEFAULT 'IDR',
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bank Accounts (Kas & Bank)
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g. "Bank BCA", "Kas Utama"
    number VARCHAR(100), -- No. Rekening
    currency VARCHAR(10) DEFAULT 'IDR',
    opening_balance NUMERIC(15, 2) DEFAULT 0.00,
    current_balance NUMERIC(15, 2) DEFAULT 0.00,
    bank_name VARCHAR(255), -- BCA, Mandiri, BRI, BNI, Cash
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items Catalog
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sale_price NUMERIC(15, 2) NOT NULL,
    purchase_price NUMERIC(15, 2) DEFAULT 0.00,
    quantity INT DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents (Invoices & Bills)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    type VARCHAR(20) CHECK (type IN ('invoice', 'bill')),
    document_number VARCHAR(50) NOT NULL,
    order_number VARCHAR(50),
    status VARCHAR(30) DEFAULT 'draft',
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'IDR',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document Line Items
CREATE TABLE document_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price NUMERIC(15, 2) NOT NULL,
    tax_amount NUMERIC(15, 2) DEFAULT 0.00,
    total NUMERIC(15, 2) NOT NULL
);

-- Transactions (Income, Expense, Transfers)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    account_id UUID REFERENCES bank_accounts(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    type VARCHAR(20) CHECK (type IN ('income', 'expense', 'transfer')),
    paid_at TIMESTAMP WITH TIME ZONE NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'IDR',
    description TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Multi-Tenant RLS Function & Policies
CREATE OR REPLACE FUNCTION is_member_of_company(cid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_companies
    WHERE user_id = auth.uid()
    AND company_id = cid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Tenant documents isolation" ON documents FOR ALL USING (is_member_of_company(company_id));
CREATE POLICY "Tenant contacts isolation" ON contacts FOR ALL USING (is_member_of_company(company_id));
CREATE POLICY "Tenant bank_accounts isolation" ON bank_accounts FOR ALL USING (is_member_of_company(company_id));
CREATE POLICY "Tenant items isolation" ON items FOR ALL USING (is_member_of_company(company_id));
CREATE POLICY "Tenant transactions isolation" ON transactions FOR ALL USING (is_member_of_company(company_id));
```

---

## 6. Indonesian UKM Localization Rules

1. **Rupiah Formatting (IDR)**:
   - Always format numbers using Indonesian standard: `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })`.
   - Display standard: `Rp 150.000` (thousands separator: `.`, decimal separator: `,`).
2. **Indonesian Tax Calculation**:
   - **PPN 11%**: Default tax toggle on Invoices and Bills. Include NPWP / NIK identification fields for tax reporting.
   - **PPh Final 0.5% (PP 55/2022)**: Automated gross revenue calculator for UKMs with turnover under Rp 4,8 Miliar/tahun.
3. **Payment Gateways (QRIS & Virtual Accounts)**:
   - Next.js API route integration ready for **Midtrans / Xendit / Tripay** allowing clients to pay invoices via QRIS (GoPay, OVO, ShopeePay, DANA) or Virtual Accounts (BCA, Mandiri, BRI, BNI).
4. **WhatsApp Invoice Sharing**:
   - Generate direct WhatsApp share buttons (`https://wa.me/628xxx?text=...`) for sending PDF invoice links and due date payment reminders directly to client phones.

---

## 7. Implementation & Mobile Export Roadmap

- **Phase 1: Next.js Foundation & Supabase Setup**: Initialize Next.js 14 App Router with TypeScript, Tailwind CSS, Shadcn UI, and `@supabase/ssr` setup. Create `CompanyContext` provider for company switching.
- **Phase 2: UI & Mobile Navigation System**: Build responsive sidebar (Desktop) and collapsible bottom navigation bar (Mobile) with language switcher (Bahasa Indonesia / English).
- **Phase 3: Core Accounting Modules**:
  - Implement Incomes (Invoice wizard, PDF generator, WhatsApp share button).
  - Implement Expenses (Vendor Bills, Mobile Camera receipt scan upload to Supabase Storage).
  - Implement Banking (Kas & Bank balances, transactions, reconciliation).
  - Implement Reports (Recharts financial charts, PnL statement export).
- **Phase 4: Ionic Capacitor Mobile Setup**:
  - Install Capacitor core and CLI: `npm i @capacitor/core @capacitor/camera @capacitor/push-notifications`.
  - Initialize Capacitor: `npx cap init Akusoft com.akusoft.app`.
  - Add native platforms: `npx cap add android` and `npx cap add ios`.
  - Sync web build: `npx cap sync`.
- **Phase 5: Native App Store & Play Store Export**:
  - Build Android APK/AAB: `npx cap open android` (Generates Android Studio project).
  - Build iOS IPA: `npx cap open ios` (Generates Xcode project).
  - Configure Vercel web deployment for the web SaaS version.
