<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    api, 
    type Citizen, 
    type CitizenStats, 
    type Pagination 
  } from '$lib/api';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Header from '$lib/components/Header.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import CitizenTable from '$lib/components/CitizenTable.svelte';
  import CitizenModal from '$lib/components/CitizenModal.svelte';
  import { 
    Users, 
    Home, 
    ShieldCheck, 
    UserCheck, 
    Sparkles, 
    PieChart, 
    CheckCircle2, 
    AlertCircle,
    Info,
    Calendar,
    Baby,
    GraduationCap,
    HeartPulse
  } from 'lucide-svelte';

  // Application State
  let citizens = $state<Citizen[]>([]);
  let stats = $state<CitizenStats>({
    totalWarga: 0,
    totalKeluarga: 0,
    gender: { pria: 0, wanita: 0 },
    kelompokUsia: { balita: 0, anak: 0, produktif: 0, lansia: 0 },
    bantuan: { penerima: 0, bukanPenerima: 0 },
    distribusiRt: []
  });
  let pagination = $state<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });

  let isLoading = $state(true);
  let isRefreshing = $state(false);
  let error = $state<string | null>(null);

  // Filters State
  let currentTab = $state('all');
  let searchQuery = $state('');
  let selectedRt = $state('');
  let selectedGender = $state('');
  let selectedFamilyRole = $state('');
  let selectedAidStatus = $state('');

  // UI & Modal State
  let isMobileSidebarOpen = $state(false);
  let isDark = $state(false);
  let isModalOpen = $state(false);
  let modalMode = $state<'create' | 'edit' | 'detail' | 'delete'>('create');
  let activeCitizen = $state<Partial<Citizen> | null>(null);
  let isSubmitting = $state(false);
  let modalErrorMessage = $state<string | null>(null);

  // Toast Notification State
  let toastMessage = $state<string | null>(null);
  let toastType = $state<'success' | 'info' | 'error'>('success');
  let toastTimer: any = null;

  function showToast(message: string, type: 'success' | 'info' | 'error' = 'success') {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessage = message;
    toastType = type;
    toastTimer = setTimeout(() => {
      toastMessage = null;
    }, 4000);
  }

  // Helper untuk mengekstrak pesan error ramah dari Eden Treaty / Server
  function extractErrorMessage(err: any, fallback: string): string {
    if (!err) return fallback;
    const val = err.value !== undefined ? err.value : err;
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val !== null) {
      if (typeof val.message === 'string') return val.message;
      if (typeof val.summary === 'string') return val.summary;
      if (typeof val.error === 'string') return val.error;
      try {
        return JSON.stringify(val);
      } catch {
        return fallback;
      }
    }
    return String(val) || fallback;
  }

  // Fetch Citizens List
  async function fetchCitizens(page = pagination.page) {
    try {
      const queryParams: Record<string, string> = {
        page: String(page),
        limit: String(pagination.limit)
      };

      if (searchQuery.trim()) queryParams.search = searchQuery.trim();
      if (selectedRt) queryParams.rt = selectedRt;
      if (selectedGender) queryParams.gender = selectedGender;
      if (selectedFamilyRole) queryParams.statusKeluarga = selectedFamilyRole;
      if (selectedAidStatus) queryParams.statusBantuan = selectedAidStatus;

      const res = await api.api.citizens.get({
        query: queryParams
      });

      if (res.data && res.data.success) {
        citizens = (res.data.data as Citizen[]) || [];
        pagination = res.data.pagination;
        error = null;
      } else {
        const errMsg = extractErrorMessage(res.error, '');
        error = errMsg 
          ? `Gangguan server: ${errMsg}` 
          : 'Tidak dapat terhubung ke server backend di http://localhost:3001. Pastikan server backend sedang berjalan (jalankan: bun run dev atau bun run dev:backend).';
      }
    } catch (err: any) {
      console.error('Error fetching citizens:', err);
      error = 'Tidak dapat terhubung ke server backend di http://localhost:3001. Pastikan server backend aktif.';
    }
  }

  // Fetch Real Stats from SQLite
  async function fetchStats() {
    try {
      const res = await api.api.citizens.stats.get();
      if (res.data && res.data.success) {
        stats = res.data.stats;
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }

  // Load all initial data
  async function loadData(page = 1) {
    isLoading = true;
    error = null;
    await Promise.all([fetchCitizens(page), fetchStats()]);
    isLoading = false;
  }

  // Refresh data trigger
  async function handleRefresh() {
    isRefreshing = true;
    await Promise.all([fetchCitizens(pagination.page), fetchStats()]);
    isRefreshing = false;
    showToast('Data berhasil disegarkan langsung dari server.', 'info');
  }

  // Debounced search
  let searchTimeout: any = null;
  function handleSearchChange(query: string) {
    searchQuery = query;
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      pagination.page = 1;
      fetchCitizens(1);
    }, 300);
  }

  function handleRtChange(rt: string) {
    selectedRt = rt;
    pagination.page = 1;
    fetchCitizens(1);
  }

  function handleGenderChange(gender: string) {
    selectedGender = gender;
    pagination.page = 1;
    fetchCitizens(1);
  }

  function handleFamilyRoleChange(role: string) {
    selectedFamilyRole = role;
    pagination.page = 1;
    fetchCitizens(1);
  }

  function handleAidStatusChange(status: string) {
    selectedAidStatus = status;
    pagination.page = 1;
    fetchCitizens(1);
  }

  function handleResetFilters() {
    searchQuery = '';
    selectedRt = '';
    selectedGender = '';
    selectedFamilyRole = '';
    selectedAidStatus = '';
    currentTab = 'all';
    pagination.page = 1;
    fetchCitizens(1);
    showToast('Filter pencarian telah dikosongkan.', 'info');
  }

  function handlePageChange(newPage: number) {
    pagination.page = newPage;
    fetchCitizens(newPage);
  }

  // Handle Tab Selection
  function handleSelectTab(tabId: string) {
    currentTab = tabId;
    if (tabId === 'all') {
      selectedFamilyRole = '';
      selectedAidStatus = '';
    } else if (tabId === 'kk') {
      selectedFamilyRole = 'Kepala Keluarga';
      selectedAidStatus = '';
    } else if (tabId === 'bansos') {
      selectedFamilyRole = '';
      selectedAidStatus = 'Penerima Bantuan';
    } else if (tabId === 'stats') {
      // Jump view or scroll
      const statsSection = document.getElementById('demografi-section');
      if (statsSection) {
        statsSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    pagination.page = 1;
    fetchCitizens(1);
  }

  // Seed sample data if empty
  async function handleSeedData() {
    try {
      isLoading = true;
      const res = await api.api.citizens.seed.post();
      if (res.data && res.data.success) {
        showToast(res.data.message, 'success');
        await loadData(1);
      }
    } catch (err: any) {
      showToast('Gagal memuat data contoh: ' + err.message, 'error');
    } finally {
      isLoading = false;
    }
  }

  // Modal Handlers
  function openAddModal() {
    activeCitizen = null;
    modalMode = 'create';
    modalErrorMessage = null;
    isModalOpen = true;
  }

  function openEditModal(c: Citizen) {
    activeCitizen = { ...c };
    modalMode = 'edit';
    modalErrorMessage = null;
    isModalOpen = true;
  }

  function openDetailModal(c: Citizen) {
    activeCitizen = { ...c };
    modalMode = 'detail';
    modalErrorMessage = null;
    isModalOpen = true;
  }

  function openDeleteModal(c: Citizen) {
    activeCitizen = { ...c };
    modalMode = 'delete';
    modalErrorMessage = null;
    isModalOpen = true;
  }

  function closeModal() {
    if (isSubmitting) return;
    isModalOpen = false;
    activeCitizen = null;
    modalErrorMessage = null;
  }

  // Submit Add or Edit Citizen
  async function handleModalSubmit(formData: any) {
    isSubmitting = true;
    modalErrorMessage = null;

    try {
      if (modalMode === 'create') {
        const res = await api.api.citizens.post(formData);
        if (res.error) {
          modalErrorMessage = extractErrorMessage(res.error, 'Gagal menyimpan data warga baru.');
          isSubmitting = false;
          return;
        }
        showToast(`Warga baru an. ${formData.namaLengkap} berhasil didaftarkan.`, 'success');
      } else if (modalMode === 'edit' && activeCitizen?.id) {
        const res = await api.api.citizens({ id: String(activeCitizen.id) }).put(formData);
        if (res.error) {
          modalErrorMessage = extractErrorMessage(res.error, 'Gagal memperbarui data warga.');
          isSubmitting = false;
          return;
        }
        showToast(`Data warga an. ${formData.namaLengkap} berhasil diperbarui.`, 'success');
      }

      isModalOpen = false;
      await Promise.all([fetchCitizens(pagination.page), fetchStats()]);
    } catch (err: any) {
      modalErrorMessage = err.message || 'Terjadi gangguan saat memproses data';
    } finally {
      isSubmitting = false;
    }
  }

  // Delete Citizen
  async function handleConfirmDelete(id: number) {
    isSubmitting = true;
    try {
      const res = await api.api.citizens({ id: String(id) }).delete();
      if (res.error) {
        modalErrorMessage = extractErrorMessage(res.error, 'Gagal menghapus data warga.');
        isSubmitting = false;
        return;
      }
      showToast('Catatan data kependudukan berhasil dihapus dari sistem.', 'success');
      isModalOpen = false;
      await Promise.all([fetchCitizens(pagination.page), fetchStats()]);
    } catch (err: any) {
      modalErrorMessage = err.message || 'Terjadi gangguan saat menghapus data';
    } finally {
      isSubmitting = false;
    }
  }

  // Export CSV
  function handleExportCsv() {
    if (citizens.length === 0) {
      showToast('Tidak ada data warga untuk diekspor.', 'info');
      return;
    }

    const headers = [
      'NIK',
      'No KK',
      'Nama Lengkap',
      'Jenis Kelamin',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Agama',
      'Pendidikan',
      'Pekerjaan',
      'Status Keluarga',
      'Alamat',
      'RT',
      'RW',
      'Status Bantuan Sosial',
      'Telepon'
    ];

    const rows = citizens.map((c) => [
      `"${c.nik}"`,
      `"${c.noKk}"`,
      `"${c.namaLengkap.replace(/"/g, '""')}"`,
      `"${c.jenisKelamin}"`,
      `"${c.tempatLahir.replace(/"/g, '""')}"`,
      `"${c.tanggalLahir}"`,
      `"${c.agama}"`,
      `"${c.pendidikan}"`,
      `"${c.pekerjaan.replace(/"/g, '""')}"`,
      `"${c.statusKeluarga}"`,
      `"${c.alamat.replace(/"/g, '""')}"`,
      `"${c.rt}"`,
      `"${c.rw}"`,
      `"${c.statusBantuan}"`,
      `"${c.nomorTelepon || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `data_warga_rw03_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Berhasil mengekspor ${citizens.length} data warga ke format CSV.`, 'success');
  }

  // Theme Toggle
  function handleToggleTheme() {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      showToast('Beralih ke Mode Gelap.', 'info');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      showToast('Beralih ke White Mode (Mode Terang).', 'info');
    }
  }

  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    isDark = savedTheme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    loadData(1);
  });
</script>

<div class="flex h-screen overflow-hidden">
  <!-- Sidebar -->
  <Sidebar
    {currentTab}
    isOpenMobile={isMobileSidebarOpen}
    onSelectTab={handleSelectTab}
    onCloseMobile={() => (isMobileSidebarOpen = false)}
  />

  <!-- Main Area -->
  <div class="flex flex-1 flex-col overflow-y-auto min-w-0 bg-slate-50 dark:bg-slate-950">
    <!-- Header -->
    <Header
      title="Administrasi Data Kependudukan"
      description="Pangkalan data warga terverifikasi RT 01 s/d RT 05, RW 03"
      {isDark}
      {isRefreshing}
      onToggleMobileMenu={() => (isMobileSidebarOpen = true)}
      onToggleTheme={handleToggleTheme}
      onOpenAddModal={openAddModal}
      onExportCsv={handleExportCsv}
      onRefresh={handleRefresh}
    />

    <!-- Main Content Container -->
    <main class="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
      <!-- Toast Alert Pop-up -->
      {#if toastMessage}
        <div 
          class="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-800 dark:bg-slate-900 transition-all duration-200"
          role="status"
          aria-live="polite"
        >
          {#if toastType === 'success'}
            <CheckCircle2 class="h-5 w-5 text-emerald-500 shrink-0" />
          {:else if toastType === 'error'}
            <AlertCircle class="h-5 w-5 text-rose-500 shrink-0" />
          {:else}
            <Info class="h-5 w-5 text-sky-500 shrink-0" />
          {/if}
          <p class="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">{toastMessage}</p>
        </div>
      {/if}

      <!-- Banner Seed jika data 0 -->
      {#if !isLoading && stats.totalWarga === 0}
        <div class="rounded-xl border border-amber-200 bg-amber-50/80 p-5 dark:border-amber-900/60 dark:bg-amber-950/30">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-start gap-3">
              <div class="rounded-lg bg-amber-100 p-2 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                <Sparkles class="h-5 w-5" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-amber-900 dark:text-amber-200">
                  Pangkalan Data SQLite Masih Kosong
                </h3>
                <p class="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5">
                  Anda dapat mengisi data contoh kependudukan Indonesia realistis secara instan untuk menguji fitur.
                </p>
              </div>
            </div>
            <button
              type="button"
              onclick={handleSeedData}
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none min-h-[40px] shrink-0"
            >
              <Sparkles class="h-4 w-4" />
              <span>Muat Data Contoh Warga</span>
            </button>
          </div>
        </div>
      {/if}

      <!-- Stat Cards Grid -->
      <section aria-labelledby="ringkasan-statistik">
        <h2 id="ringkasan-statistik" class="sr-only">Statistik Kependudukan</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Warga"
            value={stats.totalWarga}
            description="Jiwa terdaftar dalam pangkalan data"
            icon={Users}
            colorVariant="emerald"
          />

          <StatCard
            title="Kepala Keluarga"
            value={stats.totalKeluarga}
            description="Nomor Kartu Keluarga (KK) terdaftar"
            icon={Home}
            colorVariant="blue"
          />

          <StatCard
            title="Perbandingan Gender"
            value={`${stats.gender.pria}L / ${stats.gender.wanita}P`}
            description={`${stats.totalWarga > 0 ? Math.round((stats.gender.pria / stats.totalWarga) * 100) : 0}% Pria, ${stats.totalWarga > 0 ? Math.round((stats.gender.wanita / stats.totalWarga) * 100) : 0}% Perempuan`}
            icon={UserCheck}
            colorVariant="indigo"
          />

          <StatCard
            title="Penerima Bansos"
            value={stats.bantuan.penerima}
            description={`${stats.totalWarga > 0 ? Math.round((stats.bantuan.penerima / stats.totalWarga) * 100) : 0}% dari seluruh warga terdaftar`}
            icon={ShieldCheck}
            colorVariant="amber"
          />
        </div>
      </section>

      <!-- Section Tabel Data Warga -->
      <section aria-labelledby="daftar-warga-heading">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h2 id="daftar-warga-heading" class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {#if currentTab === 'kk'}
                Daftar Kepala Keluarga
              {:else if currentTab === 'bansos'}
                Daftar Penerima Bantuan Sosial
              {:else}
                Buku Induk Kependudukan Warga
              {/if}
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Daftar identitas warga yang dapat disaring, diperbarui, dan diekspor.
            </p>
          </div>
        </div>

        <CitizenTable
          {citizens}
          {pagination}
          {isLoading}
          {error}
          {searchQuery}
          {selectedRt}
          {selectedGender}
          {selectedFamilyRole}
          {selectedAidStatus}
          onSearchChange={handleSearchChange}
          onRtChange={handleRtChange}
          onGenderChange={handleGenderChange}
          onFamilyRoleChange={handleFamilyRoleChange}
          onAidStatusChange={handleAidStatusChange}
          onResetFilters={handleResetFilters}
          onPageChange={handlePageChange}
          onViewDetail={openDetailModal}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onOpenAddModal={openAddModal}
          onRetry={() => loadData(pagination.page)}
        />
      </section>

      <!-- Section Demografi & Distribusi Wilayah -->
      <section id="demografi-section" class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        <!-- Komposisi Kelompok Usia -->
        <div class="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">Komposisi Kelompok Usia</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Distribusi umur terhitung dari tanggal lahir</p>
            </div>
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <HeartPulse class="h-4 w-4" />
            </div>
          </div>

          <div class="space-y-3.5 text-xs">
            <!-- Balita -->
            <div>
              <div class="flex justify-between font-medium mb-1 text-slate-700 dark:text-slate-300">
                <span class="flex items-center gap-1.5"><Baby class="h-3.5 w-3.5 text-sky-500" /> Balita (0 s/d 4 thn)</span>
                <span class="font-bold">{stats.kelompokUsia.balita} warga</span>
              </div>
              <div class="h-2 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                <div 
                  class="h-full bg-sky-500 rounded-full transition-all duration-300"
                  style="width: {stats.totalWarga > 0 ? (stats.kelompokUsia.balita / stats.totalWarga) * 100 : 0}%"
                ></div>
              </div>
            </div>

            <!-- Anak & Remaja -->
            <div>
              <div class="flex justify-between font-medium mb-1 text-slate-700 dark:text-slate-300">
                <span class="flex items-center gap-1.5"><GraduationCap class="h-3.5 w-3.5 text-emerald-500" /> Anak & Remaja (5 s/d 17 thn)</span>
                <span class="font-bold">{stats.kelompokUsia.anak} warga</span>
              </div>
              <div class="h-2 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                <div 
                  class="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style="width: {stats.totalWarga > 0 ? (stats.kelompokUsia.anak / stats.totalWarga) * 100 : 0}%"
                ></div>
              </div>
            </div>

            <!-- Usia Produktif -->
            <div>
              <div class="flex justify-between font-medium mb-1 text-slate-700 dark:text-slate-300">
                <span class="flex items-center gap-1.5"><Users class="h-3.5 w-3.5 text-indigo-500" /> Usia Produktif (18 s/d 59 thn)</span>
                <span class="font-bold">{stats.kelompokUsia.produktif} warga</span>
              </div>
              <div class="h-2 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                <div 
                  class="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style="width: {stats.totalWarga > 0 ? (stats.kelompokUsia.produktif / stats.totalWarga) * 100 : 0}%"
                ></div>
              </div>
            </div>

            <!-- Lansia -->
            <div>
              <div class="flex justify-between font-medium mb-1 text-slate-700 dark:text-slate-300">
                <span class="flex items-center gap-1.5"><HeartPulse class="h-3.5 w-3.5 text-amber-500" /> Lanjut Usia (60+ thn)</span>
                <span class="font-bold">{stats.kelompokUsia.lansia} warga</span>
              </div>
              <div class="h-2 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                <div 
                  class="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style="width: {stats.totalWarga > 0 ? (stats.kelompokUsia.lansia / stats.totalWarga) * 100 : 0}%"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Distribusi Wilayah RT -->
        <div class="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">Sebaran Warga per RT</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Jumlah warga per rukun tetangga di lingkungan RW 03</p>
            </div>
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
              <PieChart class="h-4 w-4" />
            </div>
          </div>

          {#if stats.distribusiRt.length === 0}
            <div class="py-8 text-center text-xs text-slate-400">
              Belum ada data persebaran RT.
            </div>
          {:else}
            <div class="space-y-3 text-xs">
              {#each stats.distribusiRt as rtItem}
                {@const percent = stats.totalWarga > 0 ? Math.round((rtItem.jumlah / stats.totalWarga) * 100) : 0}
                <div>
                  <div class="flex justify-between font-medium mb-1 text-slate-700 dark:text-slate-300">
                    <span class="font-semibold text-slate-900 dark:text-white">RT {rtItem.rt}</span>
                    <span>{rtItem.jumlah} warga ({percent}%)</span>
                  </div>
                  <div class="h-2 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                    <div 
                      class="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style="width: {percent}%"
                    ></div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </section>
    </main>
  </div>
</div>

<!-- Modal Dialog Component -->
<CitizenModal
  isOpen={isModalOpen}
  mode={modalMode}
  citizen={activeCitizen}
  {isSubmitting}
  errorMessage={modalErrorMessage}
  onClose={closeModal}
  onSubmit={handleModalSubmit}
  onConfirmDelete={handleConfirmDelete}
/>
