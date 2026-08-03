# CLAUDE.md — Akusoft v2.0

> This file governs every design and engineering decision in this repository.
> **Read it — and the hierarchy in §2 — before designing or building anything.**

---

## 1. Project Identity

**Akusoft v2.0** is a cloud-native, multi-tenant **accounting SaaS for Indonesian UKMs**
(Usaha Kecil & Menengah). It ships as one codebase to three targets:

- **Web** — Next.js 14 on **Vercel**.
- **Android + iOS** — the same web build wrapped with **Ionic Capacitor**.

This is a **brand-new, standalone project**. It reimplements the accounting features of
Akusoft v1.0 (Akaunting) but shares **no code, history, or dependencies** with it. Do not
treat this as a branch or fork of v1.0.

---

## 2. ⚠️ Source-of-Truth Hierarchy — ALWAYS follow before designing anything

Before you design a screen, build a component, choose a color, write copy, or model data,
**consult these documents in this exact order**. Each layer answers a different question.

| # | Document | Authoritative for |
|---|----------|-------------------|
| **1** | [`AKUSOFT_V2_GIGA_PROMPT.md`](AKUSOFT_V2_GIGA_PROMPT.md) | **WHAT to build** — stack, multi-tenant architecture, domain modules, Supabase schema & RLS, Indonesian tax & localization rules. |
| **2** | [`AKUSOFT_V2_STITCH_DESIGN_PROMPT.md`](AKUSOFT_V2_STITCH_DESIGN_PROMPT.md) | **Design intent** — per-screen composition, layout, and copy direction. |
| **3** | [`references/luminous_precision/DESIGN.md`](references/luminous_precision/DESIGN.md) | **The canonical design system** — color tokens, typography, radius, spacing, elevation, and component specs. **Token values here are law.** |
| **4** | `references/<screen>/code.html` + `screen.png` | **The pixel/markup contract** for the specific screen being built. |

### Available reference screens (layer 4)

`references/` contains one folder per screen, each with `code.html` (Tailwind markup) and
`screen.png` (the rendered target):

- `executive_financial_dashboard`
- `invoice_builder_preview`
- `bank_reconciliation_ai_matching`
- `expense_management_analytics`
- `tax_compliance_reporting`
- `multi_company_registration`
- `secure_login`

### How to apply the hierarchy

When building a specific screen:
1. **Re-read this hierarchy.**
2. Layers **1–2** define behavior, data, and content — *what the screen does and says*.
3. Layer **4** (`code.html` + `screen.png`) is the **visual contract** for that screen — match it.
4. Layer **3** (`DESIGN.md`) governs **any token or component not pinned by the reference**, and is the implementation vocabulary (token names, values) for everything.

### Conflict resolution

- Conflicts resolve **upward**: a lower layer never overrides a higher layer's *intent*.
- **`DESIGN.md` tokens are the source of truth for values** (a color/spacing/radius). If a
  reference `code.html` hardcodes a value that contradicts `DESIGN.md`, prefer the
  `DESIGN.md` token and flag the discrepancy.
- **Known discrepancy to resolve deliberately:** `DESIGN.md` frontmatter lists `rounded-lg`
  as `1rem`, but the reference `code.html` files compile `rounded-lg` → `0.5rem` and use
  `rounded-xl` (`0.75rem`) for bento cards. When we set up the Tailwind config, decide the
  card radius once and centralize it as a token — do not copy raw values ad hoc.

---

## 3. Language Policy

- **Default language is Bahasa Indonesia.** ALL user-facing copy is written in Bahasa
  Indonesia (e.g. `Buat Faktur`, `Piutang Usaha`, status pills `LUNAS` / `JATUH TEMPO` /
  `PENDING`). Keep it that way.
- **English is a planned second locale — do NOT author English copy now.**
- **But build for it from day one:** route every visible string through an i18n layer with
  `id` as the default namespace, so English can be added later with **zero refactor**.
  No hardcoded UI strings scattered in components.

---

## 4. Tech Stack (locked — per GIGA §2)

- **Framework:** Next.js 14+ (App Router, Server Actions) + React 18 + TypeScript.
- **UI:** Tailwind CSS + Shadcn UI + Radix UI + Lucide icons + Framer Motion.
- **Data/state:** TanStack Query (React Query v5) + Zustand.
- **Charts:** Recharts / Tremor.
- **PDF:** `@react-pdf/renderer`.

---

## 5. Database — Supabase

- **Managed PostgreSQL** in `ap-southeast-1` (Singapore), plus Supabase **Auth**, **Storage**,
  and **Edge Functions**.
- **Storage buckets:** `invoices`, `bills`, `logos`, `receipts`.
- **Multi-tenancy is non-negotiable:** every table and every query is scoped by
  **`company_id`** and enforced with **Row Level Security** using the
  `is_member_of_company(company_id)` policy pattern.
- The **SQL DDL in [GIGA §5](AKUSOFT_V2_GIGA_PROMPT.md)** is the source of truth for the
  schema — new migrations extend it, they do not diverge from it.

---

## 6. Deployment — Vercel

- Web SaaS deploys to **Vercel** (Singapore `sin1` / Jakarta `cgk` edge).
- **Capacitor constraint:** the build must stay compatible with Next.js **static export**
  (`webDir: 'out'`) so the same output can be wrapped for mobile. Avoid server-only features
  that break static export unless a deliberate web/mobile split is decided first.

---

## 7. Mobile — Ionic Capacitor 6+

One web codebase → Web + Android + iOS.

- `appId`: `com.akusoft.app` · `appName`: `Akusoft UKM` · `webDir`: `out`.
- **Native plugins:**
  - `@capacitor/camera` — scan receipts/struk → upload to Storage `bills/`.
  - `@capacitor-community/bluetooth-le` — 58mm & 80mm thermal receipt printing.
  - `@capacitor/push-notifications` — payment confirmations, overdue reminders, low-stock.
  - `@capacitor/biometrics` — FaceID / fingerprint quick login.
- Keep all web output **export-safe** so `npx cap sync` works from the `out/` build.

---

## 8. Design System — Quick Reference

> `references/luminous_precision/DESIGN.md` is authoritative. This is a convenience summary;
> if it drifts, **DESIGN.md wins.**

**Aesthetic:** Airy Minimalism, bright light mode, Bento grid. Pure white cards on a soft
pearl canvas, sapphire + mint accents, high-contrast slate typography, micro-shadows.

| Token | Value |
|-------|-------|
| Canvas base | `#F8FAFC` |
| Card surface | `#FFFFFF`, `1px solid #E2E8F0`, micro-shadow `0 4px 6px -1px rgba(0,0,0,.05)` |
| Primary (Sapphire) | `#2563EB` / `#1D4ED8` |
| Growth (Mint) | `#10B981` / `#059669` |
| Alert (Coral) | `#EF4444` / `#DC2626` |
| Text | heading `#0F172A`, body `#334155` |
| Pastel pills | mint `#D1FAE5` · indigo `#E0E7FF` · amber `#FEF3C7` · rose `#FEE2E2` |
| Font | **Plus Jakarta Sans** (all levels) |
| Radius | cards `rounded-lg` · controls `rounded-md` · pills `rounded-full` (see §2 discrepancy note) |

**Status pills:** LUNAS → `#059669` on `#D1FAE5` · JATUH TEMPO → `#DC2626` on `#FEE2E2` ·
PENDING → `#D97706` on `#FEF3C7`.

---

## 9. Indonesian Localization Rules (per GIGA §6)

- **IDR formatting:** `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })`
  → `Rp 150.000` (thousands `.`, decimal `,`).
- **PPN 11%:** default tax toggle on invoices & bills; capture NPWP / NIK.
- **PPh Final 0.5% (PP 55/2022):** auto gross-revenue calc for UKMs with turnover
  < Rp 4,8 Miliar / tahun.
- **Payment gateways:** QRIS (GoPay, OVO, ShopeePay, DANA) + Virtual Accounts (BCA, Mandiri,
  BRI, BNI) — integration-ready via Midtrans / Xendit / Tripay.
- **WhatsApp sharing:** `https://wa.me/628xxx?text=...` for invoice links & reminders.

---

## 10. Working Agreement — before every screen/component

1. **Re-read the §2 hierarchy.**
2. Locate the matching `references/<screen>/` (visual contract).
3. Use **`DESIGN.md` tokens verbatim** — no ad-hoc hex/spacing.
4. Keep **all copy in Bahasa Indonesia**, routed through the i18n layer.
5. Enforce **`company_id` scoping / RLS** on every data path.
6. Keep output **Capacitor-export-safe**.
