import { Elysia, t } from "elysia";
import { db } from "../db";
import { citizens } from "../db/schema";
import { eq, like, or, and, sql, desc, asc } from "drizzle-orm";

// Data bibit warga Indonesia untuk simulasi awal jika data kosong
const SEED_DATA = [
  {
    nik: "3201011203850001",
    noKk: "3201010101150001",
    namaLengkap: "Budi Santoso",
    jenisKelamin: "Laki-laki",
    tempatLahir: "Bogor",
    tanggalLahir: "1985-03-12",
    agama: "Islam",
    pendidikan: "S1",
    pekerjaan: "Karyawan Swasta",
    statusPernikahan: "Kawin",
    statusKeluarga: "Kepala Keluarga",
    alamat: "Jl. Melati No. 12",
    rt: "001",
    rw: "003",
    nomorTelepon: "081234567890",
    golonganDarah: "O",
    statusBantuan: "Bukan Penerima",
  },
  {
    nik: "3201015507870002",
    noKk: "3201010101150001",
    namaLengkap: "Siti Aminah",
    jenisKelamin: "Perempuan",
    tempatLahir: "Bandung",
    tanggalLahir: "1987-07-15",
    agama: "Islam",
    pendidikan: "SMA/SMK",
    pekerjaan: "Ibu Rumah Tangga",
    statusPernikahan: "Kawin",
    statusKeluarga: "Istri",
    alamat: "Jl. Melati No. 12",
    rt: "001",
    rw: "003",
    nomorTelepon: "081234567891",
    golonganDarah: "A",
    statusBantuan: "Bukan Penerima",
  },
  {
    nik: "3201012010120003",
    noKk: "3201010101150001",
    namaLengkap: "Rizky Ramadhan",
    jenisKelamin: "Laki-laki",
    tempatLahir: "Bogor",
    tanggalLahir: "2012-10-20",
    agama: "Islam",
    pendidikan: "SMP",
    pekerjaan: "Pelajar/Mahasiswa",
    statusPernikahan: "Belum Kawin",
    statusKeluarga: "Anak",
    alamat: "Jl. Melati No. 12",
    rt: "001",
    rw: "003",
    nomorTelepon: "",
    golonganDarah: "O",
    statusBantuan: "Bukan Penerima",
  },
  {
    nik: "3201010506780004",
    noKk: "3201010202160002",
    namaLengkap: "Hendro Wibowo",
    jenisKelamin: "Laki-laki",
    tempatLahir: "Semarang",
    tanggalLahir: "1978-06-05",
    agama: "Kristen",
    pendidikan: "Diploma",
    pekerjaan: "Wiraswasta",
    statusPernikahan: "Kawin",
    statusKeluarga: "Kepala Keluarga",
    alamat: "Jl. Mawar No. 5",
    rt: "002",
    rw: "003",
    nomorTelepon: "085678901234",
    golonganDarah: "B",
    statusBantuan: "Bukan Penerima",
  },
  {
    nik: "3201014811800005",
    noKk: "3201010202160002",
    namaLengkap: "Maria Magdalena",
    jenisKelamin: "Perempuan",
    tempatLahir: "Yogyakarta",
    tanggalLahir: "1980-11-08",
    agama: "Kristen",
    pendidikan: "S1",
    pekerjaan: "Guru",
    statusPernikahan: "Kawin",
    statusKeluarga: "Istri",
    alamat: "Jl. Mawar No. 5",
    rt: "002",
    rw: "003",
    nomorTelepon: "085678901235",
    golonganDarah: "AB",
    statusBantuan: "Bukan Penerima",
  },
  {
    nik: "3201011504550006",
    noKk: "3201010303170003",
    namaLengkap: "Suhardi Kartodirdjo",
    jenisKelamin: "Laki-laki",
    tempatLahir: "Solo",
    tanggalLahir: "1955-04-15",
    agama: "Islam",
    pendidikan: "SMA/SMK",
    pekerjaan: "Pensiunan",
    statusPernikahan: "Cerai Mati",
    statusKeluarga: "Kepala Keluarga",
    alamat: "Jl. Kenanga No. 24",
    rt: "003",
    rw: "003",
    nomorTelepon: "081399887766",
    golonganDarah: "B",
    statusBantuan: "Penerima Bantuan",
  },
  {
    nik: "3201016208920007",
    noKk: "3201010404180004",
    namaLengkap: "Dewi Lestari",
    jenisKelamin: "Perempuan",
    tempatLahir: "Surabaya",
    tanggalLahir: "1992-08-22",
    agama: "Islam",
    pendidikan: "S1",
    pekerjaan: "Apoteker",
    statusPernikahan: "Belum Kawin",
    statusKeluarga: "Kepala Keluarga",
    alamat: "Jl. Anggrek No. 8",
    rt: "001",
    rw: "003",
    nomorTelepon: "087711223344",
    golonganDarah: "A",
    statusBantuan: "Bukan Penerima",
  },
  {
    nik: "3201012509650008",
    noKk: "3201010505190005",
    namaLengkap: "I Nyoman Artha",
    jenisKelamin: "Laki-laki",
    tempatLahir: "Denpasar",
    tanggalLahir: "1965-09-25",
    agama: "Hindu",
    pendidikan: "SMA/SMK",
    pekerjaan: "Pedagang",
    statusPernikahan: "Kawin",
    statusKeluarga: "Kepala Keluarga",
    alamat: "Jl. Dahlia No. 17",
    rt: "003",
    rw: "003",
    nomorTelepon: "081922334455",
    golonganDarah: "O",
    statusBantuan: "Penerima Bantuan",
  },
  {
    nik: "3201016503700009",
    noKk: "3201010505190005",
    namaLengkap: "Ni Ketut Suartini",
    jenisKelamin: "Perempuan",
    tempatLahir: "Gianyar",
    tanggalLahir: "1970-03-25",
    agama: "Hindu",
    pendidikan: "SMP",
    pekerjaan: "Ibu Rumah Tangga",
    statusPernikahan: "Kawin",
    statusKeluarga: "Istri",
    alamat: "Jl. Dahlia No. 17",
    rt: "003",
    rw: "003",
    nomorTelepon: "",
    golonganDarah: "O",
    statusBantuan: "Penerima Bantuan",
  },
  {
    nik: "3201010101220010",
    noKk: "3201010202160002",
    namaLengkap: "Kezia Grace Wibowo",
    jenisKelamin: "Perempuan",
    tempatLahir: "Bogor",
    tanggalLahir: "2022-01-01",
    agama: "Kristen",
    pendidikan: "Belum Sekolah",
    pekerjaan: "Belum Bekerja",
    statusPernikahan: "Belum Kawin",
    statusKeluarga: "Anak",
    alamat: "Jl. Mawar No. 5",
    rt: "002",
    rw: "003",
    nomorTelepon: "",
    golonganDarah: "B",
    statusBantuan: "Bukan Penerima",
  }
];

export const citizenRoutes = new Elysia({ prefix: "/citizens" })
  // 1. GET /citizens - Daftar warga dengan pencarian, filter, dan pagination
  .get(
    "/",
    async ({ query }) => {
      const search = query.search?.trim() || "";
      const rt = query.rt?.trim() || "";
      const rw = query.rw?.trim() || "";
      const gender = query.gender?.trim() || "";
      const statusKeluarga = query.statusKeluarga?.trim() || "";
      const statusBantuan = query.statusBantuan?.trim() || "";
      const page = Math.max(1, Number(query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
      const offset = (page - 1) * limit;

      const conditions = [];

      if (search) {
        conditions.push(
          or(
            like(citizens.namaLengkap, `%${search}%`),
            like(citizens.nik, `%${search}%`),
            like(citizens.noKk, `%${search}%`),
            like(citizens.pekerjaan, `%${search}%`)
          )
        );
      }

      if (rt) {
        conditions.push(eq(citizens.rt, rt));
      }

      if (rw) {
        conditions.push(eq(citizens.rw, rw));
      }

      if (gender) {
        conditions.push(eq(citizens.jenisKelamin, gender));
      }

      if (statusKeluarga) {
        conditions.push(eq(citizens.statusKeluarga, statusKeluarga));
      }

      if (statusBantuan) {
        conditions.push(eq(citizens.statusBantuan, statusBantuan));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Hitung total record sesuai filter
      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(citizens)
        .where(whereClause);
      const total = Number(totalResult[0]?.count || 0);

      // Ambil data halaman ini
      const items = await db
        .select()
        .from(citizens)
        .where(whereClause)
        .orderBy(desc(citizens.id))
        .limit(limit)
        .offset(offset);

      return {
        success: true,
        data: items,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    },
    {
      query: t.Optional(
        t.Object({
          search: t.Optional(t.String()),
          rt: t.Optional(t.String()),
          rw: t.Optional(t.String()),
          gender: t.Optional(t.String()),
          statusKeluarga: t.Optional(t.String()),
          statusBantuan: t.Optional(t.String()),
          page: t.Optional(t.String()),
          limit: t.Optional(t.String()),
        })
      ),
    }
  )

  // 2. GET /citizens/stats - Statistik riil terhitung dari database
  .get("/stats", async () => {
    const allCitizens = await db.select().from(citizens);
    const totalWarga = allCitizens.length;

    // KK unik
    const uniqueKk = new Set(allCitizens.map((c) => c.noKk));
    const totalKeluarga = uniqueKk.size;

    // Rasio gender
    let pria = 0;
    let wanita = 0;
    let penerimaBantuan = 0;

    // Kelompok umur berdasarkan tahun kelahiran
    const currentYear = new Date().getFullYear();
    let balita = 0; // 0-4 tahun
    let anak = 0; // 5-17 tahun
    let produktif = 0; // 18-59 tahun
    let lansia = 0; // 60+ tahun

    const rtCountMap: Record<string, number> = {};

    for (const c of allCitizens) {
      if (c.jenisKelamin === "Laki-laki") pria++;
      else if (c.jenisKelamin === "Perempuan") wanita++;

      if (c.statusBantuan === "Penerima Bantuan") penerimaBantuan++;

      if (c.tanggalLahir) {
        const birthYear = parseInt(c.tanggalLahir.split("-")[0] || "0", 10);
        if (birthYear > 0) {
          const age = currentYear - birthYear;
          if (age < 5) balita++;
          else if (age <= 17) anak++;
          else if (age < 60) produktif++;
          else lansia++;
        }
      }

      if (c.rt) {
        rtCountMap[c.rt] = (rtCountMap[c.rt] || 0) + 1;
      }
    }

    const distribusiRt = Object.entries(rtCountMap)
      .map(([rt, jumlah]) => ({ rt, jumlah }))
      .sort((a, b) => a.rt.localeCompare(b.rt));

    return {
      success: true,
      stats: {
        totalWarga,
        totalKeluarga,
        gender: {
          pria,
          wanita,
        },
        kelompokUsia: {
          balita,
          anak,
          produktif,
          lansia,
        },
        bantuan: {
          penerima: penerimaBantuan,
          bukanPenerima: totalWarga - penerimaBantuan,
        },
        distribusiRt,
      },
    };
  })

  // 3. POST /citizens/seed - Seed data contoh jika kosong
  .post("/seed", async ({ set }) => {
    const existing = await db.select({ count: sql<number>`count(*)` }).from(citizens);
    const count = Number(existing[0]?.count || 0);

    if (count > 0) {
      return {
        success: true,
        message: `Database sudah memiliki ${count} data warga.`,
        inserted: 0,
      };
    }

    await db.insert(citizens).values(SEED_DATA);
    set.status = 201;
    return {
      success: true,
      message: `Berhasil menambahkan ${SEED_DATA.length} data contoh warga.`,
      inserted: SEED_DATA.length,
    };
  })

  // 4. GET /citizens/:id - Detail warga
  .get("/:id", async ({ params, set }) => {
    const id = Number(params.id);
    if (isNaN(id)) {
      set.status = 400;
      return { success: false, message: "ID tidak valid" };
    }

    const result = await db.select().from(citizens).where(eq(citizens.id, id));
    if (!result[0]) {
      set.status = 404;
      return { success: false, message: "Data warga tidak ditemukan" };
    }

    return {
      success: true,
      data: result[0],
    };
  })

  // 5. POST /citizens - Tambah warga baru
  .post(
    "/",
    async ({ body, set }) => {
      // Validasi NIK 16 digit
      if (!/^\d{16}$/.test(body.nik)) {
        set.status = 400;
        return { success: false, message: "NIK harus berupa 16 digit angka numerik" };
      }

      // Validasi No KK 16 digit
      if (!/^\d{16}$/.test(body.noKk)) {
        set.status = 400;
        return { success: false, message: "Nomor KK harus berupa 16 digit angka numerik" };
      }

      // Periksa apakah NIK sudah terdaftar
      const existing = await db.select().from(citizens).where(eq(citizens.nik, body.nik));
      if (existing.length > 0) {
        set.status = 409;
        return { success: false, message: `NIK ${body.nik} sudah terdaftar dalam sistem` };
      }

      const inserted = await db
        .insert(citizens)
        .values({
          nik: body.nik,
          noKk: body.noKk,
          namaLengkap: body.namaLengkap.trim(),
          jenisKelamin: body.jenisKelamin,
          tempatLahir: body.tempatLahir.trim(),
          tanggalLahir: body.tanggalLahir,
          agama: body.agama,
          pendidikan: body.pendidikan,
          pekerjaan: body.pekerjaan.trim(),
          statusPernikahan: body.statusPernikahan,
          statusKeluarga: body.statusKeluarga,
          alamat: body.alamat.trim(),
          rt: body.rt.padStart(3, "0"),
          rw: body.rw.padStart(3, "0"),
          nomorTelepon: body.nomorTelepon?.trim() || null,
          golonganDarah: body.golonganDarah || "Tidak Tahu",
          statusBantuan: body.statusBantuan || "Bukan Penerima",
        })
        .returning();

      set.status = 201;
      return {
        success: true,
        message: "Data warga berhasil ditambahkan",
        data: inserted[0],
      };
    },
    {
      body: t.Object({
        nik: t.String(),
        noKk: t.String(),
        namaLengkap: t.String({ minLength: 2 }),
        jenisKelamin: t.String(),
        tempatLahir: t.String(),
        tanggalLahir: t.String(),
        agama: t.String(),
        pendidikan: t.String(),
        pekerjaan: t.String(),
        statusPernikahan: t.String(),
        statusKeluarga: t.String(),
        alamat: t.String(),
        rt: t.String(),
        rw: t.String(),
        nomorTelepon: t.Optional(t.Nullable(t.String())),
        golonganDarah: t.Optional(t.String()),
        statusBantuan: t.Optional(t.String()),
      }),
    }
  )

  // 6. PUT /citizens/:id - Update data warga
  .put(
    "/:id",
    async ({ params, body, set }) => {
      const id = Number(params.id);
      if (isNaN(id)) {
        set.status = 400;
        return { success: false, message: "ID tidak valid" };
      }

      const existing = await db.select().from(citizens).where(eq(citizens.id, id));
      if (!existing[0]) {
        set.status = 404;
        return { success: false, message: "Data warga tidak ditemukan" };
      }

      // Validasi NIK dan No KK jika diubah
      if (body.nik && !/^\d{16}$/.test(body.nik)) {
        set.status = 400;
        return { success: false, message: "NIK harus berupa 16 digit angka numerik" };
      }

      if (body.noKk && !/^\d{16}$/.test(body.noKk)) {
        set.status = 400;
        return { success: false, message: "Nomor KK harus berupa 16 digit angka numerik" };
      }

      // Jika NIK diubah, pastikan tidak bentrok dengan warga lain
      if (body.nik && body.nik !== existing[0].nik) {
        const duplicate = await db.select().from(citizens).where(eq(citizens.nik, body.nik));
        if (duplicate.length > 0) {
          set.status = 409;
          return { success: false, message: `NIK ${body.nik} sudah digunakan oleh warga lain` };
        }
      }

      const updated = await db
        .update(citizens)
        .set({
          ...body,
          rt: body.rt ? body.rt.padStart(3, "0") : existing[0].rt,
          rw: body.rw ? body.rw.padStart(3, "0") : existing[0].rw,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(citizens.id, id))
        .returning();

      return {
        success: true,
        message: "Data warga berhasil diperbarui",
        data: updated[0],
      };
    },
    {
      body: t.Partial(
        t.Object({
          nik: t.String(),
          noKk: t.String(),
          namaLengkap: t.String(),
          jenisKelamin: t.String(),
          tempatLahir: t.String(),
          tanggalLahir: t.String(),
          agama: t.String(),
          pendidikan: t.String(),
          pekerjaan: t.String(),
          statusPernikahan: t.String(),
          statusKeluarga: t.String(),
          alamat: t.String(),
          rt: t.String(),
          rw: t.String(),
          nomorTelepon: t.Optional(t.Nullable(t.String())),
          golonganDarah: t.Optional(t.String()),
          statusBantuan: t.Optional(t.String()),
        })
      ),
    }
  )

  // 7. DELETE /citizens/:id - Hapus data warga
  .delete("/:id", async ({ params, set }) => {
    const id = Number(params.id);
    if (isNaN(id)) {
      set.status = 400;
      return { success: false, message: "ID tidak valid" };
    }

    const existing = await db.select().from(citizens).where(eq(citizens.id, id));
    if (!existing[0]) {
      set.status = 404;
      return { success: false, message: "Data warga tidak ditemukan" };
    }

    await db.delete(citizens).where(eq(citizens.id, id));

    return {
      success: true,
      message: `Data warga an. ${existing[0].namaLengkap} berhasil dihapus`,
    };
  });
