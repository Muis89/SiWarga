# Technical Design Document: Dashboard Pengelolaan Data Warga

Dokumen spesifikasi arsitektur dan teknis untuk implementasi dashboard administrasi data warga berbasis **Bun**, **ElysiaJS**, **Drizzle ORM**, **`bun:sqlite`**, dan **SvelteKit** dengan komunikasi end-to-end type-safe via **Eden Treaty**.

---

## 1. Project Overview & Architecture Pattern

Sistem dibangun menggunakan arsitektur monorepo native Bun Workspaces. Backend bertindak sebagai single source of truth untuk type definitions yang dikonsumsi langsung oleh client frontend tanpa build code-gen tambahan.

### Directory Tree Structure
```text
project-root/
├── package.json
├── bun.lockb
├── packages/
│   ├── backend/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── drizzle.config.ts
│   │   ├── sqlite.db
│   │   └── src/
│   │       ├── index.ts
│   │       ├── db/
│   │       │   ├── index.ts
│   │       │   └── schema.ts
│   │       └── routes/
│   │           └── citizens.ts
│   └── frontend/
│       ├── package.json
│       ├── tsconfig.json
│       ├── svelte.config.js
│       ├── vite.config.ts
│       └── src/
│           ├── app.html
│           ├── lib/
│           │   ├── api.ts
│           │   └── components/
│           │       ├── Sidebar.svelte
│           │       ├── Header.svelte
│           │       ├── StatCard.svelte
│           │       ├── CitizenTable.svelte
│           │       └── CitizenModal.svelte
│           └── routes/
│               ├── +layout.svelte
│               └── +page.svelte