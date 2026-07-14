"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const confirmSchema = z.object({
  reservationId: z.string().min(1),
  items: z
    .array(z.object({ itemId: z.string(), quantity: z.number().int().min(1) }))
    .min(1),
});

export async function confirmSale(input: z.infer<typeof confirmSchema>) {
  const { reservationId, items } = confirmSchema.parse(input);

  await prisma.$transaction(async (tx) => {
    const dbItems = await tx.item.findMany({ where: { id: { in: items.map((i) => i.itemId) } } });
    const priceMap = new Map(dbItems.map((i) => [i.id, i.price]));

    const total = items.reduce((sum, i) => sum + Number(priceMap.get(i.itemId) ?? 0) * i.quantity, 0);

    await tx.sale.create({
      data: {
        reservationId,
        total,
        items: {
          create: items.map((i) => ({
            itemId: i.itemId,
            quantity: i.quantity,
            price: priceMap.get(i.itemId) ?? 0,
          })),
        },
      },
    });

    for (const i of items) {
      await tx.item.update({
        where: { id: i.itemId },
        data: { stockQty: { decrement: i.quantity } },
      });
    }

    await tx.reservation.update({
      where: { id: reservationId },
      data: { status: "CONFIRMED" },
    });
  });

  revalidatePath("/admin/reservas");
  revalidatePath("/admin/itens");
  revalidatePath("/admin/caixa");
  redirect("/admin/reservas");
}
