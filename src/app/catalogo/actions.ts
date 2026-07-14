"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const reservationSchema = z.object({
  customerName: z.string().min(1),
  contact: z.string().min(1),
  items: z
    .array(z.object({ itemId: z.string(), quantity: z.number().int().min(1) }))
    .min(1),
});

export async function createReservation(input: z.infer<typeof reservationSchema>) {
  const parsed = reservationSchema.parse(input);

  const validItems = await prisma.item.findMany({
    where: { id: { in: parsed.items.map((i) => i.itemId) }, active: true },
    select: { id: true },
  });
  const validIds = new Set(validItems.map((i) => i.id));
  const itemsToCreate = parsed.items.filter((i) => validIds.has(i.itemId));

  if (itemsToCreate.length === 0) {
    return { success: false, error: "Nenhuma peça válida selecionada." };
  }

  await prisma.reservation.create({
    data: {
      customerName: parsed.customerName,
      contact: parsed.contact,
      items: {
        create: itemsToCreate.map((i) => ({ itemId: i.itemId, quantity: i.quantity })),
      },
    },
  });

  return { success: true };
}
