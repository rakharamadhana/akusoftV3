# Akusoft v3.0

> **Cloud-Native Multi-Tenant Accounting SaaS for Indonesian UKMs (Usaha Kecil & Menengah)**  
> *One codebase running across Web, Android, and iOS.*

---

## 📌 Overview

**Akusoft v3.0** is a modern, cloud-native financial management and accounting platform specifically designed for Indonesian small and medium enterprises (UKM / Usaha Kecil & Menengah). Built from the ground up as a multi-tenant SaaS, it empowers business owners and accountants to manage invoices, track expenses, reconcile bank statements, calculate tax obligations (PPN 11%, PPh Final 0.5%), and generate financial reports seamlessly.

### Key Features

- 💼 **Multi-Company & Multi-Tenant**: Manage multiple businesses under a single account with strict database row-level security (RLS) per `company_id`.
- 📊 **Executive Financial Dashboard**: Real-time cash flow monitoring, revenue vs. expense metrics, and financial health indicators.
- 🧾 **Invoice Builder & AR Management**: Create professional digital invoices, track overdue payments, and share invoice links directly via WhatsApp.
- 💸 **Expense & Receipt Management**: Track company spending and scan receipt images directly via mobile camera integration.
- 🏦 **Bank Reconciliation**: Streamlined bank statement matching and automated cash flow tracking.
- 🇮🇩 **Indonesian Tax & Localization**: Built-in PPN (11%) handling, PPh Final 0.5% (PP 55/2022) calculation for UKMs, IDR currency formatting (`Rp 150.000`), and local payment gateway readiness (QRIS & Virtual Accounts).
- 📱 **Cross-Platform Native Apps**: Powered by Next.js static export wrapped with Ionic Framework and Capacitor for native Android and iOS experiences.

---

## 🛠️ Tech Stack

| Domain | Technology / Library |
| --- | --- |
| **Core Framework** | [Next.js 14+](https://nextjs.org/) (App Router, Static Export), [React 18](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Mobile & UI Layer** | [Ionic Framework (`@ionic/react` v8)](https://ionicframework.com/), [Capacitor 6+](https://capacitorjs.com/) |
| **Styling & Design** | [Tailwind CSS](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/), Luminous Precision Design System |
| **State & Data Fetching** | [TanStack Query v5](https://tanstack.com/query) (React Query), [Zustand v5](https://github.com/pmndrs/zustand) |
| **Backend & Database** | [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage, Edge Functions in `ap-southeast-1`) |
| **Charts & Documents** | [Recharts](https://recharts.org/), [`@react-pdf/renderer`](https://react-pdf.org/) |

---

## 📂 Repository Structure

```text
akusoft-v3/
├── .env.local.example          # Environment variable template
├── capacitor.config.ts         # Capacitor native container configuration
├── ionic.config.json           # Ionic CLI configuration
├── next.config.mjs             # Next.js configuration (configured for static export output)
├── tailwind.config.ts          # Tailwind CSS design system token mapping
├── CLAUDE.md                   # Core development guidelines & architecture rules
├── AKUSOFT_V3_GIGA_PROMPT.md   # Domain rules, database schema, tax & RLS specifications
├── AKUSOFT_V3_STITCH_DESIGN_PROMPT.md # Screen design composition specs
├── references/                 # Design system specifications & target HTML/screen previews
│   └── luminous_precision/    # Luminous Precision design tokens (DESIGN.md)
├── scripts/                    # Development helper scripts
│   └── ionic-serve.mjs        # Script to serve ionic web build
└── src/                        # Main application source code
    ├── app/                    # Next.js App Router routes & layouts
    │   ├── (app)/              # Authenticated dashboard & domain pages
    │   ├── daftar/             # Registration flow
    │   ├── login/              # Secure login screen
    │   ├── globals.css         # Tailwind global styles
    │   └── ionic-theme.css     # Ionic CSS variable design token bindings
    ├── components/             # Reusable UI components & Ionic wrappers
    ├── i18n/                   # Internationalization layer (Default: Bahasa Indonesia)
    ├── lib/                    # Supabase clients, utilities, and helpers
    └── store/                  # Zustand global state stores
```

---

## 🚀 Quick Start & Development

### Prerequisites

Ensure you have the following installed on your development machine:

- **Node.js**: `v18.x` or `v20.x` (LTS recommended)
- **npm**: `v9.x` or higher
- **Android Studio** *(Optional, for Android mobile development)*
- **Xcode** *(Optional, macOS required, for iOS mobile development)*

### 1. Clone the Repository

```bash
git clone https://github.com/rakharamadhana/akusoftV3.git
cd akusoftV3
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the environment template file to `.env.local`:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your Supabase project credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-publishable-key
```

### 4. Run Development Server

To launch the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

Alternatively, to run via Ionic serve helper:

```bash
npm run ionic:serve
```

---

## 📱 Mobile Development (Capacitor)

Akusoft v3.0 uses Capacitor to wrap the Next.js static output (`out/`) into native Android and iOS applications.

### Building for Mobile

1. **Build Web Output & Sync Native Projects**:
   ```bash
   npm run cap:sync
   ```
2. **Open in Android Studio**:
   ```bash
   npm run cap:android
   ```
3. **Open in Xcode (macOS only)**:
   ```bash
   npm run cap:ios
   ```

> ⚠️ **Note**: Any code added to `src/app` must remain compatible with Next.js static export (`output: 'export'`). Avoid server-only runtime APIs that break static builds.

---

## ⚙️ Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Next.js development server at `http://localhost:3000`. |
| `npm run build` | Compiles the project and generates static HTML export in `out/`. |
| `npm run start` | Runs Next.js production server. |
| `npm run ionic:serve` | Runs the development environment through the Ionic helper script. |
| `npm run typecheck` | Executes TypeScript type checking (`tsc --noEmit`). |
| `npm run lint` | Runs Next.js ESLint validation. |
| `npm run cap:sync` | Builds the web application and synchronizes assets with Capacitor native platforms. |
| `npm run cap:android` | Builds, syncs, and opens the Android project in Android Studio. |
| `npm run cap:ios` | Builds, syncs, and opens the iOS project in Xcode. |

---

## 🤝 Contribution Guidelines

We welcome contributions! To ensure high code quality, security, and consistency across platforms, please adhere to the following guidelines:

### 1. Architectural Source of Truth
Before making design or code changes, consult the documentation hierarchy in [`CLAUDE.md`](CLAUDE.md):
1. **[`AKUSOFT_V3_GIGA_PROMPT.md`](AKUSOFT_V3_GIGA_PROMPT.md)**: Domain architecture, database schema, multi-tenancy, and tax rules.
2. **[`AKUSOFT_V3_STITCH_DESIGN_PROMPT.md`](AKUSOFT_V3_STITCH_DESIGN_PROMPT.md)**: Screen layouts and UX requirements.
3. **[`references/luminous_precision/DESIGN.md`](references/luminous_precision/DESIGN.md)**: Design system tokens (colors, typography, spacing, radius).

### 2. Multi-Tenant Security (Row Level Security)
- All database queries and table operations **must** be scoped by `company_id`.
- Ensure Supabase RLS policies utilize `is_member_of_company(company_id)` to prevent unauthorized cross-tenant data access.

### 3. Language & i18n Policy
- **Primary Language**: All user-facing UI text must be written in **Bahasa Indonesia** (e.g., `Buat Faktur`, `Piutang Usaha`, status labels `LUNAS` / `JATUH TEMPO` / `PENDING`).
- All strings must be passed through the i18n translation layer (`src/i18n`) rather than hardcoded inline, keeping the codebase ready for multi-language support.

### 4. Design & UI Components
- Use **Ionic Framework** components (`IonPage`, `IonContent`, `IonButton`, `IonCard`, `IonInput`, etc.) styled with the **Luminous Precision** theme (`src/app/ionic-theme.css`).
- Use Tailwind CSS utility classes for layout alignment.
- Maintain consistent status colors:
  - **LUNAS** (Paid): Mint green (`#059669` on `#D1FAE5`)
  - **JATUH TEMPO** (Overdue): Coral red (`#DC2626` on `#FEE2E2`)
  - **PENDING** (Pending): Amber yellow (`#D97706` on `#FEF3C7`)

### 5. Contribution Workflow

1. **Fork or Create a Feature Branch**:
   ```bash
   git checkout -b feature/nama-fitur
   ```
2. **Make Changes & Verify**:
   - Run typecheck: `npm run typecheck`
   - Run linting: `npm run lint`
   - Test build compatibility: `npm run build`
3. **Commit Your Changes**:
   ```bash
   git commit -m "feat: tambahkan modul rekonsiliasi bank"
   ```
4. **Push & Create Pull Request**:
   Push to your branch and open a Pull Request with a clear summary of your changes.

---

## 📄 License

Private & Proprietary — © **Akusoft v3.0**. All rights reserved.
