<script lang="ts">
  import type { Citizen, Pagination } from '$lib/api';
  import { 
    Search, 
    Filter, 
    X, 
    Eye, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    ChevronRight, 
    AlertCircle, 
    Plus,
    UserCheck,
    RotateCcw
  } from 'lucide-svelte';

  interface Props {
    citizens: Citizen[];
    pagination: Pagination;
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
    selectedRt: string;
    selectedGender: string;
    selectedFamilyRole: string;
    selectedAidStatus: string;
    onSearchChange: (query: string) => void;
    onRtChange: (rt: string) => void;
    onGenderChange: (gender: string) => void;
    onFamilyRoleChange: (role: string) => void;
    onAidStatusChange: (status: string) => void;
    onResetFilters: () => void;
    onPageChange: (page: number) => void;
    onViewDetail: (citizen: Citizen) => void;
    onEdit: (citizen: Citizen) => void;
    onDelete: (citizen: Citizen) => void;
    onOpenAddModal: () => void;
    onRetry: () => void;
  }

  let {
    citizens,
    pagination,
    isLoading,
    error,
    searchQuery,
    selectedRt,
    selectedGender,
    selectedFamilyRole,
    selectedAidStatus,
    onSearchChange,
    onRtChange,
    onGenderChange,
    onFamilyRoleChange,
    onAidStatusChange,
    onResetFilters,
    onPageChange,
    onViewDetail,
    onEdit,
    onDelete,
    onOpenAddModal,
    onRetry
  }: Props = $props();

  // Hitung usia dari tanggal lahir YYYY-MM-DD
  function calculateAge(dobString: string): number {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return 0;
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const hasActiveFilters = $derived(
    Boolean(searchQuery || selectedRt || selectedGender || selectedFamilyRole || selectedAidStatus)
  );
</script>

<div class="rounded-xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
  <!-- Bar filter & pencarian -->
  <div class="border-b border-slate-100 p-4 sm:p-5 dark:border-slate-800 space-y-4">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <!-- Search input -->
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          oninput={(e) => onSearchChange((e.target as HTMLInputElement).value)}
          placeholder="Cari nama, NIK, No KK, atau profesi..."
          class="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-9 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-emerald-500 dark:focus:bg-slate-900"
        />
        {#if searchQuery}
          <button
            type="button"
            onclick={() => onSearchChange('')}
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Bersihkan pencarian"
          >
            <X class="h-4 w-4" />
          </button>
        {/if}
      </div>

      <!-- Quick filters wrapper -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- RT Filter -->
        <select
          value={selectedRt}
          onchange={(e) => onRtChange((e.target as HTMLSelectElement).value)}
          class="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          aria-label="Filter berdasarkan RT"
        >
          <option value="">Semua RT</option>
          <option value="001">RT 001</option>
          <option value="002">RT 002</option>
          <option value="003">RT 003</option>
          <option value="004">RT 004</option>
          <option value="005">RT 005</option>
        </select>

        <!-- Jenis Kelamin Filter -->
        <select
          value={selectedGender}
          onchange={(e) => onGenderChange((e.target as HTMLSelectElement).value)}
          class="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          aria-label="Filter jenis kelamin"
        >
          <option value="">Semua Gender</option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>

        <!-- Status Keluarga Filter -->
        <select
          value={selectedFamilyRole}
          onchange={(e) => onFamilyRoleChange((e.target as HTMLSelectElement).value)}
          class="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none hidden sm:block"
          aria-label="Filter status hubungan keluarga"
        >
          <option value="">Semua Peran</option>
          <option value="Kepala Keluarga">Kepala Keluarga</option>
          <option value="Istri">Istri</option>
          <option value="Anak">Anak</option>
          <option value="Famili Lain">Famili Lain</option>
        </select>

        <!-- Status Bansos Filter -->
        <select
          value={selectedAidStatus}
          onchange={(e) => onAidStatusChange((e.target as HTMLSelectElement).value)}
          class="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          aria-label="Filter status bantuan sosial"
        >
          <option value="">Semua Status Bantuan</option>
          <option value="Penerima Bantuan">Penerima Bansos</option>
          <option value="Bukan Penerima">Bukan Penerima</option>
        </select>

        <!-- Reset Button -->
        {#if hasActiveFilters}
          <button
            type="button"
            onclick={onResetFilters}
            class="flex h-10 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
            title="Reset semua filter"
          >
            <RotateCcw class="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        {/if}
      </div>
    </div>
  </div>

  <!-- Konten Utama: Loading / Error / Empty / Tabel -->
  <div class="relative min-h-[300px] overflow-x-auto">
    {#if isLoading}
      <!-- State 1: Memuat Data -->
      <div class="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div class="h-9 w-9 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent"></div>
        <p class="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Memuat data kependudukan...
        </p>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Mengambil catatan kependudukan dari pangkalan data SQLite.
        </p>
      </div>

    {:else if error}
      <!-- State 2: Terjadi Kesalahan -->
      <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/70 dark:text-rose-400">
          <AlertCircle class="h-6 w-6" />
        </div>
        <h3 class="mt-3 text-base font-bold text-slate-900 dark:text-white">
          Gagal Memuat Data Warga
        </h3>
        <p class="mt-1 max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {error}
        </p>
        <button
          type="button"
          onclick={onRetry}
          class="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none min-h-[40px]"
        >
          <RotateCcw class="h-3.5 w-3.5" />
          <span>Coba Muat Ulang</span>
        </button>
      </div>

    {:else if citizens.length === 0}
      <!-- State 3: Data Kosong -->
      <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          <Search class="h-6 w-6" />
        </div>
        <h3 class="mt-3 text-base font-bold text-slate-900 dark:text-white">
          {hasActiveFilters ? "Tidak Ada Data yang Cocok" : "Belum Ada Data Warga Terdaftar"}
        </h3>
        <p class="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {hasActiveFilters 
            ? "Silakan sesuaikan kata kunci pencarian atau bersihkan filter untuk menampilkan data lainnya."
            : "Pangkalan data warga masih kosong. Anda dapat menambahkan warga baru secara manual."}
        </p>
        <div class="mt-4 flex flex-wrap gap-2 justify-center">
          {#if hasActiveFilters}
            <button
              type="button"
              onclick={onResetFilters}
              class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 min-h-[40px]"
            >
              <span>Bersihkan Filter</span>
            </button>
          {:else}
            <button
              type="button"
              onclick={onOpenAddModal}
              class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 min-h-[40px]"
            >
              <Plus class="h-4 w-4" />
              <span>Tambah Warga Baru</span>
            </button>
          {/if}
        </div>
      </div>

    {:else}
      <!-- Tabel Data -->
      <table class="w-full text-left text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <thead class="bg-slate-50/80 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200/80 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-800">
          <tr>
            <th scope="col" class="py-3.5 px-4 sm:px-6">Nama & NIK</th>
            <th scope="col" class="py-3.5 px-4">Gender & Usia</th>
            <th scope="col" class="py-3.5 px-4 hidden md:table-cell">Hubungan Keluarga</th>
            <th scope="col" class="py-3.5 px-4 hidden lg:table-cell">Wilayah / Alamat</th>
            <th scope="col" class="py-3.5 px-4 hidden sm:table-cell">Pekerjaan</th>
            <th scope="col" class="py-3.5 px-4">Bansos</th>
            <th scope="col" class="py-3.5 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
          {#each citizens as citizen (citizen.id)}
            {@const age = calculateAge(citizen.tanggalLahir)}
            <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
              <!-- Kolom 1: Nama & NIK -->
              <td class="py-3 px-4 sm:px-6">
                <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{citizen.namaLengkap}</span>
                  {#if citizen.statusKeluarga === 'Kepala Keluarga'}
                    <span class="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      KK
                    </span>
                  {/if}
                </div>
                <div class="text-[11px] text-slate-400 font-mono tracking-tight mt-0.5">
                  NIK: {citizen.nik}
                </div>
              </td>

              <!-- Kolom 2: Gender & Usia -->
              <td class="py-3 px-4">
                <div class="font-medium text-slate-800 dark:text-slate-200">
                  {citizen.jenisKelamin}
                </div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400">
                  {age > 0 ? `${age} tahun` : citizen.tanggalLahir}
                </div>
              </td>

              <!-- Kolom 3: Hubungan Keluarga & No KK -->
              <td class="py-3 px-4 hidden md:table-cell">
                <span class="font-medium text-slate-800 dark:text-slate-200">
                  {citizen.statusKeluarga}
                </span>
                <div class="text-[11px] text-slate-400 font-mono tracking-tight mt-0.5">
                  KK: {citizen.noKk}
                </div>
              </td>

              <!-- Kolom 4: Alamat & RT/RW -->
              <td class="py-3 px-4 hidden lg:table-cell">
                <div class="truncate max-w-xs text-slate-800 dark:text-slate-200">
                  {citizen.alamat}
                </div>
                <div class="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  RT {citizen.rt} / RW {citizen.rw}
                </div>
              </td>

              <!-- Kolom 5: Pekerjaan -->
              <td class="py-3 px-4 hidden sm:table-cell">
                <span class="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {citizen.pekerjaan}
                </span>
              </td>

              <!-- Kolom 6: Bansos -->
              <td class="py-3 px-4">
                {#if citizen.statusBantuan === 'Penerima Bantuan'}
                  <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span>Penerima</span>
                  </span>
                {:else}
                  <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    <span>Non-Bansos</span>
                  </span>
                {/if}
              </td>

              <!-- Kolom 7: Tombol Aksi -->
              <td class="py-3 px-4 text-right">
                <div class="inline-flex items-center gap-1">
                  <!-- Detail -->
                  <button
                    type="button"
                    class="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                    onclick={() => onViewDetail(citizen)}
                    title="Lihat rincian data lengkap"
                    aria-label={`Rincian data ${citizen.namaLengkap}`}
                  >
                    <Eye class="h-4 w-4" />
                  </button>

                  <!-- Edit -->
                  <button
                    type="button"
                    class="flex h-8 w-8 items-center justify-center rounded-md text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/50 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                    onclick={() => onEdit(citizen)}
                    title="Ubah data warga"
                    aria-label={`Ubah data ${citizen.namaLengkap}`}
                  >
                    <Edit class="h-4 w-4" />
                  </button>

                  <!-- Hapus -->
                  <button
                    type="button"
                    class="flex h-8 w-8 items-center justify-center rounded-md text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
                    onclick={() => onDelete(citizen)}
                    title="Hapus data warga"
                    aria-label={`Hapus data ${citizen.namaLengkap}`}
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>

  <!-- Footer Pagination -->
  {#if !isLoading && !error && citizens.length > 0}
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 p-4 dark:border-slate-800">
      <div class="text-xs text-slate-500 dark:text-slate-400">
        Menampilkan <span class="font-semibold text-slate-800 dark:text-slate-200">{((pagination.page - 1) * pagination.limit) + 1}</span>
        sampai <span class="font-semibold text-slate-800 dark:text-slate-200">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>
        dari <span class="font-semibold text-slate-800 dark:text-slate-200">{pagination.total}</span> data warga
      </div>

      <div class="flex items-center gap-1.5">
        <button
          type="button"
          disabled={pagination.page <= 1}
          onclick={() => onPageChange(pagination.page - 1)}
          class="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none min-h-[36px]"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft class="h-4 w-4" />
          <span>Sebelumnya</span>
        </button>

        <span class="px-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
          Hal. {pagination.page} / {pagination.totalPages}
        </span>

        <button
          type="button"
          disabled={pagination.page >= pagination.totalPages}
          onclick={() => onPageChange(pagination.page + 1)}
          class="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none min-h-[36px]"
          aria-label="Halaman berikutnya"
        >
          <span>Berikutnya</span>
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>
    </div>
  {/if}
</div>
