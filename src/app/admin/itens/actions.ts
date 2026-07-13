"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

const itemSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  material: z.string().optional(),
  price: z.coerce.number().nonnegative(),
  stockQty: z.coerce.number().int().nonnegative(),
  active: z.coerce.boolean(),
  categoryId: z.string().optional(),
  newCategoryName: z.string().optional(),
});

async function resolveCategoryId(categoryId?: string, newCategoryName?: string) {
  if (newCategoryName && newCategoryName.trim()) {
    const name = newCategoryName.trim();
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, slug },
    });
    return category.id;
  }
  return categoryId || null;
}

async function nextSku() {
  const count = await prisma.item.count();
  let n = count + 1;
  for (;;) {
    const sku = `NC-${String(n).padStart(4, "0")}`;
    const existing = await prisma.item.findUnique({ where: { sku } });
    if (!existing) return sku;
    n++;
  }
}

async function saveImages(itemId: string, files: File[]) {
  const validFiles = files.filter((f) => f && f.size > 0);
  if (validFiles.length === 0) return;

  await mkdir(UPLOAD_DIR, { recursive: true });

  const existingCount = await prisma.itemImage.count({ where: { itemId } });

  for (let i = 0; i < validFiles.length; i++) {
    const file = validFiles[i];
    const ext = path.extname(file.name) || "";
    const filename = `${randomUUID()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);
    await prisma.itemImage.create({
      data: { itemId, filename, position: existingCount + i },
    });
  }
}

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
  const parsed = itemSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    material: formData.get("material") || undefined,
    price: formData.get("price"),
    stockQty: formData.get("stockQty"),
    active: formData.get("active") === "on",
    categoryId: formData.get("categoryId") || undefined,
    newCategoryName: formData.get("newCategoryName") || undefined,
  });

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
  const parsed = itemSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    material: formData.get("material") || undefined,
    price: formData.get("price"),
    stockQty: formData.get("stockQty"),
    active: formData.get("active") === "on",
    categoryId: formData.get("categoryId") || undefined,
    newCategoryName: formData.get("newCategoryName") || undefined,
  });

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
