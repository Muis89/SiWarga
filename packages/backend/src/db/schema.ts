import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const citizens = sqliteTable("citizens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nik: text("nik", { length: 16 }).notNull().unique(),
  noKk: text("no_kk", { length: 16 }).notNull(),
  namaLengkap: text("nama_lengkap").notNull(),
  jenisKelamin: text("jenis_kelamin").notNull(), // 'Laki-laki' | 'Perempuan'
  tempatLahir: text("tempat_lahir").notNull(),
  tanggalLahir: text("tanggal_lahir").notNull(), // Format YYYY-MM-DD
  agama: text("agama").notNull(), // Islam, Kristen, Katolik, Hindu, Buddha, Konghucu
  pendidikan: text("pendidikan").notNull(), // SD, SMP, SMA/SMK, Diploma, S1, S2, S3, Belum Sekolah
  pekerjaan: text("pekerjaan").notNull(),
  statusPernikahan: text("status_pernikahan").notNull(), // Belum Kawin, Kawin, Cerai Hidup, Cerai Mati
  statusKeluarga: text("status_keluarga").notNull(), // Kepala Keluarga, Istri, Anak, Famili Lain
  alamat: text("alamat").notNull(),
  rt: text("rt", { length: 3 }).notNull(),
  rw: text("rw", { length: 3 }).notNull(),
  nomorTelepon: text("nomor_telepon"),
  golonganDarah: text("golongan_darah").notNull().default("Tidak Tahu"), // A, B, AB, O, Tidak Tahu
  statusBantuan: text("status_bantuan").notNull().default("Bukan Penerima"), // Penerima Bantuan, Bukan Penerima
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Citizen = typeof citizens.$inferSelect;
export type NewCitizen = typeof citizens.$inferInsert;
