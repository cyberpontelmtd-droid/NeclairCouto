import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toggleItemActive, deleteItem } from "./actions";

export default async function ItensPage() {
  const items = await prisma.item.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">Estoque</h1>
        <Link
          href="/admin/itens/novo"
          className="bg-brand-purple text-white px-5 py-2 rounded-full hover:bg-brand-dark transition-colors"
        >
          + Nova peça
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Estoque</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Ativo</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{item.sku}</td>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.category?.name ?? "—"}</td>
                <td className="px-4 py-3">{item.stockQty}</td>
                <td className="px-4 py-3">
                  {Number(item.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>
                <td className="px-4 py-3">
                  <form
                    action={async () => {
                      "use server";
                      await toggleItemActive(item.id, !item.active);
                    }}
                  >
                    <button
                      type="submit"
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.active ? "Ativo" : "Inativo"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 flex gap-3">
                  <Link href={`/admin/itens/${item.id}/editar`} className="text-brand-purple hover:underline">
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteItem(item.id);
                    }}
                  >
                    <button type="submit" className="text-red-500 hover:underline">
                      Excluir
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Nenhuma peça cadastrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
