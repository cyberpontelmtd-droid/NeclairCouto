import { prisma } from "@/lib/prisma";
import { ItemForm } from "../ItemForm";
import { createItem } from "../actions";

export default async function NovoItemPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Nova peça</h1>
      <ItemForm categories={categories} action={createItem} />
    </div>
  );
}
