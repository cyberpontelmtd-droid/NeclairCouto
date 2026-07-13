import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [itemCount, lowStockCount] = await Promise.all([
    prisma.item.count(),
    prisma.item.count({ where: { stockQty: { lte: 3 } } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Itens cadastrados</p>
          <p className="text-3xl font-bold text-brand-purple">{itemCount}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500">Estoque baixo (≤ 3)</p>
          <p className="text-3xl font-bold text-brand-purple">{lowStockCount}</p>
        </div>
      </div>
    </div>
  );
}
