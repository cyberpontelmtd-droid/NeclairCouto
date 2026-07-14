import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cancelReservation } from "./actions";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
};

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default async function ReservasPage() {
  const reservations = await prisma.reservation.findMany({
    include: { items: { include: { item: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Reservas</h1>

      <div className="flex flex-col gap-4">
        {reservations.length === 0 && (
          <p className="text-gray-400 bg-white rounded-2xl shadow-sm p-6 text-center">
            Nenhuma reserva ainda.
          </p>
        )}

        {reservations.map((res) => (
          <div key={res.id} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="font-bold text-brand-dark">{res.customerName}</p>
                <p className="text-sm text-gray-500">{res.contact}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {res.createdAt.toLocaleString("pt-BR")}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${STATUS_STYLE[res.status]}`}>
                {STATUS_LABEL[res.status]}
              </span>
            </div>

            <ul className="text-sm text-gray-600 mb-4 space-y-1">
              {res.items.map((ri) => (
                <li key={ri.id} className="flex justify-between">
                  <span>
                    {ri.quantity}x {ri.item.name}
                  </span>
                  <span className="font-mono text-xs text-gray-400">{ri.item.sku}</span>
                </li>
              ))}
            </ul>

            {res.status === "PENDING" && (
              <div className="flex gap-3">
                <Link
                  href={`/admin/reservas/${res.id}/confirmar`}
                  className="bg-brand-purple text-white px-5 py-2 rounded-full hover:bg-brand-dark transition-colors text-sm font-bold"
                >
                  Confirmar venda
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await cancelReservation(res.id);
                  }}
                >
                  <button type="submit" className="text-red-500 hover:underline text-sm">
                    Cancelar
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
