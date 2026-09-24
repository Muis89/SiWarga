export interface ParsedNik {
  isValid: boolean;
  provinceCode: string;
  provinceName: string;
  gender: 'Laki-laki' | 'Perempuan';
  birthDate: string; // Format YYYY-MM-DD untuk input HTML type="date"
  birthDateDisplay: string; // Format teks ramah: 15 Juli 1987
  age: number;
  sequenceNumber: string;
  error?: string;
}

const PROVINSI_MAP: Record<string, string> = {
  '11': 'Aceh',
  '12': 'Sumatera Utara',
  '13': 'Sumatera Barat',
  '14': 'Riau',
  '15': 'Jambi',
  '16': 'Sumatera Selatan',
  '17': 'Bengkulu',
  '18': 'Lampung',
  '19': 'Kep. Bangka Belitung',
  '21': 'Kep. Riau',
  '31': 'DKI Jakarta',
  '32': 'Jawa Barat',
  '33': 'Jawa Tengah',
  '34': 'DI Yogyakarta',
  '35': 'Jawa Timur',
  '36': 'Banten',
  '51': 'Bali',
  '52': 'Nusa Tenggara Barat',
  '53': 'Nusa Tenggara Timur',
  '61': 'Kalimantan Barat',
  '62': 'Kalimantan Tengah',
  '63': 'Kalimantan Selatan',
  '64': 'Kalimantan Timur',
  '65': 'Kalimantan Utara',
  '71': 'Sulawesi Utara',
  '72': 'Sulawesi Tengah',
  '73': 'Sulawesi Selatan',
  '74': 'Sulawesi Tenggara',
  '75': 'Gorontalo',
  '76': 'Sulawesi Barat',
  '81': 'Maluku',
  '82': 'Maluku Utara',
  '91': 'Papua',
  '92': 'Papua Barat',
  '93': 'Papua Selatan',
  '94': 'Papua Tengah',
  '95': 'Papua Pegunungan',
  '96': 'Papua Barat Daya'
};

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function parseIndonesianNik(rawNik: string): ParsedNik | null {
  const clean = rawNik.replace(/\D/g, '');
  if (clean.length < 12) {
    return null;
  }

  const provCode = clean.slice(0, 2);
  const rawDay = parseInt(clean.slice(6, 8), 10);
  const rawMonth = parseInt(clean.slice(8, 10), 10);
  const rawYear = parseInt(clean.slice(10, 12), 10);
  const seq = clean.length >= 16 ? clean.slice(12, 16) : '';

  // Validasi bulan (1 - 12)
  if (isNaN(rawMonth) || rawMonth < 1 || rawMonth > 12) {
    return {
      isValid: false,
      provinceCode: provCode,
      provinceName: PROVINSI_MAP[provCode] || 'Wilayah Luar/Tidak Diketahui',
      gender: 'Laki-laki',
      birthDate: '',
      birthDateDisplay: '',
      age: 0,
      sequenceNumber: seq,
      error: 'Digit bulan lahir pada NIK tidak valid (harus 01 s/d 12).'
    };
  }

  // Deteksi gender dan tanggal lahir (wanita ditambah 40)
  let isFemale = false;
  let day = rawDay;

  if (rawDay > 40) {
    isFemale = true;
    day = rawDay - 40;
  }

  if (isNaN(day) || day < 1 || day > 31) {
    return {
      isValid: false,
      provinceCode: provCode,
      provinceName: PROVINSI_MAP[provCode] || 'Wilayah Luar/Tidak Diketahui',
      gender: isFemale ? 'Perempuan' : 'Laki-laki',
      birthDate: '',
      birthDateDisplay: '',
      age: 0,
      sequenceNumber: seq,
      error: 'Digit tanggal lahir pada NIK tidak valid.'
    };
  }

  // Tentukan tahun 4 digit
  const currentYear = new Date().getFullYear();
  const currentTwoDigitYear = currentYear % 100;

  // Jika 2 digit tahun lebih besar dari 2 digit tahun saat ini, berarti abad 20 (19xx)
  // Contoh: 85 -> 1985, 99 -> 1999, 05 -> 2005
  let fullYear: number;
  if (rawYear > currentTwoDigitYear) {
    fullYear = 1900 + rawYear;
  } else {
    fullYear = 2000 + rawYear;
  }

  const paddedDay = String(day).padStart(2, '0');
  const paddedMonth = String(rawMonth).padStart(2, '0');
  const birthDate = `${fullYear}-${paddedMonth}-${paddedDay}`;
  const birthDateDisplay = `${day} ${NAMA_BULAN[rawMonth - 1]} ${fullYear}`;

  // Hitung usia
  const birth = new Date(fullYear, rawMonth - 1, day);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }

  return {
    isValid: true,
    provinceCode: provCode,
    provinceName: PROVINSI_MAP[provCode] || 'Provinsi ' + provCode,
    gender: isFemale ? 'Perempuan' : 'Laki-laki',
    birthDate,
    birthDateDisplay,
    age: Math.max(0, age),
    sequenceNumber: seq
  };
}
