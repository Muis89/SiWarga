import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

const sqlite = new Database("sqlite.db", { create: true });
sqlite.exec("PRAGMA journal_mode = WAL;");

// Initialize table if it does not exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS citizens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nik TEXT NOT NULL UNIQUE,
    no_kk TEXT NOT NULL,
    nama_lengkap TEXT NOT NULL,
    jenis_kelamin TEXT NOT NULL,
    tempat_lahir TEXT NOT NULL,
    tanggal_lahir TEXT NOT NULL,
    agama TEXT NOT NULL,
    pendidikan TEXT NOT NULL,
    pekerjaan TEXT NOT NULL,
    status_pernikahan TEXT NOT NULL,
    status_keluarga TEXT NOT NULL,
    alamat TEXT NOT NULL,
    rt TEXT NOT NULL,
    rw TEXT NOT NULL,
    nomor_telepon TEXT,
    golongan_darah TEXT NOT NULL DEFAULT 'Tidak Tahu',
    status_bantuan TEXT NOT NULL DEFAULT 'Bukan Penerima',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

export const db = drizzle(sqlite, { schema });
