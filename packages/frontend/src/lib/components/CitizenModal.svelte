<script lang="ts">
  import type { Citizen } from '$lib/api';
  import { parseIndonesianNik } from '$lib/nikParser';
  import { 
    X, 
    Save, 
    Trash2, 
    AlertCircle, 
    Check, 
    IdCard, 
    User, 
    MapPin, 
    Phone, 
    ShieldAlert, 
    Calendar,
    Briefcase,
    Sparkles,
    Wand2
  } from 'lucide-svelte';

  interface Props {
    isOpen: boolean;
    mode: 'create' | 'edit' | 'detail' | 'delete';
    citizen: Partial<Citizen> | null;
    isSubmitting: boolean;
    errorMessage: string | null;
    onClose: () => void;
    onSubmit: (formData: any) => Promise<void>;
    onConfirmDelete: (id: number) => Promise<void>;
  }

  let {
    isOpen,
    mode,
    citizen,
    isSubmitting,
    errorMessage,
    onClose,
    onSubmit,
    onConfirmDelete
  }: Props = $props();

  // Form state
  let nik = $state('');
  let noKk = $state('');
  let namaLengkap = $state('');
  let jenisKelamin = $state('Laki-laki');
  let tempatLahir = $state('');
  let tanggalLahir = $state('');
  let agama = $state('Islam');
  let pendidikan = $state('SMA/SMK');
  let pekerjaan = $state('');
  let statusPernikahan = $state('Kawin');
  let statusKeluarga = $state('Kepala Keluarga');
  let alamat = $state('');
  let rt = $state('001');
  let rw = $state('003');
  let nomorTelepon = $state('');
  let golonganDarah = $state('O');
  let statusBantuan = $state('Bukan Penerima');

  // Form validation errors
  let validationError = $state<string | null>(null);

  // Otomasi NIK state
  let isAutoFillNikEnabled = $state(true);
  let parsedNikInfo = $derived(parseIndonesianNik(nik));

  // Efek otomasi pengisian Jenis Kelamin dan Tanggal Lahir dari NIK
  $effect(() => {
    if (isAutoFillNikEnabled && parsedNikInfo && parsedNikInfo.isValid) {
      jenisKelamin = parsedNikInfo.gender;
      if (parsedNikInfo.birthDate) {
        tanggalLahir = parsedNikInfo.birthDate;
      }
    }
  });

  // Sync state when modal opens or citizen prop updates
  $effect(() => {
    if (isOpen && citizen) {
      nik = citizen.nik || '';
      noKk = citizen.noKk || '';
      namaLengkap = citizen.namaLengkap || '';
      jenisKelamin = citizen.jenisKelamin || 'Laki-laki';
      tempatLahir = citizen.tempatLahir || '';
      tanggalLahir = citizen.tanggalLahir || '';
      agama = citizen.agama || 'Islam';
      pendidikan = citizen.pendidikan || 'SMA/SMK';
      pekerjaan = citizen.pekerjaan || '';
      statusPernikahan = citizen.statusPernikahan || 'Kawin';
      statusKeluarga = citizen.statusKeluarga || 'Kepala Keluarga';
      alamat = citizen.alamat || '';
      rt = citizen.rt || '001';
      rw = citizen.rw || '003';
      nomorTelepon = citizen.nomorTelepon || '';
      golonganDarah = citizen.golonganDarah || 'O';
      statusBantuan = citizen.statusBantuan || 'Bukan Penerima';
      validationError = null;
    } else if (isOpen && mode === 'create') {
      nik = '';
      noKk = '';
      namaLengkap = '';
      jenisKelamin = 'Laki-laki';
      tempatLahir = '';
      tanggalLahir = '';
      agama = 'Islam';
      pendidikan = 'SMA/SMK';
      pekerjaan = '';
      statusPernikahan = 'Belum Kawin';
      statusKeluarga = 'Kepala Keluarga';
      alamat = 'Jl. Sukamaju';
      rt = '001';
      rw = '003';
      nomorTelepon = '';
      golonganDarah = 'O';
      statusBantuan = 'Bukan Penerima';
      validationError = null;
    }
  });

  // Handle keyboard Escape
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isOpen && !isSubmitting) {
      onClose();
    }
  }

  function handleFormSubmit(e: Event) {
    e.preventDefault();
    validationError = null;

    if (!nik || nik.length !== 16 || !/^\d{16}$/.test(nik)) {
      validationError = 'NIK harus tepat 16 digit angka numerik.';
      return;
    }

    if (!noKk || noKk.length !== 16 || !/^\d{16}$/.test(noKk)) {
      validationError = 'Nomor Kartu Keluarga (KK) harus tepat 16 digit angka numerik.';
      return;
    }

    if (!namaLengkap || namaLengkap.trim().length < 2) {
      validationError = 'Nama lengkap wajib diisi minimal 2 karakter.';
      return;
    }

    if (!tempatLahir || tempatLahir.trim().length < 2) {
      validationError = 'Tempat lahir wajib diisi minimal 2 karakter.';
      return;
    }

    if (!tanggalLahir) {
      validationError = 'Tanggal lahir wajib ditentukan.';
      return;
    }

    if (!alamat || alamat.trim().length < 3) {
      validationError = 'Alamat domisili wajib diisi lengkap.';
      return;
    }

    const payload = {
      nik: nik.trim(),
      noKk: noKk.trim(),
      namaLengkap: namaLengkap.trim(),
      jenisKelamin,
      tempatLahir: tempatLahir.trim(),
      tanggalLahir,
      agama,
      pendidikan,
      pekerjaan: pekerjaan.trim() || 'Belum Bekerja',
      statusPernikahan,
      statusKeluarga,
      alamat: alamat.trim(),
      rt: rt.trim(),
      rw: rw.trim(),
      nomorTelepon: nomorTelepon.trim() || null,
      golonganDarah,
      statusBantuan
    };

    onSubmit(payload);
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if isOpen}
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-xs transition-opacity"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <!-- Modal container -->
    <div 
      class="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 my-8 transition-all"
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <div>
          <h3 id="modal-title" class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {#if mode === 'create'}
              Pendaftaran Data Warga Baru
            {:else if mode === 'edit'}
              Perbarui Data Warga
            {:else if mode === 'detail'}
              Rincian Kependudukan Warga
            {:else if mode === 'delete'}
              Konfirmasi Penghapusan
            {/if}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {#if mode === 'create'}
              Masukkan data identitas sesuai KTP dan Kartu Keluarga yang berlaku.
            {:else if mode === 'edit'}
              Sesuaikan data warga terdaftar di bawah ini.
            {:else if mode === 'detail'}
              Kartu identitas data kependudukan pangkalan data RT/RW.
            {:else if mode === 'delete'}
              Tindakan ini akan menghapus data dari basis data SQLite secara permanen.
            {/if}
          </p>
        </div>

        <button
          type="button"
          disabled={isSubmitting}
          onclick={onClose}
          class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          aria-label="Tutup jendela modal"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <!-- Pesan Kesalahan / Error Banner -->
      {#if validationError || errorMessage}
        <div class="mx-6 mt-4 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle class="h-4 w-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <p>{validationError || errorMessage}</p>
        </div>
      {/if}

      <!-- Modal Body berdasarkan Mode -->
      {#if mode === 'delete' && citizen}
        <!-- Form Konfirmasi Hapus -->
        <div class="p-6">
          <div class="rounded-xl border border-rose-100 bg-rose-50/60 p-4 dark:border-rose-950 dark:bg-rose-950/20">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
                <Trash2 class="h-5 w-5" />
              </div>
              <div>
                <p class="text-sm font-bold text-slate-900 dark:text-white">
                  Apakah Anda yakin ingin menghapus data warga ini?
                </p>
                <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Nama: <strong class="text-slate-900 dark:text-slate-100">{citizen.namaLengkap}</strong> (NIK: {citizen.nik})
                </p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onclick={onClose}
              class="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none min-h-[40px]"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={isSubmitting || !citizen.id}
              onclick={() => citizen.id && onConfirmDelete(citizen.id)}
              class="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-rose-700 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none min-h-[40px] disabled:opacity-50"
            >
              {#if isSubmitting}
                <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Menghapus...</span>
              {:else}
                <Trash2 class="h-4 w-4" />
                <span>Ya, Hapus Data</span>
              {/if}
            </button>
          </div>
        </div>

      {:else if mode === 'detail' && citizen}
        <!-- Tampilan Kartu Rincian Warga -->
        <div class="p-6 space-y-5">
          <!-- Header Ringkas -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <div>
              <div class="flex items-center gap-2">
                <h4 class="text-lg font-bold text-slate-900 dark:text-white">{citizen.namaLengkap}</h4>
                <span class="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {citizen.statusKeluarga}
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                RT {citizen.rt} / RW {citizen.rw} • {citizen.alamat}
              </p>
            </div>
            <div>
              {#if citizen.statusBantuan === 'Penerima Bantuan'}
                <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
                  Penerima Bantuan Sosial
                </span>
              {:else}
                <span class="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  Bukan Penerima Bantuan
                </span>
              {/if}
            </div>
          </div>

          <!-- Grid Data Rincian -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
              <span class="text-slate-400 font-medium">Nomor Induk Kependudukan (NIK)</span>
              <p class="font-mono text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{citizen.nik}</p>
            </div>

            <div class="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
              <span class="text-slate-400 font-medium">Nomor Kartu Keluarga (KK)</span>
              <p class="font-mono text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{citizen.noKk}</p>
            </div>

            <div class="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
              <span class="text-slate-400 font-medium">Jenis Kelamin</span>
              <p class="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{citizen.jenisKelamin}</p>
            </div>

            <div class="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
              <span class="text-slate-400 font-medium">Tempat, Tanggal Lahir</span>
              <p class="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{citizen.tempatLahir}, {citizen.tanggalLahir}</p>
            </div>

            <div class="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
              <span class="text-slate-400 font-medium">Agama</span>
              <p class="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{citizen.agama}</p>
            </div>

            <div class="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
              <span class="text-slate-400 font-medium">Golongan Darah</span>
              <p class="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{citizen.golonganDarah || 'Tidak Tahu'}</p>
            </div>

            <div class="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
              <span class="text-slate-400 font-medium">Pendidikan Terakhir</span>
              <p class="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{citizen.pendidikan}</p>
            </div>

            <div class="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
              <span class="text-slate-400 font-medium">Pekerjaan</span>
              <p class="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{citizen.pekerjaan}</p>
            </div>

            <div class="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
              <span class="text-slate-400 font-medium">Status Pernikahan</span>
              <p class="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{citizen.statusPernikahan}</p>
            </div>

            <div class="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
              <span class="text-slate-400 font-medium">Kontak Telepon / WhatsApp</span>
              <p class="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{citizen.nomorTelepon || 'Tidak ada kontak'}</p>
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <button
              type="button"
              onclick={onClose}
              class="rounded-lg bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 min-h-[40px]"
            >
              Tutup Rincian
            </button>
          </div>
        </div>

      {:else}
        <!-- Form Tambah / Edit Warga -->
        <form onsubmit={handleFormSubmit} class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <!-- Row 1: NIK & No KK -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="form-nik" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  NIK (16 Digit) <span class="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onclick={() => isAutoFillNikEnabled = !isAutoFillNikEnabled}
                  class="text-[10px] font-medium inline-flex items-center gap-1 transition-colors {isAutoFillNikEnabled ? 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700' : 'text-slate-400 hover:text-slate-600'}"
                  title="Klik untuk menghidupkan atau mematikan otomasi pengisian data dari NIK"
                >
                  <Wand2 class="h-3 w-3" />
                  <span>{isAutoFillNikEnabled ? 'Otomasi NIK Aktif' : 'Otomasi Mati'}</span>
                </button>
              </div>
              <input
                id="form-nik"
                type="text"
                maxlength="16"
                required
                bind:value={nik}
                placeholder="Contoh: 3201011203850001"
                class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <div class="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                <span>{nik.length}/16 digit</span>
                {#if parsedNikInfo?.isValid}
                  <span class="text-emerald-600 dark:text-emerald-400 font-medium">Format NIK Valid</span>
                {/if}
              </div>

              <!-- Hasil Deteksi Otomasi NIK -->
              {#if parsedNikInfo}
                {#if parsedNikInfo.isValid}
                  <div class="mt-2 rounded-lg border border-emerald-200 bg-emerald-50/80 p-2.5 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-1.5 font-bold text-[11px]">
                        <Sparkles class="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Otomasi NIK Terdeteksi</span>
                      </div>
                      <span class="rounded bg-emerald-100 dark:bg-emerald-900/70 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:text-emerald-200">
                        {parsedNikInfo.provinceName}
                      </span>
                    </div>
                    <p class="mt-1 text-[11px] text-emerald-700 dark:text-emerald-300 leading-normal">
                      Jenis Kelamin: <strong>{parsedNikInfo.gender}</strong> • Lahir: <strong>{parsedNikInfo.birthDateDisplay}</strong> ({parsedNikInfo.age} tahun)
                    </p>
                  </div>
                {:else if parsedNikInfo.error}
                  <div class="mt-1.5 flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400">
                    <AlertCircle class="h-3.5 w-3.5 shrink-0" />
                    <span>{parsedNikInfo.error}</span>
                  </div>
                {/if}
              {/if}
            </div>

            <div>
              <label for="form-nokk" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nomor KK (16 Digit) <span class="text-rose-500">*</span>
              </label>
              <input
                id="form-nokk"
                type="text"
                maxlength="16"
                required
                bind:value={noKk}
                placeholder="Contoh: 3201010101150001"
                class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 font-mono text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <span class="text-[10px] text-slate-400 mt-0.5 block">{noKk.length}/16 digit</span>
            </div>
          </div>

          <!-- Row 2: Nama Lengkap & Jenis Kelamin -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-2">
              <label for="form-nama" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap <span class="text-rose-500">*</span>
              </label>
              <input
                id="form-nama"
                type="text"
                required
                bind:value={namaLengkap}
                placeholder="Masukkan nama lengkap sesuai KTP"
                class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="form-gender" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Jenis Kelamin <span class="text-rose-500">*</span>
                </label>
                {#if parsedNikInfo?.isValid && isAutoFillNikEnabled}
                  <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Diisi NIK</span>
                {/if}
              </div>
              <select
                id="form-gender"
                bind:value={jenisKelamin}
                class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <!-- Row 3: Tempat & Tanggal Lahir -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="form-tempat-lahir" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tempat Lahir <span class="text-rose-500">*</span>
              </label>
              <input
                id="form-tempat-lahir"
                type="text"
                required
                bind:value={tempatLahir}
                placeholder="Kota / Kabupaten Kelahiran"
                class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              {#if parsedNikInfo?.isValid && !tempatLahir}
                <button
                  type="button"
                  onclick={() => tempatLahir = parsedNikInfo.provinceName}
                  class="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>+ Isi wilayah: {parsedNikInfo.provinceName}</span>
                </button>
              {/if}
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="form-tgl-lahir" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tanggal Lahir <span class="text-rose-500">*</span>
                </label>
                {#if parsedNikInfo?.isValid && isAutoFillNikEnabled}
                  <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Diisi NIK</span>
                {/if}
              </div>
              <input
                id="form-tgl-lahir"
                type="date"
                required
                bind:value={tanggalLahir}
                class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <!-- Row 4: Agama, Pendidikan, Golongan Darah -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label for="form-agama" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Agama
              </label>
              <select
                id="form-agama"
                bind:value={agama}
                class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>

            <div>
              <label for="form-pendidikan" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pendidikan Terakhir
              </label>
              <select
                id="form-pendidikan"
                bind:value={pendidikan}
                class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="SD">SD Sederajat</option>
                <option value="SMP">SMP Sederajat</option>
                <option value="SMA/SMK">SMA/SMK Sederajat</option>
                <option value="Diploma">Diploma (D1-D4)</option>
                <option value="S1">Strata 1 (S1)</option>
                <option value="S2">Magister (S2)</option>
                <option value="S3">Doktor (S3)</option>
                <option value="Belum Sekolah">Belum Sekolah</option>
              </select>
            </div>

            <div>
              <label for="form-goldar" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Golongan Darah
              </label>
              <select
                id="form-goldar"
                bind:value={golonganDarah}
                class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
                <option value="Tidak Tahu">Tidak Tahu</option>
              </select>
            </div>
          </div>

          <!-- Row 5: Pekerjaan, Status Pernikahan, Status Keluarga -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label for="form-pekerjaan" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pekerjaan <span class="text-rose-500">*</span>
              </label>
              <input
                id="form-pekerjaan"
                type="text"
                required
                bind:value={pekerjaan}
                placeholder="Contoh: Karyawan Swasta"
                class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label for="form-kawin" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status Pernikahan
              </label>
              <select
                id="form-kawin"
                bind:value={statusPernikahan}
                class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Belum Kawin">Belum Kawin</option>
                <option value="Kawin">Kawin</option>
                <option value="Cerai Hidup">Cerai Hidup</option>
                <option value="Cerai Mati">Cerai Mati</option>
              </select>
            </div>

            <div>
              <label for="form-keluarga" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hubungan Keluarga
              </label>
              <select
                id="form-keluarga"
                bind:value={statusKeluarga}
                class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Kepala Keluarga">Kepala Keluarga</option>
                <option value="Istri">Istri</option>
                <option value="Anak">Anak</option>
                <option value="Famili Lain">Famili Lain</option>
              </select>
            </div>
          </div>

          <!-- Row 6: Alamat, RT, RW -->
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div class="sm:col-span-2">
              <label for="form-alamat" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Domisili <span class="text-rose-500">*</span>
              </label>
              <input
                id="form-alamat"
                type="text"
                required
                bind:value={alamat}
                placeholder="Jl. / Gang / Blok / No. Rumah"
                class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label for="form-rt" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                RT <span class="text-rose-500">*</span>
              </label>
              <input
                id="form-rt"
                type="text"
                maxlength="3"
                required
                bind:value={rt}
                placeholder="001"
                class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label for="form-rw" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                RW <span class="text-rose-500">*</span>
              </label>
              <input
                id="form-rw"
                type="text"
                maxlength="3"
                required
                bind:value={rw}
                placeholder="003"
                class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <!-- Row 7: Nomor Telepon & Status Bantuan -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="form-telp" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nomor Telepon / WhatsApp (Opsional)
              </label>
              <input
                id="form-telp"
                type="tel"
                bind:value={nomorTelepon}
                placeholder="081234567890"
                class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label for="form-bantuan" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Bantuan Sosial
              </label>
              <select
                id="form-bantuan"
                bind:value={statusBantuan}
                class="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Bukan Penerima">Bukan Penerima</option>
                <option value="Penerima Bantuan">Penerima Bantuan</option>
              </select>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onclick={onClose}
              class="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none min-h-[40px]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none min-h-[40px] disabled:opacity-50"
            >
              {#if isSubmitting}
                <div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Menyimpan...</span>
              {:else}
                <Save class="h-4 w-4" />
                <span>{mode === 'create' ? 'Daftarkan Warga' : 'Simpan Perubahan'}</span>
              {/if}
            </button>
          </div>
        </form>
      {/if}
    </div>
  </div>
{/if}
