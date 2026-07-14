import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ItemForm } from "../../ItemForm";
import { updateItem } from "../../actions";

export default async function EditarItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [item, categories] = await Promise.all([
    prisma.item.findUnique({ where: { id }, include: { images: true, labels: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!item) notFound();

  const boundUpdate = updateItem.bind(null, item.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Editar peça — {item.name}</h1>
      <ItemForm
        item={item}
        categories={categories}
        action={boundUpdate}
        existingLabelCodes={item.labels.map((l) => l.code)}
      />
    </div>
  );
}
