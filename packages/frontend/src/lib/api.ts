import { treaty } from "@elysiajs/eden";
import type { App } from "../../../backend/src/index";

export const getApiUrl = () => {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:3001`;
  }
  return "http://localhost:3001";
};

// @ts-ignore
export const api = treaty<App>(getApiUrl());

export interface Citizen {
  id: number;
  nik: string;
  noKk: string;
  namaLengkap: string;
  jenisKelamin: "Laki-laki" | "Perempuan" | string;
  tempatLahir: string;
  tanggalLahir: string;
  agama: string;
  pendidikan: string;
  pekerjaan: string;
  statusPernikahan: string;
  statusKeluarga: string;
  alamat: string;
  rt: string;
  rw: string;
  nomorTelepon: string | null;
  golonganDarah: string;
  statusBantuan: "Penerima Bantuan" | "Bukan Penerima" | string;
  createdAt: string;
  updatedAt: string;
}

export interface CitizenStats {
  totalWarga: number;
  totalKeluarga: number;
  gender: {
    pria: number;
    wanita: number;
  };
  kelompokUsia: {
    balita: number;
    anak: number;
    produktif: number;
    lansia: number;
  };
  bantuan: {
    penerima: number;
    bukanPenerima: number;
  };
  distribusiRt: Array<{ rt: string; jumlah: number }>;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
