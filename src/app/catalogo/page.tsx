import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";

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
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-transparent hover:border-brand-accent"
                >
                  <div className="relative w-full aspect-square bg-brand-pink/30">
                    {item.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/uploads/${item.images[0].filename}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-purple/40 text-sm">
                        Sem foto
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    {item.category && (
                      <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
                        {item.category.name}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-brand-dark mt-1 mb-1">{item.name}</h3>
                    {item.material && <p className="text-sm text-gray-500 mb-2">{item.material}</p>}
                    <p className="text-brand-purple font-bold">
                      {Number(item.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
