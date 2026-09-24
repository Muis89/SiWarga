<script lang="ts">
  import { Menu, Plus, Download, Sun, Moon, RefreshCw } from 'lucide-svelte';

  interface Props {
    title: string;
    description: string;
    isDark: boolean;
    isRefreshing: boolean;
    onToggleMobileMenu: () => void;
    onToggleTheme: () => void;
    onOpenAddModal: () => void;
    onExportCsv: () => void;
    onRefresh: () => void;
  }

  let {
    title,
    description,
    isDark,
    isRefreshing,
    onToggleMobileMenu,
    onToggleTheme,
    onOpenAddModal,
    onExportCsv,
    onRefresh
  }: Props = $props();
</script>

<header class="sticky top-0 z-30 flex min-h-[4.75rem] w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 pt-3 pb-3 sm:pt-3.5 sm:pb-3.5 backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/95 shadow-xs transition-all">
  <!-- Left section: mobile hamburger & breadcrumb title -->
  <div class="flex items-center gap-3">
    <button
      type="button"
      class="flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
      onclick={onToggleMobileMenu}
      aria-label="Buka menu navigasi"
    >
      <Menu class="h-5 w-5" />
    </button>

    <div>
      <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
        {title}
      </h2>
      <p class="text-xs text-slate-500 dark:text-slate-400 hidden sm:block mt-0.5">
        {description}
      </p>
    </div>
  </div>

  <!-- Right section: action buttons -->
  <div class="flex items-center gap-2 sm:gap-2.5">
    <!-- Refresh button -->
    <button
      type="button"
      class="flex h-10 w-10 sm:w-auto sm:px-3 items-center justify-center gap-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-colors"
      onclick={onRefresh}
      title="Muat ulang data dari server"
      aria-label="Muat ulang data"
    >
      <RefreshCw class="h-4 w-4 {isRefreshing ? 'animate-spin text-emerald-600 dark:text-emerald-400' : ''}" />
      <span class="hidden md:inline">Segarkan</span>
    </button>

    <!-- Theme Mode Switch (White Mode / Dark Mode) -->
    <button
      type="button"
      class="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/90 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-colors cursor-pointer"
      onclick={onToggleTheme}
      aria-label={isDark ? "Beralih ke White Mode (Mode Terang)" : "Beralih ke Dark Mode (Mode Gelap)"}
      title={isDark ? "Beralih ke White Mode (Terang)" : "Beralih ke Dark Mode (Gelap)"}
    >
      {#if isDark}
        <Sun class="h-4 w-4 text-amber-400 shrink-0" />
        <span class="hidden sm:inline font-medium">Mode Terang</span>
      {:else}
        <Moon class="h-4 w-4 text-slate-600 shrink-0" />
        <span class="hidden sm:inline font-medium">Mode Gelap</span>
      {/if}
    </button>

    <!-- Export CSV -->
    <button
      type="button"
      class="flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none min-h-[40px] transition-colors"
      onclick={onExportCsv}
      title="Unduh seluruh data tabel ke file CSV"
    >
      <Download class="h-4 w-4 text-slate-500 dark:text-slate-400" />
      <span class="hidden sm:inline">Ekspor CSV</span>
    </button>

    <!-- Primary CTA: Tambah Warga -->
    <button
      type="button"
      class="flex h-10 items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:bg-emerald-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none min-h-[40px]"
      onclick={onOpenAddModal}
    >
      <Plus class="h-4 w-4" />
      <span>Tambah Warga</span>
    </button>
  </div>
</header>
