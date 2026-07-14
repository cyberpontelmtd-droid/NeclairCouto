import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ConfirmSaleForm } from "./ConfirmSaleForm";

export default async function ConfirmarVendaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { items: { include: { item: true } } },
  });

  if (!reservation) notFound();

  if (reservation.status !== "PENDING") {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-md">
        <h1 className="text-xl font-bold text-brand-dark mb-2">Reserva já processada</h1>
        <p className="text-gray-500 text-sm mb-4">Esta reserva não está mais pendente.</p>
        <Link href="/admin/reservas" className="text-sm text-brand-purple hover:underline">
          ← Voltar para reservas
        </Link>
      </div>
    );
  }

  const allItems = await prisma.item.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  const initialLines = reservation.items.map((ri) => ({
    itemId: ri.item.id,
    name: ri.item.name,
    sku: ri.item.sku,
    price: Number(ri.item.price),
    quantity: ri.quantity,
  }));

  const availableItems = allItems.map((i) => ({
    id: i.id,
    name: i.name,
    sku: i.sku,
    price: Number(i.price),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark mb-2">Confirmar venda</h1>
      <p className="text-gray-500 text-sm mb-6">
        {reservation.customerName} · {reservation.contact}
      </p>
      <ConfirmSaleForm reservationId={reservation.id} initialLines={initialLines} availableItems={availableItems} />
    </div>
  );
}
