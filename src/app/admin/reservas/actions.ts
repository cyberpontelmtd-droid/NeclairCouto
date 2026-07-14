"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function cancelReservation(id: string) {
  await prisma.reservation.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
  revalidatePath("/admin/reservas");
}
