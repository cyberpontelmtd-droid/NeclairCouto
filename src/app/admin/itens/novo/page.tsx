import { prisma } from "@/lib/prisma";
import { ItemForm } from "../ItemForm";
import { createItem } from "../actions";
import { ScanLabelButton } from "./ScanLabelButton";

export default async function NovoItemPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-brand-dark">Nova peça</h1>
        <ScanLabelButton />
      </div>
      <p className="text-gray-500 text-sm mb-6">
        Já tem uma etiqueta impressa colada na peça? Escaneie o QR code para cadastrar vinculado a ela.
      </p>
      <ItemForm categories={categories} action={createItem} />
    </div>
  );
}
