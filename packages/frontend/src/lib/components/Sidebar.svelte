<script lang="ts">
  import { 
    Users, 
    PieChart, 
    ShieldCheck, 
    Home, 
    X, 
    Database, 
    FileSpreadsheet,
    HelpCircle
  } from 'lucide-svelte';

  interface Props {
    currentTab: string;
    isOpenMobile: boolean;
    onSelectTab: (tab: string) => void;
    onCloseMobile: () => void;
  }

  let { currentTab, isOpenMobile, onSelectTab, onCloseMobile }: Props = $props();

  const navItems = [
    { id: 'all', label: 'Semua Warga', icon: Users, badge: null },
    { id: 'kk', label: 'Kepala Keluarga', icon: Home, badge: 'KK' },
    { id: 'bansos', label: 'Penerima Bantuan', icon: ShieldCheck, badge: 'Sosial' },
    { id: 'stats', label: 'Ringkasan & Demografi', icon: PieChart, badge: null }
  ];
</script>

<!-- Mobile backdrop -->
{#if isOpenMobile}
  <button 
    type="button" 
    class="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity lg:hidden"
    aria-label="Tutup menu navigasi"
    onclick={onCloseMobile}
  ></button>
{/if}

<!-- Sidebar element -->
<aside 
  class="fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white shadow-xs transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900 {isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}"
>
  <!-- Header brand -->
  <div class="flex h-[4.75rem] items-center justify-between border-b border-slate-100 px-6 dark:border-slate-800/80">
    <div class="flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-xs">
        <Users class="h-5 w-5" />
      </div>
      <div>
        <h1 class="text-sm font-bold tracking-tight text-slate-900 dark:text-white">SI-WARGA</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400">RW 03 / Kel. Sukamaju</p>
      </div>
    </div>
    
    <button 
      type="button"
      class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
      onclick={onCloseMobile}
      aria-label="Tutup navigasi"
    >
      <X class="h-5 w-5" />
    </button>
  </div>

  <!-- Navigation menu -->
  <div class="flex-1 overflow-y-auto px-4 py-5 space-y-6">
    <div>
      <div class="px-3 mb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
        Menu Utama
      </div>
      <nav class="space-y-1">
        {#each navItems as item}
          {@const Icon = item.icon}
          {@const active = currentTab === item.id}
          <button
            type="button"
            class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors {active ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'} focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none min-h-[44px]"
            onclick={() => {
              onSelectTab(item.id);
              if (isOpenMobile) onCloseMobile();
            }}
          >
            <div class="flex items-center gap-3">
              <Icon class="h-4 w-4 shrink-0 {active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}" />
              <span>{item.label}</span>
            </div>
            {#if item.badge}
              <span class="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {item.badge}
              </span>
            {/if}
          </button>
        {/each}
      </nav>
    </div>

    <!-- Info Wilayah Administrasi -->
    <div class="rounded-xl border border-slate-200/80 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
      <div class="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-300">
        <Database class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <span class="text-xs font-semibold">Status Pangkalan Data</span>
      </div>
      <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        Penyimpanan lokal SQLite aktif via Bun runtime. Type-safe via Eden Treaty.
      </p>
      <div class="mt-3 flex items-center gap-2">
        <span class="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        <span class="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">Sinkronisasi Siap</span>
      </div>
    </div>
  </div>

  <!-- Footer profil pengurus -->
  <div class="border-t border-slate-100 p-4 dark:border-slate-800">
    <div class="flex items-center gap-3">
      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-semibold text-xs dark:bg-slate-700 dark:text-slate-200">
        PW
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-slate-900 truncate dark:text-slate-100">Pengurus RT/RW</p>
        <p class="text-[11px] text-slate-500 truncate dark:text-slate-400">Sekretariat RW 03</p>
      </div>
    </div>
  </div>
</aside>
