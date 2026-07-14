import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function EtiquetasPage() {
  const items = await prisma.item.findMany({
    include: { category: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-brand-dark">Etiquetas</h1>
        <Link
          href="/admin/etiquetas/gerar"
          className="bg-brand-purple text-white px-6 py-2 rounded-full hover:bg-brand-dark transition-colors text-sm font-bold"
        >
          Gerar etiquetas novas (sem produto)
        </Link>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        Selecione peças já cadastradas para reimprimir suas etiquetas, ou gere etiquetas novas
        antes de cadastrar o estoque.
      </p>

      <form action="/admin/etiquetas/imprimir" method="GET" className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-end mb-4">
          <button
            type="submit"
            className="bg-brand-purple text-white px-6 py-2 rounded-full hover:bg-brand-dark transition-colors text-sm font-bold"
          >
            Gerar etiquetas selecionadas
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="px-4 py-3 w-10"></th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Categoria</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <input type="checkbox" name="ids" value={item.id} />
                </td>
                <td className="px-4 py-3 font-mono text-xs">{item.sku}</td>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.category?.name ?? "—"}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  Nenhuma peça cadastrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </form>
    </div>
  );
}
