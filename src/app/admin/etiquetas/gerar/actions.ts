"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const batchSchema = z.object({
  quantidade: z.coerce.number().int().min(1).max(500),
  porFolha: z.coerce.number().int().min(1).max(60),
});

async function nextLabelCode() {
  const count = await prisma.label.count();
  let n = count + 1;
  for (;;) {
    const code = `NC-L${String(n).padStart(6, "0")}`;
    const existing = await prisma.label.findUnique({ where: { code } });
    if (!existing) return code;
    n++;
  }
}

export async function generateLabelBatch(formData: FormData) {
  const { quantidade, porFolha } = batchSchema.parse({
    quantidade: formData.get("quantidade"),
    porFolha: formData.get("porFolha"),
  });

  const ids: string[] = [];
  for (let i = 0; i < quantidade; i++) {
    const code = await nextLabelCode();
    const label = await prisma.label.create({ data: { code } });
    ids.push(label.id);
  }

  const params = new URLSearchParams();
  ids.forEach((id) => params.append("ids", id));
  params.set("porFolha", String(porFolha));
  redirect(`/admin/etiquetas/lote/imprimir?${params.toString()}`);
}
