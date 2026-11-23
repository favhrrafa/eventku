"use client";

import { hapusEvent } from "@/app/admin/actions";

export default function TombolHapus({ id, judul }: { id: number; judul: string }) {
  function konfirmasi(e: React.MouseEvent<HTMLButtonElement>) {
    if (!window.confirm(`Hapus "${judul}"? Tindakan ini tidak bisa dibatalkan.`)) {
      e.preventDefault();
    }
  }

  return (
    <form action={hapusEvent}>
      <input type="hidden" name="id" value={id} />
      <button onClick={konfirmasi} className="text-red-600 underline">
        Hapus
      </button>
    </form>
  );
}
