import Link from "next/link";
import { generateLabelBatch } from "./actions";

export default function GerarEtiquetasPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">Gerar etiquetas novas</h1>
        <Link href="/admin/etiquetas" className="text-sm text-brand-purple hover:underline">
          ← Voltar
        </Link>
      </div>

      <p className="text-gray-500 text-sm mb-2 max-w-xl">
        Gere um lote de etiquetas antes de cadastrar as peças. Elas ficam registradas no sistema
        sem estar vinculadas a nenhum produto. Imprima, cole nas peças e depois escaneie cada QR
        code com o celular (logado no site) para cadastrar a peça e vincular a etiqueta.
      </p>
      <p className="text-gray-400 text-xs mb-6 max-w-xl">
        Layout calibrado para a folha Pimaco 6180 (Carta, 25,4 × 66,7mm, 30 etiquetas por folha).
      </p>

      <form action={generateLabelBatch} className="bg-white rounded-2xl shadow-sm p-6 max-w-md flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Quantidade de etiquetas</label>
          <input
            name="quantidade"
            type="number"
            min={1}
            max={3000}
            defaultValue={30}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
        </div>

        <button
          type="submit"
          className="self-start bg-brand-purple text-white font-bold px-8 py-3 rounded-full hover:bg-brand-dark transition-colors"
        >
          Gerar etiquetas
        </button>
      </form>
    </div>
  );
}
