import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/lib/auth";
import { MobileNav } from "./MobileNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-brand-pink/30 print:bg-white">
      <header className="print:hidden bg-brand-dark text-white relative">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image src="/logo-icon.png" alt="Neclair Couto" fill className="object-contain" />
            </div>
            <span className="font-serif font-bold">Painel Admin</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm">
            <Link href="/admin" className="hover:text-brand-accent transition-colors">Dashboard</Link>
            <Link href="/admin/itens" className="hover:text-brand-accent transition-colors">Estoque</Link>
            <Link href="/admin/etiquetas" className="hover:text-brand-accent transition-colors">Etiquetas</Link>
            <Link href="/admin/reservas" className="hover:text-brand-accent transition-colors">Reservas</Link>
            <Link href="/admin/caixa" className="hover:text-brand-accent transition-colors">Caixa</Link>
            <Link href="/admin/usuarios" className="hover:text-brand-accent transition-colors">Usuários</Link>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-sm text-brand-pink hidden sm:inline">{session?.user?.name}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors"
              >
                Sair
              </button>
            </form>
            <MobileNav />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 md:px-6 py-8 print:p-0 print:m-0 print:max-w-none">{children}</main>
    </div>
  );
}
