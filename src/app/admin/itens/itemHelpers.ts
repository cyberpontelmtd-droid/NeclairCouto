import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

export const itemSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  material: z.string().optional(),
  price: z.coerce.number().nonnegative(),
  stockQty: z.coerce.number().int().nonnegative(),
  active: z.coerce.boolean(),
  categoryId: z.string().optional(),
  newCategoryName: z.string().optional(),
});

export function parseItemForm(formData: FormData) {
  return itemSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    material: formData.get("material") || undefined,
    price: formData.get("price"),
    stockQty: formData.get("stockQty"),
    active: formData.get("active") === "on",
    categoryId: formData.get("categoryId") || undefined,
    newCategoryName: formData.get("newCategoryName") || undefined,
  });
}

export async function resolveCategoryId(categoryId?: string, newCategoryName?: string) {
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

export async function nextSku() {
  const count = await prisma.item.count();
  let n = count + 1;
  for (;;) {
    const sku = `NC-${String(n).padStart(4, "0")}`;
    const existing = await prisma.item.findUnique({ where: { sku } });
    if (!existing) return sku;
    n++;
  }
}

export async function saveImages(itemId: string, files: File[]) {
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
