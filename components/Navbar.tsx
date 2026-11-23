"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { href: "/", text: "Beranda" },
  { href: "/event", text: "Event" },
  { href: "/tentang", text: "Tentang" },
  { href: "/favorit", text: "Favorit" },
  { href: "/pesanan", text: "Pesanan" },
  { href: "/admin", text: "Admin" },
];

function NavLink({ href, text }: { href: string; text: string }) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={
        pathname === href
          ? "font-semibold text-blue-600"
          : "text-slate-600 hover:text-blue-600"
      }
    >
      {text}
    </Link>
  );
}

export default function Navbar() {
  return (
    <nav className="flex items-center gap-6 bg-white px-6 py-3">
      <span className="text-lg font-bold text-blue-600">EventKu</span>
      {menu.map((m) => (
        <NavLink key={m.href} href={m.href} text={m.text} />
      ))}
    </nav>
  );
}
