import { prisma } from "@/lib/prisma";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth() {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function CaixaPage() {
  const sales = await prisma.sale.findMany({
    include: { items: { include: { item: true } }, reservation: true },
    orderBy: { createdAt: "desc" },
  });

  const todayStart = startOfToday();
  const monthStart = startOfMonth();

  const totalToday = sales
    .filter((s) => s.createdAt >= todayStart)
    .reduce((sum, s) => sum + Number(s.total), 0);
  const totalMonth = sales
    .filter((s) => s.createdAt >= monthStart)
    .reduce((sum, s) => sum + Number(s.total), 0);
  const totalAll = sales.reduce((sum, s) => sum + Number(s.total), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Caixa</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Hoje</p>
          <p className="text-2xl font-bold text-brand-purple">{formatBRL(totalToday)}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Este mês</p>
          <p className="text-2xl font-bold text-brand-purple">{formatBRL(totalMonth)}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Total geral</p>
          <p className="text-2xl font-bold text-brand-purple">{formatBRL(totalAll)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Itens</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b last:border-0">
                <td className="px-4 py-3 whitespace-nowrap">{sale.createdAt.toLocaleString("pt-BR")}</td>
                <td className="px-4 py-3">{sale.reservation?.customerName ?? "—"}</td>
                <td className="px-4 py-3">
                  {sale.items.map((si) => `${si.quantity}x ${si.item.name}`).join(", ")}
                </td>
                <td className="px-4 py-3 font-bold text-brand-purple">{formatBRL(Number(sale.total))}</td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  Nenhuma venda registrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
