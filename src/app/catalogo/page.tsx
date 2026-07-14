import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { CatalogGrid } from "./CatalogGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de Joias | Neclair Couto",
  description: "Catálogo de joias para body piercing da Neclair Couto — titânio, ouro e aço cirúrgico.",
};

export default async function CatalogoPage() {
  const items = await prisma.item.findMany({
    where: { active: true },
    include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 bg-gradient-to-b from-brand-pink/50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="text-brand-purple font-bold tracking-widest uppercase text-sm">
              Coleção
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mt-2 mb-4">
              Catálogo de Joias
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Peças em Titânio Grau Implante, Ouro 18k e Aço Cirúrgico, com laudo de garantia.
            </p>
          </div>

          {items.length === 0 ? (
            <p className="text-center text-gray-400">Catálogo em atualização, volte em breve.</p>
          ) : (
            <CatalogGrid
              items={items.map((item) => ({
                id: item.id,
                name: item.name,
                material: item.material,
                price: Number(item.price),
                categoryName: item.category?.name ?? null,
                imageFilename: item.images[0]?.filename ?? null,
              }))}
            />
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
