"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "crypto";
import { NAMA_COOKIE, UMUR_SESI, buatTokenn } from "@/lib/sesi";

export type HasilMasuk = { pesan: string };

const NAMA_COOKIE_GAGAL = "login_gagal";
const BATAS_PERCOBAAN = 5;
const DURASI_BLOKIR = 60; // detik

function sandiSama(a: string, b: string): boolean {
  // Pastikan panjang sama dulu agar timingSafeEqual tidak error
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b.padEnd(a.length, "\0").slice(0, a.length));
  return a.length === b.length && timingSafeEqual(bufA, bufB);
}

export async function masuk(_sebelum: HasilMasuk, formData: FormData): Promise<HasilMasuk> {
  const sandi = String(formData.get("sandi") ?? "");
  const dari = String(formData.get("dari") ?? "");
  const jar = await cookies();

  // baca limit
  const dataGagal = jar.get(NAMA_COOKIE_GAGAL)?.value ?? "";
  const [jumlahStr, blokirStr] = dataGagal.split(":");
  const jumlah = parseInt(jumlahStr) || 0;
  const blokirHingga = parseInt(blokirStr) || 0;

  // cek blokir
  if (jumlah >= BATAS_PERCOBAAN && Date.now() < blokirHingga) {
    const sisaDetik = Math.ceil((blokirHingga - Date.now()) / 1000);
    return { pesan: `Terlalu banyak percobaan. Coba lagi dalam ${sisaDetik} detik.` };
  }

  // hapus blokir jika sudah habis
  const jumlahBaru = jumlah >= BATAS_PERCOBAAN && Date.now() >= blokirHingga ? 0 : jumlah;

  // bandingkan sandi
  if (!sandiSama(sandi, process.env.ADMIN_PASSWORD ?? "")) {
    const gagalBaru = jumlahBaru + 1;
    const blokirBaru = gagalBaru >= BATAS_PERCOBAAN ? Date.now() + DURASI_BLOKIR * 1000 : blokirHingga;

    jar.set(NAMA_COOKIE_GAGAL, `${gagalBaru}:${blokirBaru}`, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: DURASI_BLOKIR * 2,
    });

    const sisaPercobaan = BATAS_PERCOBAAN - gagalBaru;
    if (gagalBaru >= BATAS_PERCOBAAN) {
      return { pesan: `Terlalu banyak percobaan. Coba lagi dalam ${DURASI_BLOKIR} detik.` };
    }
    return { pesan: `Kata sandi salah. Sisa percobaan: ${sisaPercobaan}.` };
  }

  // login berhasil(hapus cookie gagal)
  jar.delete(NAMA_COOKIE_GAGAL);

  jar.set(NAMA_COOKIE, await buatTokenn(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: UMUR_SESI,
  });

  redirect(dari.startsWith("/admin") ? dari : "/admin");
}

export async function keluar() {
  (await cookies()).delete(NAMA_COOKIE);
  redirect("/login");
}
