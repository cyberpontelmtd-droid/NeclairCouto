"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseItemForm, resolveCategoryId, saveImages } from "../../itens/itemHelpers";

export async function linkLabelAndCreateItem(code: string, formData: FormData) {
  const label = await prisma.label.findUnique({ where: { code } });
  if (!label || label.itemId) {
    redirect(`/admin/etiquetas/vincular/${code}`);
  }

  const parsed = parseItemForm(formData);
  const categoryId = await resolveCategoryId(parsed.categoryId, parsed.newCategoryName);

  const item = await prisma.$transaction(async (tx) => {
    const created = await tx.item.create({
      data: {
        sku: label.code,
        name: parsed.name,
        description: parsed.description || null,
        material: parsed.material || null,
        price: parsed.price,
        stockQty: parsed.stockQty,
        active: parsed.active,
        categoryId,
      },
    });
    await tx.label.update({
      where: { id: label.id },
      data: { itemId: created.id, linkedAt: new Date() },
    });
    return created;
  });

  const files = formData.getAll("images") as File[];
  await saveImages(item.id, files);

  revalidatePath("/admin/itens");
  redirect("/admin/itens");
}
