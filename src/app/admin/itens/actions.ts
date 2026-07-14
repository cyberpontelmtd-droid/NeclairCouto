"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { UPLOAD_DIR, nextSku, parseItemForm, resolveCategoryId, saveImages } from "./itemHelpers";

export async function createItem(formData: FormData) {
  try {
    await createItemInner(formData);
  } catch (err) {
    if (err && typeof err === "object" && "digest" in err) throw err;
    console.error("createItem failed:", err);
    throw err;
  }
}

async function createItemInner(formData: FormData) {
  const parsed = parseItemForm(formData);

  const categoryId = await resolveCategoryId(parsed.categoryId, parsed.newCategoryName);
  const sku = await nextSku();

  const item = await prisma.item.create({
    data: {
      sku,
      name: parsed.name,
      description: parsed.description || null,
      material: parsed.material || null,
      price: parsed.price,
      stockQty: parsed.stockQty,
      active: parsed.active,
      categoryId,
    },
  });

  const files = formData.getAll("images") as File[];
  await saveImages(item.id, files);

  revalidatePath("/admin/itens");
  redirect("/admin/itens");
}

export async function updateItem(itemId: string, formData: FormData) {
  const parsed = parseItemForm(formData);

  const categoryId = await resolveCategoryId(parsed.categoryId, parsed.newCategoryName);

  await prisma.item.update({
    where: { id: itemId },
    data: {
      name: parsed.name,
      description: parsed.description || null,
      material: parsed.material || null,
      price: parsed.price,
      stockQty: parsed.stockQty,
      active: parsed.active,
      categoryId,
    },
  });

  const files = formData.getAll("images") as File[];
  await saveImages(itemId, files);

  revalidatePath("/admin/itens");
  redirect("/admin/itens");
}

export async function deleteItemImage(imageId: string, itemId: string) {
  const image = await prisma.itemImage.findUnique({ where: { id: imageId } });
  if (image) {
    await unlink(path.join(UPLOAD_DIR, image.filename)).catch(() => {});
    await prisma.itemImage.delete({ where: { id: imageId } });
  }
  revalidatePath(`/admin/itens/${itemId}/editar`);
}

export async function toggleItemActive(itemId: string, active: boolean) {
  await prisma.item.update({ where: { id: itemId }, data: { active } });
  revalidatePath("/admin/itens");
}

export async function deleteItem(itemId: string) {
  const images = await prisma.itemImage.findMany({ where: { itemId } });
  for (const image of images) {
    await unlink(path.join(UPLOAD_DIR, image.filename)).catch(() => {});
  }
  await prisma.item.delete({ where: { id: itemId } });
  revalidatePath("/admin/itens");
}
