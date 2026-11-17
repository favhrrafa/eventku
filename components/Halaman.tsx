import Link from "next/link";
import { alamatHalaman, type Saringan } from "@/data/saring";

export default function Halaman({
  s,
  hal,
  jumlah,
}: {
  s: Saringan;
  hal: number;
  jumlah: number;
}) {
  if (jumlah <= 1) return null;

  const nomorList = Array.from({ length: jumlah }, (_, i) => i + 1);

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-2">
      {hal > 1 && (
        <Link
          href={alamatHalaman(s, hal - 1)}
          className="rounded border px-3 py-1.5 text-sm hover:bg-slate-50"
        >
          « Sebelumnya
        </Link>
      )}

      {nomorList.map((nomor) => {
        const aktif = nomor === hal;
        return (
          <Link
            key={nomor}
            href={alamatHalaman(s, nomor)}
            className={`rounded border px-3 py-1.5 text-sm ${
              aktif
                ? "border-blue-600 font-bold text-blue-600"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            {nomor}
          </Link>
        );
      })}

      {hal < jumlah && (
        <Link
          href={alamatHalaman(s, hal + 1)}
          className="rounded border px-3 py-1.5 text-sm hover:bg-slate-50"
        >
          Berikutnya »
        </Link>
      )}
    </nav>
  );
}

