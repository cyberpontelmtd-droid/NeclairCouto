"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/itens", label: "Estoque" },
  { href: "/admin/etiquetas", label: "Etiquetas" },
  { href: "/admin/reservas", label: "Reservas" },
  { href: "/admin/caixa", label: "Caixa" },
  { href: "/admin/usuarios", label: "Usuários" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        className="p-2 -mr-2 text-white"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <nav className="absolute left-0 right-0 top-full bg-brand-dark border-t border-white/10 flex flex-col px-4 py-2 shadow-lg z-50">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm text-white border-b border-white/10 last:border-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
