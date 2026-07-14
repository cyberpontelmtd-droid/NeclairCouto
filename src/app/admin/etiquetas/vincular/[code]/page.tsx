import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ItemForm } from "../../../itens/ItemForm";
import { linkLabelAndCreateItem } from "../actions";

export default async function VincularEtiquetaPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const label = await prisma.label.findUnique({
    where: { code },
    include: { item: true },
  });

  if (!label) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-md">
        <h1 className="text-xl font-bold text-brand-dark mb-2">Etiqueta não encontrada</h1>
        <p className="text-gray-500 text-sm mb-4">
          O código <span className="font-mono">{code}</span> não existe no sistema.
        </p>
        <Link href="/admin/etiquetas" className="text-sm text-brand-purple hover:underline">
          ← Voltar para etiquetas
        </Link>
      </div>
    );
  }

  if (label.item) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-md">
        <h1 className="text-xl font-bold text-brand-dark mb-2">Etiqueta já vinculada</h1>
        <p className="text-gray-500 text-sm mb-4">
          A etiqueta <span className="font-mono">{code}</span> já está vinculada à peça{" "}
          <strong>{label.item.name}</strong>.
        </p>
        <Link
          href={`/admin/itens/${label.item.id}/editar`}
          className="text-sm text-brand-purple hover:underline"
        >
          Ver / editar peça →
        </Link>
      </div>
    );
  }

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-dark mb-2">Cadastrar peça</h1>
      <p className="text-gray-500 text-sm mb-6">
        Vinculando à etiqueta <span className="font-mono text-brand-purple">{code}</span>
      </p>
      <ItemForm
        categories={categories}
        action={linkLabelAndCreateItem.bind(null, code)}
        initialLabelCodes={[code]}
      />
    </div>
  );
}
