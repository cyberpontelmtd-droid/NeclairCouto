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

      <p className="text-gray-500 text-sm mb-6 max-w-xl">
        Gere um lote de etiquetas antes de cadastrar as peças. Elas ficam registradas no sistema
        sem estar vinculadas a nenhum produto. Imprima, cole nas peças e depois escaneie cada QR
        code com o celular (logado no site) para cadastrar a peça e vincular a etiqueta.
      </p>

      <form action={generateLabelBatch} className="bg-white rounded-2xl shadow-sm p-6 max-w-md flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Quantidade de etiquetas</label>
          <input
            name="quantidade"
            type="number"
            min={1}
            max={500}
            defaultValue={10}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Etiquetas por folha</label>
          <select
            name="porFolha"
            defaultValue={12}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <option value={6}>6 por folha</option>
            <option value={8}>8 por folha</option>
            <option value={10}>10 por folha</option>
            <option value={12}>12 por folha</option>
            <option value={15}>15 por folha</option>
            <option value={20}>20 por folha</option>
            <option value={24}>24 por folha</option>
          </select>
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
