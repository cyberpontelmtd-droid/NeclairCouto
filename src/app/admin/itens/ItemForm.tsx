import type { Category, Item, ItemImage } from "@prisma/client";
import { deleteItemImage } from "./actions";
import { LabelLinker } from "./LabelLinker";
import { PhotoCapture } from "./PhotoCapture";

type ItemWithImages = Item & { images: ItemImage[] };

export function ItemForm({
  item,
  categories,
  action,
  existingLabelCodes = [],
  initialLabelCodes = [],
}: {
  item?: ItemWithImages;
  categories: Category[];
  action: (formData: FormData) => Promise<void>;
  existingLabelCodes?: string[];
  initialLabelCodes?: string[];
}) {
  return (
    <form action={action} className="bg-white rounded-2xl shadow-sm p-6 md:p-8 flex flex-col gap-5 max-w-2xl">
      {item && (
        <p className="text-sm text-gray-500">
          SKU: <span className="font-mono text-brand-purple">{item.sku}</span>
        </p>
      )}
      <div>
        <label className="block text-sm font-medium text-brand-dark mb-1">Nome *</label>
        <input
          name="name"
          defaultValue={item?.name}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-dark mb-1">Descrição</label>
        <textarea
          name="description"
          defaultValue={item?.description ?? ""}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Material</label>
          <input
            name="material"
            defaultValue={item?.material ?? ""}
            placeholder="Titânio, Ouro 18k..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Preço (R$) *</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={item ? Number(item.price) : ""}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Quantidade em estoque *</label>
          <input
            name="stockQty"
            type="number"
            min="0"
            defaultValue={item?.stockQty ?? 0}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Categoria</label>
          <select
            name="categoryId"
            defaultValue={item?.categoryId ?? ""}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <option value="">Sem categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-dark mb-1">Ou criar nova categoria</label>
        <input
          name="newCategoryName"
          placeholder="Ex: Piercing de Nariz"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
        />
      </div>

      <LabelLinker existingCodes={existingLabelCodes} initialCodes={initialLabelCodes} />

      <div id="fotos" className="scroll-mt-6">
        <label className="block text-sm font-medium text-brand-dark mb-1">Fotos</label>
        {item && item.images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-3">
            {item.images.map((img) => (
              <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/uploads/${img.filename}`} alt="" className="w-full h-full object-cover" />
                <form
                  action={async () => {
                    "use server";
                    await deleteItemImage(img.id, item.id);
                  }}
                  className="absolute top-0 right-0"
                >
                  <button
                    type="submit"
                    className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
        <PhotoCapture />
      </div>

      <label className="flex items-center gap-2 text-sm text-brand-dark">
        <input type="checkbox" name="active" defaultChecked={item?.active ?? true} />
        Visível no catálogo público
      </label>

      <button
        type="submit"
        className="self-start bg-brand-purple text-white font-bold px-8 py-3 rounded-full hover:bg-brand-dark transition-colors"
      >
        Salvar
      </button>
    </form>
  );
}
